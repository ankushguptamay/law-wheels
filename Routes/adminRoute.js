const express = require("express");
const router = express.Router();

const { registerAdmin, loginAdmin, changePassword, updateAdminName, getAdmin } = require('../Controllers/adminController');
const { getAllMutualDivorceForm } = require('../Controllers/mutualDivorceFormController');
const { getAllUser } = require('../Controllers/userController');
const { addBanner, softDeleteBanner, getHomeScreen, getMutualDivorce, getMutualDivorceDetail } = require('../Controllers/Master/bannerController');

//middleware
const { verifyAdminToken } = require('../Middlewares/verifyJWT');
const { isAdminPresent } = require('../Middlewares/isPresent');
const uploadImage = require('../Middlewares/image');

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/changePassword", changePassword);
router.put("/updateAdminName", verifyAdminToken, isAdminPresent, updateAdminName);
router.get("/getAdmin", verifyAdminToken, isAdminPresent, getAdmin);

// User
router.get("/users", verifyAdminToken, isAdminPresent, getAllUser);

router.get("/mutualDivorceDetails", verifyAdminToken, isAdminPresent, getAllMutualDivorceForm);

// Banner
router.post("/addHomeScreen", verifyAdminToken, isAdminPresent, uploadImage.single("HomeScreen"), addBanner);
router.post("/addMutualDivorce", verifyAdminToken, isAdminPresent, uploadImage.single("MutualDivorce"), addBanner);
router.post("/addMutualDivorceDetail", verifyAdminToken, isAdminPresent, uploadImage.single("MutualDivorceDetails"), addBanner);
router.delete("/deleteOfferImage/:id", verifyAdminToken, isAdminPresent, softDeleteBanner);
router.get("/homeScreenBanners", verifyAdminToken, isAdminPresent, getHomeScreen);
router.get("/mutualDivorceBanners", verifyAdminToken, isAdminPresent, getMutualDivorce);
router.get("/mutualDivorceDetailBanners", verifyAdminToken, isAdminPresent, getMutualDivorceDetail);

module.exports = router;