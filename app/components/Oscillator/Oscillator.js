"use client";

import { useContext } from "react";
import { CTX } from "../../context/Store";
import styles from "./Oscillator.module.scss";

export default function Oscillator({ version }) {
  const [state, dispatch] = useContext(CTX);
  const { gain, noise } = state.lfoSettings;

  const { type } = state.oscillatorSettings1;

  const changeType = (e) => {
    let { name: id, value } = e.target;
    dispatch({
      type: "CHANGE_OSCILLATOR_TYPE",
      payload: {
        id,
        value,
      },
    });
  };

  const changeLFOGain = (e) => {
    let { id, value } = e.target;
    dispatch({
      type: "CHANGE_LFO",
      payload: {
        id,
        value,
      },
    });
  };

  return (
    <div className="control">
      <h2>Oscillator {version}</h2>
      <div className={`param ${styles["wave-type"]}`}>
        <label htmlFor="type">Waveform</label>
        <div className="">
          <input
            type="radio"
            name="type"
            id="wave-type-sine"
            value="sine"
            checked={type === "sine"}
            onChange={changeType}
          />
          <label htmlFor="wave-type-sine">Sine</label>
        </div>
        <div className="">
          <input
            type="radio"
            name="type"
            id="wave-type-square"
            value="square"
            checked={type === "square"}
            onChange={changeType}
          />
          <label htmlFor="wave-type-square">Square</label>
        </div>
        <div className="">
          <input
            type="radio"
            name="type"
            id="wave-type-sawtooth"
            value="sawtooth"
            checked={type === "sawtooth"}
            onChange={changeType}
          />
          <label htmlFor="wave-type-sawtooth">Sawtooth</label>
        </div>
        <div className="">
          <input
            type="radio"
            name="type"
            id="wave-type-triangle"
            value="triangle"
            checked={type === "triangle"}
            onChange={changeType}
          />
          <label htmlFor="wave-type-triangle">Triangle</label>
        </div>
      </div>
      <div className="">
        <input
          type="range"
          id="noise"
          max="1"
          min="0"
          step="0.1"
          value={noise}
          onChange={changeLFOGain}
          className={styles.slider}
        />
        <label htmlFor="noise" className={styles.label}>
          Noise {noise}
        </label>
      </div>
    </div>
  );
}
