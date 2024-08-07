const db = require("../../Models");
const { reachOutValidation } = require("../../Middlewares/validate");
const ReactOut = db.reachOut;

exports.createReachOut = async (req, res) => {
  try {
    // Validate body
    const { error } = reachOutValidation(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }
    await ReactOut.create(req.body);
    res.status(200).json({
      success: true,
      message:
        "Thank you for reaching out to us. Your feedback and inquiries are important to us, and we strive to provide you with the best support!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllReachOut = async (req, res) => {
  try {
    const reachOut = await ReactOut.findAll();
    res.status(200).json({
      success: true,
      message: "All reach out fetched successfully!",
      data: reachOut,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
