import { Container, Row, Col } from "react-bootstrap";
import { Helmet, HelmetData } from "react-helmet-async";
import { getStr } from "../lang/lang-fun";
import f01 from "../includes/f01.webp";
import bg001 from "../includes/bg001.webp";
import bg002 from "../includes/bg002.webp";
import bg003 from "../includes/bg003.webp";
import bg004 from "../includes/bg004.webp";
import bg005 from "../includes/bg005.webp";
import head001 from "../includes/components/topWidget001.webp";
import { useEffect, useRef, useState } from "react";
import { blueColorDark, delay } from "../services/generalServices";
import { LogOutButton } from "../components/login/logoutButton";
import { useAuth } from "../context/authContext";
import {
  getCurrentTraining,
  getUserWorkoutsList,
  isSameDay,
  pastDays
} from "../services/workoutServices";
import { getLastReports } from "../services/reportsServices";
import HeaderTrak from "../components/home/headerTrak";
import LanguageButtons from "../components/home/languageButtons";
import useWindowSize from "../helpers/windowsSize";
import { DaysTrainings } from "../components/reports/daysTraining";
import { GithubAltIcon, GithubIcon, LinkedinIcon } from "../components/icons";
import StartWorkoutContainer from "../components/workouts/startWorkoutContainer";
import WorkoutContainer from "../components/workouts/workoutContainer";
import ReportsContainer from "../components/reports/reportsContainer";

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

  const [back, setBack] = useState(bg005);
  const [timer, setTimer] = useState(0);
  const [headerH, setHeaderH] = useState("300px");
  const tick = useRef();
  const [hover, setHover] = useState(-1);

  useEffect(() => {
    const arrayBacks = [bg001, bg002, bg003, bg004, bg005];
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
    let isSmall = false;
    if (width < 500) isSmall = true;
    setSmall(isSmall);
    async function updateAnimation() {
      await delay(1);
      setHeaderH(isSmall ? "100px" : "200px");
    }
    updateAnimation();
  }, [width, small]);

  useEffect(() => {
    async function getWorks() {
      setLoading(true);
      const myWorks = await getUserWorkoutsList();
      setWorkouts([...myWorks]);
      setLoading(false);
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

    async function getReports() {
      if (user && isLogged) {
        var reports = await getLastReports();
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
    }

    getWorks();
    verifyCurrentTraining();
    getReports();
  }, [update, isLogged, user]);

  return (
    <Container
      id="main"
      className={"back " + (small ? "p-0 text-center" : "p-0")}
      fluid
    >
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
      <section id="header">
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
      </section>
      <section id="body">
        <Container>
          <Container className={"text-start p-0 fullContainer headerCell"}>
            <Row
              className="title ms-0 me-0"
              style={{
                backgroundImage: `url(${head001})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                transition: "1s"
              }}
            >
              <Col>
                <h1>Bludemics Gym</h1>
              </Col>
            </Row>

            {user && isLogged ? (
              <>
                <Row className="mt-2 mb-2 ps-2 pe-2">
                  <Col className="mb-1">
                    {getStr("hi", 1)}, {user.email}
                  </Col>
                  <Col style={{ maxWidth: "50px" }}>
                    <LogOutButton />
                  </Col>
                </Row>
                <DaysTrainings dates={daysReport} />
              </>
            ) : (
              <>
                <HeaderTrak small={small} />
                <Row className="mt-2 p-4 mb-4">
                  <Col className="about">
                    <h2>{getStr("aboutUs", 1)}</h2>
                    <p>{getStr("blugymOpen01", 1)}</p>
                    <p className="mb-0">{getStr("blugymOpen02", 1)}:</p>
                    <div>
                      <a
                        href="https://reactjs.org"
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        ReacJS
                      </a>
                      <a
                        href="https://firebase.google.com/"
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        Firebase
                      </a>
                      <a
                        href="https://react-bootstrap.github.io/"
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        React Bootstrap
                      </a>
                      <a
                        href="https://formidable.com/open-source/victory/docs"
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        Victory Chart
                      </a>
                      <a
                        href="https://www.npmjs.com/package/react-youtube"
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        React youtube
                      </a>
                      <a
                        href="https://www.npmjs.com/package/react-helmet-async"
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        React Helmet
                      </a>
                      <a
                        href="https://v5.reactrouter.com/"
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        React Router
                      </a>
                    </div>
                    <p className="mt-2"> {getStr("blugymOpen03", 1)}:</p>
                    <Row className="pt-2 mb-2">
                      <Col className="text-center">
                        <a
                          href={getStr("githubLink")}
                          target="blank"
                          onMouseEnter={() => {
                            setHover(2);
                          }}
                          onMouseLeave={() => {
                            setHover(-1);
                          }}
                        >
                          <GithubIcon
                            className="icon"
                            fill={hover == 2 ? blueColorDark : "#282828"}
                            style={{
                              width: "40px",
                              height: "40px"
                            }}
                          />
                        </a>
                      </Col>
                      <Col className="text-center">
                        <a
                          href={getStr("linkedinLink")}
                          target="blank"
                          onMouseEnter={() => {
                            setHover(1);
                          }}
                          onMouseLeave={() => {
                            setHover(-1);
                          }}
                        >
                          <LinkedinIcon
                            className="icon"
                            fill={hover == 1 ? blueColorDark : "#282828"}
                            style={{
                              width: "40px",
                              height: "40px"
                            }}
                          />
                        </a>
                      </Col>

                      <Col className="text-center">
                        <a
                          href={getStr("githubMatLink")}
                          target="blank"
                          onMouseEnter={() => {
                            setHover(3);
                          }}
                          onMouseLeave={() => {
                            setHover(-1);
                          }}
                        >
                          <GithubAltIcon
                            className="icon"
                            fill={hover == 3 ? blueColorDark : "#282828"}
                            style={{
                              width: "40px",
                              height: "40px"
                            }}
                          />
                        </a>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </>
            )}
          </Container>
          {user && isLogged ? (
            <>
              <StartWorkoutContainer
                setUpdate={newUpdate}
                workouts={workouts}
                customClass={"mt-2 pt-1"}
              />
              {currentTraining && currentTraining.open ? null : (
                <>
                  <WorkoutContainer update={newUpdate} workouts={workouts} />
                  <ReportsContainer update={newUpdate} />
                </>
              )}
            </>
          ) : null}
        </Container>
      </section>
      <section id="footer">
        <Container fluid>
          <Container className="text-center fullContainer p-2">
            <LanguageButtons />
          </Container>
        </Container>
      </section>
    </Container>
  );
}

export default Home;
