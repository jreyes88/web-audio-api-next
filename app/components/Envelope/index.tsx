import React from "react";
import { EnvelopeSettings } from "../../types/types";
import styles from "./Envelope.module.scss";

interface EnvelopeComponentProps {
  envelopeSettings: EnvelopeSettings;
  handleEnvelopeSettingsChange: (vals: EnvelopeSettings) => void;
  variant: string;
}

export default function Envelope({
  envelopeSettings,
  handleEnvelopeSettingsChange,
  variant,
}: EnvelopeComponentProps) {
  const { attack, decay, sustain, release } = envelopeSettings;
  const onChange = (e) => {
    const prop = e.target.id;
    const val = parseFloat(e.target.value);
    const nextEnvelopeSettings = {
      ...envelopeSettings,
      [prop]: val,
    };
    handleEnvelopeSettingsChange(nextEnvelopeSettings);
  };

  return (
    <div
      className={`module ${styles[`${variant.toLocaleLowerCase()}-envelope`]}`}
    >
      <div className="header">
        <h2>{variant} envelope</h2>
      </div>
      <div className="controls">
        <div className="range-container">
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
        <div className="range-container">
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
        <div className="range-container">
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
        <div className="range-container">
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
    </div>
  );
}
