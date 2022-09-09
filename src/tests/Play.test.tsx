import * as fs from "fs";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import App from "../App";
import { SplishIpc } from "../SplishIpc";

jest.mock("../SplishIpc.ts");
const mockSplishIpc = SplishIpc as jest.Mocked<typeof SplishIpc>;

describe.skip("合成した音声を再生する。", () => {
  beforeEach(() => {
    mockSplishIpc.loadConfiguration.mockClear();
  });

  test("再生ボタンが表示されている。", () => {
    // Arrange
    mockSplishIpc.loadConfiguration.mockResolvedValue([]);
    render(<App />);
    const playButton = screen.getByRole("button", { name: "再生" });

    // Act

    // Assert
    // 再生ボタンが表示されている
    expect(playButton).toBeVisible();
  });

  test("splish.jsonのfilenameが設定されていない場合には無効になる。", () => {
    // Arrange
    mockSplishIpc.loadConfiguration.mockResolvedValue([]);
    render(<App />);
    const playButton = screen.getByRole("button", { name: "再生" });

    // Act

    // Assert
    // splish.jsonのfilenameが設定されていない場合には無効になる。
    expect(playButton).toBeDisabled();
  });

  test.skip("splish.jsonのfilenameが設定されている場合には再生ボタンが有効になる。", () => {
    // Arrange
    mockSplishIpc.loadConfiguration.mockResolvedValue([]);
    render(<App />);
    const playButton = screen.getByRole("button", { name: "再生" });

    // Act

    // Assert
    // splish.jsonのfilenameが設定されている場合には再生ボタンが有効になる。
    expect(playButton).toBeEnabled();
  });

  test.skip("再生ボタンをクリックすると、再生ボタンが無効になる。", async () => {
    // Arrange
    mockSplishIpc.loadConfiguration.mockResolvedValue([]);
    const buffer = fs.readFileSync("speech.mp3");
    mockSplishIpc.readAudioFile.mockResolvedValue(buffer);
    render(<App />);
    const playButton = screen.getByRole("button", { name: "再生" });

    // Act
    await userEvent.click(playButton);

    // Assert
    // splish.jsonのfilenameが設定されている場合には再生ボタンが有効になる。
    expect(playButton).toBeDisabled();
  });
  // test.skip("再生が終了したら、再生ボタンを有効にする。", () => {});
});
