import { Col, Row } from "react-bootstrap";
import { LineWorkout } from "./lineWorkout";

const ListOfWorkoutsWidget = ({ workouts, customClass, getWorkoutsList }) => {
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

export default ListOfWorkoutsWidget;
