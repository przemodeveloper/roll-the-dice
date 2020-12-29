import React from 'react';
import './App.scss';
import { Component } from 'react';
import Dice from './Components/Dice/Dice';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Dice />
      </div>
    );
  }
}

export default App;
