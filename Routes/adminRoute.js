const express = require("express");
const router = express.Router();

const { registerAdmin, loginAdmin, changePassword, updateAdminName, getAdmin } = require('../Controllers/adminController');
const { getAllUser } = require('../Controllers/userController');

//middleware
const { verifyAdminToken } = require('../Middlewares/verifyJWT');
const { isAdminPresent } = require('../Middlewares/isPresent');

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/changePassword", changePassword);
router.put("/updateAdminName", verifyAdminToken, isAdminPresent, updateAdminName);
router.get("/getAdmin", verifyAdminToken, isAdminPresent, getAdmin);

// User
router.get("/users", verifyAdminToken, isAdminPresent, getAllUser);

module.exports = router;