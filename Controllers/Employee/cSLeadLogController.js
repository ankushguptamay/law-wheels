const { Op } = require("sequelize");
const { cSLeadBlogValidation } = require("../../Middlewares/validate");
const {
  pushNotification,
} = require("../../Featurer/scheduledPushNotificationToEmployee");
const db = require("../../Models");
const CSLeadLog = db.contactUsLeadLogs;
const Notification = db.notification;

exports.addLeadsLog = async (req, res) => {
  try {
    // Body Validation
    const { error } = cSLeadBlogValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const {
      cSLeadId,
      nextCallTime,
      isNextCall,
      callStatus,
      legalDomain,
      leadCategory,
    } = req.body;
    if (isNextCall) {
      if (!nextCallTime) {
        return res.status(400).json({
          success: false,
          message: "Please enter next scheduled call time!",
        });
      }
    }
    await CSLeadLog.create({
      cSLeadId,
      nextCallTime,
      isNextCall,
      callStatus,
      legalDomain,
      leadCategory,
      employeeId: req.employee.id,
    });
    // Create notification
    if (nextCallTime) {
      const notification = [];
      const oneHour = new Date(nextCallTime);
      oneHour.setMinutes(oneHour.getMinutes() - 60);
      const fiftenMin = new Date(nextCallTime);
      fiftenMin.setMinutes(fiftenMin.getMinutes() - 15);
      const fiveMin = new Date(nextCallTime);
      fiveMin.setMinutes(fiveMin.getMinutes() - 5);
      const times = [oneHour, fiftenMin, fiveMin];
      for (let i = 0; i < times.length; i++) {
        if (times[i].getTime() > new Date().getTime()) {
          notification.push({
            title: "Scheduled call!",
            content: `Your have a scheduled at ${nextCallTime}`,
            notificationRelatedTo: "ContactUsLead",
            relatedId: cSLeadId,
            scheduleTime: times[i],
            receiverId: req.employee.id,
            device_token: req.employee.device_token,
          });
        }
      }
      await Notification.bulkCreate(notification, { returning: true });

      // Send Push Notification
      pushNotification(notification);
    }
    // Final response
    res.status(200).send({
      success: true,
      message: `CSLeads log added successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};
