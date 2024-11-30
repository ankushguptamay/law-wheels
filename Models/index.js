const dbConfig = require("../Config/db.config.js");

const { Sequelize, DataTypes, QueryTypes } = require("sequelize");
const { associations } = require("./associations.js");
const { changeInData } = require("./qreryInterface.js");
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
db.contactUsForm = require("./ContactUs/contactUsFormModel.js")(
  sequelize,
  Sequelize
);
db.mDPetitionForm = require("./ContactUs/mutualDivorcePetitionFormModel.js")(
  sequelize,
  Sequelize
);
db.contactUsLeadLogs = require("./ContactUs/contactUsLeadLogsModel.js")(
  sequelize,
  Sequelize
);
db.mDPFLeadLogs = require("./ContactUs/mDPFLeadLogsModel.js")(
  sequelize,
  Sequelize
);

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
db.dualityCUF = require("./ContactUs/dualityCUFModel.js")(sequelize, Sequelize);

db.blogImages = require("./Blog/blogImgesModel.js")(sequelize, Sequelize);
db.blog = require("./Blog/blogModel.js")(sequelize, Sequelize);
db.blogCategoryAssociation = require("./Blog/blogCategoryAssociation.js")(
  sequelize,
  Sequelize
);
db.notification = require("./notificationModel.js")(sequelize, Sequelize);
db.contactUsPayment = require("./contactUsPaymentModel.js")(
  sequelize,
  Sequelize
);
db.blogTagAssociation = require("./Blog/blogTagAssociation.js")(
  sequelize,
  Sequelize
);

// All Association
associations(db);

// All QueryInterface
changeInData(queryInterface);

module.exports = db;
