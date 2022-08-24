import { msj } from "../../config/general-fun";
import { getStoredTrainings } from "../workouts/workout-fun";

export function makeReports(trainings) {
  const response = {
    trainings: trainings.length,
    steps: 0,
    km: 0,
    kg: 0,
    calories: 0,
    minutes: 0
  };

  try {
    trainings.map(function (training) {
      response.steps = response.steps + training.steps;
      response.km = response.km + training.km;
      response.kg = response.kg + (training.kg ? training.kg : 0);
      response.calories = response.calories + training.calories;
      response.minutes = response.minutes + training.minutes;
    });
  } catch (d) {
    msj(d);
  }

  return response;
}

export function currentOffset() {
  var offset = new Date().getTimezoneOffset();
  if (Math.abs(offset) > 60) return (offset / 60) * -1;
  return offset * -1;
}

export function offsetStr() {
  const off = currentOffset();
  const half = off % 1 != 0;
  var negative = "";
  if (off < 0) negative = "-";
  if (Math.abs(off) < 10) {
    return (
      negative +
      "0" +
      (negative.length > 0 ? off * -1 : off) +
      (half ? ":30" : ":00")
    );
  } else {
    return (
      negative + (negative.length > 0 ? off * -1 : off) + (half ? ":30" : ":00")
    );
  }
}

export async function getLastReports(days) {
  if (!days) days = 7;
  var date = new Date();
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  var firstDay = new Date(date.getDate());
  firstDay.setDate(firstDay.getDate() - days);
  const resp = await getStoredTrainings(firstDay, lastDay);
  return resp;
}
