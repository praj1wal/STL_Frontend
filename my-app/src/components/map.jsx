import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Line, Marker } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import ReactTooltip from 'react-tooltip';
import Pie from './Pie';
import Donut from './donut';
    
  const PROJECTION_CONFIG = {
    scale: 2000,
    center: [78.9629, 15.5937]
  };
  

  
const MAHARASHTRA_TOPO_JSON = require('./maharashtra.topo.json');
const KARNATAKA_TOPO_JSON = require('./karnataka.topo.json');

const dicionary = {

}

const getHeatMapData = () => {
    return [
    { dt_code: '507', district: 'Gondiya', value: 23 },
    { dt_code: '506', district: 'Bhandara', value: 20 },
    { dt_code: '499', district: 'Jalgaon', value: 20 },
    { dt_code: '504', district: 'Wardha', value: 24 },
    { dt_code: '500', district: 'Buldana', value: 27 },
    { dt_code: '501', district: 'Akola', value: 21 },
    { dt_code: '516', district: 'Nashik', value: 22 },
    { dt_code: '508', district: 'Gadchiroli', value: 29 },
    { dt_code: '502', district: 'Washim', value: 24 },
    { dt_code: '509', district: 'Chandrapur', value: 26 },
    { dt_code: '510', district: 'Yavatmal', value: 27 },
    { dt_code: '514', district: 'Jalna', value: 22 },
    { dt_code: '522', district: 'Ahmadnagar', value: 28 },
    { dt_code: '512', district: 'Hingoli', value: 28 },
    { dt_code: '511', district: 'Nanded', value: 21 },
    { dt_code: '513', district: 'Parbhani', value: 59 },
    { dt_code: '521', district: 'Pune', value: 29 },
    { dt_code: '523', district: 'Bid', value: 59 },
    { dt_code: '519', district: 'Mumbai', value: 59 },
    { dt_code: '524', district: 'Latur', value: 24 },
    { dt_code: '525', district: 'Osmanabad', value: 27 },
    { dt_code: '526', district: 'Solapur', value: 21 },
    { dt_code: '527', district: 'Satara', value: 29 },
    { dt_code: '528', district: 'Ratnagiri', value: 20 },
    { dt_code: '531', district: 'Sangli', value: 14 },
    { dt_code: '530', district: 'Kolhapur', value: 25 },
    { dt_code: '529', district: 'Sindhudurg', value: 15 },
    { dt_code: '517', district: 'Thane', value: 17 },
    { dt_code: '732', district: 'Palghar', value: 17 },
    { dt_code: '497', district: 'Nandurbar', value: 27 },
    { dt_code: '503', district: 'Amravati', value: 29 },
    { dt_code: '498', district: 'Dhule', value: 19 },
    { dt_code: '505', district: 'Nagpur', value: 20 },
    { dt_code: '515', district: 'Aurangabad', value: 59 },
    { dt_code: '520', district: 'Raigarh', value: 25 },
    { dt_code: '518', district: 'Mumbai Suburban', value: 25 },
  ];
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
 

  function MapChart ({datum}) {

console.log("This is datum",datum)
    var arr = [];
    var len = datum[0].length;
    for (var i = 0; i < len; i++) {
        arr.push({
          dt_code: datum[0].district_id[i],
          district: datum[0].district_name[i],
          value: datum[0].samples[i]
        });
    }
    console.log("This is arr",arr)

    const [tooltipContent, setTooltipContent] = useState('');
    const [data, setData] = useState(arr);
    const [piedata, setPieData] = useState([])
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
  
    const onChangeButtonClick = () => {
      setData(getHeatMapData());
    };

    const onClick = (geo, curr) => {
      var pdata = []
      for(var i = 0; i < datum[1].length; i++){
        if(curr.dt_code === datum[1].district_id[i]){
          pdata.push({"name":datum[1].id[i], "value":datum[1].capacity[i]})
        }
      }
      setPieData(pdata)
      showRoute(curr)
    };

    const showRoute = (curr) => {
      console.log("route")
      let data = []
      let lat = 0
      let lon = 0
      for(var i = 0; i < datum[0].length; i++){
        if(curr.dt_code === datum[0].district_id[i]){
          lat = datum[0].lat[i]
          lon = datum[0].lon[i]
          break
        }
      }
      for(var i = 0; i < datum[2].length; i++){
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

  return (
    <>
      <h1 className="no-margin center">States and UTs</h1>
      <ReactTooltip>{tooltipContent}</ReactTooltip>
      <ComposableMap
          projectionConfig={PROJECTION_CONFIG}
          projection="geoMercator"
          width={600}
          height={400}
          data-tip=""
      >
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
              <circle r={4} fill="#0000FF" />
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
      </ComposableMap>
      <div className="center">
        <button className="mt16" onClick={onChangeButtonClick}>Change</button>
      </div>
      <div className="center">
        <Pie data={piedata} />
        <Donut />
      </div>
    </>
  );
};

export default MapChart;
