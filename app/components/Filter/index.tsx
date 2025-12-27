import React from "react";
import { FilterSettings } from "../../types/types";

interface FilterComponentProps {
  filterSettings: FilterSettings;
  handleFilterSettingsChange: (nextFiltersettings: FilterSettings) => void;
}

export default function Filter({
  filterSettings,
  handleFilterSettingsChange,
}: FilterComponentProps) {
  const { type, frequency, detune, Q, gain } = filterSettings;

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
    const val = parseFloat(e.target.value);
    const nextFilterSettings = {
      ...filterSettings,
      [prop]: val,
    };
    handleFilterSettingsChange(nextFilterSettings);
  };

  return (
    <div className="">
      <h2>Filter</h2>
      <div className="">
        <div className="">
          <div className="select">
            <label htmlFor="type">Filter Type</label>
            <select id="type" value={type} onChange={onTypeChange}>
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
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
