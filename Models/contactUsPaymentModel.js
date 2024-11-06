module.exports = (sequelize, DataTypes) => {
  const ContactUsPayment = sequelize.define("contactUsPayments", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    linkCreateAt: { type: DataTypes.STRING },
    link: { type: DataTypes.STRING },
    amount: { type: DataTypes.STRING },
    currencyUnit: {
      type: DataTypes.STRING,
      validate: { isIn: [["Rupee", "Paisa"]] },
      defaultValue: "Rupee",
    },
    reference_id: { type: DataTypes.STRING },
    razorpayOrderId: { type: DataTypes.STRING },
    razorpayPaymentId: { type: DataTypes.STRING },
    status: {
      type: DataTypes.STRING,
      validate: { isIn: [["Paid", "Unpaid"]] },
      defaultValue: "Unpaid",
    },
    method: { type: DataTypes.STRING },
    vpa: { type: DataTypes.STRING },
    verify: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
  return ContactUsPayment;
};
