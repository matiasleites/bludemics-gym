import { useRef, useState } from "react";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import { getStr } from "../../lang/lang-fun";
import { auth, firestoreNow, insertFirestore } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { addExampleWorkout } from "../../services/workoutServices";
import GeneralSpinner from "../generalSpinner";

const LoginForm = ({ customClass }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [email, setEmail] = useState("");
  const [typeClick, setTypeClick] = useState(0);
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

  function handlePass2(event) {
    setPass2(event.target.value);
  }

  async function submitForm(event) {
    event.preventDefault();
    event.stopPropagation();
    if (typeClick == 2) {
      setError(false);
      setTypeClick(1);
      return false;
    }
    if (typeClick == 1) return sumbitSingUp(event);
    if (typeClick == -1) {
      setError(false);
      setTypeClick(0);
      return false;
    }
    return sumbitLogIn(event);
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
          submitForm(e);
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
            {typeClick == 1 ? (
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
            ) : null}
          </Row>
          {error ? (
            <Row>
              <Col className="text-danger p-2 ms-2 mt-2 mb-0 ">{error}</Col>
            </Row>
          ) : null}
          <Row>
            {typeClick == 0 || typeClick == -1 ? (
              <Col
                className={
                  "pb-0 mb-0 d-grid gap-2 " + (error ? "mt-1" : "mt-1")
                }
              >
                <Button
                  className="pt-2 pb-2 mt-2"
                  variant={error ? "danger" : "primary"}
                  onClick={() => {
                    setTypeClick(0);
                  }}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <GeneralSpinner /> : getStr("login", 1)}
                </Button>
              </Col>
            ) : null}
          </Row>
          <Row>
            {typeClick == 1 ? (
              <Col
                sm={1}
                className={
                  "pb-0 mb-0 d-grid gap-2 " +
                  (error ? "mt-1 me-0" : "mt-1 me-0")
                }
              >
                <Button
                  className="pt-2 pb-2 mt-2 "
                  variant="secondary"
                  onClick={() => {
                    setTypeClick(-1);
                  }}
                  type="submit"
                >
                  {"<"}
                </Button>
              </Col>
            ) : null}
            <Col
              className={
                "pb-0 mb-0 d-grid gap-2 ps-1 " +
                (error ? "mt-1 " : "mt-1 ") +
                (typeClick == 1 ? " ms-1 ps-2 pe-2 me-1 " : " ms-2")
              }
              sm={3}
            >
              <Button
                className="pt-2 pb-2 mt-2 ms-0 me-2"
                variant={
                  typeClick == 1 ? (error ? "danger" : "success") : "light"
                }
                onClick={() => {
                  if (typeClick == 0) setTypeClick(2);
                  if (typeClick == 1) setTypeClick(1);
                }}
                type={"submit"}
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
