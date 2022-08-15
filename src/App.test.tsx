import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("タイトルの表示", () => {
  render(<App />);
  const linkElement = screen.getByText(/SPLISH/i);
  expect(linkElement).toBeInTheDocument();
});
