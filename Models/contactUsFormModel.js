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
    selectedDepartment: {
      type: DataTypes.STRING,
      validate: {
        isIn: [["Sales", "Marketing", "Customer Support"]],
      },
    },
    message: {
      type: DataTypes.TEXT,
    },
  });
  return ContactUsForm;
};
