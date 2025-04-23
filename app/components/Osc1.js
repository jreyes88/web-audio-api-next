"use client";

import { useContext } from "react";
import { CTX } from "../context/Store";

export default function Osc1() {
  const [state, dispatch] = useContext(CTX);

  const { detune, type } = state.oscillatorSettings;

  const change = (e) => {
    let { id, value } = e.target;
    dispatch({
      type: "CHANGE_OSCILLATOR",
      payload: {
        id,
        value,
      },
    });
  };

  const changeType = (e) => {
    let { id, value } = e.target;
    dispatch({
      type: "CHANGE_OSCILLATOR_TYPE",
      payload: {
        id,
        value,
      },
    });
  };
  return (
    <div className="control">
      <h2 className="">Oscillator 1</h2>
      <div className="param">
        <label htmlFor="detune">Detune</label>
        <input type="range" id="detune" onChange={change} value={detune} />
        <p>{detune}</p>
      </div>
      <div className="param">
        <label htmlFor="type">Wave (Type)</label>
        <select id="type" onChange={changeType} value={type}>
          <option value="sine">Sine</option>
          <option value="square">Square</option>
          <option value="sawtooth">Sawtooth</option>
          <option value="triangle">Triangle</option>
          <option disabled value="custom">
            Custom
          </option>
        </select>
        <p>{type}</p>
      </div>
    </div>
  );
}
