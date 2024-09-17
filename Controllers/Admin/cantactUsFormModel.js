const db = require("../../Models");
const { contactUsForm } = require("../../Middlewares/validate");
const { Op } = require("sequelize");
const ContactUsForm = db.contactUsForm;

exports.createContactUsForm = async (req, res) => {
  try {
    // Validate body
    const { error } = contactUsForm(req.body);
    if (error) {
      // console.log(error);
      return res.status(400).json(error.details[0].message);
    }
    await ContactUsForm.create(req.body);
    res.status(200).json({
      success: true,
      message: "Contact us form created successfully!",
    });
  } catch (err) {
    res.status(500).json({
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
          { firstName: { [Op.substring]: search } },
          { slug: { [Op.substring]: search } },
          { lastName: { [Op.substring]: search } },
          { email: { [Op.substring]: search } },
          { mobileNumber: { [Op.substring]: search } },
        ],
      });
    }
    if (isMutual) {
      query.push({ data_from_page: "Mutual Divorce" });
    } else if (others) {
      query.push({ data_from_page: "Others" });
    }

    // Date
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setMinutes(start.getMinutes() + 330);
      const end = new Date(endDate);
      end.setMinutes(end.getMinutes() + 330);
      query.push({ createdAt: { [Op.between]: [start, end] } });
    } else if (date) {
      const start = new Date(`${date}T00:00:01.000Z`);
      start.setMinutes(start.getMinutes() + 330);
      const end = new Date(`${date}T23:59:59.000Z`);
      end.setMinutes(end.getMinutes() + 330);
      query.push({ createdAt: { [Op.between]: [start, end] } });
    }

    if (excel) {
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
          order: [["createdAt", "DESC"]],
        }),
        ContactUsForm.count({ where: { [Op.and]: query } }),
      ]);

      res.status(200).json({
        success: true,
        message: "Contact us form fetched successfully!",
        totalPage: Math.ceil(totalContactUs / recordLimit),
        currentPage: currentPage,
        data: contactUs,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getContactUsAnalytics = async (req, res) => {
  try {
    const { past7Days, past14Days, past28Days, past90Days, past365Days } =
      req.query;
    const dayInMilliSecond = 1000 * 60 * 60 * 24;

    const today = new Date();
    today.setMinutes(today.getMinutes() + 330);
    const day = String(today.getUTCDate()).padStart(2, "0");
    const month = String(today.getUTCMonth() + 1).padStart(2, "0");
    const year = today.getUTCFullYear();
    const todayForData = new Date(`${year}-${month}-${day}T18:29:59.000Z`);

    // For Current
    const lastDays = new Date();
    lastDays.setMinutes(lastDays.getMinutes() + 330);
    const compareLastDays = new Date();
    compareLastDays.setMinutes(compareLastDays.getMinutes() + 330);
    let query, contactUs, message, pastQuery, days;

    if (past14Days) {
      days = 14;
    } else if (past28Days) {
      days = 28;
    } else if (past90Days) {
      days = 90;
    } else if (past365Days) {
      days = 365;
    } else {
      days = 7;
    }
    lastDays.setDate(lastDays.getDate() - days);
    compareLastDays.setDate(compareLastDays.getDate() - days * 2);
    contactUs = new Array(days).fill(0);
    message = `Past ${days} days contact us details!`;
    query = { createdAt: { [Op.gte]: lastDays } };
    pastQuery = {
      updatedAt: { [Op.between]: [compareLastDays, lastDays] },
    };

    const [totalContactUs, contactUsWithRespectivePastTime, lastDaysContactUs] =
      await Promise.all([
        ContactUsForm.count({ where: query }),
        ContactUsForm.count({ where: pastQuery }),
        ContactUsForm.findAll({
          where: query,
          attributes: ["id", "createdAt"],
        }),
      ]);

    lastDaysContactUs.forEach((contact) => {
      const indexApprox =
        (todayForData.getTime() - contact.createdAt.getTime()) /
        dayInMilliSecond;
      const index = Math.floor(indexApprox);
      contactUs[days - 1 - index]++;
    });

    const status = {
      totalContactUs,
      contactUsWithRespectivePastTime,
      chart: contactUs,
    };
    return res.status(200).json({ success: true, message, data: status });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
