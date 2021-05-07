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

  return (
    <>
      <div>{`${timer.hours.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
      })}:${timer.minutes.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
      })}:${timer.seconds.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
      })}`}</div>
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
