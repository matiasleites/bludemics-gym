import { where } from "firebase/firestore";
import {
  deleteFirestoreDocument,
  getFirestoreDocument,
  insertFirestore,
  updateFirestoreDocument
} from "../../config/firebase";
import { userId } from "../../config/general-fun";

export async function getUserWorkoutsList() {
  const uid = userId();
  if (uid) {
    const response = await getFirestoreDocument(`users/${uid}/workouts`);
    return response;
  }
  return [];
}

export async function createWorkout(name) {
  const uid = userId();
  if (uid) {
    const exercices = [];
    const data = { exercices, name, uid };
    const response = await insertFirestore(`users/${uid}/workouts`, data);
    return response;
  }
  return false;
}

export async function updateWorkout(data) {
  const uid = userId();
  if (uid) {
    const response = await updateFirestoreDocument(
      `users/${uid}/workouts/${data.id}`,
      data
    );
    return response;
  }
  return false;
}

export async function getWorkout(workout) {
  const uid = userId();
  if (uid) {
    const response = await getFirestoreDocument(
      `users/${uid}/workouts/${workout}`
    );
    return response;
  }
  return false;
}

export async function deleteWorkout(workout) {
  const uid = userId();
  if (uid) {
    const response = await deleteFirestoreDocument(
      `users/${uid}/workouts/${workout}`
    );
    return response;
  }
  return false;
}

export async function getCurrentTraining() {
  const uid = userId();
  if (uid) {
    return await getFirestoreDocument(`users/${uid}/open`);
  }
  return false;
}

export async function startTraining(info) {
  const uid = userId();
  if (uid) {
    const response = await insertFirestore(`users/${uid}/open`, info);
    return response;
  }
  return false;
}

export async function updateTraining(info) {
  const uid = userId();
  if (uid) {
    const response = await updateFirestoreDocument(
      `users/${uid}/open/${info.id}`,
      info
    );
    return response;
  }
  return false;
}

export async function endTraining(info) {
  const uid = userId();
  if (uid) {
    const store = await storeTraining(info);
    if (store) {
      const response = await deleteFirestoreDocument(
        `users/${uid}/open/${info.id}`
      );
      return response;
    } else {
      return false;
    }
  }
  return false;
}

export async function storeTraining(info) {
  const uid = userId();
  if (uid) {
    const response = await insertFirestore(`users/${uid}/stored`, info);
    return response;
  }
  return false;
}

export function traninigElapsedTime(workout) {
  const myStart = workout.open.toDate();
  const now = new Date();
  const diff = now.getTime() - myStart.getTime();
  const totalSeconds = diff / 1000;
  const hours = totalSeconds / (60 * 60);
  var minutes = totalSeconds / 60;
  if (minutes > 60) minutes = minutes % 60;
  const seconds = totalSeconds % 60;
  var minutesFormated = Math.floor(minutes);
  if (minutesFormated < 10) minutesFormated = "0" + minutesFormated;
  var secondsFormated = Math.floor(seconds);
  if (secondsFormated < 10) secondsFormated = "0" + secondsFormated;
  var hoursFormated = Math.floor(hours);
  if (hoursFormated < 10) hoursFormated = "0" + hoursFormated;
  if (hours >= 1)
    return hoursFormated + ":" + minutesFormated + ":" + secondsFormated;
  return minutesFormated + ":" + secondsFormated;
}

export async function getStoredTrainings(start, end) {
  const uid = userId();
  if (uid) {
    if (!start) start = new Date();
    start.setHours(0, 0, 0, 0);
    if (!end) end = new Date();
    end.setHours(23, 59, 59, 0);
    var response = await getFirestoreDocument(
      `users/${uid}/stored`,
      where("open", ">=", start),
      where("open", "<=", end)
    );
    const positionResponse = [];
    if (response)
      response = response.map(function (tranining, index) {
        tranining.pos = index + 1;
        positionResponse.push(tranining);
      });
    return positionResponse;
  }
  return false;
}
