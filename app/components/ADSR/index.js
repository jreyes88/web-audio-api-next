"use client";
import { useContext } from "react";
import { CTX } from "../../context/Store";

export default function ADSR() {
  const [state, dispatch] = useContext(CTX);
  const { attack, decay, sustain, release } = state.envelopeSettings;
  const change = (e) => {
    let { id, value } = e.target;
    dispatch({
      type: "CHANGE_ADSR",
      payload: {
        id,
        value,
      },
    });
  };
  return (
    <div className="control">
      <h2>Volume Filter</h2>
      <div className="param">
        <h3>Attack {attack}</h3>
        <input
          type="range"
          id="attack"
          onChange={change}
          max="2"
          step="0.02"
          value={attack}
        />

        <h3>Decay ={decay}</h3>
        <input
          type="range"
          id="decay"
          onChange={change}
          max="1"
          step="0.01"
          value={decay}
        />

        <h3>Sustain {sustain}</h3>
        <input
          type="range"
          id="sustain"
          onChange={change}
          max="1"
          step="0.01"
          value={sustain}
        />

        <h3>Release {release}</h3>
        <input
          type="range"
          id="release"
          onChange={change}
          max="2000"
          step="0.02"
          value={release}
        />
      </div>
    </div>
  );
}
