import { Time } from "./TimeInput";

interface PresetsProp {
  onChange: (timeObj: Time) => void;
}

const PRESETS = {
  "15 minutes": {
    hours: 0,
    minutes: 15,
    seconds: 0,
  },
  "30 Minutes": {
    hours: 0,
    minutes: 30,
    seconds: 0,
  },
  "45 Minutes": {
    hours: 0,
    minutes: 45,
    seconds: 0,
  },
  "1 Hour": {
    hours: 1,
    minutes: 0,
    seconds: 0,
  },
} as const;
type Options = keyof typeof PRESETS;

export default function Presets({ onChange }: PresetsProp) {
  const options = Object.keys(PRESETS);
  return (
    <div className="buttonWrapper">
      {options.map((option) => {
        return (
          <>
            <input
              onChange={(e) => {
                const value = e.target.value as Options;
                onChange(PRESETS[value]);
              }}
              type="radio"
              value={option}
              id={option}
              name="time"
            />
            <label htmlFor={option}>{option}</label>
          </>
        );
      })}
    </div>
  );
}
