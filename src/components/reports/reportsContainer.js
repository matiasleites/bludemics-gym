import { useEffect, useRef, useState } from "react";
import { Container, Row, Col, FormControl, Form } from "react-bootstrap";
import {
  VictoryChart,
  VictoryContainer,
  VictoryTheme,
  VictoryAxis,
  VictoryLine
} from "victory";
import {
  dateToInputString,
  formatedNumber,
  getGraphicSize
} from "../../services/generalServices";
import { getStr } from "../../lang/lang-fun";
import { getStoredTrainings } from "../../services/workoutServices";
import { makeReports } from "../../services/reportsServices";
import titleImage from "../../includes/components/stats001.jpg";
import { ReportWorkouts } from "./reportWorkouts";
import useWindowSize from "../../helpers/windowsSize";
import GeneralInformation from "../generalInformation";

// eslint-disable-next-line no-unused-vars
const ReportsContainer = ({ update }) => {
  const [loading, setLoading] = useState(false);
  const [trainings, setTrainings] = useState([]);
  const [info, setInfo] = useState({ pos: 0, text: "" });
  const [report, setReport] = useState({});
  const [width] = useWindowSize();
  const [videoOptions, setVideoOptions] = useState({ width: 300, height: 200 });
  const [minutesGraphic, setMinutesGraphic] = useState([]);

  const startRef = useRef();
  const endRef = useRef();

  useEffect(() => {
    const size = getGraphicSize(width);
    setVideoOptions(size);
  }, [width]);

  useEffect(() => {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    firstDay = dateToInputString(firstDay);
    lastDay = dateToInputString(lastDay);
    startRef.current.value = firstDay;
    endRef.current.value = lastDay;
    getTrainings();
  }, []);

  async function getTrainings() {
    setLoading(true);
    var start = startRef.current.value;
    start = new Date(start + "T00:00:00-03:00");
    var end = endRef.current.value;
    end = new Date(end + "T00:00:00-03:00");
    const response = await getStoredTrainings(start, end);
    setLoading(false);
    if (response) {
      const myReport = makeReports(response);
      const myStepGraph = [];

      response.map(function (work, pos) {
        const line = {};
        line.quarter = pos + 1;
        line.quarterName = work.minutes;
        line.earnings = work.minutes;
        myStepGraph.push(line);
      });

      setReport({ ...myReport });
      setTrainings([...response]);
      setMinutesGraphic([...myStepGraph]);
    } else {
      setInfo({ pos: 1, text: getStr("errorUpdate", 1) });
    }
  }

  return (
    <Container className="fullContainer staticsCell">
      <Row
        className="title"
        style={{
          backgroundImage: `url(${titleImage})`,
          bacgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <Col>{getStr("reports", 1)}</Col>
      </Row>
      <Row className="">
        <Col sm>
          <Form.Group className="mb-3">
            <Form.Label>{getStr("start", 1)}</Form.Label>
            <FormControl
              type="date"
              readOnly={loading}
              ref={startRef}
              onChange={() => {
                getTrainings();
              }}
            />
          </Form.Group>
        </Col>
        <Col sm>
          <Form.Group className="mb-3">
            <Form.Label>{getStr("end", 1)}</Form.Label>
            <FormControl
              type="date"
              readOnly={loading}
              ref={endRef}
              onChange={() => {
                getTrainings();
              }}
            />
          </Form.Group>
        </Col>
      </Row>
      <GeneralInformation info={info} pos={1} />
      {open ? (
        <>
          <Container className="window">
            <Row className="mb-2">
              <Col>{getStr("totals", 2)}</Col>
            </Row>
            <Row className="ps-2 pe-2 texts">
              <Col sm>
                {getStr("workouts", 1)}: {report.trainings}
              </Col>
              <Col sm>
                {getStr("calories", 1)}: {report.calories}
              </Col>
              <Col sm>
                {getStr("kg", 1)}:{" "}
                {formatedNumber(report.kg / report.trainings, 0)}
              </Col>
              <Col sm>
                {getStr("km", 1)}: {report.km}
              </Col>
              <Col sm>
                {getStr("steps", 1)}: {report.steps}
              </Col>
              <Col sm>
                {getStr("minutes", 1)}: {report.minutes}
              </Col>
            </Row>
          </Container>

          <Container className="window">
            <Row className="mb-2">
              <Col>{getStr("average", 2)}</Col>
            </Row>
            <hr />
            <Row className="texts">
              <Col sm>
                {getStr("calories", 1)}:{" "}
                {formatedNumber(report.calories / report.trainings, 0)}
              </Col>
              <Col sm>
                {getStr("kg", 1)}:{" "}
                {formatedNumber(report.kg / report.trainings)}
              </Col>
              <Col sm>
                {getStr("km", 1)}:{" "}
                {formatedNumber(report.km / report.trainings)}
              </Col>
              <Col sm>
                {getStr("steps", 1)}:{" "}
                {formatedNumber(report.steps / report.trainings, 0)}
              </Col>
              <Col sm>
                {getStr("minutes", 1)}:{" "}
                {formatedNumber(report.minutes / report.trainings, 0)}
              </Col>
            </Row>
          </Container>
          {minutesGraphic && minutesGraphic.length > 1 ? (
            <Container className="window">
              <Row>
                <Col className="text-center">
                  {getStr("minutesByWorkout", 1)}
                </Col>
              </Row>
              <Row>
                <Col className="text-center">
                  <VictoryChart
                    domainPadding={0}
                    theme={VictoryTheme.material}
                    height={videoOptions.height}
                    width={videoOptions.width}
                    style={{
                      grid: {
                        fill: "transparent",
                        stroke: "transparent",
                        strokeWidht: 0
                      }
                    }}
                    containerComponent={<VictoryContainer responsive={false} />}
                  >
                    <VictoryAxis
                      style={{
                        grid: {
                          stroke: "transparente",
                          strokeWidht: 0
                        }
                      }}
                      tickValues={Object.entries(minutesGraphic).map(
                        // eslint-disable-next-line no-unused-vars
                        ([k, data]) => data.quarter
                      )}
                    />
                    <VictoryAxis
                      style={{
                        grid: {
                          fill: "transparent",
                          stroke: "rgba(255,255,255, 0.2)",
                          strokeWidht: 0.1
                        }
                      }}
                      dependentAxis
                      tickFormat={(x) => `${x}`}
                    />
                    <VictoryLine
                      data={minutesGraphic}
                      x="quarter"
                      y="earnings"
                      style={{
                        data: { stroke: "#a12626" },
                        grid: {
                          fill: "transparent",
                          stroke: "transparent",
                          strokeWidht: 0
                        }
                      }}
                    />
                  </VictoryChart>
                </Col>
              </Row>
            </Container>
          ) : null}
          <ReportWorkouts workouts={trainings} />
        </>
      ) : null}
    </Container>
  );
};

export default ReportsContainer;
