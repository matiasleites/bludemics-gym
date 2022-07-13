import {
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
