import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { Container } from "react-bootstrap";
import useWindowSize from "../helpers/windowsSize";
import bg001 from "../includes/bg001.webp";
import bg002 from "../includes/bg002.webp";
import bg003 from "../includes/bg003.webp";
import bg004 from "../includes/bg004.webp";
import bg005 from "../includes/bg005.webp";
import { delay } from "../services/generalServices";

const Header = () => {
  const [headerH, setHeaderH] = useState("300px");
  const [back, setBack] = useState(bg005);
  const [timer, setTimer] = useState(0);
  const [width] = useWindowSize();
  const [small, setSmall] = useState(width < 400 ? true : false);
  const tick = useRef();

  useEffect(() => {
    const arrayBacks = [bg001, bg002, bg003, bg004, bg005];
    tick.current = setInterval(() => {
      if (timer == 0) {
        var randBack =
          arrayBacks[Math.floor(Math.random() * arrayBacks.length)];
        setBack(randBack);
      }
      var newTime = timer + 1;
      if (newTime > 15) {
        newTime = 0;
      }
      setTimer(newTime);
    }, 1000);
    return () => clearInterval(tick.current);
  }, [timer]);

  useEffect(() => {
    let isSmall = false;
    if (width < 500) isSmall = true;
    setSmall(isSmall);
    async function updateAnimation() {
      await delay(1);
      setHeaderH(isSmall ? "100px" : "200px");
    }
    updateAnimation();
  }, [width, small]);

  return (
    <section id="header">
      <Container
        className="m-0"
        fluid
        style={{
          backgroundImage: `url(${back})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          minHeight: headerH,
          transition: "1s"
        }}
      />
    </section>
  );
};

export default Header;
