import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as url from "url";
import * as fs from "fs";

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
