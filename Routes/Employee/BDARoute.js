const express = require("express");
const router = express.Router();

const {
  getAllContactUsLeadBDA,
  getContactUsLeadDetails,
} = require("../../Controllers/Admin/cantactUsFormModel");
const {
  addLeadsLog,
} = require("../../Controllers/Employee/cSLeadLogController");
const {
  getEmployeeNotification
} = require("../../Controllers/Admin/notificationController");

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

router.post(
  "/leadsLog",
  verifyEmployeeToken,
  isBDAEmployeePresent,
  addLeadsLog
);

router.get(
  "/notification",
  verifyEmployeeToken,
  isBDAEmployeePresent,
  getEmployeeNotification
);

module.exports = router;
