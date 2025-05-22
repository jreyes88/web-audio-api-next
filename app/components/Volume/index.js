"use client";
import styles from "./Volume.module.scss";

import { useContext } from "react";
import { CTX } from "../../context/Store";

export default function Volume() {
  const [state, dispatch] = useContext(CTX);
  const { volume } = state.masterGainSettings;

  const changeVolume = (e) => {
    let { id, value } = e.target;
    dispatch({
      type: "CHANGE_MASTER_GAIN_VOLUME",
      payload: {
        id,
        value,
      },
    });
  };

  return (
    <div className={styles["volume"]}>
      <h2>Volume</h2>
      <div className="">
        <label htmlFor="volume">
          Volume <span className="right">{volume}</span>
        </label>
        <input
          type="range"
          id="volume"
          max="2"
          min="0"
          step="0.1"
          onChange={changeVolume}
        />
      </div>
    </div>
  );
}
