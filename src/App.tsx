import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>learn react</p>
        <p>{count}</p>
        <button
          onClick={() => {
            console.log();
            setCount(window.myAPI.counter(count));
          }}
        >
          count
        </button>
      </header>
    </div>
  );
}

export default App;
