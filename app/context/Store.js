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
    octave: "32",
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
    attack: 0.005,
    decay: 0.1,
    sustain: 0.6, // sustain is a volume
    release: 1.1,
  },
  lfoSettings: {
    rate: 11.7,
    delay: 1.4,
    gain: 0.5,
    noise: 0.31,
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
  switch (action.type) {
    case "CREATE_OSCILLATOR": {
      const { audioContext, frequency } = action.payload;

      // Create Master Gain
      let masterGain = audioContext.createGain();
      masterGain.gain.value = state.masterGainSettings.volume;

      // Set Master Gain Settings

      // Calculate Oscillator Octovae Frequency
      const oscillator1OctaveFrequency = octaveToFrequency(
        frequency,
        state.oscillator1Settings.octave
      );

      // Create Oscillator
      const oscillator1 = new Oscillator(
        audioContext,
        state.oscillator1Settings.type,
        oscillator1OctaveFrequency,
        state.oscillator1Settings.detune,
        state.envelopeSettings,
        state.oscillator1Settings.volume,
        masterGain,
        state.easing
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
      lfo.frequency.value = state.lfoSettings.rate;

      // Create LFO Gain
      const lfoGain = audioContext.createGain();
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

      nodes.push(oscillator1);

      return {
        ...state,
        audioContext,
        filter,
        lfo,
        lfoGain,
      };
    }
    case "KILL_OSCILLATOR": {
      const { frequency } = action.payload;
      let newNodes = [];

      // Calculate Oscillator Octovae Frequency
      const oscillator1OctaveFrequency = octaveToFrequency(
        frequency,
        state.oscillator1Settings.octave
      );

      nodes.forEach((node) => {
        if (
          Math.round(node.oscillator.frequency.value) ===
          Math.round(oscillator1OctaveFrequency)
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
      const { id, value } = action.payload;
      nodes.forEach((node) => {
        node.oscillator[id].value = value;
      });
      return {
        ...state,
        oscillator1Settings: {
          ...state.oscillator1Settings,
          [id]: value,
        },
      };
    }
    case "CHANGE_OSCILLATOR_TYPE": {
      const { id, value } = action.payload;
      nodes.forEach((node) => {
        node.oscillator[id] = value;
      });
      return {
        ...state,
        oscillator1Settings: {
          ...state.oscillator1Settings,
          [id]: value,
        },
      };
    }
    case "CHANGE_OSCILLATOR_VOLUME": {
      const { id, value } = action.payload;
      return {
        ...state,
        oscillator1Settings: {
          ...state.oscillator1Settings,
          [id]: value,
        },
      };
    }
    case "CHANGE_OSCILLATOR_OCTAVE": {
      const { id, value } = action.payload;
      return {
        ...state,
        oscillator1Settings: {
          ...state.oscillator1Settings,
          [id]: value,
        },
      };
    }
    case "CHANGE_LFO": {
      const { id, value } = action.payload;

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
      const { id, value } = action.payload;
      return {
        ...state,
        lfoSettings: {
          ...state.lfoSettings,
          [id]: value,
        },
      };
    }
    case "CHANGE_FILTER": {
      const { id, value } = action.payload;
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
      const { id, value } = action.payload;
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
      const { id, value } = action.payload;
      return {
        ...state,
        envelopeSettings: {
          ...state.envelopeSettings,
          [id]: Number(value),
        },
      };
    }
    case "CHANGE_MASTER_GAIN_VOLUME": {
      const { id, value } = action.payload;
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
