const db = require("../../../Models");
const MutualDivorceForm = db.mutualDivorceForm;
const { Op } = require("sequelize");

exports.getAllMutualDivorceForm = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    // Pagination
    const recordLimit = parseInt(limit) || 10;
    let offSet = 0;
    let currentPage = 1;
    if (page) {
      offSet = (parseInt(page) - 1) * recordLimit;
      currentPage = parseInt(page);
    }
    const condition = [];
    // Search
    if (search) {
      condition.push({
        [Op.or]: [
          { he_name: { [Op.substring]: search } },
          { she_name: { [Op.substring]: search } },
          { he_email: { [Op.substring]: search } },
          { she_email: { [Op.substring]: search } },
        ],
      });
    }
    // Count All mutualDivorceForm
    const totalMutualDivorceForm = await MutualDivorceForm.count({
      where: {
        [Op.and]: condition,
      },
    });
    // Get All mutualDivorceForm
    const mutualDivorceForm = await MutualDivorceForm.findAll({
      limit: recordLimit,
      offset: offSet,
      where: {
        [Op.and]: condition,
      },
      order: [["createdAt", "DESC"]],
    });
    const transForm = mutualDivorceForm.map(
      ({
        id,
        userId,
        he_mobileNumber,
        he_city,
        he_religion,
        he_email,
        he_dateOfBirth,
        he_residence_address,
        he_present_address,
        he_fatherName,
        he_name,
        she_mobileNumber,
        she_husbandCity,
        she_religion,
        she_email,
        she_dateOfBirth,
        she_residence_address,
        she_present_address,
        she_fatherName,
        she_name,
        cityOfMarriage,
        marriage_date,
        placeOfMarriage,
        doYouHave_children,
        is_maintenanceAlimony,
        is_settlementRegardingJointAssets,
        any_pending_ligitations,
        comment,
        post_marriage_address,
      }) => {
        return {
          id,
          userId,
          heDetails: {
            he_mobileNumber,
            he_city,
            he_religion,
            he_email,
            he_dateOfBirth,
            he_residence_address,
            he_present_address,
            he_fatherName,
            he_name,
          },
          sheDetails: {
            she_mobileNumber,
            she_husbandCity,
            she_religion,
            she_email,
            she_dateOfBirth,
            she_residence_address,
            she_present_address,
            she_fatherName,
            she_name,
          },
          otherDetails: {
            cityOfMarriage,
            marriage_date,
            placeOfMarriage,
            doYouHave_children,
            is_maintenanceAlimony,
            is_settlementRegardingJointAssets,
            any_pending_ligitations,
            comment,
            post_marriage_address,
          },
        };
      }
    );
    // Final response
    res.status(200).send({
      success: true,
      message: "Mutual divorce form fetched successfully!",
      totalPage: Math.ceil(totalMutualDivorceForm / recordLimit),
      currentPage: currentPage,
      data: transForm,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllMutualDivorceFormForUser = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    // Pagination
    const recordLimit = parseInt(limit) || 10;
    let offSet = 0;
    let currentPage = 1;
    if (page) {
      offSet = (parseInt(page) - 1) * recordLimit;
      currentPage = parseInt(page);
    }
    const condition = [{ userId: req.user.id }];
    // Search
    if (search) {
      condition.push({
        [Op.or]: [
          { he_name: { [Op.substring]: search } },
          { she_name: { [Op.substring]: search } },
          { he_email: { [Op.substring]: search } },
          { she_email: { [Op.substring]: search } },
        ],
      });
    }
    // Count All mutualDivorceForm
    const totalMutualDivorceForm = await MutualDivorceForm.count({
      where: {
        [Op.and]: condition,
      },
    });
    // Get All mutualDivorceForm
    const mutualDivorceForm = await MutualDivorceForm.findAll({
      limit: recordLimit,
      offset: offSet,
      where: {
        [Op.and]: condition,
      },
      order: [["createdAt", "DESC"]],
    });
    // Final response
    res.status(200).send({
      success: true,
      message: "Mutual divorce form fetched successfully!",
      totalPage: Math.ceil(totalMutualDivorceForm / recordLimit),
      currentPage: currentPage,
      data: mutualDivorceForm,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getMutualDivorceFormUserId = async (req, res) => {
  try {
    // Get All mutualDivorceForm
    const mutualDivorceForm = await MutualDivorceForm.findAll({
      where: { userId: req.params.id },
      order: [["createdAt", "DESC"]],
    });
    const transForm = mutualDivorceForm.map(
      ({
        id,
        userId,
        he_mobileNumber,
        he_city,
        he_religion,
        he_email,
        he_dateOfBirth,
        he_residence_address,
        he_present_address,
        he_fatherName,
        he_name,
        she_mobileNumber,
        she_husbandCity,
        she_religion,
        she_email,
        she_dateOfBirth,
        she_residence_address,
        she_present_address,
        she_fatherName,
        she_name,
        cityOfMarriage,
        marriage_date,
        placeOfMarriage,
        doYouHave_children,
        is_maintenanceAlimony,
        is_settlementRegardingJointAssets,
        any_pending_ligitations,
        comment,
        post_marriage_address,
      }) => {
        return {
          id,
          userId,
          heDetails: {
            he_mobileNumber,
            he_city,
            he_religion,
            he_email,
            he_dateOfBirth,
            he_residence_address,
            he_present_address,
            he_fatherName,
            he_name,
          },
          sheDetails: {
            she_mobileNumber,
            she_husbandCity,
            she_religion,
            she_email,
            she_dateOfBirth,
            she_residence_address,
            she_present_address,
            she_fatherName,
            she_name,
          },
          otherDetails: {
            cityOfMarriage,
            marriage_date,
            placeOfMarriage,
            doYouHave_children,
            is_maintenanceAlimony,
            is_settlementRegardingJointAssets,
            any_pending_ligitations,
            comment,
            post_marriage_address,
          },
        };
      }
    );
    // Final response
    res.status(200).send({
      success: true,
      message: "Mutual divorce form fetched successfully!",
      data: transForm,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
