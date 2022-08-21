import { render, screen, act } from "@testing-library/react";
import App from "../App";

import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

import { SplishIpc } from "../SplishIpc";

jest.mock("../SplishIpc.ts");
const mockSplishIpc = SplishIpc as jest.Mocked<typeof SplishIpc>;

describe("入力したテキストから音声に合成する。", () => {
  test("テキストの入力エリアと合成ボタンが表示されている。", () => {
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
    // テキストの入力エリアが表示されている
    const inputText = screen.getByTestId("inputText");
    expect(inputText).toBeVisible();

    // 合成ボタンが表示されている
    const synthesizeButton = screen.getByTestId("synthesizeButton");
    expect(synthesizeButton).toBeVisible();
  });

  test("テキストの入力エリアに文字列が入力されていないときは合成ボタンが無効である。", () => {
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
    // テキストの入力エリアに文字列が入力されていないときは合成ボタンが無効である。
    const inputText = screen.getByTestId("inputText");
    expect(inputText).toHaveValue("");
    const synthesizeButton = screen.getByTestId("synthesizeButton");
    expect(synthesizeButton).toBeDisabled();
  });

  test("テキストの入力エリアに文字列が入力されているときは合成ボタンが有効である。", async () => {
    // Arrange
    mockSplishIpc.getSynthesizedInfo.mockResolvedValue({
      text: "",
      filename: "",
    });
    render(<App />);
    // const inputText = screen.getByTestId("inputText");
    const inputText =
      screen.getByPlaceholderText("合成するテキストを入力して下さい");
    const text =
      "Today's Changelog brings improved date filtering and the command palette (beta) to Projects!";

    // Act
    // テキストの入力エリアに文字列を入力する
    await userEvent.type(inputText, text);

    // Assert
    // テキストの入力エリアに文字列が入力されているときは合成ボタンが有効である。
    expect(inputText).toHaveValue(text);
    const synthesizeButton = screen.getByTestId("synthesizeButton");
    expect(synthesizeButton).toBeEnabled();
  });

  test("テキストの入力エリアに文字列が入力されているときに合成ボタンをクリックする", async () => {
    // Arrange
    mockSplishIpc.getSynthesizedInfo.mockResolvedValue({
      text: "",
      filename: "",
    });
    render(<App />);
    // const inputText = screen.getByTestId("inputText");
    const inputText =
      screen.getByPlaceholderText("合成するテキストを入力して下さい");
    const synthesizeButton = screen.getByTestId("synthesizeButton");
    const synthesizedText = screen.getByTestId("synthesizedText");
    const text =
      "Today's Changelog brings improved date filtering and the command palette (beta) to Projects!";

    // Act
    // テキストの入力エリアに文字列を入力する
    await userEvent.type(inputText, text);
    // 合成ボタンをクリックする
    await userEvent.click(synthesizeButton);

    // Assert
    // 入力エリアの文字列が合成されたテキストのエリアに表示される。
    expect(synthesizedText).toHaveValue(text);
    // 入力エリアの文字列がクリアされる。
    expect(inputText).toHaveValue("");
    // 合成ボタンが無効になる。
    expect(synthesizeButton).toBeDisabled();
    // TODO: 合成された音声を保存したファイル名が設定されている。
  });
});
