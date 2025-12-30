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

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = "#f4e6f6";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
      ctx.lineWidth = 1;

      const numVerticalLines = 10;
      ctx.beginPath();
      for (let i = 0; i <= numVerticalLines; i++) {
        const x = (canvas.width / numVerticalLines) * i;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      ctx.stroke();

      const numHorizontalLines = 6;
      ctx.beginPath();
      for (let i = 0; i <= numHorizontalLines; i++) {
        const y = (canvas.height / numHorizontalLines) * i;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      ctx.lineWidth = 1;
      ctx.strokeStyle = "#f3a7a7";
      ctx.beginPath();

      let triggerOffset = 0;
      const WAVEFORM_MIDPOINT = 128;
      for (let i = 0; i < bufferLength / 2; i++) {
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
      const sliceWidth = canvas.width / samplesToDraw;
      let x = 0;

      for (let i = triggerOffset; i < triggerOffset + samplesToDraw; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

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
