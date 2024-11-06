const { createPaymentLink } = require("../../Util/razorpay");
const db = require("../../Models");
const { create_PaymentLinkValidation } = require("../../Middlewares/validate");
const ContactUsForm = db.contactUsForm;

exports.create_PaymentLink = async (req, res) => {
  try {
    // Validate body
    const { error } = create_PaymentLinkValidation(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }
    const { amount, leadId } = req.body;

    const contactUs = await ContactUsForm.findOne({ where: { id: leadId } });
    if (!contactUs) {
      return res.status(400).json({
        success: false,
        message: "This lead is not present!",
      });
    }
    const response = await createPaymentLink(
      amount,
      contactUs.mobileNumber,
      contactUs.name
    );

    res.status(200).json({
      success: true,
      message: "Successfully",
      data: response,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};

exports.payment_response = async (req, res) => {
  try {
    console.log(req.body.payload.payment.entity);
    res.status(400).json({
      success: true,
      message: "Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
