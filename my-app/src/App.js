import React from "react";
import './App.css';
import Map from './components/map';
import IndiaMap from './components/IndiaMap';
import {AppBar, Toolbar, Typography} from '@material-ui/core';
function App() {
  
  
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar style={{backgroundColor:"#ff5533"}}>
          Hackathon
        </Toolbar>
      </AppBar>
      <Typography variant="h5">CNI SWABS2LABS HACKATHON</Typography>
       <IndiaMap />
    </div>
  );
}

export default App;
