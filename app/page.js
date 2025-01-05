import Osc1 from "./components/Osc1";
import Filter from "./components/Filter";
import Keyboard from "./components/Keyboard";
import ADSR from "./components/ADSR";

import Waveform from "./components/Waveform/Waveform";
import LFO from "./components/LFO/LFO";

import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.app}>
      <header className="header">
        <h1>Web Audio API in React</h1>
      </header>
      <div className={styles.synth}>
        <LFO />
        <Waveform />
        <Osc1 />
        <ADSR />
        {/* <Filter /> */}
        <Keyboard />
      </div>
    </div>
  );
}
