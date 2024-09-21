const { Op } = require("sequelize");
const db = require("../../Models");
const Notification = db.notification;

exports.getEmployeeNotification = async (req, res) => {
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

    const date = new Date();
    date.setMinutes(date.getMinutes() + 330);
    //Search
    const query = [
      { scheduleTime: { [Op.lt]: date } },
      { receiverId: req.employee.id },
    ];
    if (search) {
      query.push({
        [Op.or]: [
          { title: { [Op.substring]: search } },
          { content: { [Op.substring]: search } },
        ],
      });
    }
    const [notifications, totalNotifications] = await Promise.all([
      Notification.findAll({
        limit: recordLimit,
        offset: offSet,
        where: {
          [Op.and]: query,
        },
        order: [["createdAt", "DESC"]],
      }),
      Notification.count({ where: { [Op.and]: query } }),
    ]);

    const totalPages = Math.ceil(totalNotifications / recordLimit) || 0;
    res.status(200).json({
      success: true,
      data: notifications,
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