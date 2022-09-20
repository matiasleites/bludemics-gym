import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { firestoreNow } from "../../config/firebase";
import {
  blueColor,
  minutesBetweenTwoDates,
  msj
} from "../../services/generalServices";
import { getStr } from "../../lang/lang-fun";
import TimerTraining from "./timeTraining";
import { endTraining, updateTraining } from "../../services/workoutServices";
import { ExerciceOfTraining } from "./exerciceOfTraining";

const OpenTrainigContainer = ({ training, setUpdate, generalUpdate }) => {
  if (!training.color) training.color = blueColor;
  const [loading, setLoading] = useState(false);
  const [acceptClose, setAcceptClose] = useState(false);

  async function updateMyTraining(info) {
    setLoading(true);
    const response = await updateTraining(info);
    setLoading(false);
    return response;
  }

  async function updateOneValue(input, value) {
    setLoading(true);
    training[input] = value;
    const result = await updateMyTraining(training);
    setLoading(false);
    return result;
  }

  async function updateOneExcercice(pos, info) {
    const exercices = training.exercices;
    exercices[pos] = info;
    training.exercices = exercices;
    return await updateMyTraining(training);
  }

  async function closeMyTraining() {
    setLoading(true);
    const end = firestoreNow();
    var minutes = training.minutes;
    if (minutes <= 0) {
      minutes = minutesBetweenTwoDates(training.open.toDate(), end.toDate());
    }
    training.end = end;
    training.minutes = minutes;

    if (training.calories == "") training.calories = 0;
    if (training.kg == "") training.kg = 0;
    if (training.km == "") training.calokmries = 0;
    if (training.minutes == "") training.minutes = 0;
    if (training.steps == "") training.steps = 0;

    const response = await endTraining(training);
    setLoading(false);
    setUpdate();
    generalUpdate();
    return response;
  }

  return (
    <div className="openWorkoutCell">
      <Row style={{ color: training.color }}>
        <Col className="text-center title">{training.name}</Col>
      </Row>
      <Row>
        <Col className="text-center">
          <TimerTraining workout={training} />
        </Col>
      </Row>
      <Row>
        <Col>
          {Object.entries(training.exercices).map(([k, exercice]) => (
            <ExerciceOfTraining
              exercice={exercice}
              key={"exerciceTranining" + k + exercice.id}
              pos={k}
              update={updateOneExcercice}
            />
          ))}
        </Col>
      </Row>
      <Row className="mt-4 ps-2 pe-2">
        <Col sm>
          <Form.Group>
            <Form.Group>
              <Form.Label>{getStr("calories", 1)}</Form.Label>
              <Form.Control
                placeholder={getStr("calories", 1)}
                className="alphaContainerLigth"
                type="number"
                onChange={(e) => {
                  var value = e.target.value;
                  try {
                    value = parseInt(value);
                  } catch (e) {
                    msj(e);
                    value = "";
                  }
                  if (!value) value = "";
                  updateOneValue("calories", value);
                }}
                value={training.calories}
              />
            </Form.Group>
          </Form.Group>
        </Col>
        <Col sm>
          <Form.Group>
            <Form.Group>
              <Form.Label>{getStr("kg", 1)}</Form.Label>
              <Form.Control
                placeholder={getStr("kg", 1)}
                className="alphaContainerLigth"
                type="number"
                step={0.1}
                onChange={(e) => {
                  var value = e.target.value;
                  try {
                    value = parseFloat(value);
                  } catch (e) {
                    msj(e);
                    value = "";
                  }
                  if (!value) value = "";
                  updateOneValue("kg", value);
                }}
                value={training.kg}
              />
            </Form.Group>
          </Form.Group>
        </Col>
        <Col sm>
          <Form.Group>
            <Form.Group>
              <Form.Label>{getStr("km", 1)}</Form.Label>
              <Form.Control
                placeholder={getStr("km", 1)}
                className="alphaContainerLigth"
                type="number"
                step={0.1}
                onChange={(e) => {
                  var value = e.target.value;
                  try {
                    value = parseFloat(value);
                  } catch (e) {
                    msj(e);
                    value = "";
                  }
                  if (!value) value = "";
                  updateOneValue("km", value);
                }}
                value={training.km}
              />
            </Form.Group>
          </Form.Group>
        </Col>
        <Col sm>
          <Form.Group>
            <Form.Group>
              <Form.Label>{getStr("steps", 1)}</Form.Label>
              <Form.Control
                placeholder={getStr("steps", 1)}
                className="alphaContainerLigth"
                type="number"
                onChange={(e) => {
                  var value = e.target.value;
                  try {
                    value = parseInt(value);
                  } catch (e) {
                    msj(e);
                    value = "";
                  }
                  if (!value) value = "";
                  updateOneValue("steps", value);
                }}
                value={training.steps}
              />
            </Form.Group>
          </Form.Group>
        </Col>
        <Col sm>
          <Form.Group>
            <Form.Group>
              <Form.Label>{getStr("minutes", 1)} </Form.Label>
              <Form.Control
                placeholder={getStr("minutes", 1)}
                className="alphaContainerLigth"
                type="number"
                onChange={(e) => {
                  var value = e.target.value;
                  try {
                    value = parseInt(value);
                  } catch (e) {
                    msj(e);
                    value = "";
                  }
                  if (!value) value = "";
                  updateOneValue("minutes", value);
                }}
                value={training.minutes}
              />
              <Form.Label>
                <small className="ms-1">{getStr("minutesCalculate", 1)}</small>
              </Form.Label>
            </Form.Group>
          </Form.Group>
        </Col>
      </Row>
      <Row className="ps-2 pe-2">
        <Col sm>
          <Form.Group>
            <Form.Group>
              {training.info.length > 0 ? (
                <Form.Label>{getStr("info", 1)}</Form.Label>
              ) : null}
              <Form.Control
                placeholder={getStr("info", 1)}
                className="alphaContainerLigth"
                type="text"
                as="textarea"
                rows={1}
                onChange={(e) => {
                  var value = e.target.value;
                  if (!value) value = "";
                  updateOneValue("info", value);
                }}
                value={training.info}
              />
            </Form.Group>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col className="pt-2 pb-2 d-grid gap-2" sm>
          <Button
            className="m-3"
            variant={acceptClose ? "danger" : "warning"}
            disabled={loading}
            onClick={() => {
              setAcceptClose(!acceptClose);
              if (acceptClose) closeMyTraining();
            }}
          >
            {getStr("endWorkout", 1)}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default OpenTrainigContainer;
