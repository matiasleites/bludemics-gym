import { Container, Row, Col } from "react-bootstrap";
import { Helmet, HelmetData } from "react-helmet-async";
import { getStr } from "../../lang/lang-fun";
import { SelectLanguage, SubTitle, Text } from "./home-ele";
import f01 from "../../img/f01.jpg";
import { useEffect, useState } from "react";
import { useWindowSize } from "../../config/general-fun";
import { LoginForm, LogOutButton } from "../login/login-ele";
import { useAuth } from "../../context/authContext";
import {
  StartWorkoutContainer,
  WorkoutContainer
} from "../workouts/workout-ele";
import { ReportsContainer } from "../reports/reports-ele";
import { getUserWorkoutsList } from "../workouts/workout-fun";

const helmetData = new HelmetData({});
function Home() {
  const [width] = useWindowSize();
  const [small, setSmall] = useState(width < 400 ? true : false);
  const { user, isLogged } = useAuth();
  const [update, setUpdate] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [workouts, setWorkouts] = useState([]);

  function newUpdate() {
    setUpdate(!update);
  }

  useEffect(() => {
    if (width < 500) {
      setSmall(true);
    } else {
      setSmall(false);
    }
  }, [width]);

  useEffect(() => {
    getWorkouts();
  }, [update]);

  async function getWorkouts() {
    setLoading(true);
    const myWorks = await getUserWorkoutsList();
    setWorkouts([...myWorks]);
    setLoading(false);
  }

  return (
    <Container className={small ? "p-1 text-center" : "p-2 pt-5"} fluid>
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
      <Container className={"text-start alphaContainerDark p-3"}>
        <Row>
          <Col>
            <SubTitle>{getStr("appName", 2)}</SubTitle>
            <Text>{getStr("slogan", 1)}! </Text>
          </Col>
          <Col className="ps-0 pe-0" style={{ maxWidth: "50px" }}>
            <SelectLanguage />
          </Col>
        </Row>
        <hr />
        {user && isLogged ? (
          <Row>
            <Col className="mb-1">
              {getStr("hi", 1)}, {user.email}
            </Col>
            <Col sm={2}>
              <LogOutButton />
            </Col>
          </Row>
        ) : (
          <LoginForm customClass={"mt-3 p-0"} />
        )}
      </Container>
      {user && isLogged ? (
        <>
          <Container
            className={
              "text-start alphaContainerDark p-3 mt-2" + (small ? " " : "")
            }
          >
            <StartWorkoutContainer setUpdate={newUpdate} workouts={workouts} />
          </Container>
          <Container
            className={
              "text-start alphaContainerDark p-3 mt-2" + (small ? " " : "")
            }
          >
            <WorkoutContainer update={newUpdate} workouts={workouts} />
          </Container>
          <Container
            className={
              "text-start alphaContainerDark p-3 mt-2" + (small ? " " : "")
            }
          >
            <ReportsContainer update={newUpdate} />
          </Container>
        </>
      ) : null}
    </Container>
  );
}

export default Home;
