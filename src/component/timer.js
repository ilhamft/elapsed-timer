import React, { useEffect, useState, useRef } from "react";

const Timer = () => {
  const [now, setNow] = useState(new Date());

  const [tempDuration, setTempDuration] = useState(0);
  const [duration, setDuration] = useState(11000);
  const [startTime, setStartTime] = useState(
    new Date(new Date().getTime() + duration)
  );
  const [timer, setTimer] = useState({
    full: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [startCount, setStartCount] = useState(false);
  const [finished, setFinished] = useState(false);
  const [clearInput, setClearInput] = useState(false);
  const [warningTimer, setWarningTimer] = useState(0);
  const [warn, setWarn] = useState(false);

  const timeout = useRef(null);

  const calculateTime = () => {
    const difference = startTime - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        full: difference,
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };

      if (difference < warningTimer + 1000) setWarn(true);
      else setWarn(false);

      setTimer(timeLeft);
    } else {
      setFinished(true);
      setTimeout(() => {
        setFinished(false);
      }, 5000);
    }
  };

  useEffect(() => {
    setInterval(() => {
      setNow(new Date());
    }, 1000);
  }, []);

  useEffect(() => {
    calculateTime();
  }, [startTime]);

  useEffect(() => {
    if (startCount) {
      timeout.current = setTimeout(() => {
        calculateTime();
      }, 1000);
    }
  }, [timer]);

  useEffect(() => {
    setClearInput(false);
  }, [clearInput]);

  const onInputChange = (value) => {
    let newDuration = {
      full: 0,
      hours: Math.floor((duration / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((duration / 1000 / 60) % 60),
      seconds: Math.floor((duration / 1000) % 60),
    };
    if (value.hours) newDuration.hours = parseInt(value.hours);
    if (value.minutes) newDuration.minutes = parseInt(value.minutes);
    if (value.seconds) newDuration.seconds = parseInt(value.seconds) + 1;

    newDuration.full =
      newDuration.hours * 1000 * 60 * 60 +
      newDuration.minutes * 1000 * 60 +
      newDuration.seconds * 1000;

    setTempDuration(newDuration.full);
    setStartTime(new Date(new Date().getTime() + newDuration.full));
  };

  const onWarningChange = (value) => {
    let newDuration = 0;
    if (value.hours) newDuration += parseInt(value.hours) * 1000 * 60 * 60;
    if (value.minutes) newDuration += parseInt(value.minutes) * 1000 * 60;
    if (value.seconds) newDuration += parseInt(value.seconds) * 1000;

    setWarningTimer(newDuration);
  };

  return (
    <>
      <div className="clock">
        <h5>Clock</h5>
        <input value={now.toTimeString()} readOnly />
      </div>

      <div
        className={`timer ${finished ? "blink" : ""} ${
          warn && startCount ? "warn" : ""
        }`}
      >
        <h5>Elapsed Timer</h5>
        <input
          type="number"
          min="0"
          {...(clearInput ? { value: "" } : {})}
          placeholder={`${timer.hours.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
          })}`}
          readOnly={startCount}
          onChange={(e) => {
            if (!startCount) onInputChange({ hours: e.target.value });
          }}
        ></input>
        :
        <input
          type="number"
          min="0"
          {...(clearInput ? { value: "" } : {})}
          placeholder={`${timer.minutes.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
          })}`}
          readOnly={startCount}
          onChange={(e) => {
            if (!startCount) onInputChange({ minutes: e.target.value });
          }}
        ></input>
        :
        <input
          type="number"
          min="0"
          {...(clearInput ? { value: "" } : {})}
          placeholder={`${timer.seconds.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
          })}`}
          readOnly={startCount}
          onChange={(e) => {
            if (!startCount) onInputChange({ seconds: e.target.value });
          }}
        ></input>
      </div>
      <div className="buttons">
        <button
          onClick={() => {
            setStartTime(new Date(new Date().getTime() + timer.full));
            if (startCount) {
              setStartCount(!startCount);
              if (timeout.current) clearTimeout(timeout.current);
            } else {
              setClearInput(true);
              if (tempDuration) {
                setDuration(tempDuration);
                setTempDuration(0);
              }
              setStartCount(!startCount);
            }
          }}
        >
          Start/Stop
        </button>
        <button
          onClick={() => {
            setClearInput(true);
            setStartCount(false);
            if (timeout.current) clearTimeout(timeout.current);
            setStartTime(new Date(new Date().getTime() + duration));
          }}
        >
          Reset
        </button>
        <button>Setting</button>
      </div>
      <div className="warning">
        <h5>Warning Time</h5>
        <input
          type="number"
          defaultValue="0"
          min="0"
          readOnly={startCount}
          onChange={(e) => {
            onWarningChange({ hours: e.target.value });
          }}
        ></input>
        :
        <input
          type="number"
          defaultValue="0"
          min="0"
          readOnly={startCount}
          onChange={(e) => {
            onWarningChange({ minutes: e.target.value });
          }}
        ></input>
        :
        <input
          type="number"
          defaultValue="0"
          min="0"
          readOnly={startCount}
          onChange={(e) => {
            onWarningChange({ seconds: e.target.value });
          }}
        ></input>
      </div>
    </>
  );
};

export default Timer;
