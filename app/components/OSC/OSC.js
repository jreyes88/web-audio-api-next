"use client";

import { useContext } from "react";
import { CTX } from "../../context/Store";
import styles from "./OSC.module.scss";

export default function OSC() {
  const [state, dispatch] = useContext(CTX);
  const { gain, noise } = state.lfoSettings;

  const { type } = state.osc1Settings;

  const changeType = (e) => {
    let { id, value } = e.target;
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
        <select id="type" onChange={changeType} value={type}>
          <option value="sine">
            <span className={styles.hide}>Sine </span>∿
          </option>
          <option value="square">
            <span>Square </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#000000"
              width="800px"
              height="800px"
              viewBox="0 -64 640 640"
            >
              <path d="M476 480H324a36 36 0 0 1-36-36V96h-96v156a36 36 0 0 1-36 36H16a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16h112V68a36 36 0 0 1 36-36h152a36 36 0 0 1 36 36v348h96V260a36 36 0 0 1 36-36h140a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16H512v156a36 36 0 0 1-36 36z" />
            </svg>
          </option>
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
