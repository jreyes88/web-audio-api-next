"use client";

import { createContext, useReducer } from "react";
import Gain from "../context/Gain";
import Oscillator from "../context/Oscillator";

const CTX = createContext();

export { CTX };

let nodes = [];
let gains = [];

const initialState = {
  easing: 0.005,
  windowWidth: 0,
  // filter: null,
  // oscillator1: null,
  // oscillator1Gain: null,
  gainSettings: {
    volume: 1,
  },
  oscillator1Settings: {
    detune: 0,
    type: "square",
    octave: "32",
  },
  oscillator1GainSettings: {
    volume: 1,
  },
  oscillator2Settings: {
    detune: 0,
    type: "sawtooth",
    octave: "4",
  },
  oscillator2GainSettings: {
    volume: 1,
  },
  oscillator3Settings: {
    detune: 0,
    type: "square",
    octave: "16",
  },
  oscillator3GainSettings: {
    volume: 1,
  },
  // lfoSettings: {
  //   rate: 11.7, // Rate slider
  //   delay: 1.4, // Delay Slider
  //   gain: 2.8, // LFO Knob
  //   noise: 0.31, // Noise knob
  // },
  envelopeSettings: {
    attack: 0.005,
    decay: 0.1,
    sustain: 0.6,
    release: 0.1,
  },
  // filterSettings: {
  //   frequency: 350,
  //   detune: 0,
  //   Q: 1,
  //   gain: 0,
  //   type: "lowpass",
  // },
  // whiteNoise: null,
  // whiteNoiseGain: null,
};

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
  const { id, value, frequency, version } = action.payload || {};
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
      gain.gain.value = state.gainSettings.volume;
      const filter = audioContext.createBiquadFilter();
      const out = audioContext.destination;

      // Create gain for oscillator 1
      const oscillator1Gain = new Gain(
        audioContext,
        state.oscillator1GainSettings.volume,
        gain
      );

      // Create gain for oscillator 2
      const oscillator2Gain = new Gain(
        audioContext,
        state.oscillator2GainSettings.volume,
        gain
      );

      // Create gain for oscillator 3
      const oscillator3Gain = new Gain(
        audioContext,
        state.oscillator3GainSettings.volume,
        gain
      );

      // Calculate octave 1 frequency
      const octave1Frequency = octaveToFrequency(
        frequency,
        state.oscillator1Settings.octave
      );

      // Calculate octave 2 frequency
      const octave2Frequency = octaveToFrequency(
        frequency,
        state.oscillator2Settings.octave
      );

      // Calculate octave 3 frequency
      const octave3Frequency = octaveToFrequency(
        frequency,
        state.oscillator3Settings.octave
      );

      // Create basic oscillator 1
      const oscillator1 = new Oscillator(
        audioContext,
        state.oscillator1Settings.type,
        octave1Frequency,
        state.oscillator1Settings.detune,
        oscillator1Gain.gain
      );

      // Create basic oscillator 2
      const oscillator2 = new Oscillator(
        audioContext,
        state.oscillator2Settings.type,
        octave2Frequency,
        state.oscillator2Settings.detune,
        oscillator2Gain.gain
      );

      // Create basic oscillator 3
      const oscillator3 = new Oscillator(
        audioContext,
        state.oscillator3Settings.type,
        octave3Frequency,
        state.oscillator3Settings.detune,
        oscillator3Gain.gain
      );

      gain.connect(filter);
      filter.connect(out);

      // Create LFO
      // const lfo = audioContext.createOscillator();
      // lfo.frequency.value = state.lfoSettings.rate;

      // Create gain for LFO
      // const lfoGain = audioContext.createGain();

      // lfo.connect(lfoGain);
      // lfoGain.connect(oscillator1.oscillator.detune);
      // lfo.start();

      let { currentTime } = audioContext;
      // console.log(gain);
      gain.gain.cancelScheduledValues(currentTime);
      gain.gain.setValueAtTime(0, currentTime + state.easing);
      gain.gain.linearRampToValueAtTime(
        state.gainSettings.volume,
        currentTime + state.envelopeSettings.attack + state.easing
      );
      // gain.gain.linearRampToValueAtTime(
      //   state.envelopeSettings.sustain,
      //   currentTime +
      //     state.envelopeSettings.attack +
      //     state.envelopeSettings.decay +
      //     state.easing
      // );

      // lfoGain.gain.cancelScheduledValues(currentTime);
      // lfoGain.gain.setValueAtTime(0, currentTime + state.easing);
      // lfoGain.gain.linearRampToValueAtTime(
      //   state.lfoSettings.gain,
      //   currentTime + state.lfoSettings.delay + state.easing
      // );

      oscillator1
        .start
        // state.lfoSettings,
        // state.envelopeSettings,
        // state.easing
        ();

      oscillator2
        .start
        // state.lfoSettings,
        // state.envelopeSettings,
        // state.easing
        ();

      oscillator3
        .start
        // state.lfoSettings,
        // state.envelopeSettings,
        // state.easing
        ();

      nodes.push(oscillator1);
      nodes.push(oscillator2);
      nodes.push(oscillator3);

      // Put running audioContext, filter, oscillator, lfo, and lfoGain into state so we can adjust them while a note is playing
      return {
        ...state,
        audioContext,
        gain,
        oscillator1Gain,
        oscillator2Gain,
        oscillator3Gain,
        // filter,
        // oscillator1: oscillator1.oscillator,
        // oscillator1Gain: oscillator1Gain.gain,
        // lfo,
        // lfoGain,
        // whiteNoise: oscillator1.whiteNoise,
        // whiteNoiseGain: oscillator1.whiteNoiseGain,
      };
    }
    case "KILL_OSCILLATOR": {
      // can probably spread and slice this
      let newNodes = [];

      // Calculate octave frequency
      const octave1Frequency = octaveToFrequency(
        frequency,
        state.oscillator1Settings.octave
      );

      const octave2Frequency = octaveToFrequency(
        frequency,
        state.oscillator2Settings.octave
      );

      // Calculate octave 3 frequency
      const octave3Frequency = octaveToFrequency(
        frequency,
        state.oscillator3Settings.octave
      );

      // console.log(gains);
      let { currentTime } = state.audioContext;
      // const { gain } = state;
      // console.log(gain);
      // gain.gain.cancelScheduledValues(currentTime);
      // gain.gain.setValueAtTime(0, currentTime + state.easing);
      // gain.gain.linearRampToValueAtTime(
      //   0,
      //   currentTime + state.envelopeSettings.release + state.easing
      // );

      console.log(state);

      console.log(nodes);
      console.log(gains);

      [
        state.oscillator1Gain,
        state.oscillator2Gain,
        state.oscillator3Gain,
      ].forEach(({ gain }, index) => {
        console.log(gain);
        // console.log(state[`oscillator${index + 1}GainSettings`].volume);
        // const currentVolume =
        // state[`oscillator${index + 1}GainSettings`].volume;
        // gain.gain.setValueAtTime(currentVolume, currentTime + state.easing);
        gain.gain.linearRampToValueAtTime(
          0,
          currentTime + state.envelopeSettings.release + state.easing
        );
      });

      nodes.forEach((node) => {
        if (
          Math.round(node.oscillator.frequency.value) ===
            Math.round(octave1Frequency) ||
          Math.round(node.oscillator.frequency.value) ===
            Math.round(octave2Frequency) ||
          Math.round(node.oscillator.frequency.value) ===
            Math.round(octave3Frequency)
        ) {
          node.stop(state.envelopeSettings, state.easing);
        } else {
          newNodes.push(node);
        }
      });
      return {
        ...state,
        // oscillator: null,
        // lfo: null,
        // lfoGain: null,
      };
    }
    case "CHANGE_OSCILLATOR_TYPE": {
      // if (state.oscillator) {
      //   state.oscillator[id] = value;
      // }
      const oscillatorVersion = `oscillator${version}Settings`;
      return {
        ...state,
        [`${oscillatorVersion}`]: {
          ...state[`${oscillatorVersion}`],
          [id]: value,
        },
      };
    }
    case "CHANGE_OSCILLATOR_OCTAVE": {
      const oscillatorVersion = `oscillator${version}Settings`;
      return {
        ...state,
        [`${oscillatorVersion}`]: {
          ...state[`${oscillatorVersion}`],
          [id]: value,
        },
      };
    }
    case "CHANGE_OSCILLATOR_VOLUME": {
      const oscillatorVersion = `oscillator${version}GainSettings`;
      return {
        ...state,
        [`${oscillatorVersion}`]: {
          ...state[`${oscillatorVersion}`],
          [id]: value,
        },
      };
    }
    case "CHANGE_MAIN_VOLUME": {
      return {
        ...state,
        gainSettings: {
          ...state.gainSettings,
          volume: value,
        },
      };
    }
    case "CHANGE_LFO": {
      // if (id === "rate") {
      //   if (state.lfo) {
      //     state.lfo.frequency.setValueAtTime(
      //       value,
      //       state.audioContext.currentTime
      //     );
      //   }
      // }
      // if (id === "gain") {
      //   if (state.lfoGain) {
      //     state.lfoGain.gain.setValueAtTime(
      //       value,
      //       state.audioContext.currentTime
      //     );
      //   }
      // }
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
      // if (state.filter) {
      //   state.filter[id].value = value;
      // }
      return {
        ...state,
        filterSettings: {
          ...state.filterSettings,
          [id]: value,
        },
      };
    }
    case "CHANGE_FILTER_TYPE": {
      // if (state.filter) {
      //   state.filter[id] = value;
      // }
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
