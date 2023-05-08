import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAknNngnB0qwegmqDTtOI2yjXSIICIAiWI",
  authDomain: "therap-d1d30.firebaseapp.com",
  projectId: "therap-d1d30",
  storageBucket: "therap-d1d30.appspot.com",
  messagingSenderId: "528644440773",
  appId: "1:528644440773:web:6ea9b9a99b8da414ac26ac",
  measurementId: "G-QBKVPH9CRP",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth, firebaseConfig };
