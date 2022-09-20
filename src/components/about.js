import { blueColorDark } from "../services/generalServices";
import { GithubAltIcon, GithubIcon, LinkedinIcon } from "../components/icons";
import { Col, Row, Container } from "react-bootstrap";
import { getStr } from "../lang/lang-fun";
import { useState } from "react";
import about from "../includes/components/about.webp";

const About = () => {
  const [hover, setHover] = useState(-1);

  return (
    <section id="about">
      <Container>
        <Container className={"text-justify p-0 fullContainer headerCell"}>
          <Row
            className="title ms-0 me-0"
            style={{
              backgroundImage: `url(${about})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              transition: "1s"
            }}
          >
            <Col>
              <h2>{getStr("aboutUs", 1)}</h2>
            </Col>
          </Row>
          <Row className="mt-2 p-4 mb-4">
            <Col className="about">
              <h3>{getStr("appName", 1)}</h3>
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
        </Container>
      </Container>
    </section>
  );
};

export default About;
