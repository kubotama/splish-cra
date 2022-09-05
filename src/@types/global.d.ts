import { SynthesizedInfo, SynthesizedRow } from "../../electron/electron";

export declare global {
  interface Window {
    splish: {
      loadConfiguration: () => Promise<SynthesizedInfo>;
      textToSynthesize: (text: string) => Promise<SynthesizedRow[]>;
      readAudioFile: (filename: string) => Promise<Buffer>;
    };
  }
}
