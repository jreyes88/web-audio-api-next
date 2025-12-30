import React from "react";
import { LFOSettings } from "../../types/types";
import styles from "./VolumeLFO.module.scss";

interface VolumeLFOComponentProps {
  masterVolume: number;
  handleMasterVolumeChange: (val: number) => void;
  lfoSettings: LFOSettings;
  handleLFOSettingsChange: (nextLFOSettings: LFOSettings) => void;
}

export default function VolumeLFO({
  masterVolume,
  handleMasterVolumeChange,
  lfoSettings,
  handleLFOSettingsChange,
}: VolumeLFOComponentProps) {
  const { type, rate, depth } = lfoSettings;

  const onVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleMasterVolumeChange(parseFloat(e.target.value));
  };

  const onLFOChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    const prop = id.split("-").pop() as keyof LFOSettings;
    const val = parseFloat(e.target.value);
    const nextLFOSettings = {
      ...lfoSettings,
      [prop]: val,
    };
    handleLFOSettingsChange(nextLFOSettings);
  };

  const onLFOTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as LFOSettings["type"];
    const nextLFOSettings = {
      ...lfoSettings,
      type: val,
    };
    handleLFOSettingsChange(nextLFOSettings);
  };

  return (
    <div className={`module ${styles["volume-lfo"]}`}>
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
            onChange={onVolumeChange}
          />
        </div>
      </div>
      <div className="header">
        <h2>LFO</h2>
      </div>
      <div className="controls">
        <div className="select-container">
          <label htmlFor="lfo-type">Wave Type</label>
          <select id="lfo-type" value={type} onChange={onLFOTypeChange}>
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="triangle">Triangle</option>
          </select>
        </div>
        <div className="range-container">
          <label htmlFor="lfo-rate">
            Rate <span className="right">{rate}</span>
          </label>
          <input
            type="range"
            id="lfo-rate"
            max="5"
            min="0"
            step="0.1"
            value={rate}
            onChange={onLFOChange}
          />
        </div>
        <div className="range-container">
          <label htmlFor="lfo-depth">
            Depth <span className="right">{depth}</span>
          </label>
          <input
            type="range"
            id="lfo-depth"
            max="20"
            min="0"
            step="1"
            value={depth}
            onChange={onLFOChange}
          />
        </div>
      </div>
    </div>
  );
}
