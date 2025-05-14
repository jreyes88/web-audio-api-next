"use client";
import LFO from "./components/LFO";
import Oscillator from "./components/Oscillator";
import Volume from "./components/Volume";
import ADSR from "./components/ADSR";
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
        <Oscillator version={1} />
        <Oscillator version={2} />
        <Oscillator version={3} />
        <Volume />
        {/* <LFO /> */}
        {/* <Filter /> */}
        {/* <ADSR /> */}
        <Keyboard />
      </div>
    </div>
  );
}
