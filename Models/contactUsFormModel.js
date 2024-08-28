module.exports = (sequelize, DataTypes) => {
  const ContactUsForm = sequelize.define("contactUsForms", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    mobileNumber: {
      type: DataTypes.STRING,
    },
    data_from_page: {
      type: DataTypes.STRING,
      validate: {
        isIn: [["Mutual Divorce", "Others"]],
      },
      defaultValue: "Others",
    },
    message: {
      type: DataTypes.TEXT,
    },
  });
  return ContactUsForm;
};
