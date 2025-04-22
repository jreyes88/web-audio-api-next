"use client";
import Oscillator from "./Oscillator";

import { createContext, useReducer } from "react";

const CTX = createContext();

export { CTX };

let nodes = [];

const initialState = {
  windowWidth: 0,
  filter: null,
  osc1: null,
  osc1Settings: {
    detune: 0,
    type: "sine",
  },
  lfoSettings: {
    rate: 1, // Rate slider
    delay: 0, // Delay Slider
    gain: 100, // LFO Knob
    noise: 1, // Noise knob
  },
  envelopeSettings: {
    attack: 0.005,
    decay: 0.1,
    sustain: 0.6,
    release: 0.1,
  },
  filterSettings: {
    frequency: 350,
    detune: 0,
    Q: 1,
    gain: 0,
    type: "lowpass",
  },
};

const reducer = (state, action) => {
  if (state.filter) {
    state.filter["frequency"].value = state.filterSettings.frequency;
    state.filter["detune"].value = state.filterSettings.detune;
    state.filter["Q"].value = state.filterSettings.Q;
    state.filter["gain"].value = state.filterSettings.gain;
    state.filter.type = state.filterSettings.type;
  }
  const { id, value, freq } = action.payload || {};
  switch (action.type) {
    case "SET_WINDOW_WIDTH": {
      return {
        ...state,
        windowWidth: action.payload,
      };
    }
    case "MAKE_OSCILLATOR": {
      const { osc1, filter } = action.payload;
      state.filter = filter;
      state.osc1 = osc1;
      nodes.push(osc1);
      return {
        ...state,
      };
    }
    case "KILL_OSCILLATOR": {
      // can probably spread and slice this
      let newNodes = [];
      nodes.forEach((node) => {
        if (Math.round(node.oscillator.frequency.value) === Math.round(freq)) {
          node.stop();
        } else {
          newNodes.push(node);
        }
      });
      return {
        ...state,
      };
    }
    case "CHANGE_OSCILLATOR_TYPE": {
      if (state.osc1.oscillator) {
        state.osc1.oscillator[id] = value;
      }
      return {
        ...state,
        osc1Settings: {
          ...state.osc1Settings,
          [id]: value,
        },
      };
    }
    case "CHANGE_LFO": {
      return {
        ...state,
        lfoSettings: {
          ...state.lfoSettings,
          [id]: Number(value),
        },
      };
    }
    case "CHANGE_ADSR": {
      return {
        ...state,
        envelopeSettings: {
          ...state.envelopeSettings,
          [id]: Number(value),
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
    default: {
      console.error("reducer error: action: ", action);
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
