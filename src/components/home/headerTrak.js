import { Col, Container, Row } from "react-bootstrap";
import trackFull from "../../includes/components/trakLeftBig.webp";
import { getStr } from "../../lang/lang-fun";
import LoginForm from "../login/loginForm";

const HeaderTrak = ({ small }) => {
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
            style={{ minHeight: small ? "50px" : "75px" }}
            className="p-2 pt-3"
          >
            <Col>{getStr("slogan", 1)}</Col>
          </Row>
          <Row
            style={{ minHeight: small ? "50px" : "75px" }}
            className="p-2 pt-3"
          >
            <Col>1. {getStr("head01", 1)}</Col>
          </Row>
          <Row
            style={{ minHeight: small ? "50px" : "75px" }}
            className="p-2 pt-3"
          >
            <Col>2. {getStr("head02", 1)}</Col>
          </Row>
          <Row
            style={{ minHeight: small ? "50px" : "75px" }}
            className="p-2 pt-3"
          >
            <Col>3. {getStr("head03", 1)}</Col>
          </Row>
          <Row
            style={{ minHeight: small ? "50px" : "75px" }}
            className="p-2 pt-3"
          >
            <Col>4. {getStr("head04", 1)}</Col>
          </Row>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <LoginForm customClass={"m-0 p-2"} />
        </Col>
      </Row>
    </Container>
  );
};

export default HeaderTrak;
