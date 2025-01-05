import Osc1 from "./components/Osc1";
import Filter from "./components/Filter";
import Keyboard from "./components/Keyboard";
import ADSR from "./components/ADSR";

export default function Home() {
  return (
    <div className="App">
      <header className="header">
        <h1>Web Audio API in React</h1>
      </header>
      <Osc1 />
      <ADSR />
      <Filter />
      <Keyboard />
    </div>
  );
}
