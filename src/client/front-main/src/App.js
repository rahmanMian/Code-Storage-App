import './App.css';
import {AddQuestion} from './add/addQuestion.jsx';
import React, { useState } from 'react';

function App() {

  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <>
    <div className="App">
      <header className="App-header">
      <button onClick={toggleDarkMode}>
          {darkMode ? "Let There Be Light 🌞" : "Escape to the Shadows 🌚"}
        </button>
      </header>
      </div>
      <AddQuestion />
    </>
  );
}

export default App;
