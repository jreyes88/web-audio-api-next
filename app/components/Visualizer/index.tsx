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
      for (let i = 0; i <= numVerticalLines; i++) {
        const x = (canvas.width / numVerticalLines) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      const numHorizontalLines = 6;
      for (let i = 0; i <= numHorizontalLines; i++) {
        const y = (canvas.height / numHorizontalLines) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      ctx.lineWidth = 1;
      ctx.strokeStyle = "#f3a7a7";
      ctx.beginPath();

      let triggerOffset = 0;
      for (let i = 0; i < bufferLength / 2; i++) {
        if (dataArray[i] < 128 && dataArray[i + 1] >= 128) {
          triggerOffset = i;
          break;
        }
      }

      const sliceWidth = canvas.width / (bufferLength / 2);
      let x = 0;

      for (let i = triggerOffset; i < triggerOffset + bufferLength / 2; i++) {
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
