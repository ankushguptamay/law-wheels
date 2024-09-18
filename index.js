require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("./Routes/adminRoute");
const user = require("./Routes/userRoute");
const BDA = require("./Routes/Employee/BDARoute");
const blogger = require("./Routes/Employee/bloggerRoute");
// const os = require('os');
// const cpus = os.cpus().length;
// console.log(cpus);

const app = express();

var corsOptions = {
  origin: "*",
};

const db = require("./Models");
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

app.use("/files", express.static("./Resource"));

app.use("/api/admin", admin);
app.use("/api/user", user);
app.use("/api/BDA", BDA);
app.use("/api/blogger", blogger);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
