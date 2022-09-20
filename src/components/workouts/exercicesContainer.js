import { Col, Container, Row } from "react-bootstrap";
import { getStr } from "../../lang/lang-fun";
import { ExerciceLine } from "./excerciceLine";
import { ExerciceForm } from "./exerciceForm";

const ExercicesContainer = ({ work, updateExercices }) => {
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

export default ExercicesContainer;
