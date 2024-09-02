// Import the functions you need from the SDKs you need
// import firebase from 'firebase/app';

// v9 compat packages are API compatible with v8 code
import firebase from 'firebase/compat/app';


import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';


const firebaseConfig = {
  apiKey: "AIzaSyCdMTRQ_rBZ-VcrBfFIMCx5Uivyv9Ye-2k",
  authDomain: "chat-app-3498c.firebaseapp.com",
  projectId: "chat-app-3498c",
  storageBucket: "chat-app-3498c.appspot.com",
  messagingSenderId: "648990871333",
  appId: "1:648990871333:web:6e30bdf7a61d004c1054cc",
  measurementId: "G-2J01KZ0KF3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();

if (window.location.hostname === 'localhost') {
  // auth.useEmulator('http://localhost:9099');
  // db.useEmulator('localhost', '8080');
}

export { db, auth };
export default firebase;