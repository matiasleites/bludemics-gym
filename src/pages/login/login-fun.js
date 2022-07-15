import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { auth, firestoreNow, insertFirestore } from "../../config/firebase";
import { msj } from "../../config/general-fun";

export async function registerUser(email, pass) {
  var info = "";
  var success = false;
  await createUserWithEmailAndPassword(auth, email, pass)
    .then(async (resp) => {
      const create = await insertFirestore(`users/${resp.user.uid}`, {
        created: firestoreNow()
      });
      success = create;
    })
    .catch((error) => {
      msj(error);
      info = error.code;
      info = info.replaceAll("auth/", "");
      info = info.replaceAll("-", " ");
    });
  return { success, info };
}

export async function logIn(email, pass) {
  var info = "";
  var success = false;
  await signInWithEmailAndPassword(auth, email, pass)
    .then(() => {
      success = true;
    })
    .catch((error) => {
      msj(error);
      info = error.code;
      info = info.replaceAll("auth/", "");
      info = info.replaceAll("-", " ");
    });
  return { success, info };
}

export async function logOut() {
  await auth.signOut();
  localStorage.setItem("uid", "");
  window.location.reload(false);
}
