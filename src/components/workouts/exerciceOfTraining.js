import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import YouTube from "react-youtube";
import useWindowSize from "../../helpers/windowsSize";
import { getYouTubeId } from "../../services/generalServices";
import SeriesOfExercice from "./seriesOfExercice";

export const ExerciceOfTraining = ({ exercice, pos, update }) => {
  const [open, setOpen] = useState(false);

  const [width] = useWindowSize();
  const [videoOptions, setVideoOptions] = useState({ width: 300, height: 200 });

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
