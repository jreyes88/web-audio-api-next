import styles from "./page.module.scss";

import Oscillator from "./components/Oscillator";
import LFO from "./components/LFO";
import Filter from "./components/Filter";
import Envelope from "./components/Envelope";
import Volume from "./components/Volume";
import Keyboard from "./components/Keyboard";

export default function Home() {
  return (
    <div className={styles.app}>
      <h1>Web Audio API Synth in Next.js</h1>
      <div className={styles["synth-layout"]}>
        <Oscillator version={1} />
        <Oscillator version={2} />
        <Oscillator version={3} />
        <LFO />
        <Filter />
        <Envelope />
        <Volume />
        <Keyboard />
      </div>
    </div>
  );
}
