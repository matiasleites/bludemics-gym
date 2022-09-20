import { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { firestoreNow } from "../../config/firebase";
import { getStr } from "../../lang/lang-fun";
import { msj } from "../../services/generalServices";
import {
  getCurrentTraining,
  getUserWorkoutsList,
  startTraining
} from "../../services/workoutServices";
import { ButtonOneWorkout } from "./butonOneWorkout";
import OpenTrainigContainer from "./openTrainingContainer";

const StartWorkoutContainer = ({ customClass, setUpdate, workouts }) => {
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
    <Container className={"fullContainer ps-2 pe-2 " + customClass}>
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
export default StartWorkoutContainer;
