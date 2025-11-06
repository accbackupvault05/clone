import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  
  if (!projectId) {
    throw new Error('FIREBASE_PROJECT_ID environment variable is required');
  }

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId,
    });
  } else {
    // For development, you can use the default credentials
    // Make sure to set GOOGLE_APPLICATION_CREDENTIALS environment variable
    admin.initializeApp({
      projectId,
    });
  }
}

export const auth = admin.auth();
export const firestore = admin.firestore();

export default admin;