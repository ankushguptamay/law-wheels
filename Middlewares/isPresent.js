const db = require("../Models");
const Admin = db.admin;
const Employee = db.employee;
const User = db.user;
const { Op } = require("sequelize");

exports.isAdminPresent = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({
      where: {
        [Op.and]: [{ id: req.admin.id }, { email: req.admin.email }],
      },
    });
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Admin is not present!",
      });
    }
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.isUserPresent = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        [Op.and]: [
          { id: req.user.id },
          { mobileNumber: req.user.mobileNumber },
        ],
      },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User is not present!",
      });
    }
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.isBDAEmployeePresent = async (req, res, next) => {
  try {
    const admin = await Employee.findOne({
      where: {
        [Op.and]: [
          { id: req.employee.id },
          { email: req.employee.email },
          { role: "BDA" },
        ],
      },
    });
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Admin is not present!",
      });
    }
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.isEmployeePresent = async (req, res, next) => {
    try {
      const admin = await Employee.findOne({
        where: {
          [Op.and]: [
            { id: req.employee.id },
            { email: req.employee.email },
            { role: req.employee.role },
          ],
        },
      });
      if (!admin) {
        return res.status(400).json({
          success: false,
          message: "Admin is not present!",
        });
      }
      next();
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
  
