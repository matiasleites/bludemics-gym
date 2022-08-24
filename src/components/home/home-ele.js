import { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Select from "react-select";
import { getLang, getStr } from "../../lang/lang-fun";
import trackFull from "../../includes/components/trakLeftBig.png";
import { LoginForm } from "../login/login-ele";

export const Title = ({ children }) => {
  return <h1 className="title mb-0">{children}</h1>;
};

export const SubTitle = ({ children }) => {
  return <h2 className="subTitle mb-0">{children}</h2>;
};

export const Text = ({ children }) => {
  return <p className="text m-0">{children}</p>;
};

export const LanguageButtons = () => {
  const [lang, setLang] = useState(getLang());
  function dropLang(e) {
    setLang(e);
    localStorage.setItem("lang", e);
    window.location.reload();
  }
  return (
    <Row>
      <Col>
        <Button
          variant="transparent"
          style={{
            color: lang == "es" ? "#ffffff" : "#282828",
            backgroundColor: lang == "es" ? "#282828" : "#ffffff"
          }}
          onClick={() => {
            dropLang("es");
          }}
        >
          ES
        </Button>
      </Col>
      <Col>
        <Button
          variant="transparent"
          style={{
            color: lang == "en" ? "#ffffff" : "#282828",
            backgroundColor: lang == "en" ? "#282828" : "#ffffff"
          }}
          onClick={() => {
            dropLang("en");
          }}
        >
          EN
        </Button>
      </Col>
      <Col>
        <Button
          variant="transparent"
          style={{
            color: lang == "pt" ? "#ffffff" : "#282828",
            backgroundColor: lang == "pt" ? "#282828" : "#ffffff"
          }}
          onClick={() => {
            dropLang("pt");
          }}
        >
          PT
        </Button>
      </Col>
    </Row>
  );
};

export const SelectLanguage = () => {
  const [lang, setLang] = useState({ value: getLang(), label: getLang() });

  const options = [
    { value: "es", label: "es" },
    { value: "en", label: "en" },
    { value: "pt", label: "pt" }
  ];

  const customStyles = {
    control: (styles) => ({
      ...styles,
      borderRadius: "18px",
      backgroundColor: "rgba(0,0,0,0)",
      border: "none"
    }),
    option: (styles) => ({
      ...styles,
      borderRadius: "0px"
    })
  };

  function dropLang(e) {
    setLang(e);
    localStorage.setItem("lang", e.value);

    setLang(e);
    window.location.reload();
  }

  return (
    <Select
      className="p-0 ps-1"
      value={lang}
      options={options}
      onChange={dropLang}
      styles={customStyles}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null
      }}
    />
  );
};

export const HeaderTrak = ({ small }) => {
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
