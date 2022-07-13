import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  Timestamp,
  updateDoc
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { initializeAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { isEven, msj } from "./general-fun";

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
export const firestoredb = getFirestore(firebaseApp, {
  experimentalForceLongPolling: true
});
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

export const getFirestoreDocument = async (url, data, data2, data3, data4) => {
  const divisions = await url.split("/");
  var response = [];
  try {
    if (divisions.length > 0 && isEven(divisions.length)) {
      //is document
      const myDoc = doc(firestoredb, url);
      await getDoc(myDoc).then((doc) => {
        response = doc.data();
        if (response) response.id = doc.id;
      });
    } else {
      //is collection
      const myDoc = collection(firestoredb, url);
      var myQuere;
      if (data) {
        myQuere = query(myDoc, data);
        if (data2) {
          myQuere = query(myDoc, data, data2);
          if (data3) {
            myQuere = query(myDoc, data, data2, data3);
            if (data4) {
              myQuere = query(myDoc, data, data2, data3, data4);
            } else {
              myQuere = query(myDoc, data, data2, data3);
            }
          } else {
            myQuere = query(myDoc, data, data2);
          }
        } else {
          myQuere = query(myDoc, data);
        }
      } else {
        myQuere = query(myDoc);
      }
      const myDocs = await getDocs(myQuere);
      myDocs.forEach((doc) => {
        const myData = doc.data();
        myData.id = doc.id;
        response.push(myData);
      });
    }
  } catch (g) {
    msj(g);
    response = false;
  }
  return response;
};

export const insertFirestore = async (url, data) => {
  const divisions = await url.split("/");
  var response = false;
  try {
    if (divisions.length > 0 && isEven(divisions.length)) {
      //is document
      const myDoc = doc(firestoredb, url);
      await setDoc(myDoc, data).then(() => {
        response = true;
      });
    } else {
      //is collection
      const myDoc = collection(firestoredb, url);
      await addDoc(myDoc, data).then((doc) => {
        response = doc.id;
      });
    }
  } catch (g) {
    msj(g);
  }
  return response;
};

export const updateFirestoreDocument = async (url, data, force) => {
  if (!force) force = false;
  var response = false;
  try {
    const myDoc = doc(firestoredb, url);
    if (force) {
      await setDoc(myDoc, data).then(() => {
        response = true;
      });
    } else {
      await updateDoc(myDoc, data).then(() => {
        response = true;
      });
    }
  } catch (g) {
    msj(g);
  }
  return response;
};
