import { useState, useEffect } from "react";

interface TimeCountdownProps {
  initialSeconds: number;
}
function TimeCountdown({ initialSeconds }: TimeCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds((prevSeconds) => {
        if (prevSeconds <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    setTimeLeft({ hours, minutes, seconds });
  }, [remainingSeconds]);

  return (
    <div className="timeWrapper">
      <div className="timeInput">
        <label htmlFor="hh">Hours</label>
        <input
          disabled
          className="numberInput"
          id="hh"
          placeholder="HH"
          type="number"
          value={String(timeLeft.hours).padStart(2, "0")}
          min={0}
        />
      </div>
      <span className="separator">:</span>
      <div className="timeInput">
        <label htmlFor="mm">Minutes</label>
        <input
          disabled
          className="numberInput"
          placeholder="MM"
          id="mm"
          type="number"
          max={60}
          min={0}
          value={String(timeLeft.minutes).padStart(2, "0")}
        />
      </div>
      <span className="separator">:</span>

      <div className="timeInput">
        <label htmlFor="ss">Seconds</label>
        <input
          disabled
          className="numberInput"
          id="ss"
          placeholder="SS"
          type="number"
          value={String(timeLeft.seconds).padStart(2, "0")}
          max={60}
          min={0}
        />
      </div>
    </div>
  );
}

export default TimeCountdown;
