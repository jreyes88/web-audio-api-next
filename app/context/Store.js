"use client";

import { createContext, useReducer } from "react";
import Osc from "./Osc";

// console.log(window);

// let AudioContext;
// if (typeof window !== undefined) {
const AudioContext = window.AudioContext || window.webkitAudioContext;
// }

let actx = new AudioContext();
let out = actx.destination;
let gain1 = actx.createGain();
let filter = actx.createBiquadFilter();
gain1.connect(filter);
filter.connect(out);

const CTX = createContext();

export { CTX };

let nodes = [];

export function reducer(state, action) {
  const { id, value, note, freq } = action.payload || {};
  switch (action.type) {
    case "CHANGE_OSC1": {
      return {
        ...state,
        osc1Settings: {
          ...state.osc1Settings,
          [id]: value,
        },
      };
    }
    case "CHANGE_OSC1_TYPE": {
      return {
        ...state,
        osc1Settings: {
          ...state.osc1Settings,
          [id]: value,
        },
      };
    }
    case "CHANGE_FILTER": {
      filter[id].value = value;
      return {
        ...state,
        filterSettings: {
          ...state.filterSettings,
          [id]: value,
        },
      };
    }
    case "CHANGE_FILTER_TYPE": {
      filter[id] = value;
      return {
        ...state,
        filterSettings: {
          ...state.filterSettings,
          [id]: value,
        },
      };
    }
    case "MAKE_OSC": {
      const newOsc = new Osc(
        actx,
        state.osc1Settings.type,
        freq,
        state.osc1Settings.detune,
        state.envelope,
        gain1
      );
      nodes.push(newOsc);
      return {
        ...state,
      };
    }
    case "KILL_OSC": {
      // can probably spread and slice this
      let newNodes = [];
      nodes.forEach((node) => {
        console.log(node.oscillator);
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
    case "CHANGE_ADSR": {
      return {
        ...state,
        envelope: {
          ...state.envelope,
          [id]: Number(value),
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
}

export default function Store({ children }) {
  const stateHook = useReducer(reducer, {
    osc1Settings: {
      detune: 0,
      type: "sine",
    },
    filterSettings: {
      frequency: filter.frequency.value,
      detune: filter.detune.value,
      Q: filter.Q.value,
      gain: filter.gain.value,
      type: filter.type,
    },
    envelope: {
      attack: 0.005,
      decay: 0.1,
      sustain: 0.6,
      release: 0.1,
    },
  });
  return <CTX.Provider value={stateHook}>{children}</CTX.Provider>;
}
