import { SynthesizedRow } from "../electron/electron";

export const SplishIpc = {
  loadConfiguration: async (): Promise<SynthesizedRow[]> =>
    window.splish.loadConfiguration(),
  textToSynthesize: async (text: string): Promise<SynthesizedRow[]> =>
    window.splish.textToSynthesize(text),
  readAudioFile: async (filename: string): Promise<Buffer> =>
    window.splish.readAudioFile(filename),
};
