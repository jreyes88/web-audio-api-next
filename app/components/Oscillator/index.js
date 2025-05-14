"use client";

import { useContext, useId } from "react";
import { CTX } from "../../context/Store";
import styles from "./Oscillator.module.scss";

export default function Oscillator({ version }) {
  const [state, dispatch] = useContext(CTX);
  // const { gain, noise } = state.lfoSettings;

  const uniqueId = useId();

  const { type, octave } = state[`oscillator${version}Settings`];

  const { volume } = state[`oscillator${version}GainSettings`];

  const changeType = (e) => {
    let { id, value } = e.target;
    const actualId = id.split("-").pop();
    dispatch({
      type: "CHANGE_OSCILLATOR_TYPE",
      payload: {
        id: actualId,
        value,
        version,
      },
    });
  };

  // const changeLFOGain = (e) => {
  //   let { id, value } = e.target;
  //   dispatch({
  //     type: "CHANGE_LFO",
  //     payload: {
  //       id,
  //       value,
  //       version,
  //     },
  //   });
  // };

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

  return (
    <div className="control">
      <h2>Oscillator {version}</h2>
      <div className="">
        <label htmlFor={`${uniqueId}-type`}>Wave Type</label>
        <select id={`${uniqueId}-type`} value={type} onChange={changeType}>
          <option value="sine">sine</option>
          <option value="square">square</option>
          <option value="sawtooth">sawtooth</option>
          <option value="triangle">triangle</option>
        </select>
      </div>
      <div className="">
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
      {/* <div className="">
        <input
          type="range"
          id={`${uniqueId}-noise`}
          max="1"
          min="0"
          step="0.1"
          value={noise}
          onChange={changeLFOGain}
          className={styles.slider}
        />
        <label htmlFor={`${uniqueId}-noise`} className={styles.label}>
          Noise {noise}
        </label>
      </div> */}
      <div className="">
        <input
          type="range"
          id={`${uniqueId}-volume`}
          max="2"
          min="0"
          step="0.1"
          value={volume}
          onChange={changeVolume}
          className={styles.slider}
        />
        <label htmlFor={`${uniqueId}-volume`} className={styles.label}>
          volume {volume}
        </label>
      </div>
    </div>
  );
}
