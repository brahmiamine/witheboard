import { WhiteboardProvider } from "./context/WhiteboardContext";
import { Canvas } from "./components/Canvas";
import { Toolbar } from "./components/Toolbar";

function App() {
  return (
    <WhiteboardProvider>
      <div className="App">
        <Canvas />
        <Toolbar />
      </div>
    </WhiteboardProvider>
  );
}

export default App;
