const admin = require('firebase-admin');
const serviceAccount = require('./rest-hosting-firebase-adminsdk-fbsvc-2a9948f401.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;
