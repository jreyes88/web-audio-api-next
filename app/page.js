import styles from "./page.module.scss";

import Oscillator from "./components/Oscillator";
import Filter from "./components/Filter";
import Keyboard from "./components/Keyboard";

export default function Home() {
  return (
    <div className={styles.app}>
      <h1>Web Audio API Synth in Next.js</h1>
      <Oscillator />
      <Filter />
      <Keyboard />
    </div>
  );
}
