module.exports = (sequelize, DataTypes) => {
  const CSLeadLog = sequelize.define("cSLeadLogs", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    leadCategory: { type: DataTypes.STRING },
    legalDomain: { type: DataTypes.STRING },
    callStatus: { type: DataTypes.STRING },
    isNextCall: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    nextCallTime: { type: DataTypes.DATE, allowNull: true },
    comment: { type: DataTypes.TEXT },
    cSLeadId: {
      type: DataTypes.UUID,
      references: {
        model: "contactUsForms",
        key: "id",
      },
      onUpdate: "CASCADE", // Updates cSLeadId if the contactUsForms id is updated
      onDelete: "SET NULL", // Sets cSLeadId to NULL if the related contactUsForms is deleted
      allowNull: true, // Allows null values, i.e., lead may not belong to any category
    },
    employeeId: {
      type: DataTypes.UUID,
      references: {
        model: "employees",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      allowNull: true,
    },
  });
  return CSLeadLog;
};
