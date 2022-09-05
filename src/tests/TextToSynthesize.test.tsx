/* eslint-disable max-len */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable import/no-extraneous-dependencies */
import { render, screen, act } from "@testing-library/react";

import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

import App from "../App";
import { SplishIpc } from "../SplishIpc";

jest.mock("../SplishIpc.ts");
const mockSplishIpc = SplishIpc as jest.Mocked<typeof SplishIpc>;

describe.skip("入力したテキストから音声に合成する。", () => {
  test("テキストの入力エリアと合成ボタンが表示されている。", () => {
    // Arrange
    mockSplishIpc.loadConfiguration.mockResolvedValue({
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
    mockSplishIpc.loadConfiguration.mockResolvedValue({
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
    mockSplishIpc.loadConfiguration.mockResolvedValue({
      text: "",
      filename: "",
    });
    render(<App />);
    // const inputText = screen.getByTestId("inputText");
    const inputText = screen.getByPlaceholderText("合成するテキストを入力して下さい");
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

  test.each([
    {
      input:
        "Today's Changelog brings improved date filtering and the command palette (beta) to Projects!",
      expected:
        "Today's Changelog brings improved date filtering and the command palette (beta) to Projects!",
    },
    {
      input:
        "And if you’re new to Lighthouse Scores, or want to learn more about how they're calculated, check out the Developer's Intro to Core Web Vitals.",
      expected:
        "And if you're new to Lighthouse Scores, or want to learn more about how they're calculated, check out the Developer's Intro to Core Web Vitals.",
    },
    {
      input: "And if you’re new to Lighthouse Scores, And if you’re new to Lighthouse Scores,",
      expected: "And if you're new to Lighthouse Scores, And if you're new to Lighthouse Scores,",
    },
  ])(
    "テキストの入力エリアに文字列が入力されているときに合成ボタンをクリックする: $input",
    async ({ input, expected }) => {
      // Arrange
      mockSplishIpc.loadConfiguration.mockResolvedValue({
        text: "",
        filename: "",
      });
      // mockSplishIpc.textToSynthesize.mockResolvedValue("speech.mp3");
      render(<App />);
      // const inputText = screen.getByTestId("inputText");
      const inputText = screen.getByPlaceholderText("合成するテキストを入力して下さい");
      const synthesizeButton = screen.getByTestId("synthesizeButton");
      const synthesizedText = screen.getByTestId("synthesizedText");
      const synthesizedFilename = screen.getByTestId("synthesizedFilename");
      // const text =
      //   "Today's Changelog brings improved date filtering and the command palette (beta) to Projects!";

      // Act
      // テキストの入力エリアに文字列を入力する
      await userEvent.type(inputText, input);
      // 合成ボタンをクリックする
      await userEvent.click(synthesizeButton);

      // Assert
      // 入力エリアの文字列が合成されたテキストのエリアに表示される。
      expect(synthesizedText).toHaveValue(expected);
      // 入力エリアの文字列がクリアされる。
      expect(inputText).toHaveValue("");
      // 合成ボタンが無効になる。
      expect(synthesizeButton).toBeDisabled();
      // 合成された音声を保存したファイル名が設定されている。
      expect(synthesizedFilename.textContent).toBe("speech.mp3");

      expect(mockSplishIpc.textToSynthesize).toBeCalledTimes(1);
      expect(mockSplishIpc.textToSynthesize).toBeCalledWith(expected);
    },
  );
});
