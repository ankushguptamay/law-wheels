const db = require("../../Models");
const Employee = db.employee;
const Notification = db.notification;
const {
  validateEmployeeLogin,
  validateEmployeeRegistration,
  changePassword,
} = require("../../Middlewares/validate");
const { JWT_SECRET_KEY_ADMIN, JWT_VALIDITY } = process.env;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

const SALT = 10;

exports.registerEmployee = async (req, res) => {
  try {
    const { error } = validateEmployeeRegistration(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }
    const isEmployee = await Employee.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (isEmployee) {
      return res.status(400).json({
        success: false,
        message: "These credentials already exist!",
      });
    }
    const salt = await bcrypt.genSalt(SALT);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    await Employee.create({
      ...req.body,
      password: hashedPassword,
    });

    res.status(200).json({
      success: true,
      message: "Register successfully!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.loginEmployee = async (req, res) => {
  try {
    const { error } = validateEmployeeLogin(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }
    const device_token = req.body.device_token;
    const employee = await Employee.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!employee) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password!",
      });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      employee.password
    );
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password!",
      });
    }
    // Device token
    await employee.update({ device_token });
    await Notification.update(
      { device_token },
      { where: { receiverId: employee.id } }
    );
    // Auth Token
    const data = {
      id: employee.id,
      email: req.body.email,
      role: employee.role,
    };
    const authToken = jwt.sign(
      data,
      JWT_SECRET_KEY_ADMIN,
      { expiresIn: JWT_VALIDITY } // five day
    );
    res.status(200).json({
      success: true,
      message: "Login successfully!",
      authToken: authToken,
      data: employee,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { error } = changePassword(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }
    const employee = await Employee.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!employee) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password!",
      });
    }
    const validPassword = await bcrypt.compare(
      req.body.oldPassword,
      employee.password
    );
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password!",
      });
    }
    const salt = await bcrypt.genSalt(SALT);
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
    await employee.update({
      ...employee,
      password: hashedPassword,
    });
    const data = {
      id: employee.id,
      email: req.body.email,
      role: employee.role,
    };
    const authToken = jwt.sign(
      data,
      JWT_SECRET_KEY_ADMIN,
      { expiresIn: JWT_VALIDITY } // five day
    );
    res.status(200).json({
      success: true,
      message: "Password changed successfully!",
      authToken: authToken,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateEmployeeName = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      where: {
        [Op.and]: [{ id: req.employee.id }, { email: req.employee.email }],
      },
    });
    if (!employee) {
      return res.status(400).json({
        success: false,
        message: "Your profile is not present! Are you register?.. ",
      });
    }
    const { name } = req.body;
    await employee.update({
      ...employee,
      name: name,
    });
    res.status(200).json({
      success: true,
      message: "Name updated successfully!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      where: {
        [Op.and]: [{ id: req.employee.id }, { email: req.employee.email }],
      },
      attributes: { exclude: ["password"] },
    });
    if (!employee) {
      return res.status(400).json({
        success: false,
        message: "Employee is not present!",
      });
    }
    res.status(200).json({
      success: true,
      message: "Employee Profile Fetched successfully!",
      data: employee,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllEmployee = async (req, res) => {
  try {
    const { limit, page, search } = req.query;
    // Pagination
    const recordLimit = parseInt(limit) || 10;
    let offSet = 0;
    let currentPage = 1;
    if (page) {
      offSet = (parseInt(page) - 1) * recordLimit;
      currentPage = parseInt(page);
    }

    //Search
    let query = {};
    if (search) {
      query = {
        [Op.or]: [
          { slug: { [Op.substring]: search } },
          { name: { [Op.substring]: search } },
          { emial: { [Op.substring]: search } },
          { role: { [Op.substring]: search } },
        ],
      };
    }

    const [employee, totalEmployee] = await Promise.all([
      Employee.findAll({
        where: query,
        attributes: { exclude: ["password","device_token","updatedAt"] },
        limit: recordLimit,
        offset: offSet,
        order: [["createdAt", "DESC"]],
      }),
      Employee.count({ where: query }),
    ]);
    const totalPages = Math.ceil(totalEmployee / recordLimit) || 0;
    res.status(200).json({
      success: true,
      message: "Employee Profile Fetched successfully!",
      data: employee,
      totalPages: totalPages,
      currentPage,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
