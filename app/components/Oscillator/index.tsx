import React from "react";
import { useId } from "react";
import { OscillatorSettings } from "../../types/types";
import styles from "./Oscillator.module.scss";

interface OscillatorComponentProps {
  version: number;
  oscillatorSettings: OscillatorSettings;
  handleOscillatorSettingsChange: (
    version: number,
    vals: OscillatorSettings
  ) => void;
}

export default function Oscillator({
  version,
  oscillatorSettings,
  handleOscillatorSettingsChange,
}: OscillatorComponentProps) {
  const uniqueId = useId();
  const { type, octave, detune, volume, isMuted } = oscillatorSettings;

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const id = e.target.id;
    const prop = id.split("-").pop();
    const val = parseFloat(e.target.value);
    const nextOscillatorSettings = {
      ...oscillatorSettings,
      [prop]: val,
    };
    handleOscillatorSettingsChange(version, nextOscillatorSettings);
  };

  const onTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.id;
    const prop = id.split("-").pop();
    const val = e.target.value;
    const nextOscillatorSettings = {
      ...oscillatorSettings,
      [prop]: val,
    };
    handleOscillatorSettingsChange(version, nextOscillatorSettings);
  };

  const onMuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextOscillatorSettings = {
      ...oscillatorSettings,
      isMuted: e.target.checked,
    };
    handleOscillatorSettingsChange(version, nextOscillatorSettings);
  };

  return (
    <div className={styles["oscillator"]}>
      <div className={styles["oscillator-header"]}>
        <h2 className="lowercase">Oscillator {version}</h2>
        <label htmlFor={`${uniqueId}-mute`}>Mute</label>
        <input
          id={`${uniqueId}-mute`}
          type="checkbox"
          checked={isMuted}
          onChange={onMuteChange}
        />
      </div>
      <div className={styles["oscillator-controls"]}>
        <div className="select">
          <label htmlFor={`${uniqueId}-type`}>Wave Type</label>
          <select
            id={`${uniqueId}-type`}
            value={type}
            onChange={onTypeChange}
            className="select"
          >
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="triangle">Triangle</option>
          </select>
        </div>
        <div className="select">
          <label htmlFor={`${uniqueId}-octave`}>Octave</label>
          <select id={`${uniqueId}-octave`} value={octave} onChange={onChange}>
            <option value="32">32</option>
            <option value="16">16</option>
            <option value="8">8</option>
            <option value="4">4</option>
            <option value="2">2</option>
          </select>
        </div>
        <div className="">
          <label htmlFor={`${uniqueId}-detune`}>
            Detune <span className="right">{detune}</span>
          </label>
          <input
            type="range"
            min="-10"
            max="10"
            id={`${uniqueId}-detune`}
            value={detune}
            onChange={onChange}
          />
        </div>
        <div className="">
          <label htmlFor={`${uniqueId}-volume`}>
            Volume <span className="right">{volume}</span>
          </label>
          <input
            type="range"
            id={`${uniqueId}-volume`}
            max="0.4"
            min="0.3"
            step="0.01"
            value={volume}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}
