export declare global {
  interface Window {
    splish: {
      counter: (count: number) => number;
      getSynthesizedInfo: () => Promise<SynthesizedInfo>;
    };
  }
}
