import { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { getLang } from "../../lang/lang-fun";

const LanguageButtons = () => {
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

export default LanguageButtons;
