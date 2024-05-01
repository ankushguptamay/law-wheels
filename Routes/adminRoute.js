const express = require("express");
const router = express.Router();

const { registerAdmin, loginAdmin, changePassword, updateAdminName, getAdmin } = require('../Controllers/adminController');
const { getAllMutualDivorceForm } = require('../Controllers/mutualDivorceFormController');
const { getAllUser } = require('../Controllers/userController');
const { addTrandingImage, softDeleteTrandingImage, getTrandingImage } = require('../Controllers/Master/trandingOfferImageController');

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

// Tranding Offer Image 
router.post("/addOfferImage", verifyAdminToken, isAdminPresent, uploadImage.single("trandingOfferImage"), addTrandingImage);
router.delete("/deleteOfferImage/:id", verifyAdminToken, isAdminPresent, softDeleteTrandingImage);
router.get("/trandingOfferImages", verifyAdminToken, isAdminPresent, getTrandingImage);

module.exports = router;