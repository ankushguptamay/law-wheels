const db = require("../../Models");
const User = db.user;
const UserOTP = db.emailOTP;
const {
  otpVerification,
  userLogin,
  userRegistration,
} = require("../../Middlewares/validate");
const { JWT_SECRET_KEY_USER, JWT_VALIDITY, OTP_DIGITS_LENGTH, OTP_VALIDITY } =
  process.env;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const generateOTP = require("../../Util/generateOTP");
const { sendOTP } = require("../../Util/sendOTPToMobileNumber");
const { capitalizeFirstLetter } = require("../../Util/capitalizeFirstLetter");

exports.register = async (req, res) => {
  try {
    // Body Validation
    const { error } = userRegistration(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    // Check Duplicacy
    const isUser = await User.findOne({
      where: {
        [Op.or]: [
          { mobileNumber: req.body.mobileNumber },
          { email: req.body.email },
        ],
      },
    });
    if (isUser) {
      return res.status(400).json({
        success: false,
        message: "This credentials already exist!",
      });
    }
    const name = capitalizeFirstLetter(req.body.name);
    // Save in DataBase
    const user = await User.create({
      name: name,
      mobileNumber: req.body.mobileNumber,
      email: req.body.email,
      joinByApp: true,
    });
    // Generate OTP for Email
    const otp = generateOTP.generateFixedLengthRandomNumber(OTP_DIGITS_LENGTH);
    // Sending OTP to mobile number
    await sendOTP(req.body.mobileNumber, otp);
    // Store OTP
    await UserOTP.create({
      validTill: new Date().getTime() + parseInt(OTP_VALIDITY),
      otp: otp,
      receiverId: user.id,
    });
    res.status(200).json({
      success: true,
      message: `Register successfully! OTP send to ${req.body.mobileNumber}!`,
      data: {
        mobileNumber: req.body.mobileNumber,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    // Body Validation
    const { error } = userLogin(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    // find user in database
    const user = await User.findOne({
      where: {
        mobileNumber: req.body.mobileNumber,
      },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Sorry! try to login with currect credentials.",
      });
    }
    // Sending OTP to mobile number
    // Generate OTP for Email
    const otp = generateOTP.generateFixedLengthRandomNumber(OTP_DIGITS_LENGTH);
    // Sending OTP to mobile number
    await sendOTP(req.body.mobileNumber, otp);
    // Store OTP
    await UserOTP.create({
      validTill: new Date().getTime() + parseInt(OTP_VALIDITY),
      otp: otp,
      receiverId: user.id,
    });
    res.status(200).json({
      success: true,
      message: `OTP send to ${req.body.mobileNumber}!`,
      data: {
        mobileNumber: req.body.mobileNumber,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.otpVerification = async (req, res) => {
  try {
    // Validate body
    const { error } = otpVerification(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { mobileNumber, mobileOTP } = req.body;
    // Is Mobile Otp exist
    const isOtp = await UserOTP.findOne({
      where: {
        otp: mobileOTP,
      },
    });
    if (!isOtp) {
      return res.status(400).send({
        success: false,
        message: `Invalid OTP!`,
      });
    }
    // Checking is user present or not
    const user = await User.findOne({
      where: {
        [Op.and]: [{ mobileNumber: mobileNumber }, { id: isOtp.receiverId }],
      },
    });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "No Details Found. Register Now!",
      });
    }
    // is email otp expired?
    const isOtpExpired = new Date().getTime() > parseInt(isOtp.validTill);
    if (isOtpExpired) {
      await UserOTP.destroy({ where: { receiverId: isOtp.receiverId } });
      return res.status(400).send({
        success: false,
        message: `OTP expired!`,
      });
    }
    await UserOTP.destroy({ where: { receiverId: isOtp.receiverId } });
    const data = {
      id: user.id,
      mobileNumber: user.mobileNumber,
    };
    const authToken = jwt.sign(
      data,
      JWT_SECRET_KEY_USER,
      { expiresIn: JWT_VALIDITY } // five day
    );
    res.status(201).send({
      success: true,
      message: `OTP verify successfully!`,
      data: user,
      authToken: authToken,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getUser = async (req, res) => {
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
        message: "Your profile is not present! Are you register?.. ",
      });
    }
    res.status(200).json({
      success: true,
      message: "User Profile fetched successfully!",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    // Pagination
    const recordLimit = parseInt(limit) || 10;
    let offSet = 0;
    let currentPage = 1;
    if (page) {
      offSet = (parseInt(page) - 1) * recordLimit;
      currentPage = parseInt(page);
    }
    const condition = [];
    // Search
    if (search) {
      condition.push({
        [Op.or]: [
          { name: { [Op.substring]: search } },
          { mobileNumber: { [Op.substring]: search } },
          { email: { [Op.substring]: search } },
        ],
      });
    }
    // Count All User
    const totalUser = await User.count({
      where: {
        [Op.and]: condition,
      },
    });
    // Get All user
    const user = await User.findAll({
      limit: recordLimit,
      offset: offSet,
      where: {
        [Op.and]: condition,
      },
      order: [["createdAt", "DESC"]],
    });
    // Final response
    res.status(200).send({
      success: true,
      message: "User fetched successfully!",
      totalPage: Math.ceil(totalUser / recordLimit),
      currentPage: currentPage,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.heartAPI = async (req, res) => {
  try {
    await User.findOne({ where: { id: "nja" } });
    res.status(200).json({
      success: true,
      message: "Heart API fired!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
