"use client";

import { useContext, useEffect } from "react";
import { CTX } from "../../context/Store";

export default function Toggle() {
  const [state, dispatch] = useContext(CTX);
  useEffect(() => {
    const audioContext = new window.AudioContext();

    const startButton = document.getElementById("start");
    startButton.addEventListener("click", () => {
      dispatch({
        type: "CREATE_OSCILLATOR",
        payload: {
          audioContext,
        },
      });
    });

    const stopButton = document.getElementById("stop");
    stopButton.addEventListener("click", () => {
      dispatch({
        type: "KILL_OSCILLATOR",
        payload: {
          audioContext,
        },
      });
    });
  }, []);
  return (
    <>
      <button
        id="start"
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        Start oscillator
      </button>

      <button
        id="stop"
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        Stop oscillator
      </button>
    </>
  );
}
