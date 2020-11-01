const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json')
require('dotenv').config()
// const serviceAccount = JSON.parse(process.env.FIREBASEKEY)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://psu-phuket-dormitory.firebaseio.com',
  storageBucket: "gs://psu-phuket-dormitory.appspot.com"
});

module.exports = admin;
