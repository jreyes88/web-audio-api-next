"use client";
import LFO from "./components/LFO/LFO";
import OSC from "./components/OSC/OSC";
import Keyboard from "./components/Keyboard";
import Filter from "./components/Filter";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.app}>
      <header className="header">
        <h1 className={styles.heading}>Web Audio API in React</h1>
      </header>
      <div className={styles.synth}>
        <LFO />
        <OSC />
        <Filter />
        <Keyboard />
      </div>
    </div>
  );
}
