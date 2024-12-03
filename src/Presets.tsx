import type { Time } from "./TimeInput";

interface PresetsProp {
  onChange: (timeObj: Time) => void;
}

function formatTime({ hours, minutes, seconds }: Time) {
  const parts = [];
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
  if (seconds > 0) parts.push(`${seconds} second${seconds !== 1 ? "s" : ""}`);
  return parts.join(" ");
}

export default function Presets({ onChange }: PresetsProp) {
  const PRESETS = [
    {
      hours: 0,
      minutes: 15,
      seconds: 0,
    },
    {
      hours: 0,
      minutes: 30,
      seconds: 0,
    },
    {
      hours: 1,
      minutes: 0,
      seconds: 0,
    },
    {
      hours: 2,
      minutes: 0,
      seconds: 0,
    },
  ];

  const localLastUsed = localStorage.getItem("lastUsed");
  if (localLastUsed) {
    const lastUsed = JSON.parse(localLastUsed) as Time;
    const lastUsedLabel = formatTime(lastUsed);
    const labelIndex = PRESETS.findIndex((preset) => {
      return formatTime(preset) === lastUsedLabel;
    });
    if (labelIndex === -1) PRESETS[3] = lastUsed;
  }

  return (
    <div className="buttonWrapper">
      {PRESETS.map((option, index) => {
        const label = formatTime(option);
        return (
          <>
            <input
              onChange={() => {
                onChange(PRESETS[index]);
              }}
              type="radio"
              id={label}
              name="time"
            />
            <label htmlFor={label}>{label}</label>
          </>
        );
      })}
    </div>
  );
}
