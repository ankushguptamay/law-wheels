const express = require("express");
const router = express.Router();

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
  parentCategoryDetails,
  categoryDetails,
} = require("../../Controllers/Master/blogCategoryCont");
const {
  addTag,
  getTag,
  updateTag,
  deleteTag,
  tagSlug,
  tagDetails,
} = require("../../Controllers/Master/tagController");
const {
  createBlog,
  addAdditionalPic,
  addUpdateFeaturedPic,
  updateBlog,
  deleteBlog,
  deleteBlogPic,
  getBlogBySlug,
  getBlogs,
  publishBlog,
  blogSlug,
} = require("../../Controllers/Employee/blogController");

//middleware
const { verifyEmployeeToken } = require("../../Middlewares/verifyJWT");
const { isBloggerEmployeePresent } = require("../../Middlewares/isPresent");
const uploadImage = require("../../Middlewares/image");

router.use(verifyEmployeeToken);
router.use(isBloggerEmployeePresent);

router.get("/contactLeads/:id", getContactUsLeadDetails);

router.get("/contactLeads", getAllContactUsForm);

// Master
router.post("/categories", uploadImage.single("CategoryPic"), addCategories);
router.get("/categories", getCategories);
router.get("/categories/:slug", categoryDetails);
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
router.get("/parentCategories/:slug", parentCategoryDetails);
router.put(
  "/parentCategories/:id",
  uploadImage.single("CategoryPic"),
  updateParentCategories
);
router.delete("/parentCategories/:id", deleteParentCategories);
router.put("/categorySlug", categorySlug);
router.put("/parentCategorySlug", parentCategorySlug);

// tag
router.post("/tag", addTag);
router.get("/tag", getTag);
router.get("/tag/:slug", tagDetails);
router.put("/tag/:id", updateTag);
router.delete("/tag/:id", deleteTag);
router.put("/tagSlug", tagSlug);

// Blog
router.post(
  "/blog",
  uploadImage.fields([
    { name: "FeaturedPic", maxCount: 1 },
    { name: "AdditionalPic", maxCount: 20 },
  ]),
  createBlog
);
router.get("/blog", getBlogs);
router.get("/blog/:slug", getBlogBySlug);
router.put(
  "/featuredPic/:id",
  uploadImage.single("FeaturedPic"),
  addUpdateFeaturedPic
); // id = blog id
router.delete("/blogPic/:id", deleteBlogPic); // Pic id
router.put(
  "/additionalPic/:id",
  uploadImage.array("AdditionalPic", 20),
  addAdditionalPic
); // id = blog id
router.put("/blog/:id", updateBlog);
router.delete("/blog/:id", deleteBlog);
router.put("/blogSlug", blogSlug);
router.put("/publish/:id", publishBlog);

module.exports = router;
