import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("splish", {
  counter: (count: number) => {
    return count + 1;
  },
});
