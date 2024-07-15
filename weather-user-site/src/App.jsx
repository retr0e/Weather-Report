/* eslint-disable no-unused-vars */
import { useState } from "react";
import Widget from "./components/Widget.jsx";
import "./App.css";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [location, setLocation] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLocation(inputValue);
  };

  return (
    <div>
      <Widget definedLocation={location} />

      <form onSubmit={handleFormSubmit}>
        <input
          type='text'
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
}

export default App;
