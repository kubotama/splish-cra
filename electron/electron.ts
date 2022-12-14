// import { SynthesizedRow } from "./electron";
import * as fs from "fs";
import * as path from "path";

import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { google } from "@google-cloud/text-to-speech/build/protos/protos";
import { format } from "date-fns";
import { app, BrowserWindow, ipcMain } from "electron";

const createWindow = () => {
  let synthesizedRows: SynthesizedRow[] = [];

  const win = new BrowserWindow({
    width: 1200,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const appURL = app.isPackaged
    ? "file://" + path.join(__dirname, "../index.html")
    : "http://localhost:3000";

  win.loadURL(appURL);

  ipcMain.handle("loadConfiguration", () => {
    const filename = "splish.json";
    if (fs.existsSync(filename) === false) {
      fs.writeFileSync(filename, JSON.stringify([]));
    }
    synthesizedRows = JSON.parse(
      fs.readFileSync("splish.json", {
        encoding: "utf8",
      }),
    ) as SynthesizedRow[];
    return synthesizedRows;
  });

  ipcMain.handle(
    "textToSynthesize",
    async (_event: Electron.IpcMainInvokeEvent, text: string) => {
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
      if (response.audioContent) {
        fs.writeFileSync(filename, response.audioContent);

        const TRUNCATE_LEMGTH = 140;
        synthesizedRows = [
          {
            id,
            synthesizedTime: format(synthesizedTime, "yyyy/MM/dd HH:mm"),
            synthesizedText: text,
            synthesizedTruncatedText: text
              .substring(0, TRUNCATE_LEMGTH)
              .concat(text.length > TRUNCATE_LEMGTH ? "..." : ""),
            textCount: text.length,
            filename,
          },
          ...synthesizedRows,
        ];
        fs.writeFileSync("splish.json", JSON.stringify(synthesizedRows));
      }
      return synthesizedRows;
    },
  );

  ipcMain.handle(
    "readAudioFile",
    (_event: Electron.IpcMainInvokeEvent, filename: string) => {
      const buffer = fs.readFileSync(filename);
      return buffer;
    },
  );
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

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
