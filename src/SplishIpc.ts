import { SynthesizedInfo } from "../electron/electron";

export const SplishIpc = {
  loadConfiguration: async (): Promise<SynthesizedInfo> => {
    return window.splish.loadConfiguration();
  },
  textToSynthesize: async (text: string): Promise<string> => {
    return window.splish.textToSynthesize(text);
  },
  playAudio: async (filename: string): Promise<Buffer> => {
    return window.splish.playAudio(filename);
  },
};
