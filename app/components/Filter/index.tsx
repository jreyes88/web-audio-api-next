import React from "react";
import { FilterSettings } from "../../types/types";
import styles from "./Filter.module.scss";

interface FilterComponentProps {
  filterSettings: FilterSettings;
  handleFilterSettingsChange: (nextFiltersettings: FilterSettings) => void;
}

export default function Filter({
  filterSettings,
  handleFilterSettingsChange,
}: FilterComponentProps) {
  const { type, frequency, detune, Q, gain, filterEnvAmount } = filterSettings;

  const MIN_FREQ = 20;
  const MAX_FREQ = 18000;

  const toLog = (val: number) => {
    const minF = Math.log(MIN_FREQ);
    const maxF = Math.log(MAX_FREQ);
    const scale = maxF - minF;
    return Math.round(Math.exp(minF + scale * val));
  };

  const fromLog = (freq: number) => {
    const minF = Math.log(MIN_FREQ);
    const maxF = Math.log(MAX_FREQ);
    const scale = maxF - minF;
    return (Math.log(freq) - minF) / scale;
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

  const onTypeChange = (e) => {
    const prop = e.target.id;
    const val = e.target.value;
    const nextFilterSettings = {
      ...filterSettings,
      [prop]: val,
    };
    handleFilterSettingsChange(nextFilterSettings);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const prop = e.target.id;
    let val = parseFloat(e.target.value);

    if (prop === "frequency") {
      val = toLog(val);
    }

    const nextFilterSettings = {
      ...filterSettings,
      [prop]: val,
    };
    handleFilterSettingsChange(nextFilterSettings);
  };

  return (
    <div className={`module ${styles["filter"]}`}>
      <div className="header">
        <h2>Filter</h2>
      </div>
      <div className="controls">
        <div className="">
          <div className="select-container">
            <label htmlFor="type">Filter Type</label>
            <select id="type" value={type} onChange={onTypeChange}>
              <option value="lowpass">Lowpass</option>
              <option value="highpass">Highpass</option>
              <option value="notch">Notch</option>
              <option value="lowshelf">Lowshelf</option>
              <option value="highshelf">Highshelf</option>
            </select>
          </div>
          <div className="range-container">
            <label htmlFor="frequency">
              Frequency <span className="right">{frequency}</span>
            </label>
            <input
              onChange={onChange}
              type="range"
              id="frequency"
              value={fromLog(frequency)}
              min="0"
              max="1"
              step="0.001"
            />
          </div>
          <div className="range-container">
            <label htmlFor="detune">
              Detune <span className="right">{detune}</span>
            </label>
            <input
              type="range"
              onChange={onChange}
              id="detune"
              value={detune}
              min="-100"
              max="100"
            />
          </div>
        </div>
        <div className="">
          {/* Q is used for Lowpass and Highpass */}
          <div className="range-container">
            <label htmlFor="Q">
              Q <span className="helper"> - Lowpass, Highpass, Notch</span>
              <span className="right">{Q}</span>
            </label>
            <input
              type="range"
              onChange={onChange}
              id="Q"
              max="10"
              value={Q}
              step="0.1"
              disabled={isLowshelfOrHighshelf(type) === true ? true : false}
            />
          </div>
          {/* Gain is used for Lowshelf and Highshelf */}
          <div className="range-container">
            <label htmlFor="gain">
              Gain <span className="helper"> - Lowshelf, Highshelf</span>
              <span className="right">{gain}</span>
            </label>
            <input
              type="range"
              onChange={onChange}
              id="gain"
              max="10"
              value={gain}
              step="0.1"
              disabled={isLowshelfOrHighshelf(type) === true ? false : true}
            />
          </div>
        </div>
        <div className="">
          <div className="range-container">
            <label htmlFor="filterEnvAmount">
              Env Amount <span className="right">{filterEnvAmount}</span>
            </label>
            <input
              type="range"
              id="filterEnvAmount"
              min="0"
              max="10000"
              step="100"
              value={filterEnvAmount}
              onChange={onChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
