export function randomImages(array) {
  const len = array.length;
  const myBack = array[Math.floor(Math.random() * len)];
  return myBack;
}
