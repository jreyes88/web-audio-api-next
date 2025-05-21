import styles from "./page.module.scss";

import Toggle from "./components/Toggle";
import Frequency from "./components/Frequency";
import Oscillator from "./components/Oscillator";
import Filter from "./components/Filter";

export default function Home() {
  return (
    <div className={styles.app}>
      <h1>Web Audio API Synth in Next.js</h1>
      <Toggle />
      <Frequency />
      <Oscillator />
      <Filter />
    </div>
  );
}
