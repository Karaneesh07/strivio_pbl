// services/notificationService.js — Firebase Cloud Messaging integration
const admin = require('firebase-admin');
require('dotenv').config();

// Standard Firebase Admin SDK initialization 
// A service account JSON is needed for production.
// For now, we assume the environment variables are set.
// Standard Firebase Admin SDK initialization 
// A service account JSON is needed for production.
if (!admin.apps.length) {
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
  
  if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: FIREBASE_CLIENT_EMAIL,
          privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
      console.log('🔥 Firebase Admin SDK initialized.');
    } catch (err) {
      console.warn('❌ Firebase Admin SDK failed to initialize. Notifications will be skipped.', err.message);
    }
  } else {
    console.log('ℹ️ Firebase credentials not fully provided. Push notifications are disabled.');
  }
}

/**
 * Sends a push notification to a specific device token.
 * @param {string} token - FCM Device Token
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 */
const sendNotification = async (token, title, body) => {
  if (!token) return;
  
  const message = {
    notification: { title, body },
    token: token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('[PUSH] Successfully sent notification:', response);
  } catch (err) {
    console.error('[PUSH] Error sending notification:', err.message);
  }
};

module.exports = {
  sendNotification,
};
