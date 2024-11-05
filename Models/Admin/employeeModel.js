const { Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define("employees", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.STRING,
      validate: {
        isIn: [["BDA", "Blogger", "BDAManager"]],
      },
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    mobileNumber: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    device_token: { type: DataTypes.STRING(1234) },
  });

  const today = new Date();
  today.setMinutes(today.getMinutes() + 330);

  const day = today.toISOString().slice(8, 10);
  const year = today.toISOString().slice(2, 4);
  const month = today.toISOString().slice(5, 7);

  Employee.beforeCreate(async (employee) => {
    let startWith = `LWE${day}${month}${year}`;

    const lastSlug = await Employee.findOne({
      where: { slug: { [Op.startsWith]: startWith } },
      order: [["createdAt", "DESC"]],
    });
    let lastDigit;
    if (lastSlug) {
      lastDigit = parseInt(lastSlug.dataValues.slug.substring(9)) + 1;
    } else {
      lastDigit = 1;
    }

    let uniqueSlug = startWith + lastDigit;

    // Check if the slug already exists
    while (await Employee.findOne({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${startWith}${lastDigit++}`;
    }

    employee.slug = uniqueSlug;
  });
  return Employee;
};
