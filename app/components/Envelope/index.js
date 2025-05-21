"use client";

import { useContext } from "react";
import { CTX } from "../../context/Store";
import styles from "./Envelope.module.scss";

export default function Envelope() {
  const [state, dispatch] = useContext(CTX);
  const { attack, decay, sustain, release } = state.envelopeSettings;
  const change = (e) => {
    let { id, value } = e.target;
    dispatch({
      type: "CHANGE_ENVELOPE",
      payload: {
        id,
        value,
      },
    });
  };
  return (
    <div className={styles["envelope"]}>
      <h2>Envelope</h2>
      <div className="">
        <input
          onChange={change}
          type="range"
          value={attack}
          min="0"
          max="2"
          step="0.1"
          id="attack"
        />
        <label htmlFor="attack">Attack {attack}</label>
      </div>
      <div className="">
        <input
          onChange={change}
          type="range"
          value={decay}
          min="0"
          max="1"
          step="0.01"
          id="decay"
        />
        <label htmlFor="decay">Decay {decay}</label>
      </div>
      <div className="">
        <input
          onChange={change}
          type="range"
          value={sustain}
          min="0"
          max="1"
          step="0.01"
          id="sustain"
        />
        <label htmlFor="sustain">Sustain {sustain}</label>
      </div>
      <div className="">
        <input
          onChange={change}
          type="range"
          value={release}
          min="0"
          max="2"
          step="0.01"
          id="release"
        />
        <label htmlFor="release">Release {release}</label>
      </div>
    </div>
  );
}
