"use client";

import { useContext } from "react";
import { CTX } from "../../context/Store";
import styles from "./OSC.module.scss";

export default function OSC() {
  const [state, dispatch] = useContext(CTX);
  const { gain, noise } = state.lfoSettings;

  const { type } = state.oscillatorSettings;

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
      <h2 className="">Waveform</h2>
      <div className="param">
        <label htmlFor="type">Wave (Type)</label>
        <input
          type="radio"
          name="type"
          id="wave-type-sine"
          value="sine"
          checked={type === "sine"}
          onChange={changeType}
        />
        <label htmlFor="wave-type-sine">Sine</label>
        <input
          type="radio"
          name="type"
          id="wave-type-square"
          value="square"
          checked={type === "square"}
          onChange={changeType}
        />
        <label htmlFor="wave-type-sine">Square</label>
        <input
          type="radio"
          name="type"
          id="wave-type-sawtooth"
          value="sawtooth"
          checked={type === "sawtooth"}
          onChange={changeType}
        />
        <label htmlFor="wave-type-sine">Sawtooth</label>
        <input
          type="radio"
          name="type"
          id="wave-type-triangle"
          value="triangle"
          checked={type === "triangle"}
          onChange={changeType}
        />
        <label htmlFor="wave-type-sine">Triangle</label>
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
        <input
          type="range"
          id="gain"
          max="15"
          min="0.1"
          step="0.1"
          value={gain}
          onChange={changeLFOGain}
          className={styles.slider}
        />
        <label htmlFor="gain" className={styles.label}>
          LFO
        </label>
      </div>
    </div>
  );
}
