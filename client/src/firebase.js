// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import api from "./services/api";

const firebaseConfig = {
  apiKey: "AIzaSyBswI_-V_W_ZunqWweQX_se1GADh1Kmdig",
  authDomain: "strivio-pbl.firebaseapp.com",
  projectId: "strivio-pbl",
  storageBucket: "strivio-pbl.firebasestorage.app",
  messagingSenderId: "935457751072",
  appId: "1:935457751072:web:4fdae83e3404133925bc45",
  measurementId: "G-9D8JM7Q1MH"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// Request permission and sync token to backend
export const requestPushPermission = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            // Note: you need a VAPID key in production for highest reliability.
            const token = await getToken(messaging, {
                // vapidKey: "YOUR_VAPID_KEY_HERE"
            });
            if (token) {
                // Post token to backend to attach to user profile
                await api.patch('/settings', { fcm_token: token });
                console.log('✅ Push notifications activated. Token synced.');
            }
        }
    } catch (err) {
        console.error('Push notification permission denied / error:', err);
    }
};

// Background listener placeholder
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
