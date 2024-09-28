const db = require("../../Models");
const { Op } = require("sequelize");
const ContactUsForm = db.contactUsForm;
const MutualDivorcePetitionForm = db.mDPetitionForm;

exports.getContactUsAnalytics = async (req, res) => {
  try {
    const { past7Days, past14Days, past28Days, past90Days, past365Days } =
      req.query;
    const dayInMilliSecond = 1000 * 60 * 60 * 24;

    const today = new Date();
    today.setMinutes(today.getMinutes() + 330);
    const day = String(today.getUTCDate()).padStart(2, "0");
    const month = String(today.getUTCMonth() + 1).padStart(2, "0");
    const year = today.getUTCFullYear();
    const todayForData = new Date(`${year}-${month}-${day}T18:29:59.000Z`);

    // For Current
    const lastDays = new Date();
    lastDays.setMinutes(lastDays.getMinutes() + 330);
    const compareLastDays = new Date();
    compareLastDays.setMinutes(compareLastDays.getMinutes() + 330);
    let query, contactUs, message, pastQuery, days;

    if (past14Days) {
      days = 14;
    } else if (past28Days) {
      days = 28;
    } else if (past90Days) {
      days = 90;
    } else if (past365Days) {
      days = 365;
    } else {
      days = 7;
    }
    lastDays.setDate(lastDays.getDate() - days);
    compareLastDays.setDate(compareLastDays.getDate() - days * 2);
    contactUs = new Array(days).fill(0);
    message = `Past ${days} days contact us details!`;
    query = { createdAt: { [Op.gte]: lastDays } };
    pastQuery = {
      updatedAt: { [Op.between]: [compareLastDays, lastDays] },
    };

    const [totalContactUs, contactUsWithRespectivePastTime, lastDaysContactUs] =
      await Promise.all([
        ContactUsForm.count({ where: query }),
        ContactUsForm.count({ where: pastQuery }),
        ContactUsForm.findAll({
          where: query,
          attributes: ["id", "createdAt"],
        }),
      ]);

    lastDaysContactUs.forEach((contact) => {
      const indexApprox =
        (todayForData.getTime() - contact.createdAt.getTime()) /
        dayInMilliSecond;
      const index = Math.floor(indexApprox);
      contactUs[days - 1 - index]++;
    });

    const status = {
      totalContactUs,
      contactUsWithRespectivePastTime,
      chart: contactUs,
    };
    return res.status(200).json({ success: true, message, data: status });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getMDPFAnalytics = async (req, res) => {
  try {
    const { past7Days, past14Days, past28Days, past90Days, past365Days } =
      req.query;
    const dayInMilliSecond = 1000 * 60 * 60 * 24;

    const today = new Date();
    today.setMinutes(today.getMinutes() + 330);
    const day = String(today.getUTCDate()).padStart(2, "0");
    const month = String(today.getUTCMonth() + 1).padStart(2, "0");
    const year = today.getUTCFullYear();
    const todayForData = new Date(`${year}-${month}-${day}T18:29:59.000Z`);

    // For Current
    const lastDays = new Date();
    lastDays.setMinutes(lastDays.getMinutes() + 330);
    const compareLastDays = new Date();
    compareLastDays.setMinutes(compareLastDays.getMinutes() + 330);
    let query, mDPF, message, pastQuery, days;

    if (past14Days) {
      days = 14;
    } else if (past28Days) {
      days = 28;
    } else if (past90Days) {
      days = 90;
    } else if (past365Days) {
      days = 365;
    } else {
      days = 7;
    }
    lastDays.setDate(lastDays.getDate() - days);
    compareLastDays.setDate(compareLastDays.getDate() - days * 2);
    mDPF = new Array(days).fill(0);
    message = `Past ${days} days contact us details!`;
    query = { createdAt: { [Op.gte]: lastDays } };
    pastQuery = {
      updatedAt: { [Op.between]: [compareLastDays, lastDays] },
    };

    const [totalMDPFs, mDPFWithRespectivePastTime, lastDaysMDPF] =
      await Promise.all([
        MutualDivorcePetitionForm.count({ where: query }),
        MutualDivorcePetitionForm.count({ where: pastQuery }),
        MutualDivorcePetitionForm.findAll({
          where: query,
          attributes: ["id", "createdAt"],
        }),
      ]);

    lastDaysMDPF.forEach((form) => {
      const indexApprox =
        (todayForData.getTime() - form.createdAt.getTime()) / dayInMilliSecond;
      const index = Math.floor(indexApprox);
      mDPF[days - 1 - index]++;
    });

    const status = {
      totalMDPFs,
      mDPFWithRespectivePastTime,
      chart: mDPF,
    };
    return res.status(200).json({ success: true, message, data: status });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
