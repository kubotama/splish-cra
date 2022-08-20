import { useEffect, useState } from "react";

import { SplishIpc } from "./SplishIpc";

import "./App.css";

function App() {
  const [synthesizedText, setSynthesizedText] = useState("");
  const [speechFilename, setSpeechFilename] = useState("");

  useEffect(() => {
    SplishIpc.getSynthesizedInfo().then((synthesizedInfo) => {
      setSynthesizedText(synthesizedInfo.text);
      setSpeechFilename(synthesizedInfo.filename);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">SPLISH</header>
      <textarea className="inputText" data-testid="inputText" />
      <button
        className="synthesizeButton"
        data-testid="synthesizeButton"
        disabled
      >
        合成
      </button>
      <textarea
        className="synthesizedText"
        data-testid="synthesizedText"
        defaultValue={synthesizedText}
      ></textarea>
      <div hidden data-testid="synthesizedFilename">
        {speechFilename}
      </div>
    </div>
  );
}

export default App;
