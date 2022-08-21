import { render, screen, act, waitFor } from "@testing-library/react";
import App from "../App";

import "@testing-library/jest-dom";

import { SplishIpc } from "../SplishIpc";

jest.mock("../SplishIpc.ts");
const mockSplishIpc = SplishIpc as jest.Mocked<typeof SplishIpc>;

describe("起動時に、直前に音声に合成したテキストと、音声を保存したファイル名を取得する。", () => {
  beforeEach(() => {
    mockSplishIpc.getSynthesizedInfo.mockClear();
  });

  test("テキストとファイル名の領域が存在する。", () => {
    // Arrange
    mockSplishIpc.getSynthesizedInfo.mockResolvedValue({
      text: "",
      filename: "",
    });

    // Act
    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      render(<App />);
    });

    // Assert
    // テキストの領域が存在する
    const synthesizedText = screen.getByTestId("synthesizedText");
    expect(synthesizedText).toBeInTheDocument();

    // ファイル名の領域が存在する
    const synthesizedFilename = screen.getByTestId("synthesizedFilename");
    expect(synthesizedFilename).toBeInTheDocument();
  });

  test("splish.jsonがない場合には、テキストとファイル名とも''にを設定する。", () => {
    // Arrange
    mockSplishIpc.getSynthesizedInfo.mockResolvedValue({
      text: "",
      filename: "",
    });

    // Act
    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      render(<App />);
    });
    // Assert

    // テキストに""が設定されている
    const synthesizedText = screen.getByTestId("synthesizedText");
    expect(synthesizedText.textContent).toBe("");

    // ファイル名に""が設定されている
    const synthesizedFilename = screen.getByTestId("synthesizedFilename");
    expect(synthesizedFilename.textContent).toBe("");
  });

  test("splish.jsonがある場合には、splish.jsonのテキストとファイル名を設定する。", async () => {
    // Arrange
    mockSplishIpc.getSynthesizedInfo.mockResolvedValue({
      text: "Before we can enable the visualizations, we need to install the Lighthouse plugin. Skip this step if you're already using it! Otherwise, navigate to Plugins and search for Lighthouse. Click Install.",
      filename: "speech.mp3",
    });

    // Act
    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      render(<App />);
    });

    // Arrange
    const synthesizedText = screen.getByTestId("synthesizedText");
    const synthesizedFilename = screen.getByTestId("synthesizedFilename");

    // テキストが設定されている
    await waitFor(() => {
      expect(synthesizedText).toHaveValue(
        "Before we can enable the visualizations, we need to install the Lighthouse plugin. Skip this step if you're already using it! Otherwise, navigate to Plugins and search for Lighthouse. Click Install."
      );
    });
    // ファイル名が設定されている
    await waitFor(() => {
      expect(synthesizedFilename.textContent).toBe("speech.mp3");
    });
  });
});
