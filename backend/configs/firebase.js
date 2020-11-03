require('dotenv').config()
const admin = require('firebase-admin');
// const serviceAccount = require('./serviceAccountKey.json')
const FIREBASE_CONFIG = JSON.parse(process.env.FIREBASE_CONFIG)

// console.log(FIREBASE_CONFIG)
admin.initializeApp({
  credential: admin.credential.cert(FIREBASE_CONFIG),
  databaseURL: 'https://psu-phuket-dormitory.firebaseio.com',
  storageBucket: "gs://psu-phuket-dormitory.appspot.com"
});

module.exports = admin;
