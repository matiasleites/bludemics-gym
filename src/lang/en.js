const enJSON = {
  appName: "bludemics Gym",
  appName2: "bludemicsGym",
  appName3: "bluGym",
  slogan: "manage your daily workouts",
  keywords:
    "open software, gym, workout, hikking, sports, free, bludemics, blugym, gratis, academia, gimnasio, software livre, software libre, deportes",
  hello: "hello",
  hi: "hi",
  login: "login",
  logout: "logout",
  bye: "bye",
  name: "name",
  pass: "password",
  email: "email",
  repeat: "repeat",
  erro: "error",
  errorUpdate: "update error, try again",
  errorCreate: "create error, try again",
  success: "success",
  accept: "accept",
  cancel: "cancel",
  create: "create",
  update: "update",
  action: "ação",
  resetPass: "reset password",
  combos: "combos",
  mo: "mo",
  tu: "tu",
  we: "we",
  th: "th",
  fr: "fr",
  sa: "sa",
  su: "su",
  day: "day",
  monday: "monday",
  tuesday: "tuesday",
  wednesday: "wednesday",
  thursday: "wednesday",
  friday: "friday",
  saturday: "saturday",
  sunday: "sunday",
  graphics: "graphics",
  date: "date",
  info: "information",
  info2: "info",
  calories: "calories",
  proteins: "proteinas",
  training: "training",
  workout: "workout",
  repetitions: "repetitions",
  reps: "repetitions",
  series: "series",
  weight: "weight",
  plan: "plan",
  food: "food",
  exercise: "exercise",
  errorPass: "pass error",
  singUp: "sing up",
  repeatPass: "repeat pass",
  emptyInputs: "please fill all required fields",
  emptyInputsLogin:
    "please fill the email and password fields, the password needs to have at least 6 characters whit one special like @#!$%&*+-",
  errorSecondPass: "the passwords don not match",
  error500:
    "oops, something went wrong, sorry, we're already working on fixing the problem. Please go back and try again later.",
  workouts: "workouts",
  startWorkout: "start workout",
  free: "free",
  createWorkout: "create workout",
  addWorkout: "add workout",
  myWorkouts: "my workouts",
  delete: "delete",
  edit: "edit",
  upgrade: "upgrade",
  exercices: "exercices",
  exercice: "exercice",
  addExercice: "add exercice",
  createExercice: "create exercice",
  youTubeVideoLink: "youtube video link",
  video: "video",
  serie: "serie",
  endWorkout: "end workout",
  km: "km",
  minutes: "minutes",
  steps: "steps",
  reports: "reports",
  start: "start",
  end: "end",
  totals: "totals",
  percentual: "percentual",
  average: "average",
  minutesCalculate: "(zero to auto)",
  stepsByWorkout: "steps by workout",
  exampleWorkoutName: "example workout",
  squats: "squats",
  pushups: "push-ups",
  crunches: "crunches"
};

export const en = (str) => {
  if (enJSON[str]) return enJSON[str];
  return "";
};
