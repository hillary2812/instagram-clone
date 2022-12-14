// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyA1iVquvUNI6SPdFg9gBtIn_LWDu5qimeU",
  authDomain: "instagram-clone-5538b.firebaseapp.com",
  databaseURL: "https://instagram-clone-5538b.firebaseio.com",
  projectId: "instagram-clone-5538b",
  storageBucket: "instagram-clone-5538b.appspot.com",
  messagingSenderId: "286344947620",
  appId: "1:286344947620:web:b9a8f4c54b76959ba28331",
  measurementId: "G-40HN3ZNRTV",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
