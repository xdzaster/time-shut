import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import TimeInput from "./components/TimeInput";
import type { Time } from "./components/TimeInput";
import TimeCountdown from "./components/TimeCountdown";
import Presets from "./components/Presets";

function App() {
  const [time, setTime] = useState<Time>(() => {
    const localLastUsed = localStorage.getItem("lastUsed");
    if (localLastUsed) {
      const lastUsed = JSON.parse(localLastUsed) as Time;
      return lastUsed;
    } else {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }
  });
  const [isScheduled, setIsScheduled] = useState(false);
  const [isPreset, setIsPreset] = useState<boolean>(false);
  const [hasError, setHasError] = useState(false);

  const triggerError = () => {
    setHasError(true);
    setTimeout(() => setHasError(false), 1000);
  };
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
      triggerError();
      return;
    }
    try {
      await invoke("schedule_shutdown", { seconds: timeInSeconds });
      setIsScheduled(true);
      localStorage.setItem("lastUsed", JSON.stringify(time));
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
            <TimeInput hasError={hasError} time={time} onTimeChange={setTime} />
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
