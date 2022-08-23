import { SynthesizedInfo } from "../electron/electron";

export const SplishIpc = {
  loadConfiguration: async (): Promise<SynthesizedInfo> => {
    return window.splish.loadConfiguration();
  },
  textToSynthesize: async (text: string): Promise<string> => {
    return window.splish.textToSynthesize(text);
  },
  readAudioFile: async (filename: string): Promise<Buffer> => {
    return window.splish.readAudioFile(filename);
  },
};
