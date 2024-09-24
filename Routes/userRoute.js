const express = require("express");
const router = express.Router();

const {
  register,
  loginUser,
  otpVerification,
  getUser,
  heartAPI,
} = require("../Controllers/User/userController");
const {
  createHeDetails,
  createSheDetails,
  createRequiredDetails,
  createHeDetailsByWebSite,
  createSheDetailsByWebSite,
  createRequiredDetailsByWebSite,
} = require("../Controllers/User/DivorceForm/createMutualDivorceFormController");
const {
  getAllMutualDivorceFormForUser,
} = require("../Controllers/User/DivorceForm/getMDFormController");
const {
  getBlogBySlugForUser,
  getBlogsForUser,
} = require("../Controllers/Employee/blogController");
const {
  createContactUsForm,
} = require("../Controllers/Admin/cantactUsFormModel");
const { createReachOut } = require("../Controllers/Admin/reachOutController");
const {
  getHomeScreen,
  getMutualDivorce,
  getMutualDivorceDetail,
} = require("../Controllers/Master/bannerController");

//middleware
const { verifyUserToken } = require("../Middlewares/verifyJWT");
const { isUserPresent } = require("../Middlewares/isPresent");

router.post("/register", register);
router.post("/login", loginUser);
router.post("/otpVerification", otpVerification);
router.get("/getUser", verifyUserToken, getUser);

// Divorce Form When user is loged In For Both app and website
router.post("/createHeDetail", verifyUserToken, isUserPresent, createHeDetails);
router.post(
  "/createSheDetail/:id",
  verifyUserToken,
  isUserPresent,
  createSheDetails
);
router.post(
  "/createRequiredDetails/:id",
  verifyUserToken,
  isUserPresent,
  createRequiredDetails
);

// Divorce Form When user is not loged In For website
router.post("/createHeDetailsByWebSite", createHeDetailsByWebSite);
router.post("/createSheDetailsByWebSite", createSheDetailsByWebSite);
router.post(
  "/createRequiredDetailsByWebSite/:id",
  createRequiredDetailsByWebSite
);

router.get(
  "/mutualDivorceDetail",
  verifyUserToken,
  isUserPresent,
  getAllMutualDivorceFormForUser
);

// Banner
router.get("/homeScreenBanners", getHomeScreen);
router.get("/mutualDivorceBanners", getMutualDivorce);
router.get("/mutualDivorceDetailBanners", getMutualDivorceDetail);

// Contact Us
router.post("/contactUsForm", createContactUsForm);

// Reach out
router.post("/reachOut", createReachOut);

// Heart
router.get("/heartAPI", heartAPI);

// Blog
router.get("/blog", getBlogsForUser);
router.get("/blog/:slug", getBlogBySlugForUser);

module.exports = router;
