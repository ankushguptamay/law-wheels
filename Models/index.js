const dbConfig = require("../Config/db.config.js");

const { Sequelize, DataTypes, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
);

const db = {};

const queryInterface = sequelize.getQueryInterface();
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.admin = require("./Admin/adminModel.js")(sequelize, Sequelize);
db.reachOut = require("./Admin/reachOutModel.js")(sequelize, Sequelize);
db.employee = require("./Admin/employeeModel.js")(sequelize, Sequelize);
db.user = require("./User/userModel.js")(sequelize, Sequelize);
db.mutualDivorceForm = require("./User/mutualDivorceFormModel.js")(
  sequelize,
  Sequelize
);
db.contactUsForm = require("./contactUsFormModel.js")(sequelize, Sequelize);
db.emailOTP = require("./User/emailOTPModel.js")(sequelize, Sequelize);

db.banner = require("./Master/bannerModel.js")(sequelize, Sequelize);
db.blogCategory = require("./Master/blogCategoryModel.js")(
  sequelize,
  Sequelize
);
db.blogParentCategory = require("./Master/blogParentCategoryModel.js")(
  sequelize,
  Sequelize
);
db.blogTags = require("./Master/blogTagsModel.js")(sequelize, Sequelize);

db.blogImages = require("./Blog/blogImgesModel.js")(sequelize, Sequelize);
db.blog = require("./Blog/blogModel.js")(sequelize, Sequelize);
db.blogCategoryAssociation = require("./Blog/blogCategoryAssociation.js")(
  sequelize,
  Sequelize
);
db.blogTagAssociation = require("./Blog/blogTagAssociation.js")(
  sequelize,
  Sequelize
);

db.user.hasMany(db.mutualDivorceForm, {
  foreignKey: "userId",
  as: "mutualDivorceForms",
});
db.mutualDivorceForm.belongsTo(db.user, { foreignKey: "userId", as: "user" });

db.employee.hasMany(db.contactUsForm, {
  foreignKey: "employeeId",
  as: "contactUsForms",
});
db.contactUsForm.belongsTo(db.employee, {
  foreignKey: "employeeId",
  as: "employee",
});

db.blogParentCategory.hasMany(db.blogCategory, {
  foreignKey: "pCategoryId",
  as: "categories",
});
db.blogCategory.belongsTo(db.blogParentCategory, {
  foreignKey: "pCategoryId",
  as: "pCategory",
});

// Blog Association
db.blog.hasMany(db.blogImages, {
  foreignKey: "blogId",
  as: "images",
});
db.blogImages.belongsTo(db.blog, {
  foreignKey: "blogId",
  as: "blog",
});

db.blog.hasMany(db.blogCategoryAssociation, {
  foreignKey: "blogId",
  as: "blogCategory_juction",
});
db.blogCategoryAssociation.belongsTo(db.blog, {
  foreignKey: "blogId",
  as: "blogs",
});

db.blogCategory.hasMany(db.blogCategoryAssociation, {
  foreignKey: "blogCategoryId",
  as: "blogCategory_juction",
});
db.blogCategoryAssociation.belongsTo(db.blogCategory, {
  foreignKey: "blogCategoryId",
  as: "categories",
});

db.blog.hasMany(db.blogTagAssociation, {
  foreignKey: "blogId",
  as: "blogTag_juction",
});
db.blogTagAssociation.belongsTo(db.blog, {
  foreignKey: "blogId",
  as: "blogs",
});

db.blogTags.hasMany(db.blogTagAssociation, {
  foreignKey: "blogTagId",
  as: "blogTag_juction",
});
db.blogTagAssociation.belongsTo(db.blogTags, {
  foreignKey: "blogTagId",
  as: "tags",
});

// To add a foriegn key in existing table
// queryInterface
//   .addColumn("contactUsForms", "employeeId", {
//     type: DataTypes.UUID,
//     references: { model: "employees", key: "id" },
//   })
//   .then((res) => {
//     console.log("added!");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

module.exports = db;