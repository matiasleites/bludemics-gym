import { Container, Row } from "react-bootstrap";
import { pastDays } from "../../services/workoutServices";
import { OneDayCell } from "./oneDayCell";

export const DaysTrainings = ({ dates }) => {
  if (!dates) {
    dates = pastDays();
    dates = dates.map((date) => {
      date.day = date;
      date.have = false;
      return date;
    });
  }

  return (
    <Container className="fullContainer pt-2 pb-2">
      <Row>
        {dates.map((day, k) => {
          return <OneDayCell key={"day" + k} day={day} />;
        })}
      </Row>
    </Container>
  );
};
