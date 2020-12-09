import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Line, Marker, ZoomableGroup } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import ReactTooltip from 'react-tooltip';
import Pie from './Pie';
import Donut from './donut';
import Table from './table';
import {Grid, Paper, Button} from '@material-ui/core';
import LinearGradient from './LinearGradient';
  const PROJECTION_CONFIG = {
    scale:1000,
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
 

  function MapChart ({datum, area}) {
    const KARNATAKA_TOPO_JSON = require(`./${area}.topo.json`);
console.log("This is datum",datum)
    var arr = [];
    var len = datum[0].length;
    var i
    for (i = 0; i < len; i++) {
        arr.push({
          dt_code: datum[0].district_id[i],
          district: datum[0].district_name[i],
          value: datum[0].samples[i]
        });
    }
    console.log("This is arr",arr)

    var dondata = []
    for(i = 0; i <= datum[0].length; i++){
      dondata.push({publiclab:0, privatelab:0})
    }
    console.log("This is dondata",dondata)

    for(i = 0; i < datum[1].length; i++){
      if(!datum[1].lab_type[i]){
      dondata[datum[1].district_id[i]].publiclab++;
      }
      else{
        dondata[datum[1].district_id[i]].privatelab++;
      }
    }



    const [tooltipContent, setTooltipContent] = useState('');
    const [data, setData] = useState(arr);
    const [zoomdata, setZoom] = useState(1)
    const [piedata, setPieData] = useState([])
    const [donutdata, setDonutData] = useState([])
    const [routeData, setRouteData] = useState([])
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
        setTooltipContent(`${geo.properties.district}: ${current.value}`);
      };
    };
  
    const onMouseLeave = () => {
      setTooltipContent('');
    };

    const onZoomIn = () => {
      let currzoom = zoomdata
      setZoom(currzoom+1)
    }
    const onZoomOut = () => {
      let currzoom = zoomdata
      if(currzoom === 1){
        return
      }
      setZoom(currzoom-1)
    }
  

    const onClick = (geo, curr) => {
      var pdata = []
      for(var i = 0; i < datum[1].length; i++){
        if(curr.dt_code === datum[1].district_id[i]){
          pdata.push({"name":datum[1].id[i], "value":datum[1].capacity[i]})
        }
      }
      setPieData(pdata)
      showRoute(curr)
      var nayadata=[{"name":"publiclab" ,"value": dondata[curr.dt_code].publiclab},{"name":"privatelab" ,"value": dondata[curr.dt_code].privatelab}]
      console.log("This is nayadata",nayadata)
      setDonutData(nayadata)
    };

    const showRoute = (curr) => {
      console.log("route")
      let data = []
      let lat = 0
      let lon = 0
      var i = 0
      for(i = 0; i < datum[0].length; i++){
        if(curr.dt_code === datum[0].district_id[i]){
          lat = datum[0].lat[i]
          lon = datum[0].lon[i]
          break
        }
      }
      for(i = 0; i < datum[2].length; i++){
        if(curr.dt_code === datum[2].source[i]){
          let destlat = 0 
          let destlon = 0
          for(var j = 0; j < datum[1].length; j++){
            if(datum[2].destination[i] === datum[1].id[j]){
              destlat = datum[1].lat[j]
              destlon = datum[1].lon[j]
              break
            }
          }
          data.push({src:[lon, lat],dest:[destlon, destlat]})
        }
      }
      console.log("This is data",data);
      setRouteData(data)
    }

    const handleFilter = ({ constructor: { name } }) => {
      return name !== "WheelEvent";
    };

  return (
    <div style={{overflow:"hidden"}}>
    <Grid container spacing={2} >
      <Grid item xs={2} sm={2} style={{marginLeft:"5%"}}>
          <h2>{area.toUpperCase()}</h2>
          <LinearGradient data={gradientData} />
      </Grid>
      <Grid item xs = {8} sm = {8} >
          <ReactTooltip>{tooltipContent}</ReactTooltip>
          <ComposableMap
              projectionConfig={PROJECTION_CONFIG}
              projection="geoMercator"
              width={280}
              height={150}
              data-tip=""
          >
            <ZoomableGroup zoom={zoomdata} filterZoomEvent={handleFilter} center={[77,15]}>
              <Geographies geography={KARNATAKA_TOPO_JSON}>
                {({ geographies }) =>
                  geographies.map(geo => {
                    const current = data.find(s => s.district.toUpperCase() === geo.properties.district.toUpperCase());
                    // console.log("This is geo",geo);
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={current ? colorScale(current.value) : DEFAULT_COLOR}
                        style={geographyStyle}
                        onMouseEnter={onMouseEnter(geo, current)}
                        onMouseLeave={onMouseLeave}
                        onClick={()=>{onClick(geo, current)}}
                      />
                    );
                  })
                }
              </Geographies>
              {routeData.length !== 0 && (
                <Marker coordinates={routeData[0].src}>
                  <circle r={2} fill="#0000FF" />
                </Marker>
              )}
              {routeData.map((curr)=>{
                return(  
                  <Line
                  from={curr.src}
                  to={curr.dest}
                  stroke="#000000"
                  strokeWidth={1}
                  strokeLineCap="round"
                />)
              })}
            </ZoomableGroup>
          </ComposableMap>
          <Button onClick={onZoomIn}>Zoom in</Button>
          <Button onClick={onZoomOut}>Zoom out</Button>
      </Grid>
      <Grid item xs = {12} sm = {6}>
        <Paper elevation={2}>
          <center><Pie data={piedata}/></center>
        </Paper>
      </Grid>
      <Grid item xs = {12} sm = {6}>
        <Paper elevation={2}>
          <center><Donut data={donutdata} /></center>
        </Paper>
      </Grid>
      <Grid item xs = {12} sm = {12}>
        <Paper elevation={2}>
          <Table data={datum}/>
        </Paper>
      </Grid>
    </Grid>
    </div>
  );
};

export default MapChart;
