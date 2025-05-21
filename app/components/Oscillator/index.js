"use client";
import styles from "./Oscillator.module.scss";

import { useContext } from "react";
import { CTX } from "../../context/Store";

export default function Oscillator({ version }) {
  const [state, dispatch] = useContext(CTX);
  const { detune, type, volume } = state.oscillator1Settings;

  const changeDetune = (e) => {
    const { id, value } = e.target;
    dispatch({
      type: "CHANGE_OSCILLATOR",
      payload: {
        id,
        value,
      },
    });
  };

  const changeType = (e) => {
    const { id, value } = e.target;
    dispatch({
      type: "CHANGE_OSCILLATOR_TYPE",
      payload: { id, value },
    });
  };

  const changeVolume = (e) => {
    let { id, value } = e.target;
    dispatch({
      type: "CHANGE_OSCILLATOR_VOLUME",
      payload: {
        id,
        value,
      },
    });
  };

  return (
    <div
      className={`${styles["oscillator"]} ${styles[`oscillator${version}`]}`}
    >
      <h2>Oscillator {version}</h2>
      <div className="">
        <input
          type="range"
          min="-10"
          max="10"
          id="detune"
          value={detune}
          onChange={changeDetune}
        />
        <label htmlFor="detune">Detune {detune}</label>
      </div>
      <div className="">
        <label htmlFor="type">Wave Type</label>
        <select id="type" value={type} onChange={changeType}>
          <option value="sine">sine</option>
          <option value="square">square</option>
          <option value="sawtooth">sawtooth</option>
          <option value="triangle">triangle</option>
        </select>
      </div>
      <div className="">
        <input
          type="range"
          id="volume"
          max="2"
          min="0"
          step="0.1"
          onChange={changeVolume}
        />
        <label htmlFor="volume">Volume {volume}</label>
      </div>
    </div>
  );
}
