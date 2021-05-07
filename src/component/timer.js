import React, { useEffect, useState, useRef } from "react";

const Timer = () => {
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

      setTimer(timeLeft);
    } else {
      setFinished(true);
      setTimeout(() => {
        setFinished(false);
      }, 5000);
    }
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

  return (
    <>
      <input
        className={finished ? "blink" : ""}
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
        className={finished ? "blink" : ""}
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
        className={finished ? "blink" : ""}
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
    </>
  );
};

export default Timer;
