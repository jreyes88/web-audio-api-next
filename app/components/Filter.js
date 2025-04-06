"use client";

import { useContext } from "react";
import { CTX } from "../context/Store";

export default function Filter() {
  const [state, dispatch] = useContext(CTX);

  const { frequency, detune, Q, gain, type } = state.filterSettings;

  const change = (e) => {
    let { id, value } = e.target;
    dispatch({
      type: "CHANGE_FILTER",
      payload: {
        id,
        value,
      },
    });
  };

  const changeType = (e) => {
    let { id, value } = e.target;
    dispatch({
      type: "CHANGE_FILTER_TYPE",
      payload: {
        id,
        value,
      },
    });
  };

  function isLowshelfOrHighshelf(type) {
    if (type === "lowshelf") {
      return true;
    }
    if (type === "highshelf") {
      return true;
    }
    return false;
  }
  return (
    <div className="control">
      <h2>Filter</h2>
      <div className="param">
        <h3>Frequency</h3>
        <input
          type="range"
          onChange={change}
          id="frequency"
          value={frequency}
          max="10000"
        />
        <p>{frequency}</p>
      </div>
      <div className="param">
        <h3>Detune</h3>
        <input type="range" onChange={change} id="detune" value={detune} />
      </div>
      {isLowshelfOrHighshelf(type) === false && (
        <div className="param">
          <h3>Q</h3>
          <input
            type="range"
            onChange={change}
            id="Q"
            max="10"
            value={Q}
            step="0.1"
          />
          <p>{Q}</p>
        </div>
      )}
      {isLowshelfOrHighshelf(type) === true && (
        <div className="param">
          <h3>Gain</h3>
          <input
            type="range"
            onChange={change}
            id="gain"
            max="10"
            value={gain}
            step="0.1"
          />
          <p>{gain}</p>
        </div>
      )}

      <div className="param">
        <label htmlFor="type">Filter (Type)</label>
        <select id="type" value={type} onChange={changeType}>
          <option value="lowpass">Lowpass</option>
          <option value="highpass">Highpass</option>
          <option value="notch">Notch</option>
          <option value="lowshelf">Lowshelf</option>
          <option value="highshelf">Highshelf</option>
        </select>
        <p>{type}</p>
      </div>
    </div>
  );
}
