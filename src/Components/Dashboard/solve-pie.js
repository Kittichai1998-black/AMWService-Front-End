import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Alert from '@mui/material/Alert';
import { Doughnut } from 'react-chartjs-2';
import { Box, Card, CardContent, CardHeader, Divider, Typography, useTheme } from '@mui/material';
import Chart from 'chart.js/auto';

export const SolvePie = ({ datasolve } ) => {
  const theme = useTheme();
  // const [datachart, setData] = useState([]);
  const [UserID, setUserID] = useState(localStorage.getItem("userID"));
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const datas = datasolve.map((x)=> {return x.data})
  const color = datasolve.map((x)=> {return x.backgroundColor})
  const label = datasolve.map((x)=> {return x.label})

  const data = {
    
    datasets:[{
      data: datas,
      backgroundColor:color 
    }],
    labels: label
    

  };

  const options = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    },
  };

  // const devices = [
  //   {
  //     title: 'Nomal',
  //     value: 63,
  //     color: '#3F51B5'
  //   },
  //   {
  //     title: 'Wait in 24 Hr.',
  //     value: 15,
  //     color: '#EEEEEE'
  //   },
  // ];

  return (
    <Card style={{height: '100%'}}>
      <CardHeader title="Solve" />
      {/* <Divider /> */}
      <CardContent>
      {datasolve.length !== 0 ?
        <>
        <Box
          sx={{
            height: 300,
            position: 'relative'
          }}
        >
          <Doughnut
            data={data}
            options={options}
          />
        </Box>
        <Box sx={{display: 'flex',justifyContent: 'center',pt: 2}}>
            <Box sx={{p: 1,textAlign: 'center'}}>
              <Typography variant="h4">
              {/* {label[0]} / {label[1]} */}
              </Typography>
            </Box>
        </Box>
        </>
         :
         <Alert severity="info" style={{ fontSize: 24 }}>Empty Data!</Alert>
       }
      </CardContent>
    </Card>
  );
};