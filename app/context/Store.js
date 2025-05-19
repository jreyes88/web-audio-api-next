"use client";

import { createContext, useReducer } from "react";

const CTX = createContext();

export { CTX };

const initialState = {
  frequency: "440",
  oscillator1Settings: {
    detune: "0",
    type: "square",
  },
};

let nodes = [];

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_OSCILLATOR": {
      const { audioContext } = action.payload;

      // Create Oscillator
      let oscillator1 = audioContext.createOscillator();

      // Set Oscillator Settings
      oscillator1.frequency.value = state.frequency;
      oscillator1.detune.value = state.oscillator1Settings.detune;
      oscillator1.type = state.oscillator1Settings.type;

      // Create Oscillator Gain
      let oscillator1Gain = audioContext.createGain();

      // Set Oscillator Gain Settings

      // Create destination
      let out = audioContext.destination;

      // Create connections
      oscillator1.connect(oscillator1Gain);
      oscillator1Gain.connect(out);

      // Start Oscillator
      oscillator1.start();

      nodes.push(oscillator1);

      return {
        ...state,
        oscillator1,
        oscillator1Gain,
      };
    }
    case "KILL_OSCILLATOR": {
      nodes.forEach((node) => {
        node.stop();
      });
      nodes = [];
      return {
        ...state,
      };
    }
    case "CHANGE_FREQUENCY": {
      const { id, value } = action.payload;
      nodes.forEach((node) => {
        node[id].value = value;
      });
      return {
        ...state,
        [id]: value,
      };
    }
    case "CHANGE_DETUNE": {
      const { id, value } = action.payload;
      nodes.forEach((node) => {
        node[id].value = value;
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
        node[id] = value;
      });
      return {
        ...state,
        oscillator1Settings: {
          ...state.oscillator1Settings,
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
