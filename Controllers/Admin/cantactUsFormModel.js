const db = require("../../Models");
const {
  contactUsForm,
  leadOtpVerification,
  addMatuallyContactUsForm,
} = require("../../Middlewares/validate");
const { Op } = require("sequelize");
const generateOTP = require("../../Util/generateOTP");
const { sendOTP } = require("../../Util/sendOTPToMobileNumber");
const { capitalizeFirstLetter } = require("../../Util/capitalizeFirstLetter");
const {
  sendSinglePushNotification,
} = require("../../Util/sendFirebasePushNotification");
const { whatsappCampaign } = require("../../Util/whatsappCampaign");
const ContactUsForm = db.contactUsForm;
const DualityCUF = db.dualityCUF;
const Employee = db.employee;
const CSLeadLog = db.contactUsLeadLogs;
const LeadOTP = db.emailOTP;
const ContactUsPayment = db.contactUsPayment;
const Notification = db.notification;

exports.createContactUsForm = async (req, res) => {
  try {
    // Validate body
    const { error } = contactUsForm(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }
    const name = capitalizeFirstLetter(req.body.name);

    let form = await ContactUsForm.findOne({
      where: { mobileNumber: req.body.mobileNumber },
      raw: true,
    });

    let assignEmployee, content, title;
    if (form) {
      await DualityCUF.create({ ...req.body, name, contactUsFormId: form.id });
      // Update createdAt
      await ContactUsForm.update(
        { createdAt: new Date() },
        { where: { id: form.id } }
      );
      let employee;
      if (form.employeeId) {
        employee = await Employee.findOne({
          where: { id: form.employeeId },
          attributes: ["id", "device_token"],
        });
      }
      assignEmployee = employee;
      content = `New hit on old Contact Us Lead from page ${
        req.body.data_from_page || "Other"
      }s by ${name}.`;
      title = `New hit on old Contact Us Lead`;
    } else {
      // Generate Slug
      const todayForSlug = new Date();
      todayForSlug.setMinutes(todayForSlug.getMinutes() + 330);
      const dayForSlug = todayForSlug.toISOString().slice(8, 10);
      const yearForSlug = todayForSlug.toISOString().slice(2, 4);
      const monthForSlug = todayForSlug.toISOString().slice(5, 7);
      let startWith = `LW${dayForSlug}${monthForSlug}${yearForSlug}`;
      const lastSlug = await ContactUsForm.findOne({
        where: { slug: { [Op.startsWith]: startWith } },
        order: [["createdAt", "DESC"]],
      });
      let lastDigit;
      if (lastSlug) {
        lastDigit = parseInt(lastSlug.dataValues.slug.substring(8)) + 1;
      } else {
        lastDigit = 1;
      }
      let uniqueSlug = startWith + lastDigit;
      // Check if the slug already exists
      while (await ContactUsForm.findOne({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${startWith}${lastDigit++}`;
      }
      let slug = uniqueSlug;

      // Store In database
      form = await ContactUsForm.create({ ...req.body, name, slug });

      // Assign
      const today = new Date();
      today.setMinutes(today.getMinutes() - 1110);
      const day = String(today.getUTCDate()).padStart(2, "0");
      const month = String(today.getUTCMonth() + 1).padStart(2, "0");
      const year = today.getUTCFullYear();
      const todayForData = new Date(`${year}-${month}-${day}T18:29:59.000Z`);

      const employee = await Employee.findAll({
        where: { role: "BDA" },
        order: [["createdAt", "ASC"]],
        attributes: ["id", "device_token"],
        raw: true,
      });

      const totalBDA = employee.length;
      if (totalBDA === 0) {
        return res.status(200).send({
          success: true,
          message: `Contact us form created successfully! OTP send to ${req.body.mobileNumber}!`,
          data: {
            id: form.id,
            mobileNumber: req.body.mobileNumber,
          },
        });
      } else if (totalBDA === 1) {
        await form.update({ employeeId: employee[0].id });
        assignEmployee = employee[0];
      } else {
        const todaysTotalTicket = await ContactUsForm.count({
          where: { createdAt: { [Op.gte]: todayForData } },
        });
        const remain = parseInt(todaysTotalTicket) % parseInt(totalBDA);
        if (remain === 0) {
          const lastResolver = parseInt(totalBDA) - 1;
          await form.update({ employeeId: employee[lastResolver].id });
          assignEmployee = employee[lastResolver];
        } else {
          await form.update({ employeeId: employee[remain - 1].id });
          assignEmployee = employee[remain - 1];
        }
      }

      content = `New lead by ${name} form page ${
        req.body.data_from_page || "Other"
      }s.`;
      title = `New Contact Us Lead`;
    }

    // Generate OTP for mobile number
    const otp = generateOTP.generateFixedLengthRandomNumber(
      process.env.OTP_DIGITS_LENGTH
    );
    // Sending OTP to mobile number
    sendOTP(req.body.mobileNumber, otp);

    // Store OTP
    await LeadOTP.create({
      validTill: new Date().getTime() + parseInt(process.env.OTP_VALIDITY),
      otp: otp,
      receiverId: form.id,
    });

    // Send Push notification
    if (assignEmployee) {
      const notification = {
        title,
        body: content,
        image: "https://law-wheel.b-cdn.net/image/logo_law.webp",
      };
      const data = { notificationId: form.id };
      sendSinglePushNotification(
        assignEmployee.device_token,
        notification,
        data
      );
      // Store Notification
      await Notification.create({
        title,
        content: content,
        notificationRelatedTo: "ContactUsLead",
        relatedId: form.id,
        scheduleTime: new Date(),
        receiverId: assignEmployee.id,
        device_token: assignEmployee.device_token,
      });
    }
    res.status(200).json({
      success: true,
      message: `Contact us form created successfully! OTP send to ${req.body.mobileNumber}!`,
      data: {
        id: form.id,
        mobileNumber: req.body.mobileNumber,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.reSendLeadOtp = async (req, res) => {
  try {
    // Checking is lead present or not
    const lead = await ContactUsForm.findOne({
      where: { id: req.params.id },
    });
    if (!lead) {
      return res.status(400).send({
        success: false,
        message: "No Details Found!",
      });
    }
    // Send OTP to mobile number
    // Generate OTP for Email
    const otp = generateOTP.generateFixedLengthRandomNumber(
      process.env.OTP_DIGITS_LENGTH
    );
    // Sending OTP to mobile number
    sendOTP(lead.mobileNumber, otp);
    // Store OTP
    await LeadOTP.create({
      validTill: new Date().getTime() + parseInt(process.env.OTP_VALIDITY),
      otp: otp,
      receiverId: lead.id,
    });
    res.status(201).send({
      success: true,
      message: `OTP send to ${lead.mobileNumber}!`,
      data: {
        id: lead.id,
        mobileNumber: req.body.mobileNumber,
      },
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.leadOtpVerification = async (req, res) => {
  try {
    // Validate body
    const { error } = leadOtpVerification(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { leadId, mobileOTP } = req.body;
    // Is Mobile Otp exist
    const isOtp = await LeadOTP.findOne({
      where: { otp: mobileOTP, receiverId: leadId },
    });
    if (!isOtp) {
      return res.status(400).send({
        success: false,
        message: `Invalid OTP!`,
      });
    }
    // Checking is lead present or not
    const lead = await ContactUsForm.findOne({
      where: { id: leadId },
    });
    if (!lead) {
      return res.status(400).send({
        success: false,
        message: "No Details Found!",
      });
    }
    // is email otp expired?
    const isOtpExpired = new Date().getTime() > parseInt(isOtp.validTill);
    await LeadOTP.destroy({ where: { receiverId: isOtp.receiverId } });
    if (isOtpExpired) {
      return res.status(400).send({
        success: false,
        message: `OTP expired!`,
      });
    }
    // Update Lead
    await lead.update({ isMobileVerified: true });
    // Send WhatsApp Campaign
    await whatsappCampaign(
      process.env.WHATSAPP_CAMPAIGN_NAME,
      lead.mobileNumber,
      lead.name,
      []
    );
    // Final Response
    res.status(201).send({
      success: true,
      message: `OTP verify successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllContactUsForm = async (req, res) => {
  try {
    const {
      page,
      limit,
      search,
      isMutual,
      others,
      excel,
      startDate,
      endDate,
      date,
    } = req.query;
    // Search
    const query = [];

    if (search) {
      query.push({
        [Op.or]: [
          { name: { [Op.substring]: search } },
          { slug: { [Op.substring]: search } },
          { lastName: { [Op.substring]: search } },
          { email: { [Op.substring]: search } },
          { mobileNumber: { [Op.substring]: search } },
        ],
      });
    }
    if (isMutual === "true") {
      query.push({ data_from_page: "Mutual Divorce" });
    } else if (others === "true") {
      query.push({ data_from_page: "Others" });
    }

    // Date
    if (startDate && endDate) {
      const start = new Date(`${startDate}T00:00:01.000Z`);
      start.setMinutes(start.getMinutes() - 330);
      const end = new Date(`${endDate}T23:59:59.000Z`);
      end.setMinutes(end.getMinutes() - 330);
      query.push({ createdAt: { [Op.between]: [start, end] } });
    } else if (date) {
      const start = new Date(`${date}T00:00:01.000Z`);
      start.setMinutes(start.getMinutes() - 330);
      const end = new Date(`${date}T23:59:59.000Z`);
      end.setMinutes(end.getMinutes() - 330);
      query.push({ createdAt: { [Op.between]: [start, end] } });
    }

    if (excel === "true") {
      const contactUs = await ContactUsForm.findAll({
        where: { [Op.and]: query },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Employee,
            as: "employee",
            attributes: ["id", "slug", "name"],
          },
        ],
      });
      res.status(200).json({
        success: true,
        message: "Contact us form fetched successfully!",
        data: contactUs,
      });
    } else {
      // Pagination
      const recordLimit = parseInt(limit) || 10;
      let offSet = 0;
      let currentPage = 1;
      if (page) {
        offSet = (parseInt(page) - 1) * recordLimit;
        currentPage = parseInt(page);
      }

      const [contactUs, totalContactUs] = await Promise.all([
        ContactUsForm.findAll({
          limit: recordLimit,
          offset: offSet,
          where: { [Op.and]: query },
          include: [
            {
              model: DualityCUF,
              as: "dualityContactUsForms",
              attributes: ["id"],
            },
            {
              model: Employee,
              as: "employee",
              attributes: ["id", "slug", "name"],
            },
          ],
          order: [["createdAt", "DESC"]],
        }),
        ContactUsForm.count({ where: { [Op.and]: query } }),
      ]);

      const transformData = contactUs.map((lead) => {
        const { dualityContactUsForms, ...rest } = lead.dataValues; // Destructure to exclude the unwanted key
        return {
          ...rest,
          numberOfHit: 1 + dualityContactUsForms.length,
        };
      });
      res.status(200).json({
        success: true,
        message: "Contact us form fetched successfully!",
        totalPage: Math.ceil(totalContactUs / recordLimit),
        currentPage: currentPage,
        data: transformData,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllContactUsLeadBDA = async (req, res) => {
  try {
    const {
      page,
      limit,
      search,
      isMutual,
      others,
      excel,
      startDate,
      endDate,
      date,
    } = req.query;

    // Search
    const query = [{ employeeId: req.employee.id }];

    if (search) {
      query.push({
        [Op.or]: [
          { name: { [Op.substring]: search } },
          { slug: { [Op.substring]: search } },
          { lastName: { [Op.substring]: search } },
          { email: { [Op.substring]: search } },
          { mobileNumber: { [Op.substring]: search } },
        ],
      });
    }
    if (isMutual === "true") {
      query.push({ data_from_page: "Mutual Divorce" });
    } else if (others === "true") {
      query.push({ data_from_page: "Others" });
    }

    // Date
    if (startDate && endDate) {
      const start = new Date(`${startDate}T00:00:01.000Z`);
      start.setMinutes(start.getMinutes() - 330);
      const end = new Date(`${endDate}T23:59:59.000Z`);
      end.setMinutes(end.getMinutes() - 330);
      query.push({ createdAt: { [Op.between]: [start, end] } });
    } else if (date) {
      const start = new Date(`${date}T00:00:01.000Z`);
      start.setMinutes(start.getMinutes() - 330);
      const end = new Date(`${date}T23:59:59.000Z`);
      end.setMinutes(end.getMinutes() - 330);
      query.push({ createdAt: { [Op.between]: [start, end] } });
    }

    if (excel === "true") {
      const contactUs = await ContactUsForm.findAll({
        where: { [Op.and]: query },
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json({
        success: true,
        message: "Contact us form fetched successfully!",
        data: contactUs,
      });
    } else {
      // Pagination
      const recordLimit = parseInt(limit) || 10;
      let offSet = 0;
      let currentPage = 1;
      if (page) {
        offSet = (parseInt(page) - 1) * recordLimit;
        currentPage = parseInt(page);
      }

      const [contactUs, totalContactUs] = await Promise.all([
        ContactUsForm.findAll({
          limit: recordLimit,
          offset: offSet,
          where: { [Op.and]: query },
          include: [
            {
              model: DualityCUF,
              as: "dualityContactUsForms",
              attributes: ["id"],
            },
          ],
          order: [["createdAt", "DESC"]],
        }),
        ContactUsForm.count({ where: { [Op.and]: query } }),
      ]);

      const transformData = contactUs.map((lead) => {
        return {
          ...lead.dataValues,
          numberOfHit: 1 + lead.dataValues.dualityContactUsForms.length,
        };
      });

      res.status(200).json({
        success: true,
        message: "Contact us form fetched successfully!",
        totalPage: Math.ceil(totalContactUs / recordLimit),
        currentPage: currentPage,
        data: transformData,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getContactUsLeadDetails = async (req, res) => {
  try {
    const leads = await ContactUsForm.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: DualityCUF,
          as: "dualityContactUsForms",
          attributes: [
            "id",
            "name",
            "email",
            "message",
            "data_from_page",
            "createdAt",
          ],
        },
        { model: CSLeadLog, as: "leadLogs" },
        {
          model: Employee,
          as: "employee",
          attributes: ["id", "slug", "name"],
        },
        { model: ContactUsPayment, as: "payments" },
      ],
      order: [[{ model: CSLeadLog, as: "leadLogs" }, "createdAt", "ASC"]],
    });
    if (!leads) {
      return res.status(400).json({
        success: false,
        message: "Contact us details is not present!",
      });
    }
    res.status(200).json({
      success: true,
      message: "Contact us form fetched successfully!",
      data: leads,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.addMatuallyContactUsForm = async (req, res) => {
  try {
    // Validate body
    const { error } = addMatuallyContactUsForm(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }

    const { createdAt, mobileNumber } = req.body;

    let form = await ContactUsForm.findOne({
      where: { mobileNumber },
      raw: true,
    });

    let message = "New Lead added successfully!",
      assignEmployee,
      content,
      title;
    if (form) {
      await DualityCUF.create({
        createdAt,
        mobileNumber,
        contactUsFormId: form.id,
      });
      let employee;
      if (form.employeeId) {
        employee = await Employee.findOne({
          where: { id: form.employeeId },
          attributes: ["id", "device_token"],
        });
      }
      message = "Duplicate manually lead added successfully!";
      assignEmployee = employee;
      content = `New hit on old manually Contact Us Lead assigned by Admin.`;
      title = `New hit on old manually Contact Us Lead`;
    } else {
      // Generate Slug
      const todayForSlug = new Date(createdAt);
      const dayForSlug = todayForSlug.toISOString().slice(8, 10);
      const yearForSlug = todayForSlug.toISOString().slice(2, 4);
      const monthForSlug = todayForSlug.toISOString().slice(5, 7);
      let startWith = `LW${dayForSlug}${monthForSlug}${yearForSlug}`;
      const lastSlug = await ContactUsForm.findOne({
        where: { slug: { [Op.startsWith]: startWith } },
        order: [["createdAt", "DESC"]],
      });
      let lastDigit;
      if (lastSlug) {
        lastDigit = parseInt(lastSlug.dataValues.slug.substring(8)) + 1;
      } else {
        lastDigit = 1;
      }
      let uniqueSlug = startWith + lastDigit;
      // Check if the slug already exists
      while (await ContactUsForm.findOne({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${startWith}${lastDigit++}`;
      }
      let slug = uniqueSlug;

      form = await ContactUsForm.create({
        mobileNumber,
        createdAt: new Date(createdAt),
        isMobileVerified: true,
        slug,
        addedManually: true,
      });
      // Assign
      const today = new Date();
      today.setMinutes(today.getMinutes() - 1110);
      const day = String(today.getUTCDate()).padStart(2, "0");
      const month = String(today.getUTCMonth() + 1).padStart(2, "0");
      const year = today.getUTCFullYear();
      const todayForData = new Date(`${year}-${month}-${day}T18:29:59.000Z`);

      const employee = await Employee.findAll({
        where: { role: "BDA" },
        order: [["createdAt", "ASC"]],
      });

      const totalBDA = employee.length;
      if (totalBDA === 0) {
        return res.status(200).send({
          success: true,
          message: `Contact us form created successfully! OTP send to ${mobileNumber}!`,
          data: { id: form.id, mobileNumber },
        });
      } else if (totalBDA === 1) {
        await form.update({ employeeId: employee[0].id });
        assignEmployee = employee[0];
      } else {
        const todaysTotalTicket = await ContactUsForm.count({
          where: { createdAt: { [Op.gte]: todayForData } },
        });
        const remain = parseInt(todaysTotalTicket) % parseInt(totalBDA);
        if (remain === 0) {
          const lastResolver = parseInt(totalBDA) - 1;
          await form.update({ employeeId: employee[lastResolver].id });
          assignEmployee = employee[lastResolver];
        } else {
          await form.update({ employeeId: employee[remain - 1].id });
          assignEmployee = employee[remain - 1];
        }
      }
      content = `New manually Contact Us Lead assigned by Admin.`;
      title = `New manually Contact Us Lead`;
    }

    // Send Push notification
    if (assignEmployee) {
      const notification = {
        title,
        body: content,
        image: "https://law-wheel.b-cdn.net/image/logo_law.webp",
      };
      const data = { notificationId: form.id };
      sendSinglePushNotification(
        assignEmployee.device_token,
        notification,
        data
      );
      // Store Notification
      await Notification.create({
        title,
        content: content,
        notificationRelatedTo: "ContactUsLead",
        relatedId: form.id,
        scheduleTime: new Date(),
        receiverId: assignEmployee.id,
        device_token: assignEmployee.device_token,
      });
    }

    res.status(200).json({ success: true, message });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.changeContactUsLeadsBDA = async (req, res) => {
  try {
    const employeeId = req.body.employeeId;
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Select an employee!",
      });
    }
    const leads = await ContactUsForm.findOne({ where: { id: req.params.id } });
    if (!leads) {
      return res.status(400).json({
        success: false,
        message: "Contact us details is not present!",
      });
    }

    await leads.update({ employeeId: employeeId });
    res.status(200).json({
      success: true,
      message: "BDA changed successfully!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
