import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { getStr } from "../../lang/lang-fun";
import { blockButton, delay, msj } from "../../services/generalServices";
import GeneralInformation from "../generalInformation";
import GeneralSpinner from "../generalSpinner";
import { DownIcon, PlayIcon } from "../icons";

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
