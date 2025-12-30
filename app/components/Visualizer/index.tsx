"use client";
import React, { useRef, useEffect } from "react";
import styles from "./Visualizer.module.scss";

export default function Visualizer({
  analyser,
}: {
  analyser: AnalyserNode | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      if (canvas && ctx) {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        dimensionsRef.current = { width: rect.width, height: rect.height };

        ctx.scale(dpr, dpr);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      const { width, height } = dimensionsRef.current;
      if (width === 0 || height === 0) return;

      ctx.fillStyle = "#f4e6f6";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
      ctx.lineWidth = 1;

      const numVerticalLines = 10;
      ctx.beginPath();

      for (let i = 0; i <= numVerticalLines; i++) {
        const x = (width / numVerticalLines) * i;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      ctx.stroke();

      const numHorizontalLines = 6;
      ctx.beginPath();
      for (let i = 0; i <= numHorizontalLines; i++) {
        const y = (height / numHorizontalLines) * i;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#f3a7a7";
      ctx.beginPath();

      let triggerOffset = 0;
      const WAVEFORM_MIDPOINT = 128;
      const searchRange = bufferLength * 0.75;
      for (let i = 0; i < searchRange; i++) {
        if (
          dataArray[i] < WAVEFORM_MIDPOINT &&
          dataArray[i + 1] >= WAVEFORM_MIDPOINT
        ) {
          triggerOffset = i;
          break;
        }
      }

      const samplesToDraw = Math.min(
        bufferLength / 2,
        bufferLength - triggerOffset
      );
      const sliceWidth = width / samplesToDraw;
      let x = 0;

      for (let i = triggerOffset; i < triggerOffset + samplesToDraw; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === triggerOffset) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.stroke();
    };

    draw();
    return () => {
      window.removeEventListener("resize", handleResize);
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [analyser]);

  return (
    <div className={`module ${styles["visualizer"]}`}>
      <div className="header">Oscilloscope</div>

      <div className={styles["canvas-container"]}>
        <canvas ref={canvasRef} className={styles["canvas"]} />
      </div>
    </div>
  );
}
