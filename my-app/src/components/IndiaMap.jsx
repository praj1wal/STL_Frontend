import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import ReactTooltip from 'react-tooltip';
import axios from 'axios';
import {Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Button, Typography, Divider} from '@material-ui/core';
import Map from './map';
import Pie from './Pie';
import './jumbotron.css'
  const PROJECTION_CONFIG = {
    scale: 1000,
    center: [80.9629, 20.5937]
  };
  

  
const INDIA_TOPO_JSON = require('./indiaState.topo.json');
const getHeatMapData = () => {
    var data = []
    for(var i = 0; i < INDIA_TOPO_JSON.objects.IND_adm1.geometries.length; i++){
        
        let curr = {
            ID:INDIA_TOPO_JSON.objects.IND_adm1.geometries[i].properties.ID_1,
            NAME: INDIA_TOPO_JSON.objects.IND_adm1.geometries[i].properties.NAME_1,
            value: i*10,
        }
        data.push(curr)
    }
    //console.log("This is data",data)
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
          //console.log(geo)
        setTooltipContent(`${geo.properties.NAME_1}`);
      };
    };
  
    const onClick = (curr)=>{
        setArea(curr.NAME.toLowerCase())
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
                        "/",
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

  return (
    <>
    {variable === false && 
    <div >
        <div style={{paddingTop:"10%", paddingBottom:"5%"}}>
        <center><Typography variant="h4" >CNI Hackathon 2020</Typography><br/>
          <Divider style={{ width:"5%", height:2}} variant="middle"/><br/>
          <Typography variant="p">
            Please click on the state of your choice and upload district, lab and transfer data of that state.
          </Typography></center>
        </div>
    
    <ReactTooltip>{tooltipContent}</ReactTooltip>
    <ComposableMap
        projectionConfig={PROJECTION_CONFIG}
        projection="geoMercator"
        width={1000}
        height={600}
        data-tip=""
    >
        <Geographies geography={INDIA_TOPO_JSON}>
          {({ geographies }) =>
            geographies.map(geo => {
              const current = data.find(s => s.ID === geo.properties.ID_1);
              // console.log("This is geo",geo);
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
