import { msj } from "../services/generalServices.js";
import { en } from "../lang/en.js";
import { es } from "./es.js";
import { pt } from "./pt.js";

export const getStr = (str, type) => {
  //type =0 normal, type 1 firstUpercasse, type 2 all Uppercase, type 3 all Lowcase
  const lang = getLang();
  var response = en(str);
  if (lang == "es") response = es(str);
  if (lang == "pt") response = pt(str);

  if (type === 1)
    response = response.charAt(0).toUpperCase() + response.slice(1);
  if (type === 2) response = response.toUpperCase();
  if (type === 3) response = response.toLowerCase();
  return response;
};

export function getLang() {
  var lang = "en";
  try {
    lang = localStorage.getItem("lang");
    if (!lang || lang == "" || lang.length != 2) {
      lang =
        navigator.languages && navigator.languages.length
          ? navigator.languages[0]
          : navigator.language;
      if (
        lang.startsWith("en") ||
        lang.startsWith("es") ||
        lang.startsWith("pt")
      ) {
        lang = lang.substring(0, 2);
      }
    }
  } catch (e) {
    msj(e);
  }
  localStorage.setItem("lang", lang);
  return lang;
}
