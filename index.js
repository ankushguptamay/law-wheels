require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("./Routes/adminRoute");
const user = require("./Routes/userRoute");
const BDA = require("./Routes/Employee/BDARoute");
const blogger = require("./Routes/Employee/bloggerRoute");
const employee = require("./Routes/Employee/employeeRoute");
const {
  pushNotification,
} = require("./Featurer/scheduledPushNotificationToEmployee");
const { payment_response } = require("./Controllers/Admin/paymentLinkCont");
// const os = require('os');
// const cpus = os.cpus().length;
// console.log(cpus);

const app = express();

var corsOptions = {
  origin: "*",
};

const db = require("./Models");
const { Op } = require("sequelize");
const Notification = db.notification;
db.sequelize
  .sync()
  .then(() => {
    console.log("Database is synced");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Push Notification
const date = new Date();
Notification.findAll({
  where: { scheduleTime: { [Op.gte]: date } },
})
  .then((data) => {
    console.log(data.length);
    pushNotification(data);
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/files", express.static("./Resource"));

app.use("/api/admin", admin);
app.use("/api/user", user);
app.use("/api/employee", employee);
app.use("/api/BDA", BDA);
app.use("/api/blogger", blogger);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("webhook/payment-response", payment_response);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
