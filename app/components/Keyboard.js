"use client";

import { useContext, useEffect } from "react";
import { CTX } from "../context/Store";
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
    keyboard.keyDown = (note, freq) => {
      const audioContext = new window.AudioContext();
      const out = audioContext.destination;
      const gain = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      gain.connect(filter);
      filter.connect(out);

      dispatch({
        type: "MAKE_OSCILLATOR",
        payload: {
          audioContext,
          gain,
          note,
          freq,
          filter,
        },
      });
    };
    keyboard.keyUp = (note, freq) => {
      dispatch({
        type: "KILL_OSCILLATOR",
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
