import { SynthesizedInfo } from "./electron";

/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IpcRenderer, ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("splish", {
  counter: (count: number) => {
    return count + 1;
  },
  getSynthesizedInfo: async (): Promise<SynthesizedInfo> =>
    await ipcRenderer.invoke("getSynthesizedInfo"),
  textToSynthesize: async (text: string): Promise<string> =>
    await ipcRenderer.invoke("textToSynthesize", text),
});

declare global {
  interface Window {
    ipcRenderer: IpcRenderer;
  }
}

process.once("loaded", () => {
  window.ipcRenderer = ipcRenderer;
});
