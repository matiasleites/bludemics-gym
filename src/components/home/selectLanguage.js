import { useState } from "react";
import { getLang } from "../../lang/lang-fun";
import Select from "react-select";

const SelectLanguage = () => {
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

export default SelectLanguage;
