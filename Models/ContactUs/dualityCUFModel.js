const { Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const DualityCUF = sequelize.define("dualityCUFs", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
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
    contactUsFormId: {
      type: DataTypes.UUID,
      references: {
        model: "contactUsForms",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL", // optional: sets foreign key to null if the referenced row is deleted
    },
  });

  return DualityCUF;
};
