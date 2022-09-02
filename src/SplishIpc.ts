import { SynthesizedInfo } from "../electron/electron";

export const SplishIpc = {
  loadConfiguration: async (): Promise<SynthesizedInfo> => window.splish.loadConfiguration(),
  textToSynthesize: async (text: string): Promise<string> => window.splish.textToSynthesize(text),
  readAudioFile: async (filename: string): Promise<Buffer> => window.splish.readAudioFile(filename),
};
