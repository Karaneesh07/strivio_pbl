// utils/fcm.js — Firebase Admin SDK helper
const admin = require('firebase-admin');
require('dotenv').config();

let initialized = false;

const initFirebase = () => {
  if (initialized) return;
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY
          ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
          : undefined,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    initialized = true;
    console.log('🔥 Firebase Admin initialised.');
  } catch (err) {
    console.warn('⚠️  Firebase init skipped (check .env):', err.message);
  }
};

/**
 * Send a FCM push notification to a single token.
 * @param {string} fcmToken  - Device FCM token
 * @param {string} title     - Notification title
 * @param {string} body      - Notification body
 * @returns {Promise}
 */
const sendNotification = async (fcmToken, title, body) => {
  initFirebase();
  if (!initialized) throw new Error('Firebase not initialised');

  const message = {
    notification: { title, body },
    token: fcmToken,
  };
  return admin.messaging().send(message);
};

module.exports = { sendNotification };
