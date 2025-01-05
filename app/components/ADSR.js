"use client";
import { useContext } from "react";
import { CTX } from "../context/Store";

export default function ADSR() {
  const [appState, updateState] = useContext(CTX);
  const { attack, decay, sustain, release } = appState.envelope;
  const change = (e) => {
    let { id, value } = e.target;
    updateState({
      type: "CHANGE_ADSR",
      payload: {
        id,
        value,
      },
    });
  };
  return (
    <div className="control">
      <h2>ADSR</h2>
      <div className="param">
        <h3>Attack</h3>
        <input
          type="range"
          id="attack"
          onChange={change}
          max="2"
          step="0.02"
          value={attack}
        />

        <h3>Decay</h3>
        <input
          type="range"
          id="decay"
          onChange={change}
          max="1"
          step="0.01"
          value={decay}
        />

        <h3>Sustain</h3>
        <input
          type="range"
          id="sustain"
          onChange={change}
          max="1"
          step="0.01"
          value={sustain}
        />

        <h3>Release</h3>
        <input
          type="range"
          id="release"
          onChange={change}
          max="2"
          step="0.02"
          value={release}
        />
      </div>
    </div>
  );
}
