"use client";
import styles from "./Oscillator.module.scss";

import { useContext, useId } from "react";
import { CTX } from "../../context/Store";

export default function Oscillator({ version }) {
  const [state, dispatch] = useContext(CTX);
  const uniqueId = useId();
  const { detune, type, volume, octave } =
    state[`oscillator${version}Settings`];

  const changeDetune = (e) => {
    const { id, value } = e.target;
    const actualId = id.split("-").pop();
    dispatch({
      type: "CHANGE_OSCILLATOR",
      payload: {
        id: actualId,
        value,
        version,
      },
    });
  };

  const changeType = (e) => {
    const { id, value } = e.target;
    const actualId = id.split("-").pop();
    dispatch({
      type: "CHANGE_OSCILLATOR_TYPE",
      payload: { id: actualId, value, version },
    });
  };

  const changeVolume = (e) => {
    let { id, value } = e.target;
    const actualId = id.split("-").pop();
    dispatch({
      type: "CHANGE_OSCILLATOR_VOLUME",
      payload: {
        id: actualId,
        value,
        version,
      },
    });
  };

  const changeOctave = (e) => {
    let { id, value } = e.target;
    const actualId = id.split("-").pop();
    dispatch({
      type: "CHANGE_OSCILLATOR_OCTAVE",
      payload: {
        id: actualId,
        value,
        version,
      },
    });
  };

  return (
    <div className={`${styles[`oscillator${version}`]}`}>
      <h2>Oscillator {version}</h2>
      <div className={`${styles["selects"]}`}>
        <div className="select">
          <label htmlFor={`${uniqueId}-type`}>Wave Type</label>
          <select id={`${uniqueId}-type`} value={type} onChange={changeType}>
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="triangle">Triangle</option>
          </select>
        </div>
        <div className="select">
          <label htmlFor={`${uniqueId}-octave`}>Octave</label>
          <select
            id={`${uniqueId}-octave`}
            value={octave}
            onChange={changeOctave}
          >
            <option value="32">32</option>
            <option value="16">16</option>
            <option value="8">8</option>
            <option value="4">4</option>
            <option value="2">2</option>
          </select>
        </div>
      </div>
      <div className={`${styles["slider"]}`}>
        <label htmlFor={`${uniqueId}-detune`}>
          Detune <span className="right">{detune}</span>
        </label>
        <input
          type="range"
          min="-10"
          max="10"
          id={`${uniqueId}-detune`}
          value={detune}
          onChange={changeDetune}
        />
      </div>
      <div className="">
        <label htmlFor={`${uniqueId}-volume`}>
          Volume <span className="right">{volume}</span>
        </label>
        <input
          type="range"
          id={`${uniqueId}-volume`}
          max="2"
          min="0"
          step="0.1"
          onChange={changeVolume}
        />
      </div>
    </div>
  );
}
