require('dotenv').config()
const admin = require('firebase-admin')
const serviceAccount = require('./dormphuket.json')
// const serviceAccount = require('./serviceAccountKey.json')
// const FIREBASE_CONFIG = JSON.parse(process.env.FIREBASE_CONFIG)
const isDevelopment = process.env.DEVELOPMENT || false

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://psu-phuket-dormitory.firebaseio.com',
//   storageBucket: "gs://psu-phuket-dormitory.appspot.com"
// });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://dormphuket.firebaseio.com',
  storageBucket: "gs://dormphuket.appspot.com"
});

const db = admin.firestore()
const storage = admin.storage()
// if (isDevelopment) db.settings({ host: "localhost:8080", ssl: false })

module.exports = {
  db,
  storage,
  admin
};
