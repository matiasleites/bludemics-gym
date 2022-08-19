import { useState } from "react";
import { Form } from "react-bootstrap";
import { getLang } from "../../lang/lang-fun";

export const Title = ({ children }) => {
  return <h1 className="title mb-0">{children}</h1>;
};

export const SubTitle = ({ children }) => {
  return <h2 className="subTitle mb-0">{children}</h2>;
};

export const Text = ({ children }) => {
  return <p className="text m-0">{children}</p>;
};

export const SelectLanguage = () => {
  const [lang, setLang] = useState(getLang());

  function dropLang(e) {
    const newLang = e.target.value;
    localStorage.setItem("lang", newLang);
    setLang(newLang);
    window.location.reload();
  }

  return (
    <Form.Group style={{ maxWidth: "30px" }}>
      <Form.Control
        className="p-0 ps-1"
        value={lang}
        as="select"
        onChange={dropLang}
        onSelect={dropLang}
      >
        <option value="en">en</option>
        <option value="es">es</option>
        <option value="pt">pt</option>
      </Form.Control>
    </Form.Group>
  );
};
