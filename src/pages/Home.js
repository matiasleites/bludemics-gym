import { Container, Row, Col } from "react-bootstrap";
import { Helmet, HelmetData } from "react-helmet-async";
import { getStr } from "../lang/lang-fun";
import f01 from "../includes/f01.webp";
import head001 from "../includes/components/topWidget001.webp";
import { useEffect, useState } from "react";
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
import useWindowSize from "../helpers/windowsSize";
import { DaysTrainings } from "../components/reports/daysTraining";
import StartWorkoutContainer from "../components/workouts/startWorkoutContainer";
import WorkoutContainer from "../components/workouts/workoutContainer";
import ReportsContainer from "../components/reports/reportsContainer";
import Header from "../components/header";
import Footer from "../components/footer";
import About from "../components/about";

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

  function newUpdate() {
    setUpdate(!update);
  }

  useEffect(() => {
    let isSmall = false;
    if (width < 500) isSmall = true;
    setSmall(isSmall);
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
        <meta
          property="og:title"
          content={getStr("company2", 1) + " | " + getStr("slogan", 1)}
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://gym.bludemics.com/" />
        <meta property="og:image" content={f01} />
        <meta property="og:description" content={getStr("description", 1)} />
        <meta property="og:sitename" content={getStr("company2", 1)} />
        <meta property="article:tag" content={getStr("keywords")} />
        <link rel="canonical" href="https://gym.bludemics.com" />
      </Helmet>
      <Header />
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
                <div className="p-4" />
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
      <About />
      <Footer />
    </Container>
  );
}

export default Home;
