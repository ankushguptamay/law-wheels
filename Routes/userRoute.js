const express = require("express");
const router = express.Router();

const { register, loginUser, otpVerification, getUser } = require('../Controllers/userController');
const { createHeDetails, createSheDetails, createRequiredDetails, getAllMutualDivorceFormForUser } = require('../Controllers/mutualDivorceFormController');
const { getTrandingImage } = require('../Controllers/Master/trandingOfferImageController');

//middleware
const { verifyUserToken } = require('../Middlewares/verifyJWT');
const { isUserPresent } = require('../Middlewares/isPresent');

router.post("/register", register);
router.post("/login", loginUser);
router.post("/otpVerification", otpVerification);
router.get("/getUser", verifyUserToken, getUser);

// Divorce Form
router.post("/createHeDetail", verifyUserToken, isUserPresent, createHeDetails);
router.post("/createSheDetail/:id", verifyUserToken, isUserPresent, createSheDetails);
router.post("/createRequiredDetails/:id", verifyUserToken, isUserPresent, createRequiredDetails);

router.get("/mutualDivorceDetail/:id", verifyUserToken, isUserPresent, getAllMutualDivorceFormForUser);

// Tranding Offer Image
router.post("/trandingOfferImages", getTrandingImage);

module.exports = router;