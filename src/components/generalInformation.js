import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { delay } from "../services/generalServices";

const GeneralInformation = ({ info, pos, seconds = 5, customClass = "" }) => {
  const [show, setShow] = useState(true);
  useEffect(() => {
    setShow(true);
    closeInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info]);

  async function closeInformation() {
    await delay(seconds);
    setShow(false);
  }

  if (!info) return null;
  if ((show && info.pos == pos, info.text && info.text.length > 0))
    return (
      <Row className={"ps-3 " + customClass}>
        <Col className="ps-3">
          <small>{info.text}</small>
        </Col>
      </Row>
    );
  return null;
};

export default GeneralInformation;
