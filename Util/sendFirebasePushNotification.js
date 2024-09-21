const admin = require("firebase-admin");
const serviceAccount = require("../firebase-adminsdk.json");
// Decode the base64 string
const firebaseConfigBase64 = process.env.FIREBASE_CONFIG_BASE64;
const firebaseConfig = JSON.parse(Buffer.from(firebaseConfigBase64, 'base64').toString('utf8'));

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

exports.sendSinglePushNotification = (device_token, notification, data) => {
  const message = {
    token: device_token,
    notification: notification,
    android: {
      notification: {
        image: "https://law-wheel.b-cdn.net/image/logo_law.webp", // Include the image URL for Android devices
      },
    },
    data: data,
    apns: {
      payload: {
        aps: {
          "mutable-content": 1,
        },
      },
      fcm_options: {
        image: "https://law-wheel.b-cdn.net/image/logo_law.webp", // Include the image URL for iOS devices
      },
    },
    webpush: {
      headers: {
        image: "https://law-wheel.b-cdn.net/image/logo_law.webp", // Include the image URL for Web Push
      },
    },
  };
  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log("Message sent successfully:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
};

exports.sendMultiPushNotification = (device_token, notification) => {
  const tokens = device_token;
  const message = { notification: notification };
  admin
    .messaging()
    .sendMulticast({ tokens: tokens, ...message })
    .then((response) => {
      //   console.log("Message sent successfully:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
};
