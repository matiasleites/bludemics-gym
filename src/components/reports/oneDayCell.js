import { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { getLang } from "../../lang/lang-fun";

export const OneDayCell = ({ day }) => {
  const [locale, setLocale] = useState("en-US");
  useEffect(() => {
    const myLocale =
      navigator.languages && navigator.languages.length
        ? navigator.languages[0]
        : navigator.language;

    if (myLocale && myLocale.startsWith(getLang())) {
      setLocale(myLocale);
    } else {
      setLocale(getLang() + "-US");
    }
  }, [day]);

  function removeDot(date) {
    if (date.endsWith(".")) date = date.slice(0, -1);
    return date;
  }

  return (
    <Col className="p-0 m-1 text-center">
      <div className={"daysCell " + (day.have ? "have" : "")}>
        <div className="center">
          <p>{day.day.getDate().toLocaleString()}</p>
          <p>
            {removeDot(
              day.day.toLocaleDateString(locale, { weekday: "short" })
            )}
          </p>
        </div>
      </div>
    </Col>
  );
};
