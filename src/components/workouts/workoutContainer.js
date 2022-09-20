import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { getStr } from "../../lang/lang-fun";
import { getUserWorkoutsList } from "../../services/workoutServices";
import NewWorkoutForm from "./newWorkoutForm";
import mwb002 from "../../includes/components/myWorkouts002.webp";
import ListOfWorkoutsWidget from "./listOfWorkoutsWidget";

const WorkoutContainer = ({ customClass, update, workouts }) => {
  const [workoutsArray, setWorkoutsArray] = useState([]);

  useEffect(() => {
    async function getWorkoutsList() {
      if (!workouts) {
        const myWorks = await getUserWorkoutsList();
        setWorkoutsArray([...myWorks]);
      } else {
        setWorkoutsArray([...workouts]);
      }
    }
    getWorkoutsList();
  }, [setWorkoutsArray, workouts]);

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

export default WorkoutContainer;
