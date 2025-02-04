import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import ReactTooltip from 'react-tooltip';
import axios from 'axios';
import {Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Button, Typography, Divider ,AppBar, Toolbar} from '@material-ui/core';
import Map from './map';
import Pie from './Pie';
import './background.css'
  const PROJECTION_CONFIG = {
    scale: 1000,
    center: [80.9629, 20]
  };
  

  
const INDIA_TOPO_JSON = require('./IndiaState.topo.json');
const getHeatMapData = () => {
    var data = []
    for(var i = 0; i < INDIA_TOPO_JSON.objects.ne_10m_admin_1_India_Official.geometries.length; i++){
        
        let curr = {
            name: INDIA_TOPO_JSON.objects.ne_10m_admin_1_India_Official.geometries[i].properties.name,
            value: INDIA_TOPO_JSON.objects.ne_10m_admin_1_India_Official.geometries[i].properties.population,
        }
        data.push(curr)
    }
    return data
};

  
  const COLOR_RANGE = ['#eedc9b','#dcf483','#8ee677', '#5fd4a8','#53bbc9', '#5893d8']
  
  const DEFAULT_COLOR = '#EEE';

  const geographyStyle = {
    default: {
      outline: 'none'
    },
    hover: {
      fill: '#ccc',
      transition: 'all 250ms',
      outline: 'none'
    },
    pressed: {
      outline: 'none'
    }
  };
 

  const MapChart = () => {
      //console.log(INDIA_TOPO_JSON)
    const [tooltipContent, setTooltipContent] = useState('');
    const [data, setData] = useState(getHeatMapData());
    const [area, setArea] = useState("")
    const [open, setOpen] = React.useState(false);
    const [variable,setVariable]=useState(false);
    const [pass,setPass]=useState('');
    const [state, setFiles] = React.useState({file1:"", file2:"", file3:""});

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const gradientData = {
      fromColor: COLOR_RANGE[0],
      toColor: COLOR_RANGE[COLOR_RANGE.length - 1],
      min: 0,
      max: data.reduce((max, item) => (item.value > max ? item.value : max), 0)
    };
  
    const colorScale = scaleQuantile()
      .domain(data.map(d => d.value))
      .range(COLOR_RANGE);
  
    const onMouseEnter = (geo, current = { value: 'NA' }) => {
      return () => {
        setTooltipContent(`${geo.properties.name}`);
      };
    };
  
    const onClick = (curr)=>{
        setArea(curr.name.toLowerCase())
        setOpen(true)
    }
    const onMouseLeave = () => {
      setTooltipContent('');
    };
  
    const onChangeButtonClick = () => {
      setData(getHeatMapData());
    };

    
    const handleFileChange = (event) => {
        setFiles({...state, [event.target.name] : event.target.files[0]})
      };
    
    const onSubmit = (event) =>{
        event.preventDefault()
        const data = new FormData()
        console.log(state)
        data.append("file1",state.file1)
        data.append("file2",state.file2)
        data.append("file3",state.file3)
            axios
                .post(
                        "https://cni-backend.herokuapp.com/",
                data
                        ,
                    {
                headers: {
                "Content-Type":"multipart/form-data"
                }
                }
                )
            .then(res => {
                console.log(res.data);
                setPass(res.data);
                setVariable(true);
                setOpen(false)
            })
            .catch(err =>{
                console.log(err)
                setOpen(false)
            })
    }

    const handleHomeClick = () => {
      setVariable(false)
    }
  return (
    <>
    <AppBar position="static">
        <Toolbar style={{backgroundColor:"#141e30"}}>
          <Button onClick={handleHomeClick} style={{color:"white"}}>Home</Button>
        </Toolbar>
      </AppBar>
    {variable === false && 

    <div className="divBack" >
        <div style={{paddingTop:"2%", paddingBottom:"5%", color:"white"}}>
        <center><Typography variant="h4" >CNI Hackathon 2020</Typography><br/>
          <Divider style={{ width:"5%", height:2, backgroundColor:"white"}} variant="middle"/><br/>
          <Typography component="p">
            Please click on the state of your choice and upload district, lab and transfer data of that state.
          </Typography></center>
        </div>
    
    <ReactTooltip>{tooltipContent}</ReactTooltip>
    <ComposableMap
        projectionConfig={PROJECTION_CONFIG}
        projection="geoMercator"
        width={1000}
        height={700}
        data-tip=""
    >
        <Geographies geography={INDIA_TOPO_JSON}>
          {({ geographies }) =>
            geographies.map(geo => {
              const current = data.find(s => s.name.toUpperCase() === geo.properties.name.toUpperCase());
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={current ? colorScale(current.value) : DEFAULT_COLOR}
                  style={geographyStyle}
                  onMouseEnter={onMouseEnter(geo, current)}
                  onMouseLeave={onMouseLeave}
                  onClick={()=>{onClick(current)}}
                />
              );
            })
          }
        </Geographies>
    </ComposableMap>
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" >
        <DialogTitle id="form-dialog-title">Upload data</DialogTitle>
        <form onSubmit={onSubmit}>
        <DialogContent>
            <DialogContentText>
                Supported file extensions : xlsx and csv.
            </DialogContentText>
                <label>District Data:</label><br/>
                <input type="file" name="file1"  onChange= {handleFileChange}/><br/><br/>
                <label>Lab Data:</label><br/>
                <input type="file" name="file2"  onChange= {handleFileChange}/><br/><br/>
                <label>Transfer Data:</label><br/>
                <input type="file" name="file3"  onChange= {handleFileChange}/><br/><br/>
            
        </DialogContent>
        <DialogActions>
            <Button type="submit" color="primary">Submit File</Button>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
        </DialogActions>
        </form>
    </Dialog>
    </div>
  }
  {variable===true &&(
    <div>
      <Map datum={pass} area={area}/>
    </div>
  )}
</>
  );
};

export default MapChart;
