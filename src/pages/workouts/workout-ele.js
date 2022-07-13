import { useEffect, useState } from "react";
import { Container, Col, Row, Button, Form } from "react-bootstrap";
import YouTube from "react-youtube";
import {
  blockButton,
  delay,
  GeneralInformation,
  GeneralSpinner,
  getYouTubeId,
  msj,
  useWindowSize
} from "../../config/general-fun";
import { getStr } from "../../lang/lang-fun";
import {
  createWorkout,
  getUserWorkoutsList,
  updateWorkout
} from "./workout-fun";

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
      <NewWorkoutForm customClass={"p-2"} getWorkoutsList={getWorkoutsList} />
      <hr />
      <ListOfWorkoutsWidget
        workouts={workoutsArray}
        customClass={"mt-3 mb-2"}
        getWorkoutsList={getWorkoutsList}
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
    <Row
      className={
        customClass + " rounded border border-secondary mt-3 mb-2 ms-1 me-1"
      }
    >
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
      <Col className={blockButton() + (name.length > 0 ? "pt-4" : "pt-1")}>
        <Button
          variant="primary"
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

export const ListOfWorkoutsWidget = ({
  workouts,
  customClass,
  getWorkoutsList
}) => {
  return (
    <Row className={customClass}>
      <Col>
        {Object.entries(workouts).map(([k, work]) => (
          <LineWorkout
            work={work}
            key={"wForms" + k + work.id}
            getWorkoutsList={getWorkoutsList}
          />
        ))}
      </Col>
    </Row>
  );
};

