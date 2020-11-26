require('dotenv').config()
const admin = require('firebase-admin');
const FIREBASE_CONFIG = JSON.parse(process.env.FIREBASE_CONFIG)
const isDevelopment = process.env.DEVELOPMENT || false
// const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(FIREBASE_CONFIG),
  databaseURL: 'https://psu-phuket-dormitory.firebaseio.com',
  storageBucket: "gs://psu-phuket-dormitory.appspot.com"
});

const db = admin.firestore()
const storage = admin.storage()

// if (isDevelopment) db.settings({ host: "localhost:8080", ssl: false })

module.exports = {
  db,
  storage,
  admin
};
