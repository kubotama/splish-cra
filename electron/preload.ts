import { SynthesizedInfo } from "./electron";

/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IpcRenderer, ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("splish", {
  counter: (count: number) => {
    return count + 1;
  },
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
