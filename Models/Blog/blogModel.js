module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define(
    "blogs",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      content: {
        type: DataTypes.TEXT,
      },
      readTime: {
        type: DataTypes.STRING,
      },
      publishDate: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      description: {
        type: DataTypes.STRING(1234),
      },
      status: {
        type: DataTypes.STRING,
        validate: {
          isIn: [["Draft", "Published", "Unpublish"]],
        },
        defaultValue: "Draft",
      },
    }
  );
  return Blog;
};
