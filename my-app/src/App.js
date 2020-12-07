import React from "react";
import './App.css';
import Map from './components/map';
import IndiaMap from './components/IndiaMap';
import {AppBar, Toolbar, Typography} from '@material-ui/core';
import Pie from './components/Pie';
function App() {
  
  
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar style={{backgroundColor:"#ff5533"}}>
          Hackathon
        </Toolbar>
      </AppBar>
      <Typography variant="h3">CNI SWABS2LABS HACKATHON</Typography>
       {/* <IndiaMap /> */}
       <Pie />
    </div>
  );
}

export default App;
