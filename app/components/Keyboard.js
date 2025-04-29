"use client";

import { useContext, useEffect } from "react";
import { CTX } from "../context/Store";
import QwertyHancock from "qwerty-hancock";
import styles from "./Keyboard.module.scss";

export default function Keyboard() {
  const [state, dispatch] = useContext(CTX);

  // Keyboard cannot use state! It should just dispatch events from Context. Context can use state.

  function rangeToFrequency(baseFrequency, range) {
    let frequency = baseFrequency;

    switch (range) {
      case "2":
        frequency = baseFrequency * 4;
        break;
      case "4":
        frequency = baseFrequency * 2;
        break;
      case "16":
        frequency = baseFrequency / 2;
        break;
      case "32":
        frequency = baseFrequency / 4;
        break;
      case "64":
        frequency = baseFrequency / 8;
        break;
      default:
        break;
    }

    return frequency;
  }
  useEffect(() => {
    const keyboard = new QwertyHancock({
      id: "keyboard",
      width: "908",
      height: "150",
      octaves: 2,
      startNote: "C4",
      activeColour: "#6495ed",
    });
    keyboard.keyDown = (note, frequency) => {
      const audioContext = new window.AudioContext();

      const rangeFrequency = rangeToFrequency(frequency, "16");

      dispatch({
        type: "CREATE_OSCILLATOR",
        payload: {
          audioContext,
          frequency: rangeFrequency,
        },
      });
    };
    keyboard.keyUp = (note, frequency) => {
      const rangeFrequency = rangeToFrequency(frequency, "16");
      dispatch({
        type: "KILL_OSCILLATOR",
        payload: {
          note,
          frequency: rangeFrequency,
        },
      });
    };
  }, []);

  return (
    <div className={styles.keyboard}>
      <div id="keyboard" />
    </div>
  );
}
