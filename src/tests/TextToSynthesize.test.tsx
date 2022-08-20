import { render, screen, act, waitFor } from "@testing-library/react";
import App from "../App";

import "@testing-library/jest-dom";

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

    // TODO: 合成ボタンが表示されている
  });

  test("テキストの入力エリアに文字列が入力されていないときは合成ボタンが無効である。", () => {
    // TODO: テキストの入力エリアに文字列が入力されていないときは合成ボタンが無効である。
  });

  test("テキストの入力エリアに文字列が入力されているときは合成ボタンが有効である。", () => {
    // TODO: テキストの入力エリアに文字列が入力されているときは合成ボタンが有効である。
  });

  test("テキストの入力エリアに文字列が入力されているときに合成ボタンをクリックする", () => {
    // TODO: 入力エリアの文字列が合成されたテキストのエリアに表示される。
    // TODO: 入力エリアの文字列がクリアされる。
    // TODO: 合成ボタンが無効になる。
    // TODO: 合成された音声を保存したファイル名が設定されている。
  });
});
