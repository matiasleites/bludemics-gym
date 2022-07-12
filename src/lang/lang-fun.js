import { en } from "../lang/en.js";

export const getStr = (str, type) => {
  //type =0 normal, type 1 firstUpercasse, type 2 all Uppercase, type 3 all Lowcase
  var response = en(str);
  if (type === 1)
    response = response.charAt(0).toUpperCase() + response.slice(1);
  if (type === 2) response = response.toUpperCase();
  if (type === 3) response = response.toLowerCase();
  return response;
};
