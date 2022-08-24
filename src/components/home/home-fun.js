export function randomImage(array) {
  const len = array.length;
  const myBack = array[Math.floor(Math.random() * len)];
  return myBack;
}
