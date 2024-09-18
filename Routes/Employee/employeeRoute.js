const express = require("express");
const router = express.Router();

const {
  loginEmployee,
  changePassword,
  updateEmployeeName,
  getEmployee,
} = require("../../Controllers/Employee/employeeCont");

//middleware
const { verifyEmployeeToken } = require("../../Middlewares/verifyJWT");

router.post("/login", loginEmployee);
router.post("/changePassword", changePassword);
router.put("/updateName", verifyEmployeeToken, updateEmployeeName);
router.get("/", verifyEmployeeToken, getEmployee);

module.exports = router;