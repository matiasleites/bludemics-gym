import { Container, Row, Col } from "react-bootstrap";
import { Helmet, HelmetData } from "react-helmet-async";
import { getStr } from "../../lang/lang-fun";
import { SubTitle, Text } from "./home-ele";
import f02 from "../../img/f02.jpg";
import f01 from "../../img/f01.jpg";
import { useEffect, useState } from "react";
import { randomImage } from "./home-fun";
import { useWindowSize } from "../../config/general-fun";
import { LoginForm, LogOutButton } from "../login/login-ele";
import { useAuth } from "../../context/authContext";
import {
  StartWorkoutContainer,
  WorkoutContainer
} from "../workouts/workout-ele";

const helmetData = new HelmetData({});
function Home() {
  const [width] = useWindowSize();
  const [small, setSmall] = useState(width < 400 ? true : false);
  const [images] = useState([f01, f02]);
  const [back, setBack] = useState(f01);
  // eslint-disable-next-line no-unused-vars
  const { user, isLogged } = useAuth();

  useEffect(() => {
    if (width < 500) {
      setSmall(true);
    } else {
      setSmall(false);
    }
  }, [width]);

  useEffect(() => {
    const myBack = randomImage(images);
    setBack(myBack);
  }, [images]);

  return (
    <Container
      className={small ? "p-1 text-center" : "p-2 pt-5"}
      fluid
      style={{
        backgroundImage: `url(${back})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        position: "fixed"
      }}
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
      <Container className={"text-start alphaContainerDark p-3"}>
        <Row>
          <Col>
            <SubTitle>{getStr("appName", 2)}</SubTitle>
            <Text>{getStr("slogan", 1)}! </Text>
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
            <StartWorkoutContainer />
          </Container>
          <Container
            className={
              "text-start alphaContainerDark p-3 mt-2" + (small ? " " : "")
            }
          >
            <WorkoutContainer />
          </Container>
        </>
      ) : null}
    </Container>
  );
}

export default Home;
