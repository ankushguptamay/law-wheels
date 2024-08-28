const db = require("../../Models");
const { contactUsForm } = require("../../Middlewares/validate");
const ContactUsForm = db.contactUsForm;

exports.createContactUsForm = async (req, res) => {
  try {
    // Validate body
    const { error } = contactUsForm(req.body);
    if (error) {
      console.log(error);
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
    const { isMutual, others } = req.query;
    let query = {};
    if (isMutual) {
      query = { where: { data_from_page: "Mutual Divorce" } };
    } else if (others) {
      query = { where: { data_from_page: "Others" } };
    }
    const contactUs = await ContactUsForm.findAll(query);
    res.status(200).json({
      success: true,
      message: "Contact us form fetched successfully!",
      data: contactUs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
