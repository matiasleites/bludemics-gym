import { useEffect, useState } from "react";
import { Container, Col, Row, Button, Form } from "react-bootstrap";
import { blockButton, delay, GeneralSpinner } from "../../config/general-fun";
import { getStr } from "../../lang/lang-fun";
import { createWorkout, getUserWorkoutsList } from "./workout-fun";

export const StartWorkoutContainer = ({ customClass }) => {
  const [workoutType, setWorkoutType] = useState("");
  const [loading, setLoading] = useState(false);
  const [workoutsArray, setWorkoutsArray] = useState([]);
  const dropType = (e) => {
    var id = e.target.value;
    setWorkoutType(id);
  };

  useEffect(() => {
    getWorkoutsList();
  }, [setWorkoutsArray]);

  async function getWorkoutsList() {
    setLoading(true);
    const myWorks = await getUserWorkoutsList();
    setWorkoutsArray([...myWorks]);
    setLoading(false);
  }

  return (
    <Container className={customClass}>
      <Row className="mb-2">
        <Col>{getStr("workouts", 1)}</Col>
      </Row>
      <Row>
        <Col className="pt-2 pb-2" sm>
          <Form.Group>
            <Form.Control
              value={workoutType}
              as="select"
              onChange={dropType}
              onSelect={dropType}
            >
              <option id={""} value={""}>
                {getStr("free", 1)}
              </option>
              {Object.entries(workoutsArray).map(([k, work]) => (
                <option
                  id={work.id}
                  key={"wSelect" + k + work.id}
                  value={work.id}
                >
                  {work.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col className="pt-2 pb-2 d-grid gap-2" sm>
          <Button variant="success" disabled={loading}>
            {getStr("startWorkout", 1)}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export const WorkoutContainer = ({ customClass }) => {
  const [workoutsArray, setWorkoutsArray] = useState([]);

  useEffect(() => {
    getWorkoutsList();
  }, [setWorkoutsArray]);

  async function getWorkoutsList() {
    const myWorks = await getUserWorkoutsList();
    setWorkoutsArray([...myWorks]);
  }

  return (
    <Container className={customClass}>
      <Row className={customClass}>
        <Col>{getStr("myWorkouts", 1)}</Col>
      </Row>
      <NewWorkoutForm
        customClass={"mt-1 mb-4 p-2"}
        getWorkoutsList={getWorkoutsList}
      />
      <hr />
      <ListOfWorkoutsWidget
        workouts={workoutsArray}
        customClass={"mt-3 mb-2"}
      />
    </Container>
  );
};

export const NewWorkoutForm = ({ customClass, getWorkoutsList }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  async function showResponse(info, time) {
    if (!time) time = 3;
    setInfo(info);
    await delay(time);
    setInfo("");
  }

  return (
    <Row className={customClass}>
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
      <Col className={blockButton() + (name.length > 0 ? "pt-4" : "")}>
        <Button
          variant="info"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            const resp = await createWorkout(name);
            if (resp) {
              showResponse(getStr("success"));
            } else {
              showResponse(getStr("error"));
            }
            setLoading(false);

            getWorkoutsList();
          }}
        >
          {loading ? <GeneralSpinner /> : getStr("createWorkout", 1)}
        </Button>
      </Col>
      <Row>
        <Col>
          <small>{info}</small>
        </Col>
      </Row>
    </Row>
  );
};

export const ListOfWorkoutsWidget = ({ workouts, customClass }) => {
  return (
    <Row className={customClass}>
      <Col>
        {Object.entries(workouts).map(([k, work]) => (
          <LineWorkout work={work} key={"wForms" + k + work.id} />
        ))}
      </Col>
    </Row>
  );
};

export const LineWorkout = ({ work }) => {
  const [open, setOpen] = useState(false);
  return (
    <Container className="border border-secondary mt-1 rounded p-2">
      <Row
        onClick={() => {
          setOpen(!open);
        }}
      >
        <Col>
          {work.name} {open ? "-" : "+"}
        </Col>
      </Row>
      {open ? (
        <Row>
          <Col>open</Col>
        </Row>
      ) : null}
    </Container>
  );
};
