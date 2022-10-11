import { useRef, useState } from "react";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import { getStr } from "../../lang/lang-fun";
import { auth, firestoreNow, insertFirestore } from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addExampleWorkout } from "../../services/workoutServices";
import GeneralSpinner from "../generalSpinner";
import { msj } from "../../services/generalServices";

const RegisterForm = ({ customClass, setLogin }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [email, setEmail] = useState("");
  const formRef = useRef();

  async function registerUser(email, pass) {
    var info = "";
    var success = false;
    await createUserWithEmailAndPassword(auth, email, pass)
      .then(async (resp) => {
        const create = await insertFirestore(`users/${resp.user.uid}`, {
          created: firestoreNow(),
          uid: resp.user.uid
        });
        if (create) {
          success = await addExampleWorkout();
        } else {
          success = create;
        }
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

  function handlePass2(event) {
    setPass2(event.target.value);
  }

  async function sumbitSingUp(event) {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(false);
    } else {
      setValidated(true);
      var email = form.elements.email.value;
      var pass = form.elements.pass.value;
      var pass2 = form.elements.pass2.value;
      if (pass.length < 6 || email.length < 4) {
        setValidated(false);
        setError(getStr("emptyInputsLogin", 1));
      } else {
        if (pass == pass2) {
          setLoading(true);
          var response = await registerUser(email, pass);
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
          setError(getStr("errorSecondPass", 1));
        }
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
          sumbitSingUp(e);
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
            <Col className="mt-1" sm>
              <Form.Group controlId="pass2">
                {pass.length > 0 ? (
                  <Form.Label>{getStr("repeatPass", 1)}</Form.Label>
                ) : null}
                <Form.Control
                  placeholder={getStr("repeatPass", 1)}
                  className="m-0 pl-1 pr-1 alphaContainerLigth"
                  type="password"
                  onChange={handlePass2}
                  value={pass2}
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
                className="pt-2 pb-2 mt-2 ms-0 me-2"
                variant={error ? "danger" : "primary"}
                onClick={() => {}}
                type={"submit"}
                disabled={loading}
              >
                {loading ? <GeneralSpinner /> : getStr("singUp", 1)}
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
                variant="secondary"
                onClick={() => {
                  setLogin(true);
                  msj("back to Login");
                }}
                type="submit"
              >
                {loading ? <GeneralSpinner /> : getStr("login", 1)}
              </Button>
            </Col>
            <Col
              className={
                "pb-0 mb-0 d-grid gap-2 ps-1 " + (error ? "mt-1 " : "mt-1 ")
              }
              sm={3}
            />
          </Row>
        </Container>
      </Form>
    </Container>
  );
};

export default RegisterForm;
