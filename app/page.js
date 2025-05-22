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
      <h1 className={styles["heading"]}>Kite synth</h1>
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
      <div className={styles["header"]}>
        <p>
          Kite synth is a synthesizer created with Next.js App Router and the
          Web Audio API. Dedicated to the Mississippi Kites that moved into the
          tree next door.
        </p>
      </div>
    </div>
  );
}
