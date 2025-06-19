"use client";

import { createContext, useReducer } from "react";
import Oscillator from "./Oscillator";

const CTX = createContext();

export { CTX };

const initialState = {
  frequency: 440,
  easing: 0.005,
  masterGainSettings: {
    volume: 1,
  },
  oscillator1Settings: {
    detune: 0,
    type: "square",
    volume: 1,
    octave: "8",
  },
  oscillator2Settings: {
    detune: 0,
    type: "sawtooth",
    octave: 4,
    volume: 1,
  },
  oscillator3Settings: {
    detune: 0,
    type: "triangle",
    octave: 16,
    volume: 1,
  },
  filter: null,
  filterSettings: {
    frequency: 350,
    detune: 0,
    Q: 1,
    gain: 0,
    type: "lowpass",
  },
  envelopeSettings: {
    attack: 0.1,
    decay: 0.24,
    sustain: 0.44, // sustain is a volume
    release: 0.56,
  },
  lfoSettings: {
    rate: 0.1,
    delay: 0,
    gain: 0,
    noise: 0.31,
    type: "square",
  },
  audioContext: null,
  lfo: null,
  lfoGain: null,
};

let nodes = [];

function octaveToFrequency(baseFrequency, octave) {
  let frequency = baseFrequency;

  switch (octave) {
    case "2":
      frequency = baseFrequency * 4;
      break;
    case "4":
      frequency = baseFrequency * 2;
      break;
    case "16":
      frequency = baseFrequency / 2;
      break;
    case "32":
      frequency = baseFrequency / 4;
      break;
    case "64":
      frequency = baseFrequency / 8;
      break;
    default:
      break;
  }

  return frequency;
}

