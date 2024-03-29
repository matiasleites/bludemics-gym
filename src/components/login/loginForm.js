import { useRef, useState } from "react";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import { getStr } from "../../lang/lang-fun";
import { auth } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import GeneralSpinner from "../generalSpinner";

const LoginForm = ({ customClass, setLogin }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");
  const formRef = useRef();

  async function logIn(email, pass) {
    var info = "";
    var success = false;
    await signInWithEmailAndPassword(auth, email, pass)
      .then(() => {
        success = true;
      })
      .catch((error) => {
        info = error.code;
        info = info.replaceAll("auth/", "");
        info = info.replaceAll("-", " ");
      });
    return { success, info };
  }

  function handleEmail(event) {
    setEmail(event.target.value);
  }

  function handlePass(event) {
    setPass(event.target.value);
  }

  async function sumbitLogIn(event) {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(false);
      setError(getStr("emptyInputs", 1));
    } else {
      setValidated(true);
      var email = form.elements.email.value;
      var pass = form.elements.pass.value;

      if (email.length > 4 && pass.length > 5) {
        setLoading(true);
        var response = await logIn(email, pass);
        if (!response.success) {
          setError(response.info);
          setValidated(false);
        } else {
          window.location.reload(false);
          setValidated(true);
          setError(false);
        }
        setLoading(false);
      } else {
        setValidated(false);
        setError(getStr("emptyInputs", 1));
      }
    }
    return true;
  }

  return (
    <Container className={customClass}>
      <Form
        ref={formRef}
        noValidate
        validated={validated}
        onSubmit={(e) => {
          sumbitLogIn(e);
        }}
        className="loginForm"
      >
        <Container className="p-2 pb-3">
          <Row className="ps-1 pt-2 pb-2">
            <Col>{getStr("freeLogin", 1)}</Col>
          </Row>
          <Row>
            <Col className="mt-1" sm>
              <Form.Group controlId="email">
                {email.length > 0 ? (
                  <Form.Label>{getStr("email", 1)}</Form.Label>
                ) : null}
                <Form.Control
                  placeholder={getStr("email", 1)}
                  className="m-0 pl-1 pr-1"
                  type="email"
                  value={email}
                  onChange={handleEmail}
                  onLoadedData={handleEmail}
                />
              </Form.Group>
            </Col>
            <Col className="mt-1" sm>
              <Form.Group controlId="pass">
                {pass.length > 0 ? (
                  <Form.Label>{getStr("pass", 1)}</Form.Label>
                ) : null}
                <Form.Control
                  placeholder={getStr("pass", 1)}
                  className="m-0 pl-1 pr-1 alphaContainerLigth"
                  type="password"
                  onChange={handlePass}
                  value={pass}
                />
              </Form.Group>
            </Col>
          </Row>
          {error ? (
            <Row>
              <Col className="text-danger p-2 ms-2 mt-2 mb-0 ">{error}</Col>
            </Row>
          ) : null}
          <Row>
            <Col
              className={"pb-0 mb-0 d-grid gap-2 " + (error ? "mt-1" : "mt-1")}
            >
              <Button
                className="pt-2 pb-2 mt-2"
                variant={error ? "danger" : "primary"}
                type="submit"
                disabled={loading}
              >
                {loading ? <GeneralSpinner /> : getStr("login", 1)}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col
              className={
                "pb-0 mb-0 d-grid gap-2 ps-1 " + (error ? "mt-1 " : "mt-1 ")
              }
              sm={3}
            >
              <Button
                className="pt-2 pb-2 mt-2 ms-2 me-2 "
                variant={error ? "danger" : "secondary"}
                onClick={() => {
                  setLogin(false);
                }}
                disabled={loading}
              >
                {loading ? <GeneralSpinner /> : getStr("singUp", 1)}
              </Button>
            </Col>
          </Row>
        </Container>
      </Form>
    </Container>
  );
};

export default LoginForm;
