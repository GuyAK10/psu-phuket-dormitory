require('dotenv').config()
const admin = require('firebase-admin');
const FIREBASE_CONFIG = JSON.parse(process.env.FIREBASE_CONFIG)
// const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(FIREBASE_CONFIG),
  databaseURL: "https://maledormitory-2a8b6.firebaseio.com",
  storageBucket: "gs://maledormitory-2a8b6.appspot.com"
});

module.exports = admin;
