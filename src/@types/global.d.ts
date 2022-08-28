export declare global {
  interface Window {
    splish: {
      loadConfiguration: () => Promise<SynthesizedInfo>;
      textToSynthesize: (text: string) => Promise<string>;
      readAudioFile: (filename: string) => Promise<Buffer>;
    };
  }
}
