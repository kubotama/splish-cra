// import { SynthesizedRow } from "./electron";
import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as fs from "fs";
import { format } from "date-fns";

import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { google } from "@google-cloud/text-to-speech/build/protos/protos";

const createWindow = () => {
  let synthesizedRows: SynthesizedRow[] = [];

  const win = new BrowserWindow({
    width: 1200,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const appURL = app.isPackaged ? ["file://", path.join(__dirname, "../index.html")].join("") : "http://localhost:3000";

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  win.loadURL(appURL);

  // if (!app.isPackaged) {
  //   win.webContents.openDevTools();
  // }

  ipcMain.handle("loadConfiguration", (_event: Electron.IpcMainInvokeEvent) => {
    const filename = "splish.json";
    if (fs.existsSync(filename) === false) {
      // fs.writeFileSync(filename, JSON.stringify({ text: "", filename: "" }));
      fs.writeFileSync(filename, JSON.stringify([]));
    }
    synthesizedRows = JSON.parse(
      fs.readFileSync("splish.json", {
        encoding: "utf8",
      }),
    ) as SynthesizedRow[];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    // return JSON.parse(synthesizedRow);
    return synthesizedRows;
  });

  ipcMain.handle("textToSynthesize", async (_event: Electron.IpcMainInvokeEvent, text: string) => {
    // const filename = "./speech.mp3";
    const synthesizedTime = new Date();
    const id = format(synthesizedTime, "yyyyMMddHHmmssSSS");
    const filename = id.concat(".mp3");

    const client = new TextToSpeechClient();

    const request: google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
      input: { text },
      voice: {
        languageCode: "en-US",
        ssmlGender: "NEUTRAL",
        name: "en-US-Standard-J",
      },
      audioConfig: {
        audioEncoding: "MP3",
        effectsProfileId: ["headphone-class-device"],
      },
    };

    const [response] = await client.synthesizeSpeech(request);
    const TRUNCATE_LEMGTH = 140;
    synthesizedRows = [
      {
        id,
        synthesizedTime: format(synthesizedTime, "yyyy/MM/dd HH:mm"),
        synthesizedText: text,
        synthesizedTruncatedText: text.substring(0, TRUNCATE_LEMGTH).concat(text.length > TRUNCATE_LEMGTH ? "..." : ""),
        textCount: text.length,
        filename,
      },
      ...synthesizedRows,
    ];
    if (response.audioContent) {
      fs.writeFileSync(filename, response.audioContent);

      // 設定ファイル(splish.json)に合成したテキストと保存したファイル名を記録する
      // const synthesizedInfo = { text, filename };
      // fs.writeFileSync("splish.json", JSON.stringify(synthesizedInfo));
      fs.writeFileSync("splish.json", JSON.stringify(synthesizedRows));
    }
    return synthesizedRows;
  });

  ipcMain.handle("readAudioFile", (_event: Electron.IpcMainInvokeEvent, filename: string) => {
    const buffer = fs.readFileSync(filename);
    return buffer;
  });
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

export type SynthesizedInfo = {
  text: string;
  filename: string;
};

export type SynthesizedRow = {
  id: string;
  synthesizedTime: string;
  synthesizedText: string;
  synthesizedTruncatedText: string;
  textCount: number;
  filename: string;
};
