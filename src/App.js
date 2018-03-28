import React, { Component } from 'react';
import './App.css';

import Container1 from './components/container1.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const stylePadding= {
  paddingBottom:'30px',
};

class App extends Component {
  render() {
    return (
       <MuiThemeProvider>
      <div className="App" style={stylePadding}>
        <h1>OVERWATCH SKILL RATING</h1>
        <h2>
          To get started, type in a valid Overwatch BattleTag
        </h2>
        <Container1 />        
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
