"use client";
import { useContext } from "react";
import { CTX } from "../../context/Store";
import styles from "./LFO.module.scss";

export default function LFO() {
  const [state, dispatch] = useContext(CTX);
  const { rate, delay } = state.lfoSettings;
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
  return (
    <div className={styles.LFO}>
      <h2 className={styles.title}>LFO</h2>
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
          Rate
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
          Delay
        </label>
      </div>
    </div>
  );
}
