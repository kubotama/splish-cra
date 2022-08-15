import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("起動時に、直前に音声に合成したテキストと、音声を保存したファイル名を取得する。", () => {
  test("テキストとファイル名の領域が存在する。", () => {
    // Arrange
    render(<App />);

    // Act

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
    render(<App />);

    // Act

    // Assert
    // テキストに""が設定されている
    const synthesizedText = screen.getByTestId("synthesizedText");
    expect(synthesizedText.textContent).toBe("");

    // ファイル名に""が設定されている
    const synthesizedFilename = screen.getByTestId("synthesizedFilename");
    expect(synthesizedFilename.textContent).toBe("");
  });
});
