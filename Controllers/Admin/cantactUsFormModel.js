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
    const { page, limit, search, isMutual, others } = req.query;
    // Pagination
    const recordLimit = parseInt(limit) || 10;
    let offSet = 0;
    let currentPage = 1;
    if (page) {
      offSet = (parseInt(page) - 1) * recordLimit;
      currentPage = parseInt(page);
    }

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
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
