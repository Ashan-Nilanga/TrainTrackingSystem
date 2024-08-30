import React, { useState } from "react";

import TrainTracker from "./components/TrainTarcker";

import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Train Tracker</h1>
      </header>
      <TrainTracker />
    </div>
  );
}

export default App;
