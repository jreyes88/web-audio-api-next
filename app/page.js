"use client";
import OSC from "./components/OSC/OSC";
import Keyboard from "./components/Keyboard";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.app}>
      <header className="header">
        <h1 className={styles.heading}>Web Audio API in React</h1>
      </header>
      <div className={styles.synth}>
        <OSC />
        <Keyboard />
      </div>
    </div>
  );
}
