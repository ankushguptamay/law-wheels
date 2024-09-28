const express = require("express");
const router = express.Router();

const {
  getAllContactUsLeadBDA,
  getContactUsLeadDetails,
} = require("../../Controllers/Admin/cantactUsFormModel");
const {
  getAllMDPFLeadBDA,
  getMDPFLeadDetails,
} = require("../../Controllers/Admin/mDPetitionFormCont");
const {
  addCULeadsLog,
  getCULeadLog,
} = require("../../Controllers/Employee/cSLeadLogController");
const {
  addMDPFLeadsLog,
  getMDPFLeadLog,
} = require("../../Controllers/Employee/mDPFLeadLogController");
const {
  getEmployeeNotification,
} = require("../../Controllers/Admin/notificationController");

//middleware
const { verifyEmployeeToken } = require("../../Middlewares/verifyJWT");
const { isBDAEmployeePresent } = require("../../Middlewares/isPresent");

router.use(verifyEmployeeToken);
router.use(isBDAEmployeePresent);

router.get("/contactLeads/:id", getContactUsLeadDetails);
router.get("/contactLeads", getAllContactUsLeadBDA);

router.get("/mDPFForm/:id", getMDPFLeadDetails);
router.get("/mDPFForm", getAllMDPFLeadBDA);

router.post("/cULeadsLog", addCULeadsLog);
router.get("/cULeadsLog/:id", getCULeadLog);

router.post("/mDPFLeadsLog", addMDPFLeadsLog);
router.get("/mDPFLeadsLog/:id", getMDPFLeadLog);

router.get("/notification", getEmployeeNotification);

module.exports = router;
