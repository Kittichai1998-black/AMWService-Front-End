import React, { useState, useEffect, useRef } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import Badge from 'react-bootstrap/Badge'
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import { useParams } from "react-router-dom";
import Container from '@mui/material/Container';
import PropTypes from 'prop-types';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min';
import axios from 'axios';
import { CallAPI, AuthenAPI, DetailAPI, ViewAPI } from '../../intercepetors/axios'
import { styled } from '@mui/material/styles';
import Button from 'react-bootstrap/Button';
import CloseIcon from '@mui/icons-material/CloseOutlined';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CreateService from './CreateDoc';
import FormEditService from '../formpage/FormEditService';
import FormReason from '../formpage/FormReason';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FeedIcon from '@mui/icons-material/Feed';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Backdrop from '@mui/material/Backdrop';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import swal from 'sweetalert2';
import Chip from '@mui/material/Chip';
import OutlinedInput from '@mui/material/OutlinedInput';
import { makeStyles } from '@mui/styles';
import { CellTower } from '@mui/icons-material';
import Popover from '@mui/material/Popover';

const useStyles = makeStyles({
  root: {
    zIndex: -99999
  },

});


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const ServiceOrder = (val) => {
  const classes = useStyles();
  const { ServiceID } = useParams();
  const [dataTable, setData] = useState([]);
  const [Status, setStatus] = useState([]);
  const [ValStatus, setValStatus] = useState(null);
  const [ValSO, setValSO] = useState(null);
  const [Cause, setCause] = useState([])
  const [ValCause, setValCause] = useState(null)
  const [CustomerName, setCustomerName] = useState(null)
  const [Custommers, setCustommer] = useState([]);
  const [ValCustomers, setValCustomers] = useState(null);
  const [Rootcause, setRootcause] = useState([]);
  const [Priolity, setPriolity] = useState([]);
  const [ValPriolity, setValPriolity] = useState(null)
  const [ValOwner, setValOwner] = useState(null)
  const [value, setValue] = useState(Rootcause[0]);
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [state, setstate] = useState();
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [Permission, setPermission] = useState([])
  const [UserID, setUserID] = useState(localStorage.getItem('userID'));
  const [RoleID, setRoleID] = useState(localStorage.getItem('roleID'));
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [Rowdata, setRowdata] = useState('');
  const [headerDialog, setHeader] = useState('');
  const [Edit, setEdit] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [maxwidth, setMaxWidth] = useState("md")
  const [reason, setReason] = useState(false)
  const [serviceid, setServiceid] = useState();
  const [statusnum, setStatusId] = useState("");
  const Combo = useRef();
  const [expanded, setExpanded] = useState('search');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    CheckPermission()
    GetStatus()
    GetCustommer()
    GetCast()
    GetRootcause()
    GetPriolity()
    GetServiceOrders()
    // console.log(role)
  }, [UserID])

  // useEffect(() => {
  //   let render = Permission
  //   return render
  // }, [dateFrom, dateTo, Permission, ValStatus])
  useEffect(() => {
    console.log(Edit)
    console.log(reason)
  }, [Edit])

  useEffect(() => {
    GetServiceOrders();
    console.log(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'))
  }, [ValStatus, ValCustomers])

  const handleClickOpen = () => {
    setMaxWidth("md")
    setHeader("New Service Order")
    setEdit(false);
    setReason(false);
    setOpen(true);
  };

  const handleClose = () => {
    if (Backdrop === true) {
      setOpenBackdrop(false)
    }
    setOpen(false);
    setAnchorEl(null);
  };

  const handleClickEdit = (value) => {
    setMaxWidth("md")
    setRowdata(value)
    setHeader("Edit Service Order")
    setEdit(true);
    setReason(false);
    setOpen(true);

  };

  const handleReason = (value, num) => {
    // console.log(value)
    setMaxWidth("sm")
    setHeader("Reason");
    setServiceid(value)
    setStatusId(num)
    setReason(true);
    setOpen(true);
  }

  const filterDialog = (statusid) => {
    if (Edit === true && reason === false) {
      return (
        <FormEditService Rowdata={Rowdata} />
      )
    }
    if (Edit === false && reason === false) {
      return (
        <CreateService />
      )
    }
  }

  const openpop = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  async function CheckPermission() {
    const datajson = {
      params: { Role_ID: RoleID }
    }
    await axios.get(AuthenAPI.API_URL + '/CheckPermission', datajson
    ).then(res => {
      setPermission(res.data)
    })
  }


  async function UpdateStatus(row, valID) {
    // console.log(row, valID)
    swal.fire({
      title: 'Are you sure?',
      // text: "เมื่อทำการอัพเดทแล้วจะไม่สามารถย้อนกลับได้",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'YES'
    }).then((result) => {
      if (result.isConfirmed) {
        axios({
          method: 'put',
          url: DetailAPI.API_URL + '/UpdateStatusSO=' + row.ID,
          data: {
            ID: row.ID,
            Status_Id: valID,
            UpdateBy: UserID,
            UpdateDate: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
          }
        }).then((res => {
          if (res.data !== undefined) {
            GetServiceOrders()
          }
        })).catch(function (error) {
          swal.fire({
            customClass: {
              container: classes.root //Alert หน้าสุด
            }, title: 'Fail', icon: 'error'
          })
        });
      }
    })
    //  console.log(row.ID)
    //  console.log(valID)
  }

  async function GetServiceOrders() {
    // setOpenBackdrop(!open);
    const datajson = {
      params: {
        UserID: UserID,
        StatusID: ValStatus,
        SO: ValSO,
        CustomerID: ValCustomers,
        causeID: ValCause,
        PriolityID: ValPriolity,
        Owner: ValOwner,
        DateFrom: dateFrom,
        DateTo: dateTo

      }
    }
    await axios.get(DetailAPI.API_URL + '/ViewServiceOrders', datajson
    ).then(res => {
      setData(res.data)
      setOpenBackdrop(false)
    })

  }

  function GetAllService() {
    axios({
      method: 'get',
      url: DetailAPI.API_URL + '/ViewServiceOrders',
    }).then(res => {
      setData(res.data)
      setOpenBackdrop(false)
    })
  }

  function GetRootcause() {
    axios({
      method: 'get',
      url: ViewAPI.API_URL + '/GetRootcause',
    }).then(res => {
      setRootcause(res.data)
      // console.log(Rootcause)
    })
  }

  function GetStatus() {
    axios({
      method: 'get',
      url: ViewAPI.API_URL + '/GetColumns',
      responseType: 'stream'
    }).then(res => {
      setStatus(res.data)
    })
  }

  function GetCustommer() {
    axios({
      method: 'get',
      url: ViewAPI.API_URL + '/GetCustommer',
      responseType: 'stream'
    }).then(res => {
      setCustommer(res.data)
    })
  }

  function GetCast() {
    axios({
      method: 'get',
      url: ViewAPI.API_URL + '/GetRootcause',
      responseType: 'stream'
    }).then(res => {
      setCause(res.data)
    })
  }

  function GetPriolity() {
    axios({
      method: 'get',
      url: ViewAPI.API_URL + '/GetPriolity',
      responseType: 'stream'
    }).then(res => {
      setPriolity(res.data)
    })
  }

  const ViewAll = () => {
    GetAllService();
  }

  const ViewStatus = (statusid) => {
    setValStatus(statusid);

  }


  const customerSearch = (e, value, reason) => {
    console.log(value)
    if (reason === "clear") {
      setValCustomers(null)
    }
    setValCustomers(value.id)
  }

  const Actions = (cell, row, rowIndex, formatExtraData) => {
    return (
        <div style={{ textAlign: 'center' }}>

          {Permission && Permission.map((role) => {
            return (
              <div>
                {Permission &&
                  < Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={0.5}
                    style={{ zoom: "90%" }}
                  >
                    {role.uR_Todo_Status === true && row.StatusID === 2 ? <Button variant="outline-primary" onClick={() => { UpdateStatus(row, 3) }}>Get Job</Button>
                      : ""}
                    {role.uR_New_Status === true && row.StatusID !== 7 ? <Button variant="info" onClick={() => handleClickEdit(row)}>Edit</Button>
                      : ""}

                    {role.uR_Close_Status === true && row.StatusID === 6 || row.StatusID === 1 ? <Button variant="success" onClick={() => { handleReason(row, "7") }}>Closed</Button>
                      : ""}
                    {/* {role.uR_Close_Status === true && row.StatusID === 6 || row.StatusID === 1 ? <Button variant="success" onClick={() => { UpdateStatus(row, 7) }}>Closed</Button>
                  : ""} */}

                    {role.uR_Reject_Status === true && row.StatusID === 2 || row.StatusID === 3 ? <Button variant="danger" onClick={() => { handleReason(row, "8") }}>Reject</Button>
                      : ""}
                  </Stack>
                }
              </div>
            )
          })
          }
        </div >
      );
  };

  const getStatus = (cell, row) => {
    if (row.StatusID === "1" || row.StatusID === 1) {
      return <center><Chip label="BackLog" style={{ width: "75%", padding: 8, fontSize: 16, fontWeight: 'bold' }} /></center>
    } else if (row.StatusID === "2" || row.StatusID === 2) {
      return <center><Chip label="To Do" variant="outlined" color="primary" style={{ width: "75%", padding: 8, fontSize: 16, fontWeight: 'bold' }} /></center>
    } else if (row.StatusID === "3" || row.StatusID === 3) {
      return <center><Chip label="Doing" color="primary" style={{ width: "75%", padding: 8, fontSize: 16, fontWeight: 'bold' }} /></center>
    } else if (row.StatusID === "4" || row.StatusID === 4) {
      return <center><Chip label="Solved" variant="outlined" color="success" style={{ width: "75%", padding: 8, fontSize: 16, fontWeight: 'bold' }} /></center>
    } else if (row.StatusID === "5" || row.StatusID === 5) {
      return <center><Chip label="Done" style={{ width: "75%", padding: 8, fontSize: 16, fontWeight: 'bold', color: "white", background: "#63A20E" }} /></center>
    } else if (row.StatusID === "6" || row.StatusID === 6) {
      return <center><Chip label="Charge" variant="outlined" style={{ width: "75%", padding: 8, fontSize: 16, fontWeight: 'bold', color: "white", background: "#E8630A" }} /></center>
    } else if (row.StatusID === "7" || row.StatusID === 7) {
      return <center><Chip label="Closed" style={{ width: "75%", padding: 8, fontSize: 16, fontWeight: 'bold', color: "white", background: "#009A46" }} /></center>
    } else if (row.StatusID === "8" || row.StatusID === 8) {
      return <center><Chip label="Rejected" color="error" style={{ width: "75%", padding: 8, fontSize: 16, fontWeight: 'bold' }} /></center>
      // <h5><center><Badge text='light' variant="outlined" style={{ width: "75%", padding: 8 }}>Reject</Badge></center></h5>

    }
    else {
      return null;
    }
  }

  const linkidService = (cell, row) => {
    return (
      <a href={"DetailDoc?ServiceID=" + row.ID}>{cell}</a>
    )
  }

  function ChargeTypeFormatter(cell, row) {
    return (
      <h6 style={{ color: "#E8630A" }}>{cell}</h6>
    );
  }

  function DateTimeFormat(cell, row) {
    return (
      <h6>{("day js DD-MM-YYYY", dayjs(cell).format('DD-MMM-YYYY'))}</h6>
    );
  }

  const columns = [
    {
      dataField: 'StatusID',
      text: 'Status',
      headerAlign: 'center',
      headerStyle: { width: 180, backgroundColor: '#748DA6' },
      formatter: getStatus
    },
    {
      dataField: 'ServiceOrder',
      text: 'Service Order',
      formatter: linkidService,
      headerAlign: 'center',
      headerStyle: { backgroundColor: '#748DA6' },
      align: 'center',
      // headerStyle: { width: '130px' },
    },
    {
      dataField: 'Customer',
      text: 'Customer',
      headerAlign: 'center',
      headerStyle: { backgroundColor: '#748DA6' },
      // align: 'center'
    },
    {
      dataField: 'CauseName',
      text: 'Problem',
      headerAlign: 'center',
      headerStyle: { backgroundColor: '#748DA6' },
      // align: 'center'
    },
    {
      dataField: 'priorityName',
      text: 'Priolity',
      headerAlign: 'center',
      headerStyle: { backgroundColor: '#748DA6' },
      // align: 'center'
    },
    {
      dataField: 'ChargeType',
      text: 'Charge Type',
      align: 'center',
      headerAlign: 'center',
      headerStyle: { width: 140, backgroundColor: '#748DA6' },
      formatter: ChargeTypeFormatter
    },
    {
      dataField: 'CreateDate',
      text: 'Create Date',
      headerAlign: 'center',
      headerStyle: { backgroundColor: '#748DA6' },
      align: 'center',
      formatter: DateTimeFormat
    },
    {
      dataField: 'DueDate',
      text: 'Due Date',
      headerAlign: 'center',
      align: 'center',
      headerStyle: { backgroundColor: '#748DA6' },
      formatter: DateTimeFormat
    },
    // {
    //   dataField: 'FirsName',
    //   text: 'Person Responsible',
    //   headerAlign: 'center',
    //   align: 'center'
    //   // headerStyle: { width: '150px' },
    // },
    {
      dataField: '',
      text: '',
      formatter: Actions,
      headerStyle: { backgroundColor: '#748DA6' },
      // headerStyle: { width: '215px' },
    },

  ];

  const selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
    bgColor: (row, rowIndex) => (rowIndex > 1 ? '#85F4AA' : '#B5FE83')
  };

  const { SearchBar } = Search;

  const MyExportCSV = (props) => {
    const handleClick = () => {
      props.onExport();
    };
    return (
      <div>
        <button className="btn btn-success" onClick={handleClick}>Export CSV</button>
      </div>
    );
  };

  const sizePerPageRenderer = ({
    options,
    currSizePerPage,
    onSizePerPageChange
  }) => (
    <div className="btn-group" role="group">
      {
        options.map((option) => {
          const isSelect = currSizePerPage === `${option.page}`;
          return (
            <button
              key={option.text}
              type="button"
              onClick={() => onSizePerPageChange(option.page)}
              className={`btn ${isSelect ? 'btn-primary' : 'btn-secondary'}`}
            >
              {option.text}
            </button>
          );
        })
      }
    </div>
  );

  const options = {
    sizePerPageRenderer
  };

  return (
    <div style={{ width: "100%" }}>
      {/* <Container > */}
      <Accordion
      // expanded={expanded === 'search'}
      // onChange={handleChange('search')}
      >
        <AccordionSummary
          // sx={{
          //   backgroundColor: "#eeeeee"
          // }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography style={{ fontWeight: 600 }}>Search</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* <Paper> */}
          <div>
            <Box sx={{ width: '100%' }}>
              <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid item xs="auto">
                  <Stack direction="row" spacing={2}>
                    <h6 style={{ paddingTop: 9 }}>Service Order</h6>
                    <TextField
                      id="outlined-basic"
                      className="fieldset"
                      variant="outlined"
                      style={{ width: 180 }}
                      size="small"
                      sx={{ "& legend": { display: "none" } }}
                      onChange={(event) => setValSO(event.target.value)} />
                  </Stack>
                </Grid>
                <Grid item xs="auto">
                  <Stack direction="row" spacing={2}>
                    <h6 style={{ paddingTop: 9 }}>Customer</h6>
                    <Select
                      MenuProps={{ style: { maxWidth: 0, maxHeight: 300, position: 'absolute', }, disableScrollLock: true, }}
                      labelId="demo-select-small"
                      id="demo-select-small"
                      value={ValCustomers}
                      onChange={(event) => setValCustomers(event.target.value)}
                      sx={{ "& legend": { display: "none" } }}
                      style={{ width: 200 }}
                      size="small"
                    // label="Problems"
                    >
                      <MenuItem value=""><em>None</em></MenuItem>
                      {Custommers.map((items) => {
                        return (
                          <MenuItem value={items.id}>{items.customer}</MenuItem>
                        )
                      })}
                    </Select>
                  </Stack>
                </Grid>
                <Grid item xs="auto">
                  <Stack direction="row" spacing={2}>
                    <h6 style={{ paddingTop: 9 }}>Problems</h6>
                    <Select
                      labelId="demo-select-small"
                      id="demo-select-small"
                      value={ValCause}
                      onChange={(event) => setValCause(event.target.value)}
                      sx={{ "& legend": { display: "none" } }}
                      style={{ width: 150 }}
                      size="small"
                    // label="Problems"
                    >
                      <MenuItem value=""><em>None</em></MenuItem>
                      {Cause.map((items) => {
                        return (
                          <MenuItem value={items.id}>{items.name}</MenuItem>
                        )
                      })}
                    </Select>
                  </Stack>
                </Grid>
                <Grid item xs="auto">
                  <Stack direction="row" spacing={2}>
                    <h6 style={{ paddingTop: 9 }}>Priolity</h6>
                    <Select
                      labelId="demo-select-small"
                      id="demo-select-small"
                      value={ValPriolity}
                      onChange={(event) => setValPriolity(event.target.value)}
                      sx={{ "& legend": { display: "none" } }}
                      size="small"
                      style={{ width: 150 }}
                    >
                      <MenuItem value=""><em>None</em></MenuItem>
                      {Priolity.map((items) => {
                        return (
                          <MenuItem value={items.id}>{items.description}</MenuItem>
                        )
                      })}
                    </Select>
                  </Stack>
                </Grid>
                <Grid item xs="auto">
                  <Stack direction="row" spacing={2}>
                    <h6 style={{ paddingTop: 9 }}>Date</h6>
                    <LocalizationProvider dateAdapter={AdapterDateFns} >
                      <DesktopDatePicker
                        // label="DateFrom"
                        value={dateFrom}
                        inputFormat="dd/MM/yyyy"
                        // minDate={new Date('2017-01-01')}
                        onChange={(newValue) => {
                          setDateFrom(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} style={{ width: 150 }} sx={{ "& legend": { display: "none" } }} size="small" />}
                      />

                    </LocalizationProvider>
                    <h6 style={{ paddingTop: 9 }}>-</h6>
                    <LocalizationProvider dateAdapter={AdapterDateFns} >
                      <DesktopDatePicker
                        // label="DateTo"
                        value={dateTo}
                        inputFormat="dd/MM/yyyy"
                        // minDate={new Date('2017-01-01')}
                        onChange={(newValue) => {
                          setDateTo(newValue);
                        }}
                        size="small"
                        renderInput={(params) => <TextField {...params} style={{ width: 150 }} sx={{ "& legend": { display: "none" } }} size="small" />}
                      />
                    </LocalizationProvider>
                  </Stack>
                </Grid>
              </Grid>
              <Grid container justifyContent="right" style={{ paddingTop: 10 }}>
                <Grid item xs={12} sm={'auto'}>
                  <Button variant="primary" size="small" onClick={() => { GetServiceOrders() }}>Search</Button>
                </Grid>
              </Grid>
            </Box>
          </div>
        </AccordionDetails>
      </Accordion>

      <Paper elevation={6} style={{ padding: 20, marginTop: 20 }}>
        <BootstrapDialog
          maxWidth={maxwidth}
          fullWidth={true}
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          {reason ?
            <>
              <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                {headerDialog}
              </BootstrapDialogTitle>
              <DialogContent dividers>
                <FormReason
                  service={serviceid}
                  status={statusnum}
                />
              </DialogContent>
            </>
            :
            <>
              <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                {headerDialog}
              </BootstrapDialogTitle>
              <DialogContent dividers>
                {filterDialog()}
              </DialogContent>
            </>
          }
        </BootstrapDialog>

        <ToolkitProvider
          keyField="id"
          data={dataTable}
          columns={columns}
          exportCSV={{
            noAutoBOM: false
          }}
          search={{ searchFormatted: true }}
        >
          {
            props => (
              <div>
                {Permission.map((role) => {
                  return (
                    <div>
                      <h5 style={{ pt: 10, paddingBottom: 10 }}>Service Order</h5>
                      <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        <Grid item xs={4} >
                          <Box>
                            <Stack justifyContent="flex-start" direction={{ xs: 'column', sm: 'row' }}
                              spacing={{ xs: 1, sm: 2, md: 4 }}>
                              {role.uR_New_Status === true ? <Button variant="primary" onClick={handleClickOpen}>New Service Order</Button>
                                : ""}
                            </Stack>
                          </Box>
                        </Grid>
                        <Grid item xs={8}>
                          <Box>
                            <Stack justifyContent="flex-end" direction={{ xs: 'column', sm: 'row', md: 'row' }}
                              spacing={{ xs: 1, sm: 2 }}>
                              {RoleID !== 1 ?
                                <Button variant="info" style={{ borderRadius: 4 }} onClick={() => { ViewAll() }}>View All</Button>
                                : ""}
                              <Button variant="secondary" style={{ borderRadius: 4 }} onClick={() => { ViewStatus(1) }}>BackLog</Button>
                              <Button variant="outline-primary" style={{ borderRadius: 4 }} onClick={() => { ViewStatus(2) }}>To Do</Button>
                              <Button variant="primary" style={{ borderRadius: 4 }} onClick={() => { ViewStatus(3) }}>Doing</Button>
                              <Button variant="outline-success" style={{ borderRadius: 4 }} onClick={() => { ViewStatus(4) }}>Solved</Button>
                              <Button variant="success" style={{ borderRadius: 4 }} onClick={() => { ViewStatus(5) }}>Done</Button>
                              <Button variant="default" style={{ borderRadius: 4, color: "white", background: "#E8630A" }} onClick={() => { ViewStatus(6) }}>Charge</Button>
                              <Button variant="default" style={{ borderRadius: 4, color: "white", background: "#009A46" }} onClick={() => { ViewStatus(7) }}>Closed</Button>
                              <Button variant="danger" style={{ borderRadius: 4 }} onClick={() => { ViewStatus(8) }}>Rejected</Button>
                            </Stack>
                          </Box>
                        </Grid>
                      </Grid>
                    </div>
                  )
                })}

                <hr />
                <div>
                  <BootstrapTable
                    keyField="id"
                    striped
                    hover
                    data={dataTable}
                    columns={columns}
                    pagination={paginationFactory(options)}
                    // {...props.baseProps}
                    wrapperClasses="table"
                  />
                </div>
              </div>
            )
          }
        </ToolkitProvider>
      </Paper>
      {/* </Container> */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openBackdrop} onClick={handleClose}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}

export default ServiceOrder;

