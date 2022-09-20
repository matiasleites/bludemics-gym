import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { getStr } from "../../lang/lang-fun";
import {
  blueColor,
  getDayOfFirebaseDate
} from "../../services/generalServices";
import { DownIcon, PlayIcon } from "../icons";
import SimpleExercicesContainer from "./simpleExerciceContainer";

const SimpleLineWorkout = ({ work, pos }) => {
  const [open, setOpen] = useState(false);

  return (
    <Container className={"line"}>
      <Row
        onClick={() => {
          setOpen(!open);
        }}
      >
        <Col style={{ color: work.color ? work.color : blueColor }}>
          {pos} {work.name} <small>{getDayOfFirebaseDate(work.open)}</small>
          {open ? (
            <DownIcon
              className="icon"
              fill={work.color ? work.color : blueColor}
              style={{
                width: "10px",
                height: "10px"
              }}
            />
          ) : (
            <PlayIcon
              className="icon"
              fill={work.color ? work.color : blueColor}
              style={{
                width: "6px",
                height: "6px"
              }}
            />
          )}
        </Col>
      </Row>
      {open ? (
        <>
          <Row className="mt-2">
            <Col className="mt-0" md>
              {getStr("name", 1)}: {work.name}
            </Col>
          </Row>
          <Row>
            <Col className="mt-0" md>
              {getStr("info", 1)}: {work.info}
            </Col>
          </Row>
          <Row>
            <Col className="mt-0" sm>
              {getStr("calories", 1)}: {work.calories}
            </Col>
            <Col className="mt-0" sm>
              {getStr("km", 1)}: {work.km}
            </Col>
            <Col className="mt-0" sm>
              {getStr("kg", 1)}: {work.kg}
            </Col>
            <Col className="mt-0" sm>
              {getStr("minutes", 1)}: {work.minutes}
            </Col>
            <Col className="mt-0" sm>
              {getStr("steps", 1)}: {work.steps}
            </Col>
          </Row>
          <SimpleExercicesContainer work={work} />
        </>
      ) : null}
    </Container>
  );
};

export default SimpleLineWorkout;
