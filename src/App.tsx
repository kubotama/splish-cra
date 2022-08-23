import { useEffect, useState } from "react";

import { SplishIpc } from "./SplishIpc";

import "./App.css";

function App() {
  const [synthesizedText, setSynthesizedText] = useState("");
  const [speechFilename, setSpeechFilename] = useState("");
  const [inputText, setInputText] = useState("");
  const [synthesizeButtonDisabled, setSynthesizeButtonDisabled] =
    useState(true);
  const [playButtonDisabled, setPlayButtonDisabled] = useState(true);

  useEffect(() => {
    SplishIpc.loadConfiguration().then((synthesizedInfo) => {
      setSynthesizedText(synthesizedInfo.text);
      setSFandPBD(synthesizedInfo.filename);
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
    SplishIpc.textToSynthesize(text).then((filename) => {
      setSFandPBD(filename);
    });
    setSynthesizedText(text);
    setInputText("");
    setSynthesizeButtonDisabled(true);
  };

  const setSFandPBD = (filename: string) => {
    setSpeechFilename(filename);
    setPlayButtonDisabled(filename.length === 0 ? true : false);
  };

  const onClickPlayButton = async () => {
    setPlayButtonDisabled(true);
    window.splish.readAudioFile(speechFilename).then(async (buffer) => {
      const ctx = new AudioContext();
      const source = ctx.createBufferSource();
      source.buffer = await ctx.decodeAudioData(buffer.buffer);
      source.connect(ctx.destination);
      source.start();
      source.onended = (_event) => {
        source.onended = null;
        setPlayButtonDisabled(false);
      };
    });
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
      <button
        className="playButton"
        disabled={playButtonDisabled}
        onClick={onClickPlayButton}
      >
        再生
      </button>
    </div>
  );
}

export default App;
