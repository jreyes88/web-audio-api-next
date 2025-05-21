"use client";

import { useContext } from "react";
import { CTX } from "../../context/Store";

export default function Frequency() {
  const [state, dispatch] = useContext(CTX);
  const { frequency } = state;

  const changeFrequency = (e) => {
    const { id, value } = e.target;
    dispatch({
      type: "CHANGE_OSCILLATOR_FREQUENCY",
      payload: {
        id,
        value,
      },
    });
  };
  return (
    <div>
      <p>Frequency</p>
      <input
        type="range"
        min="0"
        max="5000"
        id="frequency"
        value={frequency}
        onChange={changeFrequency}
      />
      <label htmlFor="frequency">Frequency {frequency}</label>
    </div>
  );
}
