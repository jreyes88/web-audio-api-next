"use client";

import { useContext, useEffect } from "react";
import { CTX } from "../context/Store";
import QwertyHancock from "qwerty-hancock";
import styles from "./Keyboard.module.scss";
import Oscillator from "../context/Oscillator";

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
      const gain = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      const out = audioContext.destination;
      const osc1 = new Oscillator(
        audioContext,
        state.osc1Settings.type,
        freq,
        state.osc1Settings.detune,
        state.envelopeSettings,
        state.lfoSettings,
        gain
      );
      gain.connect(filter);
      filter.connect(out);

      dispatch({
        type: "MAKE_OSCILLATOR",
        payload: {
          osc1,
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
