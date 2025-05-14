"use client";

import { useContext } from "react";
import { CTX } from "../../context/Store";
import styles from "./Volume.module.scss";

export default function Volume() {
  const [state, dispatch] = useContext(CTX);
  const { volume } = state.gainSettings;

  const changeVolume = (e) => {
    let { id, value } = e.target;
    dispatch({
      type: "CHANGE_MAIN_VOLUME",
      payload: { id, value },
    });
  };

  return (
    <div className="control">
      <h2>Volume</h2>
      <div className="">
        <input
          type="range"
          id="volume"
          max="2"
          min="0"
          step="0.1"
          value={volume}
          onChange={changeVolume}
        />
        <label htmlFor="volume" className={styles.label}>
          Volume {volume}
        </label>
      </div>
    </div>
  );
}
