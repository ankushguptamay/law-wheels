const { Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const MutualDivorcePetitionForm = sequelize.define(
    "mutualDivorcePetitionForms",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      you_are: {
        type: DataTypes.STRING,
        validate: {
          isIn: [["Husband", "Wife"]],
        },
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
      },
      slug: {
        type: DataTypes.STRING,
        unique: true,
      },
      your_current_address: {
        type: DataTypes.STRING(1234),
      },
      your_contact_number: {
        type: DataTypes.STRING,
      },
      your_email: {
        type: DataTypes.STRING,
      },
      spouse_name: {
        type: DataTypes.STRING,
      },
      marriage_date: {
        type: DataTypes.DATEONLY,
      },
      place_last_resided_together: {
        type: DataTypes.STRING,
      },
      date_last_resided_together: {
        type: DataTypes.DATEONLY,
      },
      anyChild: {
        type: DataTypes.BOOLEAN,
      },
      reason_for_divorce: {
        type: DataTypes.TEXT,
      },
      paper_in_60Min: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      total_payable_amount: {
        type: DataTypes.INTEGER,
      },
      isPaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      term_accepted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
    }
  );

  const today = new Date();
  today.setMinutes(today.getMinutes() + 330);

  const day = today.toISOString().slice(8, 10);
  const year = today.toISOString().slice(2, 4);
  const month = today.toISOString().slice(5, 7);

  MutualDivorcePetitionForm.beforeCreate(async (contact) => {
    let startWith = `LWMDP${day}${month}${year}`;

    const lastSlug = await MutualDivorcePetitionForm.findOne({
      where: { slug: { [Op.startsWith]: startWith } },
      order: [["createdAt", "DESC"]],
    });
    let lastDigit;
    if (lastSlug) {
      lastDigit = parseInt(lastSlug.dataValues.slug.substring(11)) + 1;
    } else {
      lastDigit = 1;
    }

    let uniqueSlug = startWith + lastDigit;
    // Check if the slug already exists
    while (
      await MutualDivorcePetitionForm.findOne({ where: { slug: uniqueSlug } })
    ) {
      uniqueSlug = `${startWith}${lastDigit++}`;
    }
    contact.slug = uniqueSlug;
  });

  return MutualDivorcePetitionForm;
};

// employeeId