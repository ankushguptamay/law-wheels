const { Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const ContactUsForm = sequelize.define("contactUsForms", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
    },
    mobileNumber: {
      type: DataTypes.STRING,
    },
    isMobileVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    data_from_page: {
      type: DataTypes.STRING,
      validate: {
        isIn: [
          [
            "Mutual Divorce",
            "Mutual Divorce 1",
            "Cheque Bounce",
            "Corporate Law-IPR",
            "Corporate Law-ALL",
            "Corporate Law-CA",
            "Corporate Law-EL",
            "Corporate Law-BM",
            "Matrimonial",
            "Bail",
            "Property Dispute",
            "Others",
          ],
        ],
      },
      defaultValue: "Others",
    },
    message: {
      type: DataTypes.TEXT,
    },
    employeeId: {
      type: DataTypes.UUID,
      references: {
        model: "employees",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL", // optional: sets foreign key to null if the referenced row is deleted
    },
  });

  return ContactUsForm;
};
