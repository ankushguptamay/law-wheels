const { createPaymentLink } = require("../../Util/razorpay");
const db = require("../../Models");
const ContactUsForm = db.contactUsForm;

exports.create_PaymentLink = async (req, res) => {
  try {
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
