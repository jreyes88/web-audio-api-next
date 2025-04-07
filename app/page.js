"use client";
// import Osc1 from "./components/Osc1";
import Filter from "./components/Filter";
import Keyboard from "./components/Keyboard";
import ADSR from "./components/ADSR";

import LFO from "./components/LFO/LFO";
import Osc from "./components/OSC/OSC";

import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.app}>
      <header className="header">
        <h1 className={styles.heading}>Web Audio API in React</h1>
      </header>
      <div className={styles.synth}>
        <LFO />
        <Osc />
        {/* <Osc1 /> */}
        <ADSR />
        <Filter />
        <Keyboard />
      </div>
    </div>
  );
}
