"use client";

import { useContext, useEffect } from "react";
import { CTX } from "../context/Store";
import QwertyHancock from "qwerty-hancock";
import styles from "./Keyboard.module.scss";

export default function Keyboard() {
  const [appState, updateState] = useContext(CTX);

  useEffect(() => {
    const keyboard = new QwertyHancock({
      id: "keyboard",
      width: "449",
      height: "70",
      octaves: 2,
      startNote: "C4",
    });
    keyboard.keyDown = (note, freq) => {
      updateState({
        type: "MAKE_OSC",
        payload: {
          note,
          freq,
        },
      });
    };
    keyboard.keyUp = (note, freq) => {
      updateState({
        type: "KILL_OSC",
        payload: {
          note,
          freq,
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
