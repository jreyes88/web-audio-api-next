"use client";

import { createContext, useReducer } from "react";
import Oscillator from "./Oscillator";

const CTX = createContext();

export { CTX };

const initialState = {
  frequency: 440,
  oscillator1Settings: {
    detune: 0,
    type: "square",
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
};

let nodes = [];

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_OSCILLATOR": {
      const { audioContext, frequency } = action.payload;

      // Create Master Gain
      let masterGain = audioContext.createGain();

      // Set Master Gain Settings

      // Create Oscillator
      const oscillator1 = new Oscillator(
        audioContext,
        state.oscillator1Settings.type,
        frequency,
        state.oscillator1Settings.detune,
        state.envelopeSettings,
        masterGain
      );

      // Create Filter
      let filter = audioContext.createBiquadFilter();

      // // Set Filter Settings
      filter.frequency.value = state.filterSettings.frequency;
      filter.detune.value = state.filterSettings.detune;
      filter.Q.value = state.filterSettings.Q;
      filter.gain.value = state.filterSettings.gain;
      filter.type = state.filterSettings.type;

      // Create destination
      let out = audioContext.destination;

      // // Create connections
      masterGain.connect(filter);
      filter.connect(out);
      nodes.push(oscillator1);

      return {
        ...state,
        filter,
      };
    }
    case "KILL_OSCILLATOR": {
      const { audioContext, frequency } = action.payload;
      let newNodes = [];
      nodes.forEach((node) => {
        if (
          Math.round(node.oscillator.frequency.value) === Math.round(frequency)
        ) {
          node.stopOscillatorConstructor();
        } else {
          newNodes.push(node);
        }
      });
      nodes = newNodes;
      return {
        ...state,
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
