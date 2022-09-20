import { Col, Button } from "react-bootstrap";

export const SimpleSeriesOfExercice = ({ series }) => {
  if (series.length < 1) return null;

  return Object.entries(series).map(([k, serie]) => (
    <Col
      key={"serieExe" + k}
      className="ps-1 pe-1"
      style={{ maxWidth: "40px" }}
    >
      <Button
        size="sm"
        className=""
        disabled={true}
        variant={serie.status == 0 ? "secondary" : "success"}
      >
        {parseInt(k) + 1}
      </Button>
    </Col>
  ));
};

export default SimpleSeriesOfExercice;
