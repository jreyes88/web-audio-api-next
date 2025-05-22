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
        <label htmlFor="attack">
          Attack <span className="right">{attack}</span>
        </label>
        <input
          onChange={change}
          type="range"
          value={attack}
          min="0"
          max="2"
          step="0.1"
          id="attack"
        />
      </div>
      <div className="">
        <label htmlFor="decay">
          Decay <span className="right">{decay}</span>
        </label>
        <input
          onChange={change}
          type="range"
          value={decay}
          min="0"
          max="1"
          step="0.01"
          id="decay"
        />
      </div>
      <div className="">
        <label htmlFor="sustain">
          Sustain <span className="right">{sustain}</span>
        </label>
        <input
          onChange={change}
          type="range"
          value={sustain}
          min="0"
          max="1"
          step="0.01"
          id="sustain"
        />
      </div>
      <div className="">
        <label htmlFor="release">
          Release <span className="right">{release}</span>
        </label>
        <input
          onChange={change}
          type="range"
          value={release}
          min="0"
          max="2"
          step="0.01"
          id="release"
        />
      </div>
    </div>
  );
}
