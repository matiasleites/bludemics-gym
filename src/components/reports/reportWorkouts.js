import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { getStr } from "../../lang/lang-fun";
import { DownIcon, PlayIcon } from "../icons";
import SimpleLineWorkout from "../workouts/simpleLineWorkout";

export const ReportWorkouts = ({ workouts }) => {
  const [open, setOpen] = useState(false);
  return (
    <Container className="window">
      <Row
        onClick={() => {
          setOpen(!open);
        }}
        className="p-1"
      >
        <Col>
          {getStr("workouts", 1)}{" "}
          {open ? (
            <DownIcon
              className="icon"
              fill={"#282828"}
              style={{
                width: "10px",
                height: "10px"
              }}
            />
          ) : (
            <PlayIcon
              className="icon"
              fill={"#282828"}
              style={{
                width: "6px",
                height: "6px"
              }}
            />
          )}
        </Col>
      </Row>
      {open && workouts && workouts.length > 0 ? (
        <>
          {Object.entries(workouts).map(([k, work]) => (
            <SimpleLineWorkout
              key={"example" + k + work.id}
              pos={parseInt(k) + 1}
              work={work}
            />
          ))}
        </>
      ) : null}
    </Container>
  );
};
