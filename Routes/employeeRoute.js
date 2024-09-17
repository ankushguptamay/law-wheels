const express = require("express");
const router = express.Router();

const {
  loginEmployee,
  changePassword,
  updateEmployeeName,
  getEmployee,
} = require("../Controllers/Employee/employeeCont");
const {
  getAllContactUsLeadBDA,
  getContactUsLeadDetails,
} = require("../Controllers/Admin/cantactUsFormModel");

//middleware
const { verifyEmployeeToken } = require("../Middlewares/verifyJWT");
const { isBDAEmployeePresent ,isEmployeePresent} = require("../Middlewares/isPresent");

router.post("/login", loginEmployee);
router.post("/changePassword", changePassword);
router.put("/updateName", verifyEmployeeToken, updateEmployeeName);
router.get("/", verifyEmployeeToken, getEmployee);

router.get(
    "/contactLead/:id",
    verifyEmployeeToken,
    isEmployeePresent,
    getContactUsLeadDetails
  );

// BDA
router.get(
  "/myContactLeads",
  verifyEmployeeToken,
  isBDAEmployeePresent,
  getAllContactUsLeadBDA
);

module.exports = router;
