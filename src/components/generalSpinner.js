import { Spinner } from "react-bootstrap";

const GeneralSpinner = () => {
  return (
    <center>
      <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
        className="ml-2"
      />
    </center>
  );
};

export default GeneralSpinner;
