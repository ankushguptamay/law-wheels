const axios = require("axios");

const whatsappCampaign = async (
  campaignName,
  destination,
  userName,
  templateParams = [] // Is template has any variables then ["Ankush","25",......]
) => {
  return new Promise((resolve, reject) => {
    const data = {
      apiKey: process.env.WHATSAPP_ACCESS_TOKEN,
      campaignName,
      destination,
      userName,
      media: {
        url: "https://law-wheel.b-cdn.net/image/law-wheels-logo.jpg",
        filename: "law-wheels-logo",
      },
    };
    if (templateParams.length > 0) {
      data.templateParams = templateParams;
    }
    axios
      .post(`https://backend.api-wa.co/campaign/myoperator/api/v2`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(
        (data) => {
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
  });
};

module.exports = { whatsappCampaign };
