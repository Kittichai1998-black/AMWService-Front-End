import React, { useState, useEffect } from 'react';
import MUIDataTable from "mui-datatables";
import axios from 'axios';
import { ViewAPI } from '../../intercepetors/axios'
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
// import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import DateTimePicker from '@mui/lab/DateTimePicker';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

export default function DataTeble() {

  const columns = [
    // { name: 'id', label: 'ID', options: { filter: true, sort: true } },
    { name: 'so', label: 'Service_Order' },
    { name: 'custommer', label: 'Custommer' },
    {
      name: 'imageSrc',
      label: 'Image',
      options:
      {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updatevalue) => {
          return (
            <div>
              <img 
                src={value} 
                style={{ width: 100, height: 100 ,cursor: 'pointer' }} 
                onClick={()=>dialogImg(value)} 
                />
            </div>
          )
        }
      }
    },
    { name: 'problem', label: 'Description', },
    { name: 'createTime', label: 'CreateDate', options: { filter: false, sort: true } },
    {
      name: '',
      label: 'Action',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updatevalue) => {
          return (
            <Button variant="contained" size="small">
              <EditTwoToneIcon/>
          </Button>
          )
        }
      }
    }
  ];

  const [dataTable, setData] = useState();
  const [valueDate, setValueDate] = useState();
  const [imgFull, setFull] = useState({});
  const [open, setOpen] = useState(false);

  const dialogImg = (val) => {
    setFull(val)
    setOpen(true);

  }

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getSos()
  }, [valueDate])

  async function getSos() {
    axios.get(ViewAPI.API_URL + '/GetSOs', { params: { CreateTime: valueDate } }
    ).then(res => {
      setData(res.data)
      // console.log(valueDate)
    })
  }

  const options = {
    filterType: 'textField',
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <Paper elevation={0} style={{ width: '100%', padding: 10 }}>
        {/* <Paper elevation={2} style={{ width: '100%', minWidth: 500, margin: 'auto', marginBottom: 20, maxWidth: 800 }}> */}
        <Grid container rowSpacing={1}>
          <Grid item xs={0}>
            <h4 style={{ padding: 14 }}>DateTime :</h4>
          </Grid>
          <Grid item xs={8}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Select Date"
                value={valueDate}
                minDate={new Date('2017-01-01')}
                onChange={(newValue) => {
                  setValueDate(newValue);
                }}
                renderInput={(params) =>
                  <TextField {...params} />
                }
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        {/* </Paper> */}
      </Paper>
      <MUIDataTable
        title={"Report ServiceOrders"}
        data={dataTable}
        columns={columns}
        options={options}
        // checkboxSelection
        disableSelectionOnClick
      />
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div>
            <img
              style={{ maxWidth: "100%", maxHeight: "100%" }}
              src={imgFull}
              alt="image"
            />
          </div>
        </Dialog>
      </div>
    </div>
  );
}