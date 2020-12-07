import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import ReactTooltip from 'react-tooltip';
import axios from 'axios';
import {Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Button} from '@material-ui/core';
import Map from './map';
    
  const PROJECTION_CONFIG = {
    scale: 1000,
    center: [78.9629, 10.5937]
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

  const COLOR_RANGE = [
    '#ffedea',
    '#ffcec5',
    '#ffad9f',
    '#ff8a75',
    '#ff5533',
    '#e2492d',
    '#be3d26',
    '#9a311f',
    '#782618'
  ];
  
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

    const [open, setOpen] = React.useState(false);
    const [variable,setVariable]=useState(false);
    const [pass,setPass]=useState('');



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
        setTooltipContent(`${geo.properties.NAME_1}: ${current.value}`);
      };
    };
  
    const onClick = (geo)=>{
        setOpen(true)
    }
    const onMouseLeave = () => {
      setTooltipContent('');
    };
  
    const onChangeButtonClick = () => {
      setData(getHeatMapData());
    };

    const [files, setFiles] = React.useState([]);
    const handleFileChange = (event) => {
        setFiles(event.target.files)
      };
    
    const onSubmit = (event) =>{
        event.preventDefault()
        const data = new FormData()
        let filesData  = files;
        for(var i = 0; i < filesData.length;i++){
            data.append(`file${i}`, filesData[i]);
        }
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
    {variable === false && <div><ReactTooltip>{tooltipContent}</ReactTooltip>
    <ComposableMap
        projectionConfig={PROJECTION_CONFIG}
        projection="geoMercator"
        width={1000}
        height={1000}
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
                  onClick={()=>{onClick(geo)}}
                />
              );
            })
          }
        </Geographies>
    </ComposableMap>
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Upload data</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Supported file extensions : xlsx and csv.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <form onSubmit={onSubmit}>
                <input type="file" name="files" multiple onChange= {handleFileChange}/>
                <Button type="submit" color="primary">Submit File</Button>
            </form>
        </DialogActions>
    </Dialog>
    <div className="center">
        <button className="mt16" onClick={onChangeButtonClick}>Change</button>
    </div>
    </div>
  }
  {variable===true && <Map datum={pass}/>}
</>
  );
};

export default MapChart;
