import React, { useEffect, useState, useRef } from "react";

const Timer = () => {
  const [duration, setDuration] = useState(100000);
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
    }

    return setTimer(timeLeft);
  };

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

  const onInputChange = (value) => {
    let newDuration = {
      full: 0,
      hours: Math.floor((duration / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((duration / 1000 / 60) % 60),
      seconds: Math.floor((duration / 1000) % 60),
    };
    if (value.hours) newDuration.hours = value.hours;
    if (value.minutes) newDuration.minutes = value.minutes;
    if (value.seconds) newDuration.seconds = value.seconds;

    newDuration.full =
      newDuration.hours * 1000 * 60 * 60 +
      newDuration.minutes * 1000 * 60 +
      newDuration.seconds * 1000;

    setDuration(newDuration.full);
    setStartTime(new Date(new Date().getTime() + newDuration.full));
  };

  return (
    <>
      <input
        type={"number"}
        {...(startCount ? { value: "" } : {})}
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
        type={"number"}
        {...(startCount ? { value: "" } : {})}
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
        type={"number"}
        {...(startCount ? { value: "" } : {})}
        placeholder={`${timer.seconds.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
        })}`}
        readOnly={startCount}
        onChange={(e) => {
          if (!startCount) onInputChange({ seconds: e.target.value });
        }}
      ></input>
      <button
        onClick={() => {
          setStartTime(new Date(new Date().getTime() + timer.full));
          if (startCount) {
            setStartCount(!startCount);
            if (timeout.current) clearTimeout(timeout.current);
          } else {
            setStartCount(!startCount);
          }
        }}
      >
        Start/Stop
      </button>
      <button
        onClick={() => {
          setStartCount(false);
          if (timeout.current) clearTimeout(timeout.current);
          setStartTime(new Date(new Date().getTime() + duration));
        }}
      >
        Reset
      </button>
      <button>Setting</button>
    </>
  );
};

export default Timer;
