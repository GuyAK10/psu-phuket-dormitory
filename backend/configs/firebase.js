require('dotenv').config()
const admin = require('firebase-admin');
const FIREBASE_CONFIG = JSON.parse(process.env.FIREBASE_CONFIG)
// const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(FIREBASE_CONFIG),
  databaseURL: 'https://psu-phuket-dormitory.firebaseio.com',
  storageBucket: "gs://psu-phuket-dormitory.appspot.com"
});

module.exports = admin;
