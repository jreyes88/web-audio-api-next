import React from "react";
import { EnvelopeSettings } from "../../types/types";

interface EnvelopeComponentProps {
  envelopeVals: EnvelopeSettings;
  handleEnvelopeSettingsChange: (vals: EnvelopeSettings) => void;
}

export default function Envelope({
  envelopeVals,
  handleEnvelopeSettingsChange,
}: EnvelopeComponentProps) {
  const { attack, decay, sustain, release } = envelopeVals;
  const onChange = (e) => {
    const prop = e.target.id;
    const val = parseFloat(e.target.value);
    const nextEnvelopeVals = {
      ...envelopeVals,
      [prop]: val,
    };
    handleEnvelopeSettingsChange(nextEnvelopeVals);
  };
  return (
    <div className="">
      <h2>Envelope</h2>
      <div className="">
        <label htmlFor="attack">
          Attack <span className="right">{attack}</span>
        </label>
        <input
          onChange={onChange}
          type="range"
          value={attack}
          min="0"
          max="2"
          step="0.1"
          id="attack"
        />
      </div>
      <div className="">
        <label htmlFor="decay">
          Decay <span className="right">{decay}</span>
        </label>
        <input
          onChange={onChange}
          type="range"
          value={decay}
          min="0"
          max="1"
          step="0.01"
          id="decay"
        />
      </div>
      <div className="">
        <label htmlFor="sustain">
          Sustain <span className="right">{sustain}</span>
        </label>
        <input
          onChange={onChange}
          type="range"
          value={sustain}
          min="0"
          max="1"
          step="0.01"
          id="sustain"
        />
      </div>
      <div className="">
        <label htmlFor="release">
          Release <span className="right">{release}</span>
        </label>
        <input
          onChange={onChange}
          type="range"
          value={release}
          min="0"
          max="2"
          step="0.01"
          id="release"
        />
      </div>
    </div>
  );
}
