import { useEffect, useRef, useState } from "react";

const TimerTraining = ({ workout }) => {
  const [timer, setTimer] = useState("");
  const tick = useRef();

  function traninigElapsedTime(workout) {
    const myStart = workout.open.toDate();
    const now = new Date();
    const diff = now.getTime() - myStart.getTime();
    const totalSeconds = diff / 1000;
    const hours = totalSeconds / (60 * 60);
    var minutes = totalSeconds / 60;
    if (minutes > 60) minutes = minutes % 60;
    const seconds = totalSeconds % 60;
    var minutesFormated = Math.floor(minutes);
    if (minutesFormated < 10) minutesFormated = "0" + minutesFormated;
    var secondsFormated = Math.floor(seconds);
    if (secondsFormated < 10) secondsFormated = "0" + secondsFormated;
    var hoursFormated = Math.floor(hours);
    if (hoursFormated < 10) hoursFormated = "0" + hoursFormated;
    if (hours >= 1)
      return hoursFormated + ":" + minutesFormated + ":" + secondsFormated;
    return minutesFormated + ":" + secondsFormated;
  }

  useEffect(() => {
    tick.current = setInterval(() => {
      setTimer(traninigElapsedTime(workout));
    }, 1000);

    return () => clearInterval(tick.current);
  }, [workout]);

  return <div className="title">{timer}</div>;
};

export default TimerTraining;
