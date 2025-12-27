import React from "react";
import { LFOSettings } from "../../types/types";

interface LFOComponentProps {
  lfoSettings: LFOSettings;
  handleLFOSettingsChange: (nextLFOSettings: LFOSettings) => void;
}

export default function LFO({
  lfoSettings,
  handleLFOSettingsChange,
}: LFOComponentProps) {
  const { type, rate, depth } = lfoSettings;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    const prop = id.split("-").pop() as keyof LFOSettings;
    const val = parseFloat(e.target.value);
    const nextLFOSettings = {
      ...lfoSettings,
      [prop]: val,
    };
    handleLFOSettingsChange(nextLFOSettings);
  };

  const onTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as LFOSettings["type"];
    const nextLFOSettings = {
      ...lfoSettings,
      type: val,
    };
    handleLFOSettingsChange(nextLFOSettings);
  };
  return (
    <div className="">
      <h2>LFO</h2>
      <div className="">
        <div className="select">
          <label htmlFor="lfo-type">Wave Type</label>
          <select id="lfo-type" value={type} onChange={onTypeChange}>
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="triangle">Triangle</option>
          </select>
        </div>
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
          onChange={onChange}
        />
      </div>
      <div className="">
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
          onChange={onChange}
        />
      </div>
    </div>
  );
}
