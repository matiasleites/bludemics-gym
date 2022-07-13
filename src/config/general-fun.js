import { useLayoutEffect, useState } from "react";
import { Spinner, Row, Col } from "react-bootstrap";

export const formatedNumber = (number, decimals) => {
  if (!number) return 0;
  if (!decimals) decimals = 2;
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

export const GeneralInformation = ({ info, pos, customClass }) => {
  if (!info) return null;
  if (!customClass) customClass = "";
  if (info.pos == pos && info.text && info.text.length > 0)
    return (
      <Row className={"ps-3 " + customClass}>
        <Col className="ps-3">
          <small>{info.text}</small>
        </Col>
      </Row>
    );
  return null;
};
