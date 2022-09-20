import { Col, Container, Row } from "react-bootstrap";
import SimpleSeriesOfExercice from "./simpleSeriesOfExercice";

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

export default SimpleExercicesContainer;
