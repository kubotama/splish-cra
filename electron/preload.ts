import { SynthesizedInfo } from "./electron";

import { IpcRenderer, ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("splish", {
  loadConfiguration: async (): Promise<SynthesizedInfo> =>
    await ipcRenderer.invoke("loadConfiguration"),
  textToSynthesize: async (text: string): Promise<string> =>
    await ipcRenderer.invoke("textToSynthesize", text),
  readAudioFile: async (filename: string): Promise<Buffer> =>
    await ipcRenderer.invoke("readAudioFile", filename),
});

declare global {
  interface Window {
    ipcRenderer: IpcRenderer;
  }
}

process.once("loaded", () => {
  window.ipcRenderer = ipcRenderer;
});
