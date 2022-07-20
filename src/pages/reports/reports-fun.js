import { msj } from "../../config/general-fun";

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
