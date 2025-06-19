"use client";

import { useContext } from "react";
import { CTX } from "../../context/Store";
import styles from "./LFO.module.scss";

export default function LFO() {
  const [state, dispatch] = useContext(CTX);
  const { rate, delay, gain, type } = state.lfoSettings;
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
  const changeLFOType = (e) => {
    const { id, value } = e.target;
    dispatch({
      type: "CHANGE_LFO_TYPE",
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
        <div className="select">
          <label htmlFor={`lfo-type`}>Wave Type</label>
          <select id={`lfo-type`} value={type} onChange={changeLFOType}>
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="triangle">Triangle</option>
          </select>
        </div>
        <label htmlFor="rate">
          Rate <span className="right">{rate}</span>
        </label>
        <input
          type="range"
          id="rate"
          max="15"
          min="0.1"
          step="0.1"
          value={rate}
          onChange={changeLFO}
        />
      </div>
      <div className="">
        <label htmlFor="delay">
          Delay <span className="right">{delay}</span>
        </label>
        <input
          type="range"
          id="delay"
          max="2"
          min="0"
          step="0.1"
          value={delay}
          onChange={changeLFO}
        />
      </div>
      <div className="">
        <label htmlFor="gain">
          Gain <span className="right">{gain}</span>
        </label>
        <input
          type="range"
          id="gain"
          max="1"
          min="0"
          step="0.01"
          value={gain}
          onChange={changeLFOVolume}
        />
      </div>
    </div>
  );
}
