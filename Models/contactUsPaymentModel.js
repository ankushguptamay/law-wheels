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
    paymentOrderId: { type: DataTypes.STRING },
    paymentLinkId: { type: DataTypes.STRING },
    status: {
      type: DataTypes.STRING,
      validate: { isIn: [["Paid", "Unpaid"]] },
      defaultValue: "Unpaid",
    },
  });
  return ContactUsPayment;
};
