import { render, screen } from "@testing-library/react";
import App from "../App";

import "@testing-library/jest-dom";

import { SplishIpc } from "../SplishIpc";

jest.mock("../SplishIpc.ts");
const mockSplishIpc = SplishIpc as jest.Mocked<typeof SplishIpc>;

describe("合成した音声を再生する。", () => {
  beforeEach(() => {
    mockSplishIpc.getSynthesizedInfo.mockClear();
  });

  test("再生ボタンが表示されている。", () => {
    // Arrange
    mockSplishIpc.getSynthesizedInfo.mockResolvedValue({
      text: "",
      filename: "",
    });
    render(<App />);
    const playButton = screen.getByRole("button", { name: "再生" });

    // Act

    // Assert
    // 再生ボタンが表示されている
    expect(playButton).toBeVisible();
  });

  test("splish.jsonのfilenameが設定されていない場合には無効になる。", () => {});
  test("splish.jsonのfilenameが設定されている場合には再生ボタンが有効になる。", () => {});
  test("再生ボタンをクリックすると、再生ボタンが無効になる。", () => {});
  test("再生が終了したら、再生ボタンを有効にする。", () => {});
});
