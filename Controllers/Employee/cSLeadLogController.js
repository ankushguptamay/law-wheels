const { Op } = require("sequelize");
const { cSLeadLogValidation } = require("../../Middlewares/validate");
const {
  pushNotification,
} = require("../../Featurer/scheduledPushNotificationToEmployee");
const { uploadFileToBunny, deleteFileToBunny } = require("../../Util/bunny");
const bunnyFolderName = "culead-audio";
const db = require("../../Models");
const CSLeadLog = db.contactUsLeadLogs;
const Notification = db.notification;

exports.addCULeadsLog = async (req, res) => {
  try {
    console.log(req.body);
    // Body Validation
    const { error } = cSLeadLogValidation(req.body);
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
      comment,
    } = req.body;

    if (isNextCall == "true") {
      if (!nextCallTime) {
        return res.status(400).json({
          success: false,
          message: "Please enter next scheduled call time!",
        });
      } else {
        if (nextCallTime.toLowerCase().includes("z")) {
          return res.status(400).json({
            success: false,
            message: `Time formet should not contain "Z"!`,
          });
        }
      }
    }

    // File handling
    let audio_mimeType, audio_url, audio_fileName;
    if (req.file) {
      if (!req.file.mimetype.toLowerCase().startsWith("audio")) {
        return res.status(400).json({
          success: false,
          message: `Only audio acceptable!`,
        });
      }
      // Upload file to bunny
      const fileStream = Buffer.from(req.file.buffer);
      const fileName = `${new Date().getTime()}-${req.file.originalname}`;
      await uploadFileToBunny(bunnyFolderName, fileStream, fileName);

      audio_mimeType = req.file.mimetype;
      audio_url = `${process.env.SHOW_BUNNY_FILE_HOSTNAME}/${bunnyFolderName}/${fileName}`;
      audio_fileName = fileName;
    }

    await CSLeadLog.create({
      cSLeadId,
      nextCallTime,
      isNextCall,
      callStatus,
      legalDomain,
      leadCategory,
      audio_mimeType,
      audio_url,
      audio_fileName,
      comment,
      employeeId: req.employee.id,
    });
    // Create notification
    if (nextCallTime) {
      const notification = [];
      const oneHour = new Date(nextCallTime);
      oneHour.setMinutes(oneHour.getMinutes() - 390);
      const fiftenMin = new Date(nextCallTime);
      fiftenMin.setMinutes(fiftenMin.getMinutes() - 345);
      const fiveMin = new Date(nextCallTime);
      fiveMin.setMinutes(fiveMin.getMinutes() - 335);
      const times = [oneHour, fiftenMin, fiveMin];
      const iso = new Date(nextCallTime).toString().split(" ");
      for (let i = 0; i < times.length; i++) {
        if (times[i].getTime() > new Date().getTime()) {
          notification.push({
            title: "Scheduled call!",
            content: `Your have a scheduled at ${iso.slice(0, 5).join(" ")}`,
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

exports.getCULeadLog = async (req, res) => {
  try {
    const log = await CSLeadLog.findOne({
      where: { cSLeadId: req.params.id },
      order: [["createdAt", "ASC"]],
    });
    // Final response
    res.status(200).send({
      success: true,
      message: `Logs fetched successfully!`,
      data: log,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.addAudioToCULog = async (req, res) => {
  try {
    // File should be exist
    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "Please..upload an audio!",
      });
    }

    if (!req.file.mimetype.toLowerCase().startsWith("audio")) {
      return res.status(400).json({
        success: false,
        message: `Only audio acceptable!`,
      });
    }

    const id = req.params.id;
    const lead = await CSLeadLog.findOne({
      where: {
        id,
        employeeId: req.employee.id,
      },
    });

    if (!lead) {
      return res.status(400).json({
        success: false,
        message: "This lead is not present or not created by you!",
      });
    }

    // Upload file to bunny
    const fileStream = Buffer.from(req.file.buffer);
    const fileName = `${new Date().getTime()}-${req.file.originalname}`;
    await uploadFileToBunny(bunnyFolderName, fileStream, fileName);

    // Delete file from bunny if present
    if (lead.audio_fileName) {
      await deleteFileToBunny(bunnyFolderName, lead.audio_fileName);
    }

    // Update
    await lead.update({
      audio_mimeType: req.file.mimetype,
      audio_url: `${process.env.SHOW_BUNNY_FILE_HOSTNAME}/${bunnyFolderName}/${fileName}`,
      audio_fileName: fileName,
    });

    // Final response
    res.status(200).send({
      success: true,
      message: `Audio added successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};
