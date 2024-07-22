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
db.user = require("./User/userModel.js")(sequelize, Sequelize);
db.mutualDivorceForm = require("./User/mutualDivorceFormModel.js")(
  sequelize,
  Sequelize
);
db.contactUsForm = require("./contactUsFormModel.js")(sequelize, Sequelize);
db.emailOTP = require("./User/emailOTPModel.js")(sequelize, Sequelize);

db.banner = require("./Master/bannerModel.js")(sequelize, Sequelize);

db.user.hasMany(db.mutualDivorceForm, {
  foreignKey: "userId",
  as: "mutualDivorceForms",
});
db.mutualDivorceForm.belongsTo(db.user, { foreignKey: "userId", as: "user" });

// queryInterface
//   .addColumn("users", "joinByApp", {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false,
//   })
//   .then((res) => {
//     console.log("joinByApp!");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

module.exports = db;
