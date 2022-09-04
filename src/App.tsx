import React, { useEffect, useState } from "react";

import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";

import { SplishIpc } from "./SplishIpc";

import "./App.css";

const App = () => {
  const classTextVisible = {
    visible: "visibleText",
    invisible: "invisibleText",
  };

  const [synthesizedText, setSynthesizedText] = useState("");
  const [speechFilename, setSpeechFilename] = useState("");
  const [inputText, setInputText] = useState("");
  const [synthesizeButtonDisabled, setSynthesizeButtonDisabled] = useState(true);
  const [playButtonDisabled, setPlayButtonDisabled] = useState(true);
  const [synthesizedTextClass, setSynthesizedTextClass] = useState(
    ["synthesizedText", classTextVisible.visible].join(" "),
  );

  const setSFandPBD = (filename: string) => {
    setSpeechFilename(filename);
    setPlayButtonDisabled(filename.length === 0);
  };

  useEffect(() => {
    SplishIpc.loadConfiguration().then(
      (synthesizedInfo) => {
        setSynthesizedText(synthesizedInfo.text);
        setSFandPBD(synthesizedInfo.filename);
      },
      () => {
        setSynthesizedText("");
        setSFandPBD("");
      },
    );
  }, []);

  const onChangeInputText = (e: { target: { value: React.SetStateAction<string> } }) => {
    setInputText(e.target.value);
    const text = e.target.value.toString();
    setSynthesizeButtonDisabled(text.length === 0);
  };

  const onClickSynthesizeButton = () => {
    const text = inputText.replace(/’/g, "'");
    setPlayButtonDisabled(true);
    SplishIpc.textToSynthesize(text).then(
      (filename) => {
        setSFandPBD(filename);
      },
      () => {
        setSFandPBD("");
      },
    );
    setSynthesizedText(text);
    setInputText("");
    setSynthesizeButtonDisabled(true);
  };

  const playAudio = async (buffer: Buffer) => {
    const ctx = new AudioContext();
    const source = ctx.createBufferSource();
    source.buffer = await ctx.decodeAudioData(buffer.buffer);
    source.connect(ctx.destination);
    source.start();
    source.onended = () => {
      source.onended = null;
      setPlayButtonDisabled(false);
    };
  };

  const onClickPlayButton = () => {
    setPlayButtonDisabled(true);
    window.splish.readAudioFile(speechFilename).then(
      async (buffer) => {
        await playAudio(buffer);
      },
      () => {
        setSynthesizedText("");
        setSFandPBD("");
      },
    );
  };

  const onClickSynthesizedText = () => {
    setSynthesizedTextClass(
      synthesizedTextClass === ["synthesizedText", classTextVisible.visible].join(" ")
        ? ["synthesizedText", classTextVisible.invisible].join(" ")
        : ["synthesizedText", classTextVisible.visible].join(" "),
    );
  };

  const rows: GridRowsProp = [];

  const columns: GridColDef[] = [
    { field: "col1", headerName: "合成した日時", width: 150 },
    { field: "col2", headerName: "合成したテキスト", width: 950 },
    { field: "col3", headerName: "文字数", width: 90 },
  ];

  return (
    <div className="App">
      <header className="App-header">SPLISH</header>
      <textarea
        className="inputText"
        placeholder="合成するテキストを入力して下さい"
        data-testid="inputText"
        spellCheck="false"
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
        className={synthesizedTextClass}
        data-testid="synthesizedText"
        defaultValue={synthesizedText}
        spellCheck="false"
        onClick={onClickSynthesizedText}
      ></textarea>
      <div hidden data-testid="synthesizedFilename">
        {speechFilename}
      </div>
      <button className="playButton" disabled={playButtonDisabled} onClick={onClickPlayButton}>
        再生
      </button>
      <div style={{ height: 350, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={20}
          headerHeight={25}
          autoHeight={true}
          rowsPerPageOptions={[10]}
        />
      </div>
    </div>
  );
};

export default App;
