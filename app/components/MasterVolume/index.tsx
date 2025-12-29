import React from "react";
import styles from "./MasterVolume.module.scss";

interface MasterVolumeProps {
  masterVolume: number;
  handleMasterVolumeChange: (val: number) => void;
}

export default function MasterVolume({
  masterVolume,
  handleMasterVolumeChange,
}: MasterVolumeProps) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleMasterVolumeChange(parseFloat(e.target.value));
  };
  return (
    <div className={`module ${styles["master-volume"]}`}>
      <div className="header">
        <h2>Volume</h2>
      </div>
      <div className="controls">
        <div className="range-container">
          <label htmlFor="volume">
            Master Volume <span className="right">{masterVolume}</span>
          </label>
          <input
            type="range"
            id="volume"
            max="2"
            min="0"
            step="0.1"
            value={masterVolume}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}
