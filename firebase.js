const admin = require('firebase-admin');
const path = require('path');

// Try multiple possible paths for the service account file
const possiblePaths = [
  './etc/secrets/rest-hosting-firebase-adminsdk-fbsvc-2a9948f401.json',
  './rest-hosting-firebase-adminsdk-fbsvc-2a9948f401.json',
  path.join(__dirname, 'etc/secrets/rest-hosting-firebase-adminsdk-fbsvc-2a9948f401.json'),
  path.join(__dirname, 'rest-hosting-firebase-adminsdk-fbsvc-2a9948f401.json')
];

let serviceAccount;
for (const filePath of possiblePaths) {
  try {
    serviceAccount = require(filePath);
    console.log('Service account loaded from:', filePath);
    break;
  } catch (error) {
    // Continue to next path
  }
}

if (!serviceAccount) {
  throw new Error('Firebase service account file not found. Please check the file path.');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;
