module.exports = (sequelize, DataTypes) => {
  const ParentBlogCategories = sequelize.define("parentBlogCategories", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(1234),
    },
    fileName: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING(1234),
    },
    sort_order: {
      type: DataTypes.INTEGER,
    },
  });
  return ParentBlogCategories;
};
