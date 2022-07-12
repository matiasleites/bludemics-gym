import { initializeApp } from "firebase/app";
import { getFirestore, Timestamp } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { initializeAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const config = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DB,
  projectId: process.env.REACT_APP_PID,
  storageBucket: process.env.REACT_APP_SB,
  messagingSenderId: process.env.REACT_APP_SID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MID
};

export const firebaseApp = initializeApp(config);
export const auth = getAuth(firebaseApp);
export const firestoredb = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export const storageback = getStorage(firebaseApp);
export const analytics = initializeAnalytics(firebaseApp);

export const firestoreNow = () => {
  return Timestamp.now();
};

export async function getFirebaseFileUrl(url) {
  const storageRef = ref(storage, url);
  const task = await getDownloadURL(storageRef);
  return task;
}
