const { Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const ContactUsForm = sequelize.define("contactUsForms", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
    },
    mobileNumber: {
      type: DataTypes.STRING,
    },
    isMobileVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    data_from_page: {
      type: DataTypes.STRING,
      validate: {
        isIn: [["Mutual Divorce", "Mutual Divorce 1", "Others"]],
      },
      defaultValue: "Others",
    },
    message: {
      type: DataTypes.TEXT,
    },
    employeeId: {
      type: DataTypes.UUID,
      references: {
        model: "employees",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL", // optional: sets foreign key to null if the referenced row is deleted
    },
  });

  const today = new Date();
  today.setMinutes(today.getMinutes() + 330);

  const day = today.toISOString().slice(8, 10);
  const year = today.toISOString().slice(2, 4);
  const month = today.toISOString().slice(5, 7);

  ContactUsForm.beforeCreate(async (contact) => {
    let startWith = `LW${day}${month}${year}`;

    const lastSlug = await ContactUsForm.findOne({
      where: { slug: { [Op.startsWith]: startWith } },
      order: [["createdAt", "DESC"]],
    });
    let lastDigit;
    if (lastSlug) {
      lastDigit = parseInt(lastSlug.dataValues.slug.substring(8)) + 1;
    } else {
      lastDigit = 1;
    }

    let uniqueSlug = startWith + lastDigit;

    // Check if the slug already exists
    while (await ContactUsForm.findOne({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${startWith}${lastDigit++}`;
    }

    contact.slug = uniqueSlug;
  });

  return ContactUsForm;
};