const reducer = (state, action) => {
  const { audioContext, frequency, id, value, version } = action.payload;
  switch (action.type) {
    case "CREATE_OSCILLATOR": {
      // Create Master Gain
      let masterGain = audioContext.createGain();

      // Set Master Gain Settings
      masterGain.gain.value = state.masterGainSettings.volume;

      // Calculate Oscillator Octave Frequencies
      const oscillator1OctaveFrequency = octaveToFrequency(
        frequency,
        state.oscillator1Settings.octave
      );

      const oscillator2OctaveFrequency = octaveToFrequency(
        frequency,
        state.oscillator2Settings.octave
      );

      const oscillator3OctaveFrequency = octaveToFrequency(
        frequency,
        state.oscillator3Settings.octave
      );

      // Create Oscillators
      const oscillator1 = new Oscillator(
        audioContext,
        state.oscillator1Settings.type,
        oscillator1OctaveFrequency,
        state.oscillator1Settings.detune,
        state.envelopeSettings,
        state.oscillator1Settings.volume,
        masterGain,
        state.easing,
        1
      );

      const oscillator2 = new Oscillator(
        audioContext,
        state.oscillator2Settings.type,
        oscillator2OctaveFrequency,
        state.oscillator2Settings.detune,
        state.envelopeSettings,
        state.oscillator2Settings.volume,
        masterGain,
        state.easing,
        2
      );

      const oscillator3 = new Oscillator(
        audioContext,
        state.oscillator3Settings.type,
        oscillator3OctaveFrequency,
        state.oscillator3Settings.detune,
        state.envelopeSettings,
        state.oscillator3Settings.volume,
        masterGain,
        state.easing,
        3
      );

      // Create Filter
      let filter = audioContext.createBiquadFilter();

      // Set Filter Settings
      filter.frequency.value = state.filterSettings.frequency;
      filter.detune.value = state.filterSettings.detune;
      filter.Q.value = state.filterSettings.Q;
      filter.gain.value = state.filterSettings.gain;
      filter.type = state.filterSettings.type;

      // Create LFO
      const lfo = audioContext.createOscillator();

      // Set LFO Settings
      lfo.type = state.lfoSettings.type;
      lfo.frequency.value = state.lfoSettings.rate;

      // Create LFO Gain
      const lfoGain = audioContext.createGain();

      // Set LFO Gain Settings
      lfoGain.gain.cancelScheduledValues(audioContext.currentTime);
      lfoGain.gain.setValueAtTime(0, audioContext.currentTime + state.easing);
      lfoGain.gain.linearRampToValueAtTime(
        state.lfoSettings.gain,
        audioContext.currentTime + state.lfoSettings.delay + state.easing
      );

      lfo.start();

      // Create destination
      let out = audioContext.destination;

      // Create connections
      lfo.connect(lfoGain);
      lfoGain.connect(masterGain);
      masterGain.connect(filter);
      filter.connect(out);

      nodes.push(oscillator1, oscillator2, oscillator3);

      return {
        ...state,
        audioContext,
        filter,
        lfo,
        lfoGain,
      };
    }
    case "KILL_OSCILLATOR": {
      let newNodes = [];

      // Calculate Oscillator Octave Frequency
      const oscillator1OctaveFrequency = octaveToFrequency(
        frequency,
        state.oscillator1Settings.octave
      );

      const oscillator2OctaveFrequency = octaveToFrequency(
        frequency,
        state.oscillator2Settings.octave
      );

      const oscillator3OctaveFrequency = octaveToFrequency(
        frequency,
        state.oscillator3Settings.octave
      );

      nodes.forEach((node) => {
        if (
          Math.round(node.oscillator.frequency.value) ===
            Math.round(oscillator1OctaveFrequency) ||
          Math.round(node.oscillator.frequency.value) ===
            Math.round(oscillator2OctaveFrequency) ||
          Math.round(node.oscillator.frequency.value) ===
            Math.round(oscillator3OctaveFrequency)
        ) {
          node.stopOscillatorConstructor();
        } else {
          newNodes.push(node);
        }
      });
      nodes = newNodes;

      if (state.lfo) {
        state.lfo.stop();
        setTimeout(() => {
          state.lfo.disconnect();
        }, 10000);
      }
      if (state.lfoGain) {
        state.lfoGain.gain.cancelScheduledValues(
          state.audioContext.currentTime
        );
        state.lfoGain.gain.setTargetAtTime(
          0,
          state.audioContext.currentTime,
          state.envelopeSettings.release + state.easing
        );
      }

      return {
        ...state,
        lfo: null,
        lfoGain: null,
      };
    }
    case "CHANGE_OSCILLATOR": {
      nodes.forEach((node) => {
        if (node.version === version) {
          node.oscillator[id].value = value;
        }
      });
      const propertyName = `oscillator${version}Settings`;
      return {
        ...state,
        [`${propertyName}`]: {
          ...state[`${propertyName}`],
          [id]: value,
        },
      };
    }
    case "CHANGE_OSCILLATOR_TYPE": {
      nodes.forEach((node) => {
        if (node.version === version) {
          node.oscillator[id] = value;
        }
      });
      const propertyName = `oscillator${version}Settings`;
      return {
        ...state,
        [`${propertyName}`]: {
          ...state[`${propertyName}`],
          [id]: value,
        },
      };
    }
    case "CHANGE_OSCILLATOR_VOLUME": {
      const propertyName = `oscillator${version}Settings`;
      return {
        ...state,
        [`${propertyName}`]: {
          ...state[`${propertyName}`],
          [id]: value,
        },
      };
    }
    case "CHANGE_OSCILLATOR_OCTAVE": {
      const propertyName = `oscillator${version}Settings`;
      return {
        ...state,
        [`${propertyName}`]: {
          ...state[`${propertyName}`],
          [id]: value,
        },
      };
    }
    case "CHANGE_LFO": {
      if (state.lfo) {
        if (id === "rate") {
          state.lfo.frequency.value = value;
        }
      }
      return {
        ...state,
        lfoSettings: {
          ...state.lfoSettings,
          [id]: Number(value),
        },
      };
    }
    case "CHANGE_LFO_VOLUME": {
      return {
        ...state,
        lfoSettings: {
          ...state.lfoSettings,
          [id]: value,
        },
      };
    }
    case "CHANGE_LFO_TYPE": {
      return {
        ...state,
        lfoSettings: {
          ...state.lfoSettings,
          [id]: value,
        },
      };
    }
    case "CHANGE_FILTER": {
      if (state.filter) {
        state.filter[id].value = value;
      }
      return {
        ...state,
        filterSettings: {
          ...state.filterSettings,
          [id]: value,
        },
      };
    }
    case "CHANGE_FILTER_TYPE": {
      if (state.filter) {
        state.filter[id] = value;
      }
      return {
        ...state,
        filterSettings: {
          ...state.filterSettings,
          [id]: value,
        },
      };
    }
    case "CHANGE_ENVELOPE": {
      return {
        ...state,
        envelopeSettings: {
          ...state.envelopeSettings,
          [id]: Number(value),
        },
      };
    }
    case "CHANGE_MASTER_GAIN_VOLUME": {
      return {
        ...state,
        masterGainSettings: {
          ...state.masterGainSettings,
          [id]: value,
        },
      };
    }
    default: {
      console.error("reducer error. action: ", action);
      return {
        ...state,
      };
    }
  }
};

export default function Store({ children }) {
  const stateHook = useReducer(reducer, initialState);
  return <CTX.Provider value={stateHook}>{children}</CTX.Provider>;
}
