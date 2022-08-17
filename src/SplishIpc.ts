import { SynthesizedInfo } from "../electron/electron";

export const SplishIpc = {
  getSynthesizedInfo: async (): Promise<SynthesizedInfo> => {
    return window.splish.getSynthesizedInfo();
  },
};
