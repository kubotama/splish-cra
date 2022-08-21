import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as url from "url";
import * as fs from "fs";

import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { google } from "@google-cloud/text-to-speech/build/protos/protos";

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const appURL = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, "../index.html"),
        protocol: "file:",
        slashes: true,
      })
    : "http://localhost:3000";

  win.loadURL(appURL);

  // if (!app.isPackaged) {
  //   win.webContents.openDevTools();
  // }

  ipcMain.handle(
    "getSynthesizedInfo",
    async (_event: Electron.IpcMainInvokeEvent) => {
      const synthesizedInfo = fs.readFileSync("splish.json", {
        encoding: "utf8",
      });
      return JSON.parse(synthesizedInfo);
    }
  );

  ipcMain.handle(
    "textToSynthesize",
    async (_event: Electron.IpcMainInvokeEvent, text: string) => {
      const filename = "./speech.mp3";

      const client = new TextToSpeechClient();

      const request: google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
        input: { text: text },
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

        // 設定ファイル(splish.json)に合成したテキストと保存したファイル名を記録する
        const synthesizedInfo = { text: text, filename: filename };
        fs.writeFileSync("splish.json", JSON.stringify(synthesizedInfo));
      }
      return filename;
    }
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
