import { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import YouTube from "react-youtube";
import useWindowSize from "../../helpers/windowsSize";
import { getStr } from "../../lang/lang-fun";
import {
  blockButton,
  getYouTubeId,
  msj,
  redColor,
  redColorDark
} from "../../services/generalServices";
import GeneralSpinner from "../generalSpinner";
import { DownIcon, PlayIcon, TrashIcon } from "../icons";

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
    function getVideoSize(width) {
      if (width > 780) {
        return { width: 580, height: 580 / 1.6 };
      } else {
        return { width: width * 0.5, height: (width * 0.5) / 1.6 };
      }
    }
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
