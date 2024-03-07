import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { AuthenAPI, DetailAPI, ViewAPI } from '../../intercepetors/axios'
// import Head from 'next/head';
import Backdrop from '@mui/material/Backdrop';
import { Box, Container, Grid } from '@mui/material';
import { SolvePie } from '../../Components/Dashboard/solve-pie';
import Priolity from '../../Components/Dashboard/priolity';
import { TodayPie } from '../../Components/Dashboard/today-pie';
import { YesterdayPie } from '../../Components/Dashboard/yesterday-Pie';
import { TasksProgress } from '../../Components/Dashboard/tasks-progress';
import LatestOrders from '../../Components/Dashboard/latest-order';
import { Status } from '../../Components/Dashboard/all-status';
import { ChartBar } from '../../Components/Dashboard/chart-bar';
import { ChartPie } from '../../Components/Dashboard/chart-pie';
// import { TotalCustomers } from '../components/dashboard/total-customers';
// import { TotalProfit } from '../components/dashboard/total-profit';

// import { DashboardLayout } from '../../Components/Dashboard/layout';

const Dashboard = () => {
  const [dataTable, setData] = useState([]);
  const [dataTable2, setData2] = useState([]);
  const [datachartsolve, setdatachartsolve] = useState([]);
  const [datachartsolvetoday, setdatachartsolvetoday] = useState([]);
  const [datachartsolveyesterday, setdatachartsolveyesterday] = useState([]);
  const [open, setOpen] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [UserID, setUserID] = useState(localStorage.getItem("userID"));

  useEffect(() => {

    let date = new Date();
    var yesterday = new Date(Date.now() - 86400000);
    
    //table
    setOpenBackdrop(!open);
    axios.get(DetailAPI.API_URL + '/PieSolve', {
      params: {
        UserID: UserID,
      }
    }
    ).then(res => {
      setdatachartsolve(res.data)

    })

    axios.get(DetailAPI.API_URL + '/PieSolveToday', {
      params: {
        UserID: UserID,
      }
    }
    ).then(res => {
      setdatachartsolvetoday(res.data)

    })

    axios.get(DetailAPI.API_URL + '/PieSolveYesterday', {
      params: {
        UserID: UserID,
      }
    }
    ).then(res => {
      setdatachartsolveyesterday(res.data)

    })

    axios.get(DetailAPI.API_URL + '/ViewServiceOrders', {
      params: {
        UserID: UserID,
        DateFrom: yesterday,
        DateTo: date
      }
    }
    ).then(res => {
      setData(res.data)
      setOpenBackdrop(false)
    })

    // axios.get(DetailAPI.API_URL + '/ViewServiceOrders', {
    //   params: {
    //     UserID: UserID,
    //     DateFrom: yesterday,
    //     DateTo: date
    //   }
    // }
    // ).then(res => {
    //   setData2(res.data)
    //   setOpenBackdrop(false)
    // })
  }, [])

  return (
    <div style={{ zoom: "90%" }}>
      <Box>
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SolvePie datasolve={datachartsolve} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TodayPie datasolvetoday={datachartsolvetoday} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <YesterdayPie datasolveyesterday={datachartsolveyesterday} />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <Priolity data={dataTable} />
            </Grid>
            <Grid item lg={8} md={12} xl={9} xs={12}>
              {/* <ChartBar /> */}
            </Grid>
            <Grid item lg={4} md={6} xl={3} xs={12}>
              {/* <ChartPie sx={{ height: '100%' }} /> */}
            </Grid>
            <Grid item lg={4} md={6} xl={3} xs={12}>
              <Status data={dataTable} />
            </Grid>
            <Grid item lg={8} md={12} xl={9} xs={12}>
              <LatestOrders data={dataTable} />
            </Grid>

          </Grid>
        </Container>
      </Box>
    </div>
  )
};

export default Dashboard;