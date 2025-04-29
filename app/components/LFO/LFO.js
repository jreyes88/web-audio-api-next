"use client";
import { useContext } from "react";
import { CTX } from "../../context/Store";
import styles from "./LFO.module.scss";

export default function LFO() {
  const [state, dispatch] = useContext(CTX);
  const { gain, rate, delay } = state.lfoSettings;

  const change = (e) => {
    let { id, value } = e.target;
    dispatch({
      type: "CHANGE_LFO",
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
    <div className={styles.LFO}>
      <h2 className={styles.title}>LFO</h2>
      <input
        type="range"
        id="gain"
        max="15"
        min="0.1"
        step="0.1"
        value={gain}
        onChange={change}
        className={styles.slider}
      />
      <label htmlFor="gain" className={styles.label}>
        Gain {gain}
      </label>
      <div className={styles.sliderContainer}>
        <input
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
          Rate {rate}
        </label>
      </div>

      <div className={styles.sliderContainer}>
        <input
          type="range"
          id="delay"
          max="2"
          min="0"
          step="0.1"
          value={delay}
          onChange={change}
          className={styles.slider}
        />
        <label htmlFor="delay" className={styles.label}>
          Delay {delay}
        </label>
      </div>
    </div>
  );
}
