import { useRef, useState } from "react";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import { GeneralSpinner, msj } from "../../config/general-fun";
import { getStr } from "../../lang/lang-fun";
import { logIn, registerUser, logOut } from "./login-fun";
export const LoginForm = ({ customClass }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [email, setEmail] = useState("");
  const [typeClick, setTypeClick] = useState(0);
  const formRef = useRef();

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
    if (typeClick == 1) return sumbitSingUp(event);
    return sumbitLogIn(event);
  }

  async function sumbitLogIn(event) {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(false);
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
    msj(form);
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
        onSubmit={submitForm}
        className=""
      >
        <Container>
          <Row>
            <Col className="mt-3">
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
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col className="mt-4">
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
              <Col className="mt-4">
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
            {typeClick == 0 ? (
              <Col
                className={
                  "pb-0 mb-0 d-grid gap-2 " + (error ? "mt-1" : "mt-4")
                }
              >
                <Button
                  className="pt-2 pb-2 mt-2"
                  variant={error ? "danger" : "success"}
                  onClick={() => {
                    setTypeClick(0);
                  }}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <GeneralSpinner /> : getStr("login", 1)}
                </Button>
              </Col>
            ) : (
              <Col
                sm={1}
                className={
                  "pb-0 mb-0 d-grid gap-2 " +
                  (error ? "mt-1 me-0" : "mt-4 me-0")
                }
              >
                <Button
                  className="pt-2 pb-2 mt-2 "
                  variant="secondary"
                  onClick={() => {
                    setTypeClick(0);
                  }}
                  type="button"
                >
                  {"<"}
                </Button>
              </Col>
            )}

            <Col
              className={
                "pb-0 ps-0 mb-0 d-grid gap-2 " + (error ? "mt-1" : "mt-4")
              }
            >
              <Button
                className="pt-2 pb-2 mt-2"
                variant={
                  typeClick == 1 ? (error ? "danger" : "success") : "info"
                }
                onClick={() => {
                  setTypeClick(1);
                }}
                type={typeClick == 0 ? "button" : "submit"}
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

export const LogOutButton = () => {
  return (
    <Button
      variant="dark"
      size="sm"
      onClick={() => {
        logOut();
      }}
    >
      {getStr("logout", 1)}
    </Button>
  );
};
