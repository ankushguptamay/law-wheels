const express = require("express");
const router = express.Router();

const { register, loginUser, otpVerification, getUser } = require('../Controllers/User/userController');
const { createHeDetails, createSheDetails, createRequiredDetails, createHeDetailsByWebSite, createSheDetailsByWebSite, createRequiredDetailsByWebSite } = require('../Controllers/User/DivorceForm/createMutualDivorceFormController');
const { getAllMutualDivorceFormForUser } = require('../Controllers/User/DivorceForm/getMDFormController');
const { getHomeScreen, getMutualDivorce, getMutualDivorceDetail } = require('../Controllers/Master/bannerController');

//middleware
const { verifyUserToken } = require('../Middlewares/verifyJWT');
const { isUserPresent } = require('../Middlewares/isPresent');

router.post("/register", register);
router.post("/login", loginUser);
router.post("/otpVerification", otpVerification);
router.get("/getUser", verifyUserToken, getUser);

// Divorce Form When user is loged In For Both app and website
router.post("/createHeDetail", verifyUserToken, isUserPresent, createHeDetails);
router.post("/createSheDetail/:id", verifyUserToken, isUserPresent, createSheDetails);
router.post("/createRequiredDetails/:id", verifyUserToken, isUserPresent, createRequiredDetails);

// Divorce Form When user is not loged In For website
router.post("/createHeDetail", createHeDetailsByWebSite);
router.post("/createSheDetail", createSheDetailsByWebSite);
router.post("/createRequiredDetails/:id", createRequiredDetailsByWebSite);

router.get("/mutualDivorceDetail", verifyUserToken, isUserPresent, getAllMutualDivorceFormForUser);

// Banner
router.get("/homeScreenBanners", getHomeScreen);
router.get("/mutualDivorceBanners", getMutualDivorce);
router.get("/mutualDivorceDetailBanners", getMutualDivorceDetail);

module.exports = router;