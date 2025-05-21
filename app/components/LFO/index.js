"use client";

import { useContext } from "react";
import { CTX } from "../../context/Store";
import styles from "./LFO.module.scss";

export default function LFO() {
  const [state, dispatch] = useContext(CTX);
  const { rate, delay, gain, noise } = state.lfoSettings;
  const changeLFO = (e) => {
    const { id, value } = e.target;
    dispatch({
      type: "CHANGE_LFO",
      payload: {
        id,
        value,
      },
    });
  };
  const changeLFOVolume = (e) => {
    const { id, value } = e.target;
    dispatch({
      type: "CHANGE_LFO_VOLUME",
      payload: {
        id,
        value,
      },
    });
  };
  return (
    <div className={styles["lfo"]}>
      <h2>LFO</h2>
      <div className="">
        <input
          type="range"
          id="rate"
          max="15"
          min="0.1"
          step="0.1"
          value={rate}
          onChange={changeLFO}
        />
        <label htmlFor="rate">Rate {rate}</label>
      </div>
      <div className="">
        <input
          type="range"
          id="delay"
          max="2"
          min="0"
          step="0.1"
          value={delay}
          onChange={changeLFO}
        />
        <label htmlFor="delay">Delay {delay}</label>
      </div>
      <div className="">
        <input
          type="range"
          id="gain"
          max="1"
          min="0"
          step="0.01"
          value={gain}
          onChange={changeLFOVolume}
        />
        <label htmlFor="gain">Gain {gain}</label>
      </div>
    </div>
  );
}
