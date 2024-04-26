const dbConfig = require('../Config/db.config.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.admin = require('./adminModel.js')(sequelize, Sequelize);
db.user = require('./userModel.js')(sequelize, Sequelize);
db.mutualDivorceForm = require('./mutualDivorceFormModel.js')(sequelize, Sequelize);
db.emailOTP = require('./emailOTPModel.js')(sequelize, Sequelize);

db.user.hasMany(db.mutualDivorceForm, { foreignKey: 'userId', as: 'mutualDivorceForms' });
db.mutualDivorceForm.belongsTo(db.user, { foreignKey: 'userId', as: 'user' });

module.exports = db;