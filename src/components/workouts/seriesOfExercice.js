import { useState } from "react";
import { Button, Col } from "react-bootstrap";

const SeriesOfExercice = ({ series, update }) => {
  const [loading, setLoading] = useState();
  async function updateSerie(pos, status) {
    setLoading(true);
    var newStatus = 1;
    status == 1 ? (newStatus = 0) : (newStatus = 1);
    const newArray = series;
    newArray[pos] = { status: newStatus };
    const response = await update(newArray);
    setLoading(false);
    return response;
  }

  return Object.entries(series).map(([k, serie]) => (
    <Col key={"serieExe" + k} className="p-0 m-0" style={{ maxWidth: "30px" }}>
      <Button
        size="sm"
        className="m-0"
        disabled={loading}
        variant={serie.status == 0 ? "danger" : "success"}
        onClick={() => {
          updateSerie(k, serie.status);
        }}
      >
        {parseInt(k) + 1}
      </Button>
    </Col>
  ));
};

export default SeriesOfExercice;
