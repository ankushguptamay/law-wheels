const express = require("express");
const router = express.Router();

const {
  loginEmployee,
  changePassword,
  updateEmployeeName,
  getEmployee,
} = require("../../Controllers/Employee/employeeCont");
const {
  getAllContactUsForm,
  getContactUsLeadDetails,
} = require("../../Controllers/Admin/cantactUsFormModel");
const {
  addCategories,
  addParentCategories,
  getCategories,
  getParentCategories,
  updateCategories,
  updateParentCategories,
  deleteCategories,
  deleteParentCategories,
  categorySlug,
  parentCategorySlug,
} = require("../../Controllers/Master/blogCategoryCont");

//middleware
const { verifyEmployeeToken } = require("../../Middlewares/verifyJWT");
const { isBloggerEmployeePresent } = require("../../Middlewares/isPresent");

router.post("/login", loginEmployee);
router.post("/changePassword", changePassword);
router.put("/updateName", verifyEmployeeToken, updateEmployeeName);
router.get("/", verifyEmployeeToken, getEmployee);

router.use(verifyEmployeeToken);
router.use(isBloggerEmployeePresent);

router.get("/contactLeads/:id", getContactUsLeadDetails);

router.get("/contactLeads", getAllContactUsForm);

// Master
router.post("/categories", uploadImage.single("CategoryPic"), addCategories);
router.get("/categories", getCategories);
router.put(
  "/categories/:id",
  uploadImage.single("CategoryPic"),
  updateCategories
);
router.delete("/categories/:id", deleteCategories);

router.post(
  "/parentCategories",
  uploadImage.single("CategoryPic"),
  addParentCategories
);
router.get("/parentCategories", getParentCategories);
router.put(
  "/parentCategories/:id",
  uploadImage.single("CategoryPic"),
  updateParentCategories
);
router.delete("/parentCategories/:id", deleteParentCategories);
router.put("/categorySlug", categorySlug);
router.put("/parentCategorySlug", parentCategorySlug);

module.exports = router;