export const LineWorkout = ({ work, getWorkoutsList }) => {
  const [open, setOpen] = useState(false);
  const [acceptDelete, setAcceptDelete] = useState(false);
  const [name, setName] = useState(work.name);
  const [info, setInfo] = useState({ pos: 0, text: "" });
  const [loading, setLoading] = useState(false);

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

  async function updateExercices(exercices) {
    work.exercices = exercices;
    setLoading(true);
    const response = await updateWorkout(work);
    setLoading(false);
    return response;
  }

  return (
    <Container
      className={
        " mt-2 rounded p-2 border back-01" +
        (open ? " border-secondary shadow" : " border-secondary")
      }
    >
      <Row>
        <Col
          onClick={() => {
            setOpen(!open);
          }}
        >
          {work.name} {open ? "-" : "+"}
        </Col>
        {!open ? null : (
          <Col className="text-end">
            <Button
              size="sm"
              variant={acceptDelete ? "danger" : "dark"}
              onClick={() => {
                setAcceptDelete(!acceptDelete);
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
          <hr />
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
              className={
                blockButton() + (name.length > 0 ? "pt-4 pb-0" : "pt-1")
              }
              sm={3}
            >
              <Button
                size="sm"
                className={name.length > 0 ? "mt-2" : ""}
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
          <GeneralInformation info={info} />
          <ExercicesContainer work={work} updateExercices={updateExercices} />
        </>
      ) : null}
    </Container>
  );
};

export const ExercicesContainer = ({ work, updateExercices }) => {
  if (!work) return null;

  async function addExercice(info) {
    const myArrayExercices = work.exercices;
    myArrayExercices.push(info);
    return await updateExercices(myArrayExercices);
  }

  return (
    <Container className="mt-3 back-02 rounded p-2">
      <Row className="mt-3 mb-3">
        <Col>{getStr("exercices", 1) + ": " + work.name}</Col>
      </Row>
      <ExerciceForm addExercice={addExercice} />
      <Row>
        <Col>
          {Object.entries(work.exercices).map(([k, exercice]) => (
            <ExerciceLine
              key={"ExcerciceList" + k + exercice.id}
              exercice={exercice}
            />
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export const ExerciceForm = ({ addExercice }) => {
  const [name, setName] = useState("");
  const [info, setInfo] = useState("");
  const [video, setVideo] = useState("");
  const [reps, setReps] = useState(1);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [infoError, setInfoError] = useState({ pos: 0, text: "" });

  async function addNewExercice() {
    setInfoError(null);
    if (!name || name.length < 2) {
      setInfoError({ pos: 1, text: getStr("emptyInputs", 1) });
      return false;
    }

    setLoading(true);
    const infoData = { info, name, reps, video };
    const response = await addExercice(infoData);
    setLoading(false);
    if (response) {
      setInfoError({ pos: 1, text: getStr("success", 1) });
      setInfo("");
      setName("");
      setVideo("");
      setReps(0);
      await delay(3);
      setOpen(false);
    } else {
      setInfoError({ pos: 1, text: getStr("errorCreate", 1) });
    }
    return true;
  }

  return (
    <Container className="border border-secondary rounded p-2 back-01">
      <Row
        onClick={() => {
          setOpen(!open);
        }}
      >
        <Col>
          <small>
            {getStr("addExercice", 1)} {open ? "-" : "+"}
          </small>
        </Col>
      </Row>
      {!open ? null : (
        <>
          <Row>
            <Col>
              <Form.Group>
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
          </Row>
          <Row>
            <Col className="mt-2">
              <Form.Group>
                {info.length > 0 ? (
                  <Form.Label>{getStr("info", 1)}</Form.Label>
                ) : null}
                <Form.Control
                  placeholder={getStr("info", 1)}
                  className="alphaContainerLigth"
                  type="text"
                  rows={1}
                  as={"textarea"}
                  onChange={(e) => {
                    setInfo(e.target.value);
                  }}
                  value={info}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col className="mt-2">
              <Form.Group>
                {video.length > 0 ? (
                  <Form.Label>{getStr("youTubeVideoLink", 1)}</Form.Label>
                ) : null}
                <Form.Control
                  placeholder={getStr("youTubeVideoLink", 1)}
                  className="alphaContainerLigth"
                  type="text"
                  onChange={(e) => {
                    setVideo(e.target.value);
                  }}
                  value={video}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col className="mt-2" sm>
              <Form.Group>
                <Form.Label>{getStr("reps", 1)}</Form.Label>
                <Form.Control
                  placeholder={getStr("reps", 1)}
                  className="alphaContainerLigth"
                  type="number"
                  onChange={(e) => {
                    var value = e.target.value;
                    try {
                      value = parseInt(value);
                    } catch (e) {
                      msj(e);
                      value = 1;
                    }
                    if (!value) value = 0;
                    setReps(value);
                  }}
                  value={reps}
                />
              </Form.Group>
            </Col>
            <Col className={blockButton() + " pt-4 pb-0"}>
              <Button
                variant="success"
                disabled={loading}
                size="sm"
                className="mt-2"
                onClick={() => {
                  addNewExercice();
                }}
              >
                {loading ? <GeneralSpinner /> : getStr("createExercice", 1)}
              </Button>
            </Col>
          </Row>
          <GeneralInformation info={infoError} pos={1} />
        </>
      )}
    </Container>
  );
};

export const ExerciceLine = ({ exercice }) => {
  const [width] = useWindowSize();
  const [videoOptions, setVideoOptions] = useState({ width: 300, height: 200 });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (width > 780) {
      setVideoOptions({ width: 580, height: 580 / 1.6 });
    } else {
      setVideoOptions({ width: width * 0.5, height: (width * 0.5) / 1.6 });
    }
  }, [width]);

  return (
    <Container className="mt-1 border border-secondary rounded back-01 p-2">
      <Row
        onClick={() => {
          setOpen(!open);
        }}
      >
        <Col>
          {exercice.name} {open ? " -" : " +"}
        </Col>
      </Row>
      {!open ? null : (
        <>
          <Row>
            <Col>
              <small>
                {getStr("info", 1)}: {exercice.info}
              </small>
            </Col>
          </Row>
          <Row>
            <Col>
              <small>
                {getStr("reps", 1)}: {exercice.reps}
              </small>
            </Col>
          </Row>
          <Row>
            <Col className="text-center">
              {exercice.video && getYouTubeId(exercice.video) ? (
                <YouTube
                  videoId={getYouTubeId(exercice.video)}
                  opts={videoOptions}
                />
              ) : null}
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};
