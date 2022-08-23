/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useRef, useState } from "react";
import { Container, Col, Row, Button, Form } from "react-bootstrap";
import YouTube from "react-youtube";
import { firestoreNow } from "../../config/firebase";
// eslint-disable-next-line no-unused-vars
import mwb001 from "../../includes/components/myWorkouts001.jpg";
import mwb002 from "../../includes/components/myWorkouts002.jpg";
import {
  blockButton,
  blueColor,
  delay,
  DownIcon,
  DropIcon,
  GeneralInformation,
  GeneralSpinner,
  getDayOfFirebaseDate,
  getVideoSize,
  getYouTubeId,
  greenColor,
  minutesBetweenTwoDates,
  msj,
  orangeColor,
  PlayIcon,
  redColor,
  redColorDark,
  TrashIcon,
  useWindowSize,
  yellowColor
} from "../../config/general-fun";
import { getStr } from "../../lang/lang-fun";
import {
  createWorkout,
  deleteWorkout,
  endTraining,
  getCurrentTraining,
  getUserWorkoutsList,
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
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [workoutsArray, setWorkoutsArray] = useState([]);
  const [currentTraining, setCurrentTrainig] = useState({});

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
      msj(training[0]);
      setCurrentTrainig({ ...training[0] });
    } else {
      setCurrentTrainig({});
    }
    setLoading(false);
  }

  // eslint-disable-next-line no-unused-vars
  async function startMyTraining(myWorkout) {
    setLoading(true);
    var exercices = [];
    var name = getStr("free", 1);

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

    const info = {
      type: myWorkout.id,
      open: firestoreNow(),
      exercices,
      name,
      calories: 0,
      kg: 0,
      km: 0,
      minutes: 0,
      end: false,
      steps: 0,
      info: "",
      color: myWorkout.color
    };
    const response = await startTraining(info);
    setLoading(false);
    setUpdate();
    verifyCurrentTraining();
    return response;
  }

  return (
    <Container className={"fullContainer " + customClass}>
      {currentTraining && currentTraining.open ? (
        <OpenTrainigContainer
          training={currentTraining}
          setUpdate={getWorkoutsList}
          generalUpdate={setUpdate}
        />
      ) : (
        <Row xs={1} md={2} className="p-0">
          {Object.entries(workoutsArray).map(([k, work]) => (
            <ButtonOneWorkout
              key={"wSelect" + k + work.id}
              workout={work}
              loading={loading}
              setLoading={setLoading}
              start={startMyTraining}
            />
          ))}
        </Row>
      )}
    </Container>
  );
};

export const ButtonOneWorkout = ({ workout, loading, setLoading, start }) => {
  if (!workout.color) workout.color = blueColor;
  const [hover, setHover] = useState(false);
  const [time, setTime] = useState(-1);
  const [iconW, setIconW] = useState("25px");

  function manageClick() {
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

export const TimerSeconds = ({ initialSeconds, setTime }) => {
  if (!initialSeconds) initialSeconds = 3;
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
        setTime(seconds - 1);
      } else {
        clearInterval(myInterval);
      }
    }, 500);
    return () => {
      clearInterval(myInterval);
    };
  });

  return (
    <div className="countdown" style={{ paddingRight: "10px" }}>
      {seconds}
    </div>
  );
};

export const OpenTrainigContainer = ({
  training,
  setUpdate,
  generalUpdate
}) => {
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

    msj(training);
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
    <Container className="exerciceCell">
      <Container className="m-0 p-0 pt-1 pe-1">
        <Row className="ps-2 pe-2 mb-2">
          <Col
            className="text-start"
            onClick={() => {
              exercice.video && exercice.video.length > 4
                ? setOpen(!open)
                : false;
            }}
          >
            {exercice.name} ({exercice.reps}){" "}
            {exercice.video && exercice.video.length > 4
              ? open
                ? "-"
                : "+"
              : ""}
          </Col>
          <SeriesOfExercice series={exercice.series} update={updateSeries} />
        </Row>
        {!open ? null : (
          <>
            <Row className="ps-2 pe-2 mb-2">
              <Col className="text-start">
                <small>{exercice.info}</small>
              </Col>
            </Row>
            <hr />
            <Row className="mb-2">
              <Col className="text-center">
                <YouTube
                  videoId={getYouTubeId(exercice.video)}
                  opts={videoOptions}
                />
              </Col>
            </Row>
          </>
        )}
      </Container>
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
    <Col key={"serieExe" + k} className="p-0 m-0" style={{ maxWidth: "30px" }}>
      <Button
        size="sm"
        className="m-0"
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
    <Container className={"fullContainer manageWorkoutsCell " + customClass}>
      <Row
        className={"title text-white"}
        style={{
          backgroundImage: `url(${mwb002})`,
          backgroundPosition: "center",
          backgroundSize: "cover"
        }}
      >
        <Col>{getStr("manageWorkouts", 1)}</Col>
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
    <Row className={customClass + " rounded mt-3 mb-2 ms-1 me-1 pt-0"}>
      <Col className="mt-1" md>
        <Form.Group controlId="nameWorkout">
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
      <Col className={blockButton() + "mt-1"}>
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

  async function deleteExercice(index) {
    const myArrayExercices = work.exercices;
    myArrayExercices.splice(index, 1);
    return await updateExercices(myArrayExercices);
  }

  return (
    <Container className="mt-1 back-02 rounded p-2">
      <Row className="mt-1 mb-3">
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
              deleteExercice={deleteExercice}
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
    <Container className="exercice">
      <Row
        onClick={() => {
          setOpen(!open);
        }}
        className={open ? "mb-2" : ""}
      >
        <Col>
          {getStr("addExercice", 1)}{" "}
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

export const ExerciceLine = ({
  exercice,
  pos,
  editExercice,
  deleteExercice
}) => {
  const [width] = useWindowSize();
  const [videoOptions, setVideoOptions] = useState({ width: 300, height: 200 });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const [deleteE, setDeleteE] = useState(false);

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
    <Container className="mt-1 p-2 exercice">
      <Row>
        <Col
          onClick={() => {
            setOpen(!open);
          }}
        >
          {exercice.name}{" "}
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
        {open ? (
          <Col
            className="p-0"
            style={{ maxWidth: "40px" }}
            onMouseEnter={() => {
              setHover(true);
            }}
            onMouseLeave={() => {
              setHover(false);
            }}
            onClick={async () => {
              if (!loading) {
                if (deleteE) {
                  setLoading(true);
                  await deleteExercice(pos);
                  setLoading(false);
                  setDeleteE(false);
                } else {
                  setDeleteE(true);
                }
              }
            }}
          >
            <TrashIcon
              className="icon"
              fill={
                hover
                  ? deleteE
                    ? redColorDark
                    : "#747474"
                  : deleteE
                  ? redColor
                  : "#282828"
              }
              style={{
                width: "15px",
                height: "15px"
              }}
            />
          </Col>
        ) : null}
      </Row>
      {!open ? null : (
        <>
          <Row className="mt-2">
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

export const SimpleExercicesContainer = ({ work }) => {
  if (!work) return null;

  return work.exercices && work.exercices.length > 0 ? (
    <Container className="mt-2">
      {Object.entries(work.exercices).map(([k, exercice]) => (
        <Row key={"ExcerciceInfoList" + k + exercice.id} className="line">
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
