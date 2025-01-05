"use client";
import { useContext } from "react";
import { CTX } from "../../context/Store";

export default function LFO() {
  const [appState, updateState] = useContext(CTX);
  const { frequency } = appState.lfoSettings;
  const change = (e) => {
    let { id, value } = e.target;
    updateState({
      type: "CHANGE_LFO",
      payload: {
        id,
        value,
      },
    });
  };
  return (
    <div>
      <h2>LFO</h2>
      {/* slider 1: 0.1 to 15 */}
      <label htmlFor="frequency">Frequency (Rate)</label>
      <input
        type="range"
        id="frequency"
        max="15"
        min="0.1"
        step="0.1"
        value={frequency}
        onChange={change}
      />
    </div>
  );
}
