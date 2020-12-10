import React from "react";
import './App.css';
import Map from './components/map';
import IndiaMap from './components/IndiaMap';
import {AppBar, Toolbar, Typography} from '@material-ui/core';
function App() {
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar style={{backgroundColor:"#141e30"}}>
          Hackathon
        </Toolbar>
      </AppBar>
      <IndiaMap />
    </div>
  );
}

export default App;
