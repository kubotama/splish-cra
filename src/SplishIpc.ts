import { SynthesizedInfo } from "../electron/electron";

export const SplishIpc = {
  getSynthesizedInfo: async (): Promise<SynthesizedInfo> => {
    return window.splish.getSynthesizedInfo();
  },
  textToSynthesize: async (text: string): Promise<string> => {
    return window.splish.textToSynthesize(text);
  },
};
