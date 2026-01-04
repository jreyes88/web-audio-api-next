import React, { useId } from "react";
import { EnvelopeSettings } from "../../types/types";
import styles from "./Envelope.module.scss";

interface EnvelopeComponentProps {
  envelopeSettings: EnvelopeSettings;
  handleEnvelopeSettingsChange: (vals: EnvelopeSettings) => void;
  variant: string;
  handleExportPreset: () => void;
  handleImportPreset: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Envelope({
  envelopeSettings,
  handleEnvelopeSettingsChange,
  variant,
  handleExportPreset,
  handleImportPreset,
}: EnvelopeComponentProps) {
  const uniqueId = useId();
  const { attack, decay, sustain, release } = envelopeSettings;
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    const prop = id.split("-").pop() as keyof EnvelopeSettings;
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
          <label htmlFor={`${uniqueId}-attack`}>
            Attack <span className="right">{attack}</span>
          </label>
          <input
            onChange={onChange}
            type="range"
            value={attack}
            min="0"
            max="2"
            step="0.1"
            id={`${uniqueId}-attack`}
          />
        </div>
        <div className="range-container">
          <label htmlFor={`${uniqueId}-decay`}>
            Decay <span className="right">{decay}</span>
          </label>
          <input
            onChange={onChange}
            type="range"
            value={decay}
            min="0"
            max="1"
            step="0.01"
            id={`${uniqueId}-decay`}
          />
        </div>
        <div className="range-container">
          <label htmlFor={`${uniqueId}-sustain`}>
            Sustain <span className="right">{sustain}</span>
          </label>
          <input
            onChange={onChange}
            type="range"
            value={sustain}
            min="0"
            max="1"
            step="0.01"
            id={`${uniqueId}-sustain`}
          />
        </div>
        <div className="range-container">
          <label htmlFor={`${uniqueId}-release`}>
            Release <span className="right">{release}</span>
          </label>
          <input
            onChange={onChange}
            type="range"
            value={release}
            min="0"
            max="2"
            step="0.01"
            id={`${uniqueId}-release`}
          />
        </div>
      </div>
      {variant.toLocaleLowerCase() === "gain" && (
        <>
          <div className="header">
            <h2>Export / Import presets</h2>
          </div>
          <div className="controls">
            <div className="button-container">
              <button onClick={handleExportPreset}>Export preset</button>
            </div>
            <div className="button-container">
              <label className="import">
                Import preset
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportPreset}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
