import { useLayoutEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

export const formatedNumber = (number, decimals) => {
  if (!number) return 0;
  if (!decimals) decimals = 2;
  try {
    return number.toFixed(decimals);
  } catch (g) {
    return 0;
  }
};

export const msj = (info) => {
  console.error(info);
};

export const delay = async (seconds) => {
  var time = seconds * 1000;
  await new Promise((resolve) => setTimeout(resolve, time)); // 3 sec
  return true;
};

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
