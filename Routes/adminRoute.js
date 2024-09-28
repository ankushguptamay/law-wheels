const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  changePassword,
  updateAdminName,
  getAdmin,
} = require("../Controllers/Admin/adminController");
const {
  registerEmployee,
  getAllEmployee,
} = require("../Controllers/Employee/employeeCont");
const {
  getAllMutualDivorceForm,
  getMutualDivorceFormUserId,
} = require("../Controllers/User/DivorceForm/getMDFormController");
const { getAllUser } = require("../Controllers/User/userController");
const { getAllReachOut } = require("../Controllers/Admin/reachOutController");
const {
  getAllContactUsForm,
  getContactUsLeadDetails,
} = require("../Controllers/Admin/cantactUsFormModel");
const {
  getAllMDPFForm,
  getMDPFLeadDetails,
} = require("../Controllers/Admin/mDPetitionFormCont");
const {
  getContactUsAnalytics,
  getMDPFAnalytics,
} = require("../Controllers/Admin/dashBoard");
const {
  addBanner,
  softDeleteBanner,
  getHomeScreen,
  getMutualDivorce,
  getMutualDivorceDetail,
} = require("../Controllers/Master/bannerController");
const {
  getMDPFLeadLog,
} = require("../Controllers/Employee/mDPFLeadLogController");
const { getCULeadLog } = require("../Controllers/Employee/cSLeadLogController");

//middleware
const { verifyAdminToken } = require("../Middlewares/verifyJWT");
const { isAdminPresent } = require("../Middlewares/isPresent");
const uploadImage = require("../Middlewares/image");

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/changePassword", changePassword);

router.use(verifyAdminToken);
router.use(isAdminPresent);

router.put("/updateAdminName", updateAdminName);
router.get("/getAdmin", getAdmin);

// User
router.get("/users", getAllUser);

// Employee
router.post("/registerEmployee", registerEmployee);
router.get("/employee", getAllEmployee);

// router.get("/allMutualDivorceDetails", verifyAdminToken, isAdminPresent, getAllMutualDivorceForm);
router.get("/mutualDivorceDetails/:id", getMutualDivorceFormUserId);

// Banner
router.post("/addHomeScreen", uploadImage.single("HomeScreen"), addBanner);
router.post(
  "/addMutualDivorce",
  uploadImage.single("MutualDivorce"),
  addBanner
);
router.post(
  "/addMutualDivorceDetail",
  uploadImage.single("MutualDivorceDetails"),
  addBanner
);
router.delete("/deleteOfferImage/:id", softDeleteBanner);
router.get("/homeScreenBanners", getHomeScreen);
router.get("/mutualDivorceBanners", getMutualDivorce);
router.get("/mutualDivorceDetailBanners", getMutualDivorceDetail);

// Contact Us
router.get("/contactUsForm", getAllContactUsForm);
router.get("/contactUsForm/:id", getContactUsLeadDetails);

router.get("/cUleadsLog/:id", getCULeadLog);

router.get("/mDPForm", getAllMDPFForm);
router.get("/mDPForm/:id", getMDPFLeadDetails);

router.get("/mDPFLeadLogs/:id", getMDPFLeadLog);

// reach Out
router.get("/reachOut", getAllReachOut);

// Dashboard
router.get("/contactDashboard", getContactUsAnalytics);
router.get("/mDPFDashboard", getMDPFAnalytics);

module.exports = router;
