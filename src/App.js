import React, { Component } from 'react';
import './App.css';
import ologo from './Overwatch_circle_logo.svg';
import Footer from './components/footer.js'
import Container1 from './components/container1.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';



class App extends Component {
  render() {
    return (
       <MuiThemeProvider>
      <div className="App">
        <h1>OVERWATCH SKILL RATING</h1>
          <img src={ologo} className="App-logo" alt="logo" />
        <h2>
          To get started, type in a valid Overwatch BattleTag
        </h2>
        <Container1 />
        <Footer />
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
