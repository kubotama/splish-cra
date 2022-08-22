export declare global {
  interface Window {
    splish: {
      counter: (count: number) => number;
      getSynthesizedInfo: () => Promise<SynthesizedInfo>;
      textToSynthesize: (text: string) => Promise<string>;
      playAudio: (filename: string) => Promise<Buffer>;
    };
  }
}
