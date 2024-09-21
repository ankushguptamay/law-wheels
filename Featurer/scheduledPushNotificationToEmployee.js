const db = require("../Models");
const Notification = db.notification;
const cron = require("node-cron");
const {
  sendSinglePushNotification,
} = require("../Util/sendFirebasePushNotification");
const { Op } = require("sequelize");

const cronExpression = (scheduleTime) => {
  const targetDate = new Date(scheduleTime);
  // Extract hours, minutes, and date parts from the target date
  const targetMinute = targetDate.getMinutes();
  const targetHour = targetDate.getHours();
  const targetDay = targetDate.getDate();
  const targetMonth = targetDate.getMonth() + 1;

  const cronExpression = `${targetMinute} ${targetHour} ${targetDay} ${targetMonth} *`;
  return cronExpression;
};

const sendNotification = (user) => {
  const notification = {
    title: user.title,
    body: user.content,
    image: "https://law-wheel.b-cdn.net/image/logo_law.webp",
  };
  const data = { notificationId: user.id };
  sendSinglePushNotification(user.device_token, notification, data);
};

exports.pushNotification = async (data) => {
  try {
    data.forEach((user) => {
      cron.schedule(cronExpression(user.scheduleTime), () => {
        sendNotification(user);
      });
    });
    return { success: true };
  } catch (error) {
    return res.send(error.message);
  }
};
