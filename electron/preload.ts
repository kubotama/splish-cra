import { SynthesizedInfo } from "./electron";

// import * as fs from "fs";

/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import type { IpcRenderer } from "electron";
import { IpcRenderer, ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("splish", {
  counter: (count: number) => {
    return count + 1;
  },
  getSynthesizedInfo: async (): Promise<SynthesizedInfo> =>
    await ipcRenderer.invoke("getSynthesizedInfo"),
  // getSynthesizedInfo: async (
  //   _event: Electron.IpcMainInvokeEvent
  // ): Promise<SynthesizedInfo> => {
  //   // const synthesizedInfo = fs.readFileSync(
  //   //   "/home/user1/projects/splish-electron/splish.json",
  //   //   {
  //   //     encoding: "utf8",
  //   //   }
  //   // );
  //   // return JSON.parse(synthesizedInfo);
  //   fs.writeFileSync("splish.txt", "abc");
  //   const synthesizedInfo: SynthesizedInfo = {
  //     text: "How to view Google Lighthouse scores for your site in Netlify",
  //     filename: "speech.mp3",
  //   };
  //   return synthesizedInfo;
  // },
  // await ipcRenderer.invoke(IPCKeys.GET_SYNTHESIZED_INFO),
  textToSynthesize: async (text: string): Promise<string> => {
    return await ipcRenderer.invoke("textToSynthesize", text);
  },
});

declare global {
  interface Window {
    ipcRenderer: IpcRenderer;
  }
}

process.once("loaded", () => {
  window.ipcRenderer = ipcRenderer;
});

// contextBridge.exposeInMainWorld("splish", {
//   getSynthesizedInfo: async (): Promise<SynthesizedInfo> =>
//     await ipcRenderer.invoke(IPCKeys.GET_SYNTHESIZED_INFO),
//   playSpeech: async (filename: string): Promise<Buffer> =>
//     await ipcRenderer.invoke(IPCKeys.PLAY_SPEECH, filename),
// });
