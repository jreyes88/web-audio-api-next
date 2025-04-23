"use client";

import { useContext, useEffect } from "react";
import { CTX } from "../context/Store";
import QwertyHancock from "qwerty-hancock";
import styles from "./Keyboard.module.scss";
import Oscillator from "../context/Oscillator";
import Gain from "../context/Gain";

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
      const gain = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      const out = audioContext.destination;

      // Create gain for oscillator
      const oscillatorGain = new Gain(audioContext, 0.1, gain);

      // Create basic oscillator
      const oscillator = new Oscillator(
        audioContext,
        state.oscillatorSettings.type,
        frequency,
        state.oscillatorSettings.detune,
        oscillatorGain.gain
      );

      gain.connect(filter);
      filter.connect(out);

      dispatch({
        type: "MAKE_OSCILLATOR",
        payload: {
          audioContext,
          oscillator,
          filter,
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
    <div className={styles.keyboard}>
      <div id="keyboard" />
    </div>
  );
}
