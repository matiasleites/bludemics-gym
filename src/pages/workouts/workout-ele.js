import { useEffect, useRef, useState } from "react";
import { Container, Col, Row, Button, Form } from "react-bootstrap";
import YouTube from "react-youtube";
import { firestoreNow } from "../../config/firebase";
import {
  blockButton,
  delay,
  GeneralInformation,
  GeneralSpinner,
  getDayOfFirebaseDate,
  getVideoSize,
  getYouTubeId,
  minutesBetweenTwoDates,
  msj,
  useWindowSize
} from "../../config/general-fun";
import { getStr } from "../../lang/lang-fun";
import {
  createWorkout,
  deleteWorkout,
  endTraining,
  getCurrentTraining,
  getUserWorkoutsList,
  getWorkout,
  startTraining,
  traninigElapsedTime,
  updateTraining,
  updateWorkout
} from "./workout-fun";

export const TimerTraining = ({ workout }) => {
  const [timer, setTimer] = useState("");
  const tick = useRef();
  useEffect(() => {
    tick.current = setInterval(() => {
      setTimer(traninigElapsedTime(workout));
    }, 1000);

    return () => clearInterval(tick.current);
  }, [workout]);

  return <div className="title">{timer}</div>;
};

export const StartWorkoutContainer = ({ customClass, setUpdate, workouts }) => {
  const [workoutType, setWorkoutType] = useState("");
  const [loading, setLoading] = useState(false);
  const [workoutsArray, setWorkoutsArray] = useState([]);
  const [currentTraining, setCurrentTrainig] = useState({});

  const dropType = (e) => {
    var id = e.target.value;
    setWorkoutType(id);
  };

  useEffect(() => {
    getWorkoutsList();
  }, [workouts]);

  async function getWorkoutsList() {
    if (!workouts) {
      setLoading(true);
      const myWorks = await getUserWorkoutsList();
      setWorkoutsArray([...myWorks]);
      setLoading(false);
    } else {
      setWorkoutsArray([...workouts]);
    }
    verifyCurrentTraining();
  }

  async function verifyCurrentTraining() {
    setLoading(true);
    const training = await getCurrentTraining();
    if (training && training.length > 0) {
      setCurrentTrainig({ ...training[0] });
    } else {
      setCurrentTrainig({});
    }
    setLoading(false);
  }

  async function startMyTraining() {
    setLoading(true);
    const type = workoutType;
    var exercices = [];
    var name = getStr("free", 1);

    if (type.length > 0) {
      const myWorkout = await getWorkout(type);
      name = myWorkout.name;
      exercices = myWorkout.exercices;
      exercices = exercices.map(function (value) {
        value.status = 0;
        const myArray = [];
        for (let i = 0; i < value.series; i++) {
          myArray.push({ status: 0 });
        }
        value.series = myArray;
        return value;
      });
    }
    const info = {
      type,
      open: firestoreNow(),
      exercices,
      name,
      calories: 0,
      kg: 0,
      km: 0,
      minutes: 0,
      end: false,
      steps: 0,
      info: ""
    };
    const response = await startTraining(info);
    setLoading(false);
    setUpdate();
    verifyCurrentTraining();
    return response;
  }

  return (
    <Container className={customClass}>
      {currentTraining && currentTraining.open ? (
        <OpenTrainigContainer
          training={currentTraining}
          setUpdate={getWorkoutsList}
        />
      ) : (
        <>
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
              <Button
                variant="success"
                disabled={loading}
                onClick={() => {
                  startMyTraining();
                }}
              >
                {loading ? <GeneralSpinner /> : getStr("startWorkout", 1)}
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export const OpenTrainigContainer = ({ training, setUpdate }) => {
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

    msj(training);
    const response = await endTraining(training);
    setLoading(false);
    setUpdate();
    return response;
  }

  return (
    <>
      <Row>
        <Col className="text-center subTitle">{training.name}</Col>
      </Row>
      <hr />
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
      <Row className="ps-2 pe-2">
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
                <small>{getStr("minutesCalculate", 1)}</small>
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
    </>
  );
};

export const ExerciceOfTraining = ({ exercice, pos, update }) => {
  const [open, setOpen] = useState(false);
  const [width] = useWindowSize();
  const [videoOptions, setVideoOptions] = useState({ width: 300, height: 200 });

  useEffect(() => {
    const size = getVideoSize(width);
    setVideoOptions(size);
  }, [width]);

  async function updateExercice(myExercice) {
    update(pos, myExercice);
  }

  async function updateSeries(series) {
    exercice.series = series;
    await updateExercice(exercice);
  }

  return (
    <Container className=" rounded border border-secondary mt-3 mb-2 ms-0 me-0 p-2">
      <Row className="ps-2 pe-2 mb-2">
        <Col
          onClick={() => {
            setOpen(!open);
          }}
        >
          {exercice.name} ({exercice.reps}) {open ? "-" : "+"}
        </Col>
        <SeriesOfExercice series={exercice.series} update={updateSeries} />
      </Row>
      {!open ? null : (
        <>
          <Row className="ps-2 pe-2 mb-2">
            <Col>
              <small>{exercice.info}</small>
            </Col>
          </Row>
          <hr />
          <Row className="mb-2">
            <Col className="text-center">
              <YouTube
                videoId={getYouTubeId(exercice.video)}
                opts={videoOptions}
                asdf
              />
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export const SeriesOfExercice = ({ series, update }) => {
  const [loading, setLoading] = useState();
  async function updateSerie(pos, status) {
    setLoading(true);
    var newStatus = 1;
    status == 1 ? (newStatus = 0) : (newStatus = 1);
    const newArray = series;
    newArray[pos] = { status: newStatus };
    const response = await update(newArray);
    setLoading(false);
    return response;
  }

  return Object.entries(series).map(([k, serie]) => (
    <Col
      key={"serieExe" + k}
      className="ps-1 pe-1"
      style={{ maxWidth: "40px" }}
    >
      <Button
        size="sm"
        className=""
        disabled={loading}
        variant={serie.status == 0 ? "danger" : "success"}
        onClick={() => {
          updateSerie(k, serie.status);
        }}
      >
        {parseInt(k) + 1}
      </Button>
    </Col>
  ));
};

export const WorkoutContainer = ({ customClass, update, workouts }) => {
  const [workoutsArray, setWorkoutsArray] = useState([]);

  useEffect(() => {
    getWorkoutsList();
  }, [setWorkoutsArray, workouts]);

  async function getWorkoutsList() {
    if (!workouts) {
      const myWorks = await getUserWorkoutsList();
      setWorkoutsArray([...myWorks]);
    } else {
      setWorkoutsArray([...workouts]);
    }
  }

  function setUpdate() {
    update();
  }

  return (
    <Container className={customClass}>
      <Row className={customClass}>
        <Col>{getStr("myWorkouts", 1)}</Col>
      </Row>
      <NewWorkoutForm customClass={"p-2"} getWorkoutsList={setUpdate} />
      <hr />
      <ListOfWorkoutsWidget
        workouts={workoutsArray}
        customClass={"mt-3 mb-2"}
        getWorkoutsList={setUpdate}
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

  async function deleteMyWorkout() {
    setLoading(true);
    await deleteWorkout(work.id);
    await getWorkoutsList();
    setLoading(false);
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
          <GeneralInformation info={info} pos={1} />
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

  async function updateExercice(pos, info) {
    const myArrayExercices = work.exercices;
    myArrayExercices[pos] = info;
    return await updateExercices(myArrayExercices);
  }

  return (
    <Container className="mt-3 back-02 rounded p-2">
      <Row className="mt-3 mb-3">
        <Col>{getStr("exercices", 1) + ": " + work.name}</Col>
      </Row>
      <ExerciceForm addExercice={addExercice} />
      <hr />
      <Row>
        <Col>
          {Object.entries(work.exercices).map(([k, exercice]) => (
            <ExerciceLine
              key={"ExcerciceList" + k + exercice.id}
              exercice={exercice}
              pos={k}
              editExercice={updateExercice}
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
  const [series, setSeries] = useState(1);
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
    const infoData = { info, name, reps, video, series };
    const response = await addExercice(infoData);
    setLoading(false);
    if (response) {
      setInfoError({ pos: 1, text: getStr("success", 1) });
      setInfo("");
      setName("");
      setVideo("");
      setReps(1);
      setSeries(1);
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
          <small className="ps-3">
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
            <Col className="mt-2" sm>
              <Form.Group>
                <Form.Label>{getStr("series", 1)}</Form.Label>
                <Form.Control
                  placeholder={getStr("series", 1)}
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
                    setSeries(value);
                  }}
                  value={series}
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

export const ExerciceLine = ({ exercice, pos, editExercice }) => {
  const [width] = useWindowSize();
  const [videoOptions, setVideoOptions] = useState({ width: 300, height: 200 });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const size = getVideoSize(width);
    setVideoOptions(size);
  }, [width]);

  async function setReps(reps) {
    setLoading(true);
    exercice.reps = reps;
    await editExercice(pos, exercice);
    setLoading(false);
  }

  async function setSeries(series) {
    setLoading(true);
    exercice.series = series;
    await editExercice(pos, exercice);
    setLoading(false);
  }

  async function setVideo(video) {
    setLoading(true);
    exercice.video = video;
    await editExercice(pos, exercice);
    setLoading(false);
  }

  async function setInfo(info) {
    setLoading(true);
    exercice.info = info;
    await editExercice(pos, exercice);
    setLoading(false);
  }

  async function setName(name) {
    setLoading(true);
    exercice.name = name;
    await editExercice(pos, exercice);
    setLoading(false);
  }

  return (
    <Container className="mt-1 border border-secondary rounded back-01 p-2">
      <Row
        onClick={() => {
          setOpen(!open);
        }}
      >
        <Col>
          <small>
            {exercice.name}
            {open ? " -" : " +"}
          </small>
        </Col>
      </Row>
      {!open ? null : (
        <>
          <hr />
          <Row>
            <Col>
              <Form.Group>
                {exercice.name.length > 0 ? (
                  <Form.Label>{getStr("name", 1)}</Form.Label>
                ) : null}
                <Form.Control
                  placeholder={getStr("name", 1)}
                  className="alphaContainerLigth"
                  type="text"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  value={exercice.name}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                {exercice.info.length > 0 ? (
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
                  value={exercice.info}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
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
                  value={exercice.reps}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{getStr("series", 1)}</Form.Label>
                <Form.Control
                  placeholder={getStr("series", 1)}
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
                    setSeries(value);
                  }}
                  value={exercice.series}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                {exercice.video.length > 0 ? (
                  <Form.Label>{getStr("youTubeVideoLink", 1)}</Form.Label>
                ) : null}
                <Form.Control
                  placeholder={getStr("youTubeVideoLink", 1)}
                  className="alphaContainerLigth"
                  type="text"
                  onChange={(e) => {
                    setVideo(e.target.value);
                  }}
                  value={exercice.video}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col className={blockButton() + " text-center mt-2 mb-2"}>
              {loading ? <GeneralSpinner /> : null}
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

export const SimpleLineWorkout = ({ work, pos }) => {
  const [open, setOpen] = useState(false);

  return (
    <Container
      className={
        " mt-2 rounded p-2 border back-01" +
        (open ? " border-secondary shadow" : " border-secondary")
      }
    >
      <Row
        onClick={() => {
          setOpen(!open);
        }}
      >
        <Col>
          {pos} {work.name} <small>{getDayOfFirebaseDate(work.open)}</small>
          {open ? " -" : " +"}
        </Col>
      </Row>
      {open ? (
        <>
          <hr />
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

export const SimpleExercicesContainer = ({ work }) => {
  if (!work) return null;

  return work.exercices && work.exercices.length > 0 ? (
    <Container className="mt-2 back-02 rounded p-2">
      <Row className="mt-0 mb-3">
        <Col>{getStr("exercices", 1)}</Col>
      </Row>
      {Object.entries(work.exercices).map(([k, exercice]) => (
        <Row
          key={"ExcerciceInfoList" + k + exercice.id}
          className="border border-secondary pt-1 pb-1 ms-0 me-0 rounded"
        >
          <Col>{exercice.name}</Col>
          <SimpleSeriesOfExercice series={exercice.series} />
        </Row>
      ))}
    </Container>
  ) : null;
};

export const SimpleSeriesOfExercice = ({ series }) => {
  if (series.length < 1) return null;

  return Object.entries(series).map(([k, serie]) => (
    <Col
      key={"serieExe" + k}
      className="ps-1 pe-1"
      style={{ maxWidth: "40px" }}
    >
      <Button
        size="sm"
        className=""
        disabled={true}
        variant={serie.status == 0 ? "secondary" : "success"}
      >
        {parseInt(k) + 1}
      </Button>
    </Col>
  ));
};
