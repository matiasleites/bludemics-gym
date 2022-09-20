/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { blueColor, msj } from "../../services/generalServices";
import { PlayIcon } from "../icons";

export const ButtonOneWorkout = ({ workout, loading, setLoading, start }) => {
  if (!workout.color) workout.color = blueColor;
  const [hover, setHover] = useState(false);
  const [time, setTime] = useState(-1);
  const [iconW, setIconW] = useState("25px");

  const TimerSeconds = () => {
    useEffect(() => {
      let myInterval = setInterval(() => {
        if (time > 0) {
          setTime(time - 1);
        } else {
          clearInterval(myInterval);
        }
      }, 1000);
      return () => {
        clearInterval(myInterval);
      };
    });

    return (
      <div className="countdown" style={{ paddingRight: "10px" }}>
        {time}
      </div>
    );
  };

  function manageClick() {
    msj("click");
    if (time < 0 && !loading) {
      setTime(3);
      setLoading(true);
    } else {
      setLoading(false);
      setTime(-1);
    }
  }

  useEffect(() => {
    if (time == 0) {
      start(workout);
    }
  }, [time]);

  function updateHover(enter) {
    if (enter) {
      setHover(true);
      setIconW("30px");
    } else {
      setHover(false);
      setIconW("25px");
    }
  }

  return (
    <Col className="p-1 pt-2 m-0">
      <div
        onClick={() => {
          manageClick();
        }}
        className={"workoutButtonCell " + (hover ? "extraShadow" : "")}
        style={{ cursor: hover && !loading ? "pointer" : "default" }}
        onMouseEnter={() => {
          updateHover(true);
        }}
        onMouseLeave={() => {
          updateHover(false);
        }}
      >
        <div className={"center row"} style={{ color: workout.color }}>
          <Col className="text-start">{workout.name}</Col>
          <Col className="text-end">
            {time >= 0 ? (
              <TimerSeconds setTime={setTime} />
            ) : (
              <PlayIcon
                className="icon"
                fill={workout.color}
                style={{
                  width: iconW,
                  height: iconW
                }}
              />
            )}
          </Col>
        </div>
      </div>
    </Col>
  );
};
