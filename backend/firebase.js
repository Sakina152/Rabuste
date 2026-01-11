import admin from "firebase-admin";
import { readFileSync } from "fs";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

let serviceAccount;

// For local development - use serviceAccountKey.json
if (process.env.NODE_ENV !== 'production') {
  serviceAccount = JSON.parse(readFileSync("./serviceAccountKey.json", "utf8"));
} else {
  // For production - use environment variables
  serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;