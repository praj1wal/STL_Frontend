import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { DataGrid } from '@material-ui/data-grid';


const columns1 = [
  {field:"id", headerName:"District Id", headerAlign: 'center', width:200},
  {field:"district_name", headerName:"District Name", headerAlign: 'center', width:200},
  {field:"lat", headerName:"Latitude", headerAlign: 'center', width:200},
  {field:"lon", headerName:"Longitude", headerAlign: 'center', width:200},
  {field:"samples", headerName:"Samples", headerAlign: 'center', width:200}
]

const columns2 = [
  {field:"id", headerName:"Id", headerAlign: 'center', width:200},
  {field:"lab_type", headerName:"Lab Type", headerAlign: 'center', width:200},
  {field:"lat", headerName:"Latitude", headerAlign: 'center', width:200},
  {field:"lon", headerName:"Longitude", headerAlign: 'center', width:200},
  {field:"district_id", headerName:"District Id", headerAlign: 'center', width:200},
  {field:"capacity", headerName:"Capacity", headerAlign: 'center', width:200},
  {field:"backlogs", headerName:"Backlogs", headerAlign: 'center', width:200}
]

const columns3 = [
  {field:"id", headerName:"No.", headerAlign: 'center', width:200},
  {field:"source", headerName:"Source", headerAlign: 'center', width:200},
  {field:"destination", headerName:"Destination", headerAlign: 'center', width:200},
  {field:"transfer_type", headerName:"Transfer Type", headerAlign: 'center', width:200},
  {field:"samples_transferred", headerName:"Samples Transferred", headerAlign: 'center', width:200}
]

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

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
}));

export default function Table(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  console.log(props)
  let rows1 = []
  let cols1 = []
  let rows2 = []
  let cols2 = []
  let rows3 = []
  let cols3 = []
  if(props.data !== undefined){
    for(var i = 0; i < props.data[0].length; i++){
      rows1.push({
        "id":props.data[0].district_id[i],
        "district_name":props.data[0].district_name[i],
        "lat":props.data[0].lat[i],
        "lon":props.data[0].lon[i],
        "samples":props.data[0].samples[i]
      })
    }

    for(var i = 0; i < props.data[1].length; i++){
      
      rows2.push({
        "id":props.data[1].id[i],
        "lab_type":props.data[1].lab_type[i]===0?"public":"private",
        "lat":props.data[1].lat[i],
        "lon":props.data[1].lon[i],
        "district_id":props.data[0].district_name[props.data[1].district_id[i]-1],
        "capacity":props.data[1].capacity[i],
        "backlogs":props.data[1].backlogs[i]
      })
    }

    for(var i = 0; i < props.data[2].length; i++){
      rows3.push({
        "id":i+1,
        "source":props.data[0].district_name[props.data[2].source[i]-1],
        "destination":props.data[2].destination[i],
        "transfer_type":props.data[2].transfer_type[i],
        "samples_transferred":props.data[2].samples_transferred[i]
    })
  }
}
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div style={{width:"100%"}}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="District Data" {...a11yProps(0)} />
          <Tab label="Lab Data" {...a11yProps(1)} />
          <Tab label="Solution Data" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
        <TabPanel value={value} index={0} dir={theme.direction}>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid rows={rows1} columns={columns1} pageSize={5} />
          </div>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid rows={rows2} columns={columns2} pageSize={5} />
          </div>
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid rows={rows3} columns={columns3} pageSize={5} />
          </div>
        </TabPanel>
    </div>
  );
}
