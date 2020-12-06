import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import ReactTooltip from 'react-tooltip';

    
  const PROJECTION_CONFIG = {
    scale: 700,
    center: [78.9629, 22.5937]
  };
  

  
const MAHARASHTRA_TOPO_JSON = require('./maharashtra.topo.json');

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
 

  const MapChart = () => {
    const [tooltipContent, setTooltipContent] = useState('');
    const [data, setData] = useState(getHeatMapData());

    
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

  return (
      <>
       <h1 className="no-margin center">States and UTs</h1>
      <ReactTooltip>{tooltipContent}</ReactTooltip>
    <ComposableMap
        projectionConfig={PROJECTION_CONFIG}
        projection="geoMercator"
        width={600}
        height={220}
        data-tip=""
    >
        <Geographies geography={MAHARASHTRA_TOPO_JSON}>
          {({ geographies }) =>
            geographies.map(geo => {
              const current = data.find(s => s.dt_code === geo.properties.dt_code);
              // console.log("This is geo",geo);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={current ? colorScale(current.value) : DEFAULT_COLOR}
                  style={geographyStyle}
                  onMouseEnter={onMouseEnter(geo, current)}
                  onMouseLeave={onMouseLeave}
                />
              );
            })
          }
        </Geographies>
    </ComposableMap>
        <div className="center">
          <button className="mt16" onClick={onChangeButtonClick}>Change</button>
        </div>
</>
  );
};

export default MapChart;
