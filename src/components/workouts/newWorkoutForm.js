import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { getStr } from "../../lang/lang-fun";
import { blockButton, delay } from "../../services/generalServices";
import { createWorkout } from "../../services/workoutServices";
import GeneralSpinner from "../generalSpinner";

const NewWorkoutForm = ({ customClass, getWorkoutsList }) => {
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

export default NewWorkoutForm;
