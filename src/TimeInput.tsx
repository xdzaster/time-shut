export type Time = { hours: number; minutes: number; seconds: number };
interface TimeInputProps {
  onTimeChange: (time: Time) => void;
  time: Time;
}
const TimeInput = ({ onTimeChange, time }: TimeInputProps) => {
  const updateTime = (
    field: "hours" | "minutes" | "seconds",
    value: string
  ) => {
    console.log(field, value);

    let updatedTime = { ...time, [field]: parseInt(value, 10) || 0 };

    if (field === "seconds" && updatedTime.seconds == 60) {
      updatedTime.minutes += 1;
      updatedTime.seconds = 0;
    }

    if (field === "minutes" && updatedTime.minutes == 60) {
      updatedTime.hours += 1;
      updatedTime.minutes = 0;
    }
    if (field !== "hours" && (parseInt(value, 10) || 0) > 60) {
      updatedTime[field] = 0;
    }

    // Ensure values are non-negative
    updatedTime = {
      hours: Math.max(0, updatedTime.hours),
      minutes: Math.max(0, updatedTime.minutes),
      seconds: Math.max(0, updatedTime.seconds),
    };

    // Notify parent component if needed
    if (onTimeChange) {
      onTimeChange(updatedTime);
    }
  };

  return (
    <div className="timeWrapper">
      <div className="timeInput">
        <input
          className="numberInput"
          id="hh"
          placeholder="HH"
          type="number"
          value={String(time.hours).padStart(2, "0")}
          min={0}
          onChange={(e) => updateTime("hours", e.target.value)}
        />
        <label htmlFor="hh">Hours</label>
      </div>
      <span className="separator">:</span>
      <div className="timeInput">
        <input
          className="numberInput"
          placeholder="MM"
          id="mm"
          type="number"
          max={60}
          min={0}
          value={String(time.minutes).padStart(2, "0")}
          onChange={(e) => updateTime("minutes", e.target.value)}
        />
        <label htmlFor="mm">Minutes</label>
      </div>
      <span className="separator">:</span>

      <div className="timeInput">
        <input
          className="numberInput"
          id="ss"
          placeholder="SS"
          type="number"
          value={String(time.seconds).padStart(2, "0")}
          max={60}
          min={0}
          onChange={(e) => updateTime("seconds", e.target.value)}
        />
        <label htmlFor="ss">Seconds</label>
      </div>
    </div>
  );
};

export default TimeInput;
