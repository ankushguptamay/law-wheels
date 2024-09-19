const db = require("../../Models");
const ParentBlogCategories = db.blogParentCategory;
const BlogCategories = db.blogCategory;
const { Op } = require("sequelize");
const { deleteSingleFile } = require("../../Util/deleteFile");
const {
  parentCategoriesValidation,
  categoriesValidation,
  slugValidation,
} = require("../../Middlewares/blogValidation");

const { uploadFileToBunny, deleteFileToBunny } = require("../../Util/bunny");
const bunnyFolderName = "lww-m-file";
const fs = require("fs");

exports.addParentCategories = async (req, res) => {
  try {
    // Body Validation
    const { error } = parentCategoriesValidation(req.body);
    if (error) {
      if (req.file) {
        deleteSingleFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { slug, description, sort_order, name } = req.body;

    const parentCategorie = await ParentBlogCategories.findOne({
      where: { [Op.or]: [{ slug: slug }, { name: name }] },
    });
    if (parentCategorie) {
      if (req.file) {
        deleteSingleFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: `Name and slug should be unique!`,
      });
    }
    let fileName, url;
    if (req.file) {
      //Upload file to bunny
      const fileStream = fs.createReadStream(req.file.path);
      await uploadFileToBunny(bunnyFolderName, fileStream, req.file.filename);
      deleteSingleFile(req.file.path);
      fileName = req.file.filename;
      url = `${process.env.SHOW_BUNNY_FILE_HOSTNAME}/${bunnyFolderName}/${req.file.filename}`;
    }
    let data = { name, slug, description, sort_order, fileName, url };
    // Create this if not exist
    await ParentBlogCategories.create(data);
    res.status(200).json({
      success: true,
      message: "Parent categories added successfully!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.addCategories = async (req, res) => {
  try {
    // Body Validation
    const { error } = categoriesValidation(req.body);
    if (error) {
      if (req.file) {
        deleteSingleFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { slug, description, pCategoryId, sort_order, name } = req.body;

    const categorie = await BlogCategories.findOne({
      where: { [Op.or]: [{ slug: slug }, { name: name }] },
    });
    if (categorie) {
      if (req.file) {
        deleteSingleFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: `Name and slug should be unique!`,
      });
    }
    let fileName, url;
    if (req.file) {
      //Upload file to bunny
      const fileStream = fs.createReadStream(req.file.path);
      await uploadFileToBunny(bunnyFolderName, fileStream, req.file.filename);
      deleteSingleFile(req.file.path);
      fileName = req.file.filename;
      url = `${process.env.SHOW_BUNNY_FILE_HOSTNAME}/${bunnyFolderName}/${req.file.filename}`;
    }
    let data = {
      name,
      slug,
      description,
      sort_order,
      fileName,
      url,
      pCategoryId,
    };
    // Create this if not exist
    await BlogCategories.create(data);
    res.status(200).json({
      success: true,
      message: "Categories added successfully!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getParentCategories = async (req, res) => {
  try {
    const { limit, page, search } = req.query;
    // Pagination
    const recordLimit = parseInt(limit) || 10;
    let offSet = 0;
    let currentPage = 1;
    if (page) {
      offSet = (parseInt(page) - 1) * recordLimit;
      currentPage = parseInt(page);
    }

    //Search
    let query = {};
    if (search) {
      query = {
        [Op.or]: [
          { slug: { [Op.startsWith]: search } },
          { name: { [Op.startsWith]: search } },
        ],
      };
    }
    const [parentCategories, totalParentCategories] = await Promise.all([
      ParentBlogCategories.findAll({
        limit: recordLimit,
        offset: offSet,
        where: query,
        order: [["createdAt", "DESC"]],
      }),
      ParentBlogCategories.count({ where: query }),
    ]);

    const totalPages = Math.ceil(totalParentCategories / recordLimit) || 0;

    res.status(200).json({
      success: true,
      message: "Parent categories fetched successfully!",
      data: parentCategories,
      totalPages: totalPages,
      currentPage,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const { limit, page, search } = req.query;
    // Pagination
    const recordLimit = parseInt(limit) || 10;
    let offSet = 0;
    let currentPage = 1;
    if (page) {
      offSet = (parseInt(page) - 1) * recordLimit;
      currentPage = parseInt(page);
    }

    //Search
    let query = {};
    if (search) {
      query = {
        [Op.or]: [
          { slug: { [Op.startsWith]: search } },
          { name: { [Op.startsWith]: search } },
        ],
      };
    }
    const [categories, totalCategories] = await Promise.all([
      BlogCategories.findAll({
        limit: recordLimit,
        offset: offSet,
        where: query,
        include: [
          {
            model: ParentBlogCategories,
            as: "pCategory",
            attributes: ["name", "slug", "url", "description"],
          },
        ],
        order: [["createdAt", "DESC"]],
      }),
      BlogCategories.count({ where: query }),
    ]);

    const totalPages = Math.ceil(totalCategories / recordLimit) || 0;

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully!",
      data: categories,
      totalPages: totalPages,
      currentPage,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateParentCategories = async (req, res) => {
  try {
    // Body Validation
    const { error } = parentCategoriesValidation(req.body);
    if (error) {
      if (req.file) {
        deleteSingleFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { slug, description, sort_order, name } = req.body;
    const id = req.params.id;

    const parentCategorie = await ParentBlogCategories.findOne({
      where: { id },
    });
    if (!parentCategorie) {
      if (req.file) {
        deleteSingleFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: `This parent categories is not present!`,
      });
    }

    if (name !== parentCategorie.name) {
      const isName = await ParentBlogCategories.findOne({ where: { name } });
      if (isName) {
        if (req.file) {
          deleteSingleFile(req.file.path);
        }
        return res.status(400).json({
          success: false,
          message: `Name should be unique!`,
        });
      }
    }

    if (slug !== parentCategorie.slug) {
      const isSlug = await ParentBlogCategories.findOne({ where: { slug } });
      if (isSlug) {
        if (req.file) {
          deleteSingleFile(req.file.path);
        }
        return res.status(400).json({
          success: false,
          message: `Slug should be unique!`,
        });
      }
    }

    let fileName = parentCategorie.fileName,
      url = parentCategorie.url;
    if (req.file) {
      //Upload file to bunny
      const fileStream = fs.createReadStream(req.file.path);
      await uploadFileToBunny(bunnyFolderName, fileStream, req.file.filename);
      deleteSingleFile(req.file.path);
      fileName = req.file.filename;
      url = `${process.env.SHOW_BUNNY_FILE_HOSTNAME}/${bunnyFolderName}/${req.file.filename}`;
      // Delete file from bunny
      if (parentCategorie.fileName) {
        await deleteFileToBunny(bunnyFolderName, parentCategorie.fileName);
      }
    }
    let data = { name, slug, description, sort_order, fileName, url };

    // update
    await parentCategorie.update(data);
    res.status(200).json({
      success: true,
      message: "Parent categories updated successfully!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateCategories = async (req, res) => {
  try {
    // Body Validation
    const { error } = categoriesValidation(req.body);
    if (error) {
      if (req.file) {
        deleteSingleFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { slug, description, sort_order, pCategoryId, name } = req.body;
    const id = req.params.id;

    const categorie = await BlogCategories.findOne({ where: { id } });
    if (!categorie) {
      if (req.file) {
        deleteSingleFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: `This categories is not present!`,
      });
    }

    if (name !== categorie.name) {
      const isName = await BlogCategories.findOne({ where: { name } });
      if (isName) {
        if (req.file) {
          deleteSingleFile(req.file.path);
        }
        return res.status(400).json({
          success: false,
          message: `Name should be unique!`,
        });
      }
    }

    if (slug !== categorie.slug) {
      const isSlug = await BlogCategories.findOne({ where: { slug } });
      if (isSlug) {
        if (req.file) {
          deleteSingleFile(req.file.path);
        }
        return res.status(400).json({
          success: false,
          message: `Slug should be unique!`,
        });
      }
    }

    let fileName = categorie.fileName,
      url = categorie.url;
    if (req.file) {
      //Upload file to bunny
      const fileStream = fs.createReadStream(req.file.path);
      await uploadFileToBunny(bunnyFolderName, fileStream, req.file.filename);
      deleteSingleFile(req.file.path);
      fileName = req.file.filename;
      url = `${process.env.SHOW_BUNNY_FILE_HOSTNAME}/${bunnyFolderName}/${req.file.filename}`;
      // Delete file from bunny
      if (categorie.fileName) {
        await deleteFileToBunny(bunnyFolderName, categorie.fileName);
      }
    }
    let data = {
      name,
      slug,
      description,
      sort_order,
      fileName,
      url,
      pCategoryId,
    };

    // update
    await categorie.update(data);
    res.status(200).json({
      success: true,
      message: "Categories updated successfully!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteParentCategories = async (req, res) => {
  try {
    const id = req.params.id;

    const parentCategorie = await ParentBlogCategories.findOne({
      where: { id },
    });
    if (!parentCategorie) {
      return res.status(400).json({
        success: false,
        message: `This parent categories is not present!`,
      });
    }

    const categories = await BlogCategories.findAll({
      where: { pCategoryId: parentCategorie.id },
    });
    for (let i = 0; i < categories.length; i++) {
      // Delete file from bunny
      if (categories[i].fileName) {
        await deleteFileToBunny(bunnyFolderName, categories[i].fileName);
      }
    }
    await BlogCategories.destroy({
      where: { pCategoryId: parentCategorie.id },
    });
    // Delete file from bunny
    if (parentCategorie.fileName) {
      await deleteFileToBunny(bunnyFolderName, parentCategorie.fileName);
    }

    // update
    await parentCategorie.destroy();
    res.status(200).json({
      success: true,
      message: "Parent categories deleted successfully!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteCategories = async (req, res) => {
  try {
    const id = req.params.id;

    const categorie = await BlogCategories.findOne({ where: { id } });
    if (!categorie) {
      return res.status(400).json({
        success: false,
        message: `This categories is not present!`,
      });
    }

    // Delete file from bunny
    if (categorie.fileName) {
      await deleteFileToBunny(bunnyFolderName, categorie.fileName);
    }

    // update
    await categorie.destroy();
    res.status(200).json({
      success: true,
      message: "Categories deleted successfully!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.parentCategorySlug = async (req, res) => {
  try {
    // Body Validation
    const { error } = slugValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const slug = req.body.slug;
    const isBlog = await ParentBlogCategories.findOne({ where: { slug } });
    if (isBlog) {
      return res.status(400).json({
        success: false,
        message: `Present`,
      });
    }

    res.status(200).json({
      success: true,
      message: "NotPresent!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.categorySlug = async (req, res) => {
  try {
    // Body Validation
    const { error } = slugValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const slug = req.body.slug;
    const isBlog = await BlogCategories.findOne({ where: { slug } });
    if (isBlog) {
      return res.status(400).json({
        success: false,
        message: `Present`,
      });
    }

    res.status(200).json({
      success: true,
      message: "NotPresent!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.parentCategoryDetails = async (req, res) => {
  try {
    const slug = req.params.slug;
    const isBlog = await ParentBlogCategories.findOne({ where: { slug } });
    if (!isBlog) {
      return res.status(400).json({
        success: false,
        message: "NotPresent!",
      });
    }

    res.status(200).json({
      success: true,
      data: isBlog,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.categoryDetails = async (req, res) => {
  try {
    const slug = req.params.slug;
    const isBlog = await BlogCategories.findOne({ where: { slug } });
    if (!isBlog) {
      return res.status(400).json({
        success: false,
        message: "NotPresent!",
      });
    }

    res.status(200).json({
      success: true,
      data: isBlog,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
