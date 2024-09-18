const express = require("express");
const router = express.Router();

const {
  getAllContactUsLeadBDA,
  getContactUsLeadDetails,
} = require("../../Controllers/Admin/cantactUsFormModel");

//middleware
const { verifyEmployeeToken } = require("../../Middlewares/verifyJWT");
const { isBDAEmployeePresent } = require("../../Middlewares/isPresent");

router.get(
  "/contactLeads/:id",
  verifyEmployeeToken,
  isBDAEmployeePresent,
  getContactUsLeadDetails
);

router.get(
  "/contactLeads",
  verifyEmployeeToken,
  isBDAEmployeePresent,
  getAllContactUsLeadBDA
);

module.exports = router;
