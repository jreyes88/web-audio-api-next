"use client";

import { useContext } from "react";
import { CTX } from "../../context/Store";
import styles from "./OSC.module.scss";

export default function OSC() {
  const [appState, updateState] = useContext(CTX);
  const { gain, noise } = appState.lfoSettings;

  const { type } = appState.osc1Settings;

  const changeType = (e) => {
    let { id, value } = e.target;
    updateState({
      type: "CHANGE_OSC1_TYPE",
      payload: {
        id,
        value,
      },
    });
  };

  const changeLFOGain = (e) => {
    let { id, value } = e.target;
    updateState({
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
        <select id="type" onChange={changeType} value={type}>
          <option value="sine">Sine</option>
          <option value="square">Square</option>
          <option value="sawtooth">Sawtooth</option>
          <option value="triangle">Triangle</option>
        </select>
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
          Noise
        </label>
        {/* <input
          type="range"
          id="rate"
          max="15"
          min="0.1"
          step="0.1"
          value={rate}
          onChange={change}
          className={styles.slider}
        />
        <label htmlFor="rate" className={styles.label}>
          PWM
        </label> */}

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
