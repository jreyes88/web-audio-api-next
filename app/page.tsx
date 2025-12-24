"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

const AmbientSynthLooper: React.FC = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<number>(220);
  const [amplitude, setAmplitude] = useState<number>(0.5);

  const startAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }

    const audioContext = audioContextRef.current;

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    if (!oscillatorRef.current) {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      gainNode.gain.setValueAtTime(amplitude, audioContext.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;

      oscillator.start();
      setIsPlaying(true);
      console.log("Audio started");
    }
  }, [frequency, amplitude]);

  const stopAudio = useCallback(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
      gainNodeRef.current = null;
      setIsPlaying(false);
      console.log("Audio stopped");
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      // optionally close audio context
      // audioContextRef.current.close();
      // audioContextRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (oscillatorRef.current && audioContextRef.current) {
      oscillatorRef.current.frequency.setValueAtTime(
        frequency,
        audioContextRef.current.currentTime
      );
    }
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        amplitude,
        audioContextRef.current.currentTime
      );
    }
  }, [frequency, amplitude]);

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="">
      <h1 className="">synth</h1>
      <div className="">
        <div className="">
          <label htmlFor="frequency-slider">
            Frequency: {frequency.toFixed(1)}
          </label>
          <input
            id="frequency-slider"
            type="range"
            min="50"
            max="1000"
            step="0.1"
            value={frequency}
            onChange={(e) => setFrequency(parseFloat(e.target.value))}
          />
        </div>
        <div className="">
          <label htmlFor="amplitude-slider">
            Amplitude: {amplitude.toFixed(1)}
          </label>
          <input
            id="amplitude-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={amplitude}
            onChange={(e) => setAmplitude(parseFloat(e.target.value))}
          />
        </div>
        <div className="">
          {!isPlaying ? (
            <button onClick={startAudio}>Start synth</button>
          ) : (
            <button onClick={stopAudio}>Stop synth</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AmbientSynthLooper;
