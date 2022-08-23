export declare global {
  interface Window {
    splish: {
      counter: (count: number) => number;
      loadConfiguration: () => Promise<SynthesizedInfo>;
      textToSynthesize: (text: string) => Promise<string>;
      readAudioFile: (filename: string) => Promise<Buffer>;
    };
  }
}
