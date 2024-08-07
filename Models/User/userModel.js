module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "users",
    {
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
      mobileNumber: {
        type: DataTypes.STRING,
      },
      joinByApp: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      paranoid: true,
    }
  );
  return User;
};
