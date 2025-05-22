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
      <div className={styles["filter-layout"]}>
        <div className="">
          <div className="select">
            <label htmlFor="type">Filter Type</label>
            <select id="type" value={type} onChange={changeType}>
              <option value="lowpass">Lowpass</option>
              <option value="highpass">Highpass</option>
              <option value="notch">Notch</option>
              <option value="lowshelf">Lowshelf</option>
              <option value="highshelf">Highshelf</option>
            </select>
          </div>
          <div className="">
            <label htmlFor="frequency">
              Frequency <span className="right">{frequency}</span>
            </label>
            <input
              onChange={change}
              type="range"
              id="frequency"
              value={frequency}
              max="1000"
            />
          </div>
          <div className="">
            <label htmlFor="detune">
              Detune <span className="right">{detune}</span>
            </label>
            <input
              type="range"
              onChange={change}
              id="detune"
              value={detune}
              min="-100"
              max="100"
            />
          </div>
        </div>
        <div className="" style={{ marginTop: "auto" }}>
          {/* Q is used for Lowpass and Highpass */}
          <div className="">
            <label htmlFor="Q">
              Q <span className="helper"> - Lowpass, Highpass, Notch</span>
              <span className="right">{Q}</span>
            </label>
            <input
              type="range"
              onChange={change}
              id="Q"
              max="10"
              value={Q}
              step="0.1"
              disabled={isLowshelfOrHighshelf(type) === true ? true : false}
            />
          </div>

          {/* Gain is used for Lowshelf and Highshelf */}
          <div className="">
            <label htmlFor="gain">
              Gain <span className="helper"> - Lowshelf, Highshelf</span>
              <span className="right">{gain}</span>
            </label>
            <input
              type="range"
              onChange={change}
              id="gain"
              max="10"
              value={gain}
              step="0.1"
              disabled={isLowshelfOrHighshelf(type) === true ? false : true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
