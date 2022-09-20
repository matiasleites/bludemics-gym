import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import useWindowSize from "../../helpers/windowsSize";
import { getStr } from "../../lang/lang-fun";
import {
  blockButton,
  blueColor,
  greenColor,
  orangeColor,
  redColor,
  yellowColor
} from "../../services/generalServices";
import { deleteWorkout, updateWorkout } from "../../services/workoutServices";
import GeneralInformation from "../generalInformation";
import GeneralSpinner from "../generalSpinner";
import { DownIcon, DropIcon, PlayIcon } from "../icons";
import ExercicesContainer from "./exercicesContainer";

export const LineWorkout = ({ work, getWorkoutsList }) => {
  const [open, setOpen] = useState(false);
  const [acceptDelete, setAcceptDelete] = useState(false);
  const [name, setName] = useState(work.name);
  const [info, setInfo] = useState({ pos: 0, text: "" });
  const [loading, setLoading] = useState(false);
  const [width] = useWindowSize();

  async function updateName() {
    work.name = name;
    setLoading(true);
    const response = await updateWorkout(work);
    response
      ? setInfo({ pos: 1, text: getStr("success", 1) })
      : setInfo({ pos: 1, text: getStr("errorUpdate", 1) });
    setLoading(false);
    getWorkoutsList();
  }

  async function chageColor() {
    var newColor = blueColor;
    if (!work.color || work.color == blueColor) newColor = greenColor;
    if (work.color == greenColor) newColor = yellowColor;
    if (work.color == yellowColor) newColor = orangeColor;
    if (work.color == orangeColor) newColor = redColor;
    if (work.color == redColor) newColor = blueColor;

    setLoading(true);
    work.color = newColor;
    const response = await updateWorkout(work);
    response
      ? setInfo({ pos: 1, text: getStr("success", 1) })
      : setInfo({ pos: 1, text: getStr("errorUpdate", 1) });
    setLoading(false);
    getWorkoutsList();
  }

  async function updateExercices(exercices) {
    work.exercices = exercices;
    setLoading(true);
    const response = await updateWorkout(work);
    setLoading(false);
    return response;
  }

  async function deleteMyWorkout() {
    setLoading(true);
    await deleteWorkout(work.id);
    await getWorkoutsList();
    setLoading(false);
  }

  return (
    <Container className={" training"}>
      <Row>
        {open ? (
          <Col
            className={width < 600 ? "text-center" : ""}
            style={{ maxWidth: "30px" }}
            onClick={() => {
              chageColor();
            }}
          >
            <DropIcon
              className="icon"
              fill={work.color ? work.color : blueColor}
              style={{
                width: "20px",
                height: "20px"
              }}
            />
          </Col>
        ) : null}

        <Col
          className="text-start"
          style={{ color: work.color ? work.color : blueColor }}
          onClick={() => {
            setAcceptDelete(false);
            setOpen(!open);
          }}
        >
          {work.name}{" "}
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
        {!open ? null : (
          <Col className="text-end ps-0 pe-2" style={{ maxWidth: "70px" }}>
            <Button
              size="sm"
              variant={acceptDelete ? "danger" : "dark"}
              onClick={() => {
                setAcceptDelete(!acceptDelete);
                if (acceptDelete) {
                  deleteMyWorkout();
                }
              }}
              disabled={loading}
            >
              {getStr("delete", 1)}
            </Button>
          </Col>
        )}
      </Row>
      {open ? (
        <>
          <Row className="mt-2">
            <Col className="mt-0" md>
              <Form.Group controlId="nameWorkout">
                {name.length > 0 ? (
                  <Form.Label>{getStr("name", 1)}</Form.Label>
                ) : null}
                <Form.Control
                  placeholder={getStr("name", 1)}
                  className="alphaContainerLigth"
                  type="text"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  value={name}
                />
              </Form.Group>
            </Col>
            <Col
              className={blockButton() + " pt-1"}
              sm={3}
              sytle={{ maxHeight: "38px" }}
            >
              <Button
                size="sm"
                className={name.length > 0 && width > 600 ? "mt-4" : "mt-0"}
                variant="primary"
                disabled={loading}
                onClick={() => {
                  updateName();
                }}
              >
                {loading ? (
                  <GeneralSpinner />
                ) : (
                  getStr("edit", 1) + " " + getStr("name")
                )}
              </Button>
            </Col>
          </Row>
          <GeneralInformation info={info} pos={1} />
          <ExercicesContainer work={work} updateExercices={updateExercices} />
        </>
      ) : null}
    </Container>
  );
};
