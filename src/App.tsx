import { useEffect, useState } from "react";

import { SplishIpc } from "./SplishIpc";

import "./App.css";

function App() {
  const [synthesizedText, setSynthesizedText] = useState("");
  const [speechFilename, setSpeechFilename] = useState("");
  const [inputText, setInputText] = useState("");
  const [synthesizeButtonDisabled, setSynthesizeButtonDisabled] =
    useState(true);

  useEffect(() => {
    SplishIpc.getSynthesizedInfo().then((synthesizedInfo) => {
      setSynthesizedText(synthesizedInfo.text);
      setSpeechFilename(synthesizedInfo.filename);
    });
  }, []);

  const onChangeInputText = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setInputText(e.target.value);
    const text = e.target.value.toString();
    setSynthesizeButtonDisabled(text.length === 0 ? true : false);
  };

  const onClickSynthesizeButton = async () => {
    const text = inputText;
    setSynthesizedText(text);
  };

  return (
    <div className="App">
      <header className="App-header">SPLISH</header>
      <textarea
        className="inputText"
        placeholder="合成するテキストを入力して下さい"
        data-testid="inputText"
        value={inputText}
        onChange={onChangeInputText}
      />
      <button
        className="synthesizeButton"
        data-testid="synthesizeButton"
        onClick={onClickSynthesizeButton}
        disabled={synthesizeButtonDisabled}
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
