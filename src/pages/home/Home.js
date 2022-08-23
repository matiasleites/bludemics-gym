import { Container, Row, Col } from "react-bootstrap";
import { Helmet, HelmetData } from "react-helmet-async";
import { getStr } from "../../lang/lang-fun";
import { SelectLanguage, Title } from "./home-ele";
import f01 from "../../includes/f01.jpg";
import bg001 from "../../includes/bg001.jpg";
import bg002 from "../../includes/bg002.jpg";
import bg003 from "../../includes/bg003.jpg";
import bg004 from "../../includes/bg004.jpg";
import bg005 from "../../includes/bg005.jpg";
import { useEffect, useRef, useState } from "react";
import { delay, useWindowSize } from "../../config/general-fun";
import { LoginForm, LogOutButton } from "../login/login-ele";
import { useAuth } from "../../context/authContext";
import {
  StartWorkoutContainer,
  WorkoutContainer
} from "../workouts/workout-ele";
import { DaysTrainings, ReportsContainer } from "../reports/reports-ele";
import {
  getCurrentTraining,
  getUserWorkoutsList,
  isSameDay,
  pastDays
} from "../workouts/workout-fun";

const helmetData = new HelmetData({});
function Home() {
  const [width] = useWindowSize();
  const [small, setSmall] = useState(width < 400 ? true : false);
  const { user, isLogged } = useAuth();
  const [update, setUpdate] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [daysReport, setDaysReport] = useState([]);
  const [currentTraining, setCurrentTrainig] = useState({});
  const arrayBacks = [bg001, bg002, bg003, bg004, bg005];
  const [back, setBack] = useState(bg005);
  const [timer, setTimer] = useState(0);
  const [headerH, setHeaderH] = useState("300px");
  const tick = useRef();

  useEffect(() => {
    tick.current = setInterval(() => {
      if (timer == 0) {
        var randBack =
          arrayBacks[Math.floor(Math.random() * arrayBacks.length)];
        setBack(randBack);
      }
      var newTime = timer + 1;
      if (newTime > 15) {
        newTime = 0;
      }
      setTimer(newTime);
    }, 1000);
    return () => clearInterval(tick.current);
  }, [timer]);

  function newUpdate() {
    setUpdate(!update);
  }

  useEffect(() => {
    if (width < 500) {
      setSmall(true);
    } else {
      setSmall(false);
    }
    updateBackSize();
  }, [width]);

  useEffect(() => {
    animateBack();
    getWorkouts();
    verifyCurrentTraining();
  }, [update]);

  async function animateBack() {
    await delay(2);
    updateBackSize();
  }

  function updateBackSize() {
    setHeaderH(small ? "100px" : "200px");
  }

  async function getWorkouts() {
    setLoading(true);
    const myWorks = await getUserWorkoutsList();
    setWorkouts([...myWorks]);
    setLoading(false);
  }

  function getReports(reports) {
    reports = reports.map((training) => {
      training.open = training.open.toDate();
      return training;
    });
    const myDates = pastDays().reverse();
    const trainingDates = [];
    for (const day of myDates) {
      const haveTraining = reports.some((training) => {
        return isSameDay(training.open, day);
      });
      trainingDates.push({ day, have: haveTraining });
    }
    setDaysReport([...trainingDates]);
  }

  async function verifyCurrentTraining() {
    setLoading(true);
    const training = await getCurrentTraining();
    if (training && training.length > 0) {
      setCurrentTrainig({ ...training[0] });
    } else {
      setCurrentTrainig({});
    }
    setLoading(false);
  }

  return (
    <Container className={"back " + (small ? "p-0 text-center" : "p-0")} fluid>
      <Helmet helmetData={helmetData}>
        <title>{getStr("appName3", 1)}</title>
        <meta name="description" content={getStr("slogan", 1)} />
        <meta name="keywords" content={getStr("keywords")} />
        <meta property="og:title" content={getStr("company2", 1)} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://gym.bludemics.com/" />
        <meta property="og:image" content={f01} />
        <meta property="og:description" content={getStr("slogan", 1)} />
        <meta property="og:sitename" content={getStr("company2", 1)} />
        <meta property="article:tag" content={getStr("keywords")} />
        <link rel="canonical" href="https://gym.bludemics.com" />
      </Helmet>

      <Container
        className="m-0"
        fluid
        style={{
          backgroundImage: `url(${back})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          minHeight: headerH,
          transition: "1s"
        }}
      />
      <Container className={"text-start fullContainer p-3"}>
        <Row>
          <Col>
            <Title>{getStr("appName2", 1)}</Title>
          </Col>
          <Col className="ps-0 pe-1 me-2" style={{ maxWidth: "50px" }}>
            <SelectLanguage />
          </Col>
        </Row>
        {user && isLogged ? (
          <Row>
            <Col className="mb-1">
              {getStr("hi", 1)}, {user.email}
            </Col>
            <Col style={{ maxWidth: "50px" }}>
              <LogOutButton />
            </Col>
          </Row>
        ) : (
          <LoginForm customClass={"mt-3 p-0"} />
        )}
      </Container>
      {user && isLogged ? (
        <Container>
          <DaysTrainings dates={daysReport} />
          <StartWorkoutContainer setUpdate={newUpdate} workouts={workouts} />
          {currentTraining && currentTraining.open ? null : (
            <>
              <Container>
                <WorkoutContainer update={newUpdate} workouts={workouts} />
              </Container>
              <Container>
                <ReportsContainer
                  update={newUpdate}
                  returnTrainings={getReports}
                />
              </Container>
            </>
          )}
        </Container>
      ) : null}
    </Container>
  );
}

export default Home;
