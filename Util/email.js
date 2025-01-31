const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs"); // For reading file attachments
const https = require("https");

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

async function sendEmail() {
  try {
    // Create a FormData object
    const form = new FormData();

    // Append fields
    form.append("from", "Jane Smith <assetslawwheels@gmail.com>");
    form.append("to", "ankushgupta9675@gmail.com");
    form.append("replyTo", "all.replies@somedomain.com");
    form.append("subject", "Mail subject text");
    form.append("text", "Mail body text");
    form.append("html", "<h1>Html body</h1><p>Rich HTML message body.</p>");
    // form.append("bulkId", "customBulkId");
    // form.append("intermediateReport", "true");
    // form.append("notifyUrl", "https://www.example.com/email/advanced");
    // form.append("notifyContentType", "application/json");
    // form.append("callbackData", "DLR callback data");
    // form.append('attachment', fs.createReadStream('files/image1.jpg'));

    const response = await axios.post(
      "https://e.api.itwalk.in/email/1/send",
      form,
      {
        auth: {
          username: "lawwheels", // Replace with your username
          password: "Email$4321", // Replace with your password
        },
        headers: {
          ...form.getHeaders(),
        },
        httpsAgent,
      }
    );

    console.log("Email sent successfully:", response.data);
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response ? error.response.data : error.message
    );
  }
}

module.exports = { sendEmail };
