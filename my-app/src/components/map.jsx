import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Line, Marker, ZoomableGroup } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import ReactTooltip from 'react-tooltip';
import Pie from './Pie';
import Donut from './donut';
import Table from './table';
import { Grid, Paper, Button, Typography, Divider } from '@material-ui/core';
import LinearGradient from './LinearGradient';
const PROJECTION_CONFIG = {
  scale: 1500,
};



const COLORS1 = ['#eedc9b', '#dcf483', '#8ee677', '#5fd4a8', '#53bbc9', '#5893d8']
const DEFAULT_COLOR = '#DDD';

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


function MapChart({ datum, area }) {
  const KARNATAKA_TOPO_JSON = require(`./${area}.topo.json`);
  console.log("This is datum", datum)
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
  console.log("This is arr", arr)

  var dondata = []
  for (i = 0; i <= datum[0].length; i++) {
    dondata.push({ publiclab: 0, privatelab: 0 })
  }
  console.log("This is dondata", dondata)

  for (i = 0; i < datum[1].length; i++) {
    if (!datum[1].lab_type[i]) {
      dondata[datum[1].district_id[i]].publiclab++;
    }
    else {
      dondata[datum[1].district_id[i]].privatelab++;
    }
  }



  const [tooltipContent, setTooltipContent] = useState(null);
  const [data, setData] = useState(arr);
  const [zoomdata, setZoom] = useState(1)
  const [piedata, setPieData] = useState([])
  const [donutdata, setDonutData] = useState([])
  const [routeData, setRouteData] = useState([])
  const [selectedDist, setDistrict] = useState("Click On A District To See Lab Data")
  const gradientData = {
    fromColor: COLORS1[0],
    toColor: COLORS1[COLORS1.length - 1],
    min: 0,
    max: data.reduce((max, item) => (item.value > max ? item.value : max), 0)
  };


  const color1 = scaleQuantile()
    .domain(data.map(d => d.value))
    .range(COLORS1)

  const onMouseEnter = (geo, current = { value: 'NA' }) => {
    return () => {
      setTooltipContent(`${geo.properties.district}: ${current.value}`);
    };
  };

  const onMouseLeave = () => {
    setTooltipContent(null);
  };

  const onZoomIn = () => {
    let currzoom = zoomdata
    setZoom(currzoom + 1)
  }
  const onZoomOut = () => {
    let currzoom = zoomdata
    if (currzoom === 1) {
      return
    }
    setZoom(currzoom - 1)
  }


  const onClick = (geo, curr) => {
    var pdata = []
    if (curr === undefined) {
      setPieData([])
      setDonutData([])
      setDistrict("Click On A District To See Lab Data")
      return
    }
    for (var i = 0; i < datum[1].length; i++) {
      if (curr.dt_code === datum[1].district_id[i]) {
        pdata.push({ "name": datum[1].id[i], "capacity": datum[1].capacity[i], "backlog": datum[1].backlogs[i], "currentCapacity": datum[1].capacity[i] - datum[1].backlogs[i] })
      }
    }
    setPieData(pdata)
    showRoute(curr)
    var nayadata = [{ "name": "publiclab", "value": dondata[curr.dt_code].publiclab }, { "name": "privatelab", "value": dondata[curr.dt_code].privatelab }]
    console.log("This is nayadata", nayadata)
    setDonutData(nayadata)
    setDistrict(curr.district)
  };

  const showRoute = (curr) => {
    console.log("route")
    let data = []
    let lat = 0
    let lon = 0
    var i = 0
    for (i = 0; i < datum[0].length; i++) {
      if (curr.dt_code === datum[0].district_id[i]) {
        lat = datum[0].lat[i]
        lon = datum[0].lon[i]
        break
      }
    }
    for (i = 0; i < datum[2].length; i++) {
      if (curr.dt_code === datum[2].source[i]) {
        let destlat = 0
        let destlon = 0
        for (var j = 0; j < datum[1].length; j++) {
          if (datum[2].destination[i] === datum[1].id[j]) {
            destlat = datum[1].lat[j]
            destlon = datum[1].lon[j]
            break
          }
        }
        data.push({ src: [lon, lat], dest: [destlon, destlat], lab: datum[2].destination[i], samples: datum[2].samples_transferred[i] })
      }
    }
    console.log("This is data", data);
    setRouteData(data)
  }

  const handleFilter = ({ constructor: { name } }) => {
    return name !== "WheelEvent";
  };

  const onLineEnter = (curr) => {
    return () => {
      setTooltipContent(`${selectedDist} to Lab ${curr.lab} : ${curr.samples} samples transferred`);
    };
  }

  return (
    <div style={{ overflow: "hidden", }} >
      <Grid container spacing={2} >
        <Grid item xs={12} sm={7} >
          <h2>{area.toUpperCase()}</h2>
          <LinearGradient data={gradientData} />
          <Button onClick={onZoomIn}>Zoom in</Button>
          <Button onClick={onZoomOut}>Zoom out</Button>
          <ReactTooltip>{tooltipContent != null && <Typography variant='h5'>{tooltipContent}</Typography>}</ReactTooltip>
          <ComposableMap
            projectionConfig={PROJECTION_CONFIG}
            projection="geoMercator"
            width={280}
            height={200}
            data-tip=""
          >
            <ZoomableGroup zoom={zoomdata} filterZoomEvent={handleFilter} center={[77, 15]} onDoubleClick={onZoomIn}>
              <Geographies geography={KARNATAKA_TOPO_JSON}>
                {({ geographies }) =>
                  geographies.map(geo => {
                    const current = data.find(s => s.district.toUpperCase().trim() === geo.properties.district.toUpperCase().trim());
                    // console.log("This is geo",geo);
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={current ? color1(current.value) : DEFAULT_COLOR}
                        style={geographyStyle}
                        onMouseEnter={onMouseEnter(geo, current)}
                        onMouseLeave={onMouseLeave}
                        onClick={() => { onClick(geo, current) }}
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
              {routeData.map((curr) => {
                return (
                  <Line
                    from={curr.src}
                    to={curr.dest}
                    stroke="#000000"
                    strokeWidth={1 / zoomdata}
                    strokeLineCap="round"
                    onMouseEnter={onLineEnter(curr)}
                  />)
              })}
            </ZoomableGroup>
          </ComposableMap>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Paper elevation={3}>
            <h3>{selectedDist}</h3>
            <Typography variant="h6">Distribution of Labs as per Capacity</Typography><br />
            <center><Pie data={piedata} /></center><br />
            <Typography variant="h6">Distribution of Labs as per Type</Typography><br />
            <center><Divider style={{ width: "25%", height: 2, backgroundColor: "#AAA" }} variant="middle" /></center>
            <center><Donut data={donutdata} /></center>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Paper elevation={2}>
            <Table data={datum} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default MapChart;
