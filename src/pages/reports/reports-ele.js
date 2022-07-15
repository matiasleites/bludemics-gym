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
  GeneralInformation,
  getGraphicSize,
  useWindowSize
} from "../../config/general-fun";
import { getStr } from "../../lang/lang-fun";
import { SimpleLineWorkout } from "../workouts/workout-ele";
import { getStoredTrainings } from "../workouts/workout-fun";
import { makeReports } from "./reports-fun";

export const ReportsContainer = ({ update }) => {
  const [loading, setLoading] = useState(false);
  const [trainings, setTrainings] = useState([]);
  const [info, setInfo] = useState({ pos: 0, text: "" });
  const [report, setReport] = useState({});
  const [width] = useWindowSize();
  const [videoOptions, setVideoOptions] = useState({ width: 300, height: 200 });
  const [stepsGraphic, setStepGraphic] = useState([]);
  const [open, setOpen] = useState(false);

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
  }, [update]);

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
        line.quarterName = work.steps;
        line.earnings = work.steps;
        myStepGraph.push(line);
      });

      setReport({ ...myReport });
      setTrainings([...response]);
      setStepGraphic([...myStepGraph]);
    } else {
      setInfo({ pos: 1, text: getStr("errorUpdate", 1) });
    }
  }

  return (
    <Container>
      <Row
        onClick={() => {
          setOpen(!open);
        }}
      >
        <Col>
          {getStr("reports", 1)} {open ? "-" : "+"}
        </Col>
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
          <Container className="border border-secondary rounded p-2">
            <Row className="mb-2">
              <Col>{getStr("totals", 2)}</Col>
            </Row>
            <hr />
            <Row>
              <Col sm>
                {getStr("workouts", 1)}: {report.trainings}
              </Col>
              <Col sm>
                {getStr("calories", 1)}: {report.calories}
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
          <Container className="border border-secondary rounded p-2 mt-2">
            <Row className="mb-2">
              <Col>{getStr("average", 2)}</Col>
            </Row>
            <hr />
            <Row>
              <Col sm>
                {getStr("calories", 1)}:{" "}
                {formatedNumber(report.calories / report.trainings, 0)}
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
          <Container className="mt-2 border border-secondary rounded pt-2">
            <Row>
              <Col className="text-center">{getStr("stepsByWorkout", 1)}</Col>
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
                    tickValues={Object.entries(stepsGraphic).map(
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
                    data={stepsGraphic}
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
          <ReportWorkouts workouts={trainings} />
        </>
      ) : null}
    </Container>
  );
};

export const ReportWorkouts = ({ workouts }) => {
  const [open, setOpen] = useState(false);
  return (
    <Container className="mt-2 border border-secondary rounded pt-2 pb-2">
      <Row
        onClick={() => {
          setOpen(!open);
        }}
        className="p-1"
      >
        <Col>
          {getStr("workouts", 1)} {open ? "-" : "+"}
        </Col>
      </Row>
      {open && workouts && workouts.length > 0 ? (
        <>
          <hr />
          {Object.entries(workouts).map(([k, work]) => (
            <SimpleLineWorkout
              key={"example" + k + work.id}
              pos={parseInt(k) + 1}
              work={work}
            />
          ))}
        </>
      ) : null}
    </Container>
  );
};
