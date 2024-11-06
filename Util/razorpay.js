const Razorpay = require("razorpay");
const { RAZORPAY_SECRET_ID, RAZORPAY_KEY_ID } = process.env;

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_SECRET_ID,
});

exports.createPaymentLink = async (amount, customerMobile, customerName) => {
  try {
    const response = await razorpayInstance.paymentLink.create({
      amount: parseInt(amount) * 100, // Razorpay expects amount in paise, so multiply by 100
      currency: "INR",
      //   description: description,
      customer: {
        name: customerName,
        // email: customerEmail,
        contact: customerMobile,
      },
      notify: {
        sms: true,
        email: false,
        whatsapp: false, // This feature is not working
      },
      reminder_enable: true,
      callback_url: "https://affiliate.techastute.in/", // This is the path for user to redirect frontend page
      callback_method: "get",
      reference_id: "ORD123452",
      // terms: "https://affiliate.techastute.in/", // This can be displayed to users before they complete the payment.
      // expire_by: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 1 day expiry , expiry time should be 15min in future
    });

    return response;
  } catch (error) {
    console.error("Error creating payment link:", error);
    throw error;
  }
};
