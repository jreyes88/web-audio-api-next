"use client";

import { useContext } from "react";
import { CTX } from "../../context/Store";

export default function Osc1() {
  const [appState, updateState] = useContext(CTX);

  const { type } = appState.osc1Settings;

  const changeType = (e) => {
    let { id, value } = e.target;
    updateState({
      type: "CHANGE_OSC1_TYPE",
      payload: {
        id,
        value,
      },
    });
  };
  return (
    <div className="control">
      <h2 className="">Waveform</h2>
      <div className="param">
        <label htmlFor="type">Wave (Type)</label>
        <select id="type" onChange={changeType} value={type}>
          <option value="sine">Sine</option>
          <option value="square">Square</option>
          <option value="sawtooth">Sawtooth</option>
          <option value="triangle">Triangle</option>
        </select>
      </div>
    </div>
  );
}