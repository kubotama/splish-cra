import { SynthesizedRow } from "../../electron/electron";

export declare global {
  interface Window {
    splish: {
      loadConfiguration: () => Promise<SynthesizedRow[]>;
      textToSynthesize: (text: string) => Promise<SynthesizedRow[]>;
      readAudioFile: (filename: string) => Promise<Buffer>;
    };
  }
}
