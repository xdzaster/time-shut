import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

import TimeInput, { Time } from "./TimeInput";
import TimeCountdown from "./TimeCountdown";
import Presets from "./Presets";

function App() {
  const [time, setTime] = useState<Time>({ hours: 0, minutes: 15, seconds: 0 });
  const [isScheduled, setIsScheduled] = useState(false);
  const [isPreset, setIsPreset] = useState<boolean>(false);

  async function cancelShutdown() {
    try {
      await invoke("cancel_shutdown");
      setIsScheduled(false);
    } catch (error) {
      console.error("Error cancelling shutdown:", error);
    }
  }

  const scheduleShutdown = async () => {
    const timeInSeconds =
      time.hours * 60 * 60 + time.minutes * 60 + time.seconds;
    if (!timeInSeconds || isNaN(timeInSeconds) || timeInSeconds <= 0) {
      alert("Please enter a valid time in minutes.");
      return;
    }
    try {
      await invoke("schedule_shutdown", { seconds: timeInSeconds });
      setIsScheduled(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="content">
      {isScheduled ? (
        <>
          <TimeCountdown
            initialSeconds={
              time.hours * 60 * 60 + time.minutes * 60 + time.seconds
            }
          />
          <button
            className="actionBtn cancel"
            onClick={cancelShutdown}
            style={{ padding: "10px 20px", fontSize: "16px" }}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          {isPreset ? (
            <Presets onChange={setTime} />
          ) : (
            <TimeInput time={time} onTimeChange={setTime} />
          )}
          <button
            className="text-btn"
            onClick={() => {
              setIsPreset((prev) => !prev);
            }}
          >
            {isPreset ? "Set manually" : "Pick a preset"}
          </button>
          <button
            className="actionBtn"
            onClick={scheduleShutdown}
            style={{ padding: "10px 20px", fontSize: "16px" }}
          >
            Start
          </button>
        </>
      )}
    </div>
  );
}

export default App;
