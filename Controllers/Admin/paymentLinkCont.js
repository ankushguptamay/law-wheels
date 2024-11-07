const { createPaymentLink } = require("../../Util/razorpay");
const db = require("../../Models");
const { create_PaymentLinkValidation } = require("../../Middlewares/validate");
const ContactUsForm = db.contactUsForm;
const ContactUsPayment = db.contactUsPayment;

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

    await ContactUsPayment.create({
      amount,
      contactUsFormId: leadId,
      linkCreateAt: response.created_at,
      link: response.short_url,
      reference_id: response.reference_id,
      paymentLinkId: response.id,
    });

    res.status(200).json({
      success: true,
      message: "Successfully",
      data: response.short_url,
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
    if (req.body.payload.payment_link.entity.status === "paid") {
      const payment = await ContactUsPayment.findOne({
        where: { paymentLinkId: req.body.payload.payment_link.entity.id },
      });
      if (payment) {
        await payment.update({
          status: "Paid",
          paymentOrderId: req.body.payload.payment_link.entity.order_id,
        });
      }
    }
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
