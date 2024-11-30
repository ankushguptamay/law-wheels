exports.associations = (db) => {
  db.user.hasMany(db.mutualDivorceForm, {
    foreignKey: "userId",
    as: "mutualDivorceForms",
  });
  db.mutualDivorceForm.belongsTo(db.user, { foreignKey: "userId", as: "user" });

  db.employee.hasMany(db.contactUsForm, {
    foreignKey: "employeeId",
    as: "contactUsForms",
  });
  db.contactUsForm.belongsTo(db.employee, {
    foreignKey: "employeeId",
    as: "employee",
  });

  db.employee.hasMany(db.mDPetitionForm, {
    foreignKey: "employeeId",
    as: "mDPetitionForm",
  });
  db.mDPetitionForm.belongsTo(db.employee, {
    foreignKey: "employeeId",
    as: "employee",
  });

  db.blogParentCategory.hasMany(db.blogCategory, {
    foreignKey: "pCategoryId",
    as: "categories",
  });
  db.blogCategory.belongsTo(db.blogParentCategory, {
    foreignKey: "pCategoryId",
    as: "pCategory",
  });

  // Blog Association
  db.blog.hasMany(db.blogImages, {
    foreignKey: "blogId",
    as: "images",
  });
  db.blogImages.belongsTo(db.blog, {
    foreignKey: "blogId",
    as: "blog",
  });

  db.blog.hasMany(db.blogCategoryAssociation, {
    foreignKey: "blogId",
    as: "blogCategory_juction",
  });
  db.blogCategoryAssociation.belongsTo(db.blog, {
    foreignKey: "blogId",
    as: "blogs",
  });

  db.blogCategory.hasMany(db.blogCategoryAssociation, {
    foreignKey: "blogCategoryId",
    as: "blogCategory_juction",
  });
  db.blogCategoryAssociation.belongsTo(db.blogCategory, {
    foreignKey: "blogCategoryId",
    as: "categories",
  });

  db.blog.hasMany(db.blogTagAssociation, {
    foreignKey: "blogId",
    as: "blogTag_juction",
  });
  db.blogTagAssociation.belongsTo(db.blog, {
    foreignKey: "blogId",
    as: "blogs",
  });

  db.blogTags.hasMany(db.blogTagAssociation, {
    foreignKey: "blogTagId",
    as: "blogTag_juction",
  });
  db.blogTagAssociation.belongsTo(db.blogTags, {
    foreignKey: "blogTagId",
    as: "tags",
  });

  db.employee.hasMany(db.contactUsLeadLogs, {
    foreignKey: "employeeId",
    as: "leadLogs",
  });

  db.contactUsForm.hasMany(db.contactUsLeadLogs, {
    foreignKey: "cSLeadId",
    as: "leadLogs",
  });

  db.employee.hasMany(db.mDPFLeadLogs, {
    foreignKey: "employeeId",
    as: "mDPFLeadLogs",
  });

  db.mDPetitionForm.hasMany(db.mDPFLeadLogs, {
    foreignKey: "mDPFLeadId",
    as: "leadLogs",
  });

  db.contactUsForm.hasMany(db.contactUsPayment, {
    foreignKey: "contactUsFormId",
    as: "payments",
  });

  db.contactUsForm.hasMany(db.dualityCUF, {
    foreignKey: "contactUsFormId",
    as: "dualityContactUsForms",
  });
};
