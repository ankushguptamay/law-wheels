module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define("notifications", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING },
    content: { type: DataTypes.STRING(1234) },
    notificationRelatedTo: {
      type: DataTypes.STRING,
      validate: {
        isIn: [["ContactUsLead", "Profile","MDPFLead"]],
      },
    },
    relatedId: { type: DataTypes.STRING },
    scheduleTime: { type: DataTypes.DATE },
    view: { type: DataTypes.BOOLEAN, defaultValue: false },
    receiverId: { type: DataTypes.STRING },
    device_token: { type: DataTypes.STRING(1234) },
  });
  return Notification;
};
