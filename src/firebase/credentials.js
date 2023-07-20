import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

var config = {
  apiKey: process.env.VUE_APP_APIKEY,
  appId: process.env.VUE_APP_APPID,
  authDomain: process.env.VUE_APP_AUTHDOMAIN,
  messagingSenderId: process.env.VUE_APP_MESSAGINGSENDERID,
  projectId: process.env.VUE_APP_PROJECTID,
  storageBucket: process.env.VUE_APP_STORAGEBUCKET,
};

firebase.initializeApp(config);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const lotsCollection = db.collection("lots");
const requestsCollection = db.collection("requests");
const usersCollection = db.collection("users");
const sectionsCollection = db.collection("sections");

export {
  db,
  auth,
  lotsCollection,
  requestsCollection,
  usersCollection,
  sectionsCollection,
  storage,
};
