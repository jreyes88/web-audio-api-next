"use client";

import { createContext, useReducer } from "react";
import Gain from "../context/Gain";
import Oscillator from "../context/Oscillator";

const CTX = createContext();

export { CTX };

let nodes = [];

const initialState = {
  easing: 0.005,
  windowWidth: 0,
  filter: null,
  oscillator: null,
  oscillatorGain: null,
  oscillatorSettings: {
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
  whiteNoise: null,
  whiteNoiseGain: null,
};

const reducer = (state, action) => {
  if (state.filter) {
    state.filter["frequency"].value = state.filterSettings.frequency;
    state.filter["detune"].value = state.filterSettings.detune;
    state.filter["Q"].value = state.filterSettings.Q;
    state.filter["gain"].value = state.filterSettings.gain;
    state.filter.type = state.filterSettings.type;
  }
  const { id, value, frequency } = action.payload || {};
  switch (action.type) {
    case "SET_WINDOW_WIDTH": {
      return {
        ...state,
        windowWidth: action.payload,
      };
    }
    case "CREATE_OSCILLATOR": {
      const { audioContext } = action.payload;

      const gain = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      const out = audioContext.destination;

      // Create gain for oscillator
      const oscillatorGain = new Gain(audioContext, 0.1, gain);

      // Create basic oscillator
      const oscillator = new Oscillator(
        audioContext,
        state.oscillatorSettings.type,
        frequency,
        state.oscillatorSettings.detune,
        oscillatorGain.gain
      );

      gain.connect(filter);
      filter.connect(out);

      // Create LFO
      const lfo = audioContext.createOscillator();
      lfo.frequency.value = state.lfoSettings.rate;

      // Create gain for LFO
      const lfoGain = audioContext.createGain();

      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.oscillator.detune);
      lfo.start();

      let { currentTime } = audioContext;

      lfoGain.gain.cancelScheduledValues(currentTime);
      lfoGain.gain.setValueAtTime(0, currentTime + state.easing);
      lfoGain.gain.linearRampToValueAtTime(
        state.lfoSettings.gain,
        currentTime + state.lfoSettings.delay + state.easing
      );

      oscillator.start(state.lfoSettings, state.envelopeSettings, state.easing);

      console.log(oscillator);

      nodes.push(oscillator);

      // Put running audioContext, filter, oscillator, lfo, and lfoGain into state so we can adjust them while a note is playing
      return {
        ...state,
        audioContext,
        filter,
        oscillator: oscillator.oscillator,
        oscillatorGain: oscillatorGain.gain,
        lfo,
        lfoGain,
        whiteNoise: oscillator.whiteNoise,
        whiteNoiseGain: oscillator.whiteNoiseGain,
      };
    }
    case "KILL_OSCILLATOR": {
      // can probably spread and slice this
      let newNodes = [];

      nodes.forEach((node) => {
        if (
          Math.round(node.oscillator.frequency.value) === Math.round(frequency)
        ) {
          node.stop(state.envelopeSettings, state.easing);
        } else {
          newNodes.push(node);
        }
      });

      return {
        ...state,
        oscillator: null,
        lfo: null,
        lfoGain: null,
      };
    }
    case "CHANGE_OSCILLATOR_TYPE": {
      if (state.oscillator) {
        state.oscillator[id] = value;
      }
      return {
        ...state,
        oscillatorSettings: {
          ...state.oscillatorSettings,
          [id]: value,
        },
      };
    }
    case "CHANGE_LFO": {
      if (id === "rate") {
        if (state.lfo) {
          state.lfo.frequency.setValueAtTime(
            value,
            state.audioContext.currentTime
          );
        }
      }
      if (id === "gain") {
        if (state.lfoGain) {
          state.lfoGain.gain.setValueAtTime(
            value,
            state.audioContext.currentTime
          );
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
