import React, { useState } from 'react';
import {PieChart, Pie, Sector, ResponsiveContainer, Cell, BarChart, Bar,XAxis, YAxis, CartesianGrid, Tooltip, Legend,} from 'recharts';
import {AppBar, Tabs, Tab} from "@material-ui/core";
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
const COLORS1 = ['#5893d8', '#53bbc9', '#5fd4a8', '#8ee677', '#dcf483', '#eedc9b', '#0d47a1', '#90caf9'];
const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value,name } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius+15}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 21}
        outerRadius={outerRadius + 25}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" style={{fontSize:12}}>{`Capacity ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#666">
        {`Lab ${name}`}
      </text>
    </g>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <>
          {children}
        </>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}


function LabChart(props){
    const theme = useTheme();
    const [activeIndex, setIndex] = useState(null);
    const [value, setValue] = React.useState(0);
    const onPieEnter = (data, index) =>{
        setIndex(index)
    }
    
    const onPieExit = (data, index) =>{
       setIndex(null)
    }

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    
    const handleChangeIndex = (index) => {
      setValue(index);
    };
    
 
    return (
      <div>
        <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label=" Labs Capacity" {...a11yProps(0)} />
          <Tab label="Labs Backlogs" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
        <TabPanel value={value} index={0} dir={theme.direction}>
        <div style={{ width: '100%', height: 300}}>
        <ResponsiveContainer>
          <PieChart >
            <Pie
              dataKey="capacity"
              activeIndex={activeIndex}
              activeShape={renderActiveShape} 
              data={props.data} 
              outerRadius={80}
              fill="#ff5533"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieExit}>
                {
                props.data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS1[index % COLORS1.length]} />)
                }
            </Pie>
            </PieChart>
        </ResponsiveContainer>
        </div>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <div style={{ width: '100%', height: 300}}>
            <ResponsiveContainer>
            <BarChart
              data={props.data}
              margin={{
                top: 20, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="currentCapacity" stackId="a" fill="#5893d8" maxBarSize={50}/>
              <Bar dataKey="backlog" stackId="a" fill="#5fd4a8" maxBarSize={50}/>
            </BarChart>
            </ResponsiveContainer>
          </div>
        </TabPanel>
        
       </div>
    );
}

export default LabChart;