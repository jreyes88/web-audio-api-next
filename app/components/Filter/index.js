"use client";

import { useContext } from "react";
import { CTX } from "../../context/Store";
import styles from "./Filter.module.scss";

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
    <div className={styles["filter"]}>
      <h2>Filter</h2>
      <div className="">
        <input
          onChange={change}
          type="range"
          id="frequency"
          value={frequency}
          max="1000"
        />
        <label htmlFor="frequency">Frequency {frequency}</label>
      </div>
      <div className="">
        <input
          type="range"
          onChange={change}
          id="detune"
          value={detune}
          min="-100"
          max="100"
        />
        <label htmlFor="detune">Detune {detune}</label>
      </div>
      {/* Q is used for Lowpass and Highpass */}
      <div className="">
        <input
          type="range"
          onChange={change}
          id="Q"
          max="10"
          value={Q}
          step="0.1"
          disabled={isLowshelfOrHighshelf(type) === true ? true : false}
        />
        <label htmlFor="Q">Q {Q}</label>
        <p>Lowpass, Highpass, and Notch only</p>
      </div>

      {/* Gain is used for Lowshelf and Highshelf */}
      <div className="">
        <input
          type="range"
          onChange={change}
          id="gain"
          max="10"
          value={gain}
          step="0.1"
          disabled={isLowshelfOrHighshelf(type) === true ? false : true}
        />
        <label htmlFor="gain">Gain {gain}</label>
        <p>Lowshelf and Highshelf only</p>
      </div>

      <div className="">
        <label htmlFor="type">Filter (Type)</label>
        <select id="type" value={type} onChange={changeType}>
          <option value="lowpass">Lowpass</option>
          <option value="highpass">Highpass</option>
          <option value="notch">Notch</option>
          <option value="lowshelf">Lowshelf</option>
          <option value="highshelf">Highshelf</option>
        </select>
      </div>
    </div>
  );
}
