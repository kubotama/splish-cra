import { render, screen, act } from "@testing-library/react";

import "@testing-library/jest-dom";

import App from "../App";
import { SplishIpc } from "../SplishIpc";

jest.mock("../SplishIpc.ts");
const mockSplishIpc = SplishIpc as jest.Mocked<typeof SplishIpc>;

test.skip("タイトルの表示", () => {
  mockSplishIpc.loadConfiguration.mockResolvedValue([]);

  act(() => {
    render(<App />);
  });
  const linkElement = screen.getByText(/SPLISH/i);
  expect(linkElement).toBeInTheDocument();
});
