const db = require("../../Models");
const { createMDPF } = require("../../Middlewares/validate");
const { Op } = require("sequelize");
const { capitalizeFirstLetter } = require("../../Util/capitalizeFirstLetter");
const MutualDivorcePetitionForm = db.mDPetitionForm;
const Employee = db.employee;
const MDPFLeadLog = db.mDPFLeadLogs;

exports.createMDPF = async (req, res) => {
  try {
    // Validate body
    const { error } = createMDPF(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }

    const name = capitalizeFirstLetter(req.body.name);
    const form = await MutualDivorcePetitionForm.create({ ...req.body, name });

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
        message: `Form submitted successfully!`,
      });
    } else if (totalBDA === 1) {
      await form.update({
        employeeId: employee[0].id,
      });
    } else {
      const todaysTotalTicket = await MutualDivorcePetitionForm.count({
        where: { createdAt: { [Op.gte]: todayForData } },
      });
      const remain = parseInt(todaysTotalTicket) % parseInt(totalBDA);
      if (remain === 0) {
        const lastResolver = parseInt(totalBDA) - 1;
        await form.update({
          employeeId: employee[lastResolver].id,
        });
      } else {
        await form.update({
          employeeId: employee[remain - 1].id,
        });
      }
    }
    res.status(200).json({
      success: true,
      message: `Form submitted successfully!`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllMDPFForm = async (req, res) => {
  try {
    const { page, limit, search, excel, startDate, endDate, date } = req.query;
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
      const mDPForms = await MutualDivorcePetitionForm.findAll({
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
        message: "Form fetched successfully!",
        data: mDPForms,
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

      const [mDPForms, totalMDPFs] = await Promise.all([
        MutualDivorcePetitionForm.findAll({
          limit: recordLimit,
          offset: offSet,
          where: { [Op.and]: query },
          include: [
            { model: MDPFLeadLog, as: "leadLogs" },
            {
              model: Employee,
              as: "employee",
              attributes: ["id", "slug", "name"],
            },
          ],
          order: [
            ["createdAt", "DESC"],
            [{ model: MDPFLeadLog, as: "leadLogs" }, "createdAt", "ASC"],
          ],
        }),
        MutualDivorcePetitionForm.count({ where: { [Op.and]: query } }),
      ]);

      res.status(200).json({
        success: true,
        message: "Form fetched successfully!",
        totalPage: Math.ceil(totalMDPFs / recordLimit),
        currentPage: currentPage,
        data: mDPForms,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllMDPFLeadBDA = async (req, res) => {
  try {
    const { page, limit, search, excel, startDate, endDate, date } = req.query;

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
      const mDPForms = await MutualDivorcePetitionForm.findAll({
        where: { [Op.and]: query },
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json({
        success: true,
        message: "Form fetched successfully!",
        data: mDPForms,
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

      const [mDPForms, totalMDPFs] = await Promise.all([
        MutualDivorcePetitionForm.findAll({
          limit: recordLimit,
          offset: offSet,
          where: { [Op.and]: query },
          order: [["createdAt", "DESC"]],
        }),
        MutualDivorcePetitionForm.count({ where: { [Op.and]: query } }),
      ]);

      res.status(200).json({
        success: true,
        message: "Form fetched successfully!",
        totalPage: Math.ceil(totalMDPFs / recordLimit),
        currentPage: currentPage,
        data: mDPForms,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getMDPFLeadDetails = async (req, res) => {
  try {
    const leads = await MutualDivorcePetitionForm.findOne({
      where: { id: req.params.id },
      include: [
        { model: MDPFLeadLog, as: "leadLogs" },
        {
          model: Employee,
          as: "employee",
          attributes: ["id", "slug", "name"],
        },
      ],
      order: [[{ model: MDPFLeadLog, as: "leadLogs" }, "createdAt", "ASC"]],
    });
    if (!leads) {
      return res.status(400).json({
        success: false,
        message: "Mutual divorce petition's detail is not present!",
      });
    }
    res.status(200).json({
      success: true,
      message: "Mutual divorce petition fetched successfully!",
      data: leads,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
