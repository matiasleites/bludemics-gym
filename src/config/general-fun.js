import { useEffect, useLayoutEffect, useState } from "react";
import { Spinner, Row, Col } from "react-bootstrap";

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

export function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

export function isEven(n) {
  try {
    return n % 2 == 0;
  } catch (g) {
    msj(g);
    return false;
  }
}

export const GeneralSpinner = () => {
  return (
    <center>
      <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
        className="ml-2"
      />
    </center>
  );
};

export const GeneralInformation = ({
  info,
  pos,
  seconds = 5,
  customClass = ""
}) => {
  const [show, setShow] = useState(true);
  useEffect(() => {
    setShow(true);
    closeInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info]);

  async function closeInformation() {
    await delay(seconds);
    setShow(false);
  }

  if (!info) return null;
  if ((show && info.pos == pos, info.text && info.text.length > 0))
    return (
      <Row className={"ps-3 " + customClass}>
        <Col className="ps-3">
          <small>{info.text}</small>
        </Col>
      </Row>
    );
  return null;
};

export function getYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : undefined;
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

export function getVideoSize(width) {
  if (width > 780) {
    return { width: 580, height: 580 / 1.6 };
  } else {
    return { width: width * 0.5, height: (width * 0.5) / 1.6 };
  }
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