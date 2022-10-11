import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import YouTube from "react-youtube";
import trackFull from "../../includes/components/trakLeftBig.webp";
import { getStr } from "../../lang/lang-fun";
import LoginForm from "../login/loginForm";
import RegisterForm from "../register/registerForm";
import "./home.css";

const HeaderTrak = ({ small }) => {
  console.log("isSmall? " + small.toString());
  const [login, setLogin] = useState(true);
  return (
    <Container
      className="trackCard ms-0 me-0 mt-4 mb-2"
      style={{
        backgroundImage: `url(${trackFull})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        minHeight: small ? "700px" : "1096px",
        transition: "1s"
      }}
    >
      <Row>
        <Col>
          <Row
            style={{ minHeight: small ? "80px" : "75px" }}
            className="p-2 pt-3"
          >
            <Col>{getStr("slogan", 1)}</Col>
          </Row>
          <Row
            style={{ minHeight: small ? "80px" : "75px" }}
            className="p-2 pt-3"
          >
            <Col>1. {getStr("head01", 1)}</Col>
          </Row>
          <Row
            style={{ minHeight: small ? "80px" : "75px" }}
            className="p-2 pt-3"
          >
            <Col>2. {getStr("head02", 1)}</Col>
          </Row>
          <Row
            style={{ minHeight: small ? "80px" : "75px" }}
            className="p-2 pt-3"
          >
            <Col>3. {getStr("head03", 1)}</Col>
          </Row>
          <Row
            style={{ minHeight: small ? "80px" : "75px" }}
            className="p-2 pt-3"
          >
            <Col>4. {getStr("head04", 1)}</Col>
          </Row>
        </Col>
      </Row>
      <Row className="mt-4 ">
        <Col>
          {login ? (
            <LoginForm customClass={"m-0 p-2"} setLogin={setLogin} />
          ) : (
            <RegisterForm customClass={"m-0 p-2"} setLogin={setLogin} />
          )}
        </Col>
      </Row>
      <Row className={small ? "mt-3" : "mt-5"}>
        <Col>
          <YouTube
            className="videoHome"
            videoId="VmRYDsICP00"
            opts={{ width: "100%", height: small ? 300 : 350 }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default HeaderTrak;
