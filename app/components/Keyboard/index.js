"use client";
import { useContext, useEffect } from "react";
import { CTX } from "../../context/Store";
import QwertyHancock from "qwerty-hancock";
import styles from "./Keyboard.module.scss";

export default function Keyboard() {
  const [state, dispatch] = useContext(CTX);
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
      dispatch({
        type: "CREATE_OSCILLATOR",
        payload: {
          audioContext,
          note,
          frequency,
        },
      });
    };
    keyboard.keyUp = (note, frequency) => {
      dispatch({
        type: "KILL_OSCILLATOR",
        payload: {
          note,
          frequency,
        },
      });
    };
  }, []);
  return (
    <div className={styles["keyboard"]}>
      <div id="keyboard" />
    </div>
  );
}
