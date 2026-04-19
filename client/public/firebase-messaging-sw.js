// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBswI_-V_W_ZunqWweQX_se1GADh1Kmdig",
  authDomain: "strivio-pbl.firebaseapp.com",
  projectId: "strivio-pbl",
  storageBucket: "strivio-pbl.firebasestorage.app",
  messagingSenderId: "935457751072",
  appId: "1:935457751072:web:4fdae83e3404133925bc45",
  measurementId: "G-9D8JM7Q1MH"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/vite.svg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
