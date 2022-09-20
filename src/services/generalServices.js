export const redColor = "#FF2100";
export const redColorDark = "#b31700";
export const blueColor = "#05ABFF";
export const blueColorDark = "#0377b2";
export const orangeColor = "#FF8600";
export const orangeColorDark = "#b25d00";
export const greenColor = "#2BD90A";
export const greenColorDark = "#198206";
export const yellowColor = "#9C9517";
export const yellowColorDark = "#6D6810";

export const formatedNumber = (number, decimals = 2) => {
  if (!number) return 0;
  try {
    return number.toFixed(decimals);
  } catch (g) {
    return 0;
  }
};

export function userId() {
  var uid = "";
  uid = localStorage.getItem("uid");
  if (!uid) return false;
  return uid;
}
export function blockButton() {
  return " d-grid gap-2 ";
}

export function msj(info) {
  console.error(info);
}

export async function delay(seconds) {
  var time = seconds * 1000;
  await new Promise((resolve) => setTimeout(resolve, time)); // 3 sec
  return true;
}

export function isEven(n) {
  try {
    return n % 2 == 0;
  } catch (g) {
    msj(g);
    return false;
  }
}

export function getYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const response = match && match[2].length === 11 ? match[2] : undefined;
  return response;
}

export function dateToInputString(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [year, month, day].join("-");
}

export function minutesBetweenTwoDates(start, end) {
  const diff = end.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60));
}

export function getGraphicSize(width) {
  if (width > 780) {
    return { width: 630, height: 630 / 1.6 };
  } else {
    return { width: width * 0.8, height: (width * 0.8) / 1.6 };
  }
}

export function getRandomInt(min = 1, max = 999) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getDayOfFirebaseDate(date) {
  try {
    date = date.toDate().toLocaleString();
    date = date.slice(0, 10);
    return date;
  } catch (g) {
    msj(g);
    return "";
  }
}
