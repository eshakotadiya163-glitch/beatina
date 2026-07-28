import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';
dotenv.config();

// Placeholder for Firebase Admin setup
// The actual credentials will be provided by the user later
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'placeholder-project-id',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'placeholder@example.com',
  privateKey: process.env.FIREBASE_PRIVATE_KEY 
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : '-----BEGIN PRIVATE KEY-----\nPLACEHOLDER\n-----END PRIVATE KEY-----\n'
};

let adminAuth;

try {
  // Use admin.initializeApp with credential
  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount)
    });
    console.log('Firebase Admin Initialized');
  }
  adminAuth = getAuth();
} catch (error) {
  console.error('Firebase admin initialization error:', error.message);
  // Create a dummy auth object that throws if used
  adminAuth = {
    verifyIdToken: async () => {
      throw new Error('Firebase Admin SDK is not properly configured. Please update the API keys in .env');
    }
  };
}

export { adminAuth };
