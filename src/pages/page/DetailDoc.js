import React, { useState, useEffect } from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ViewAPI, DetailAPI, MasterAPI } from '../../intercepetors/axios'
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import { styled } from '@mui/material/styles';
import moment from 'moment';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Dialog from '@mui/material/Dialog';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CloseIcon from '@mui/icons-material/CloseOutlined';
import CheckIcon from '@mui/icons-material/CheckOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Card,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Linear from '../../Components/Linear/Linear'
import Comments from '../../Components/Comments/Comments'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import swal from 'sweetalert2';
import axios from 'axios';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    width: "100%",
    zoom: "90%"
    // zIndex: -99999
  },
  tableHeader: {
    "& .MuiTableCell-head": {
      color: "white",
      backgroundColor: "#839AA8",
      fontSize: 18
    },
  },
  tableCellBody: {
    "& .MuiTableCell-body": {
      fontSize: 16
    }
  }
});

const DetailDoc = (props) => {
  const classes = useStyles();
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [open, setOpen] = useState(false);
  const date = new Date().toLocaleString().split(",")[0];
  const [dataCause, setDataCause] = useState([]);
  const [dataLog, setDataLog] = useState([]);
  const [Images, setImageFile] = useState([])
  const [Project, setProject] = useState();
  const [ValueProject, setValueProject] = useState('')
  const [imgFull, setFull] = useState({});
  const [dataDetail, setDataDetail] = useState([]);
  const [UserOwner, setOwner] = useState([]);
  const queryParams = new URLSearchParams(window.location.search);
  const ServiceID = queryParams.get("ServiceID")
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [err, setError] = useState(false)
  const [checked, setChecked] = useState(true);
  const [expanded, setExpanded] = useState()

  const [orderBy, setOrderBy] = useState('calories');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  //*************GetData***********//
  useEffect(() => {
    getSOID();
    GetImages();
    GetWorkGroup()
    GetFixCause()
    GetLogHistory()
  }, [])

  useEffect(() => {
    GetMAProject();
  }, [dataDetail])

  async function getSOID() {
    // debugger
    setOpenBackdrop(!open)
    await axios.get(DetailAPI.API_URL + '/ServiceID', { params: { Serviceid: ServiceID } }
    ).then(res => {
      setDataDetail(res.data)
      setOpenBackdrop(false)
    })
  }

  async function GetImages() {
    // debugger
    axios.get(DetailAPI.API_URL + '/GetImage', { params: { Serviceid: ServiceID } }
    ).then(res => {
      setImageFile(res.data)
      // console.log(Images)
    })
  }

  async function GetMAProject() {
    // setOpenBackdrop(!open);
    for (let i of Object.keys(dataDetail)) {
      axios.get(MasterAPI.API_URL + '/GetMAProject'
        , { params: { Projectid: dataDetail.map((x) => { return x.project_Id })[i] } }
      ).then(res => {
        setProject(res.data)
      })
    }
  }

  async function GetFixCause() {
    axios.get(DetailAPI.API_URL + '/FixCause'
      , { params: { Serviceid: ServiceID } }
    ).then(res => {
      setDataCause(res.data)
    })
  }

  async function GetLogHistory() {
    axios.get(DetailAPI.API_URL + '/LogHistory'
      , { params: { Serviceid: ServiceID } }
    ).then(res => {
      setDataLog(res.data)
    })
  }


  async function GetWorkGroup() {
    await axios.get(ViewAPI.API_URL + '/GetWorkGroup', { params: { service_id: ServiceID } }
    ).then(res => {
      setOwner(res.data)
      // console.log(department.department_Id)
    })
  }

  const Iconcheck = (val) => {
    if (val === true) {
      return <div style={{ bottom: 5 }}><CheckIcon fontSize="large" color="success" /></div>
    } else {
      return <div style={{ bottom: 5 }}><CloseIcon fontSize="large" color="error" /></div>
    }
  }

  const dialogImg = (val) => {
    setFull(val)
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseBackDrop = () => {
    if (Backdrop === true) {
      setOpenBackdrop(false)
    }
    setOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function subtotal(items) {  //sum effort 
    // console.log(items.map(({ effort }) => effort))
    let x = items.map(({ effort }) => parseFloat(effort))
    return x.reduce((a, b) => a + b, 0);
  }

  const handleChangeAccordion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="xl">
        <Box style={{ paddingBottom: 20 }}>
          <Button
            component="a"
            startIcon={<ArrowBackIcon />}
            href={"ServiceOrder"}
            style={{ textTransform: 'none' }}
          >
            Service Orders
          </Button>
        </Box>

        <Paper elevation={8}>
          {dataDetail.map((val) => {
            return (
              <div>
                <Box m={2} p={4}>
                  <Typography variant="h4" gutterBottom component="div">
                    Status
                  </Typography>
                </Box>
                <Grid container columns={{ xs: 4, md: 12 }} style={{ padding: 15 }}>
                  <Linear
                    status_id={val.statusID}
                    charge={val.chargeType}
                    step_id={val.stepID}
                    reason={val.reason}
                  />
                </Grid>
              </div>
            )
          })}
          <hr />

          {dataDetail.map(val => {
            return (
              <div>
                <Box m={2} p={1}>
                  <Typography variant="h4" gutterBottom component="div">
                    ServiceOrder Detail
                    {/* <hr /> */}
                  </Typography>
                </Box>
                <div style={{ paddingInline: '10%' }}>
                  <Grid container spacing={3} columns={{ xs: 4, md: 12 }} style={{ padding: 15 }}>
                    <Grid item xs={12} sm={2}>
                      <b>Order Ref.</b>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <label style={{ color: "#3120E0" }}>{val.so}</label>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <b>Status</b>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <label>{val.statusName}</label>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <b>Problems</b>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <label>{val.rootCause}</label>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <b>ChargeType</b>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <label style={{ color: "#E8630A" }}>{val.chargeType}</label>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <b>Customer</b>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <label>{val.custommer}</label>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <b>Project</b>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      {val.mA_Name === null ? <label>-</label> : <label>{val.mA_Name}</label>}
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <b>MA / Condition</b>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      {Project?.map((x) => {
                        return (
                          <Stack direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}>
                            <label>PM</label>
                            {Iconcheck(x.mA_PM)}
                            <label>Service</label>
                            {Iconcheck(x.mA_Service)}
                            <label>Insurance</label>
                            {Iconcheck(x.mA_Insurance)}
                          </Stack>
                        )
                      })}
                    </Grid>
                    <Grid item xs={2} sm={2}>
                      <b>Person responsible</b>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      {UserOwner.map((user, index) => {
                        return (
                          <label>{user.firsName + ','}</label>
                        )
                      })}
                    </Grid>
                    <Grid item xs={2} sm={2}>
                      <b>CreateDate</b>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <h7>{("day js DD-MM-YYYY", dayjs(val.createDate).format('DD-MMM-YYYY HH:mm'))}</h7>
                    </Grid>
                  </Grid>

                  <Grid container spacing={3} columns={{ xs: 4, md: 12 }} style={{ padding: 15 }}>
                    <Grid item xs={12} sm={2}>
                      <b>Details</b>
                    </Grid>
                    <Grid item xs={12} sm={10}>
                      <label>{val.problem}</label>
                    </Grid>
                  </Grid>
                  <Grid container spacing={3} columns={{ xs: 4, md: 12 }} style={{ padding: 15 }}>
                    <Grid item xs={12} sm={12}>
                      <ImageList sx={{ width: 'auto', height: 'auto' }} cols={6}>
                        {Images.map((photo, index) => (
                          <ImageListItem key={photo.imageSrc}>
                            <img src={photo.imageSrc}
                              style={{ width: 180, height: 160, cursor: "pointer", border: '1px solid', borderRadius: 10 }}
                              onClick={() => dialogImg(photo.imageSrc)} />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </Grid>
                  </Grid>
                  {/* </Grid> */}
                </div>
                <hr />
                <Box m={2} p={1}>
                  <Typography variant="h4" gutterBottom component="div">
                    Cause / Solution
                  </Typography>
                </Box>
                <div style={{ paddingInline: '10%', paddingBottom: 24 }}>
                  <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow className={classes.tableHeader}>
                          <TableCell align="center" style={{ width: 180 }}>
                            CreateDate
                          </TableCell>
                          <TableCell align="center">
                            Cause
                          </TableCell>
                          <TableCell align="center">
                            Solution
                          </TableCell>
                          <TableCell align="center" style={{ width: 100 }}>
                            Effort
                          </TableCell>

                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dataCause.map((cause, index) => (
                          <TableRow key={cause.ID} className={classes.tableCellBody}>
                            <TableCell align="left">
                              {("day js DD-MM-YYYY", dayjs(cause.createDate).format('DD-MMM-YYYY HH:mm'))}
                            </TableCell>
                            <TableCell>
                              {cause.causeName}
                            </TableCell>
                            <TableCell>
                              {cause.howToFix}
                            </TableCell>
                            <TableCell align="center">
                              {cause.effort}
                            </TableCell>

                          </TableRow>
                        ))}
                        {dataCause.length <= 0 &&
                          <TableRow>
                            <TableCell colSpan='11' align='center'>
                              <Alert severity='info'>Empty Data</Alert>
                            </TableCell>
                          </TableRow>
                        }
                        <TableRow>
                          <TableCell colSpan={2} />
                          <TableCell align="right">Total</TableCell>
                          <TableCell>{subtotal(dataCause)} hours</TableCell>
                        </TableRow>

                      </TableBody>
                    </Table>
                  </TableContainer>
                  {/* </Box> */}
                </div>
              </div>
            )
          })}
        </Paper>

        {/* ******************************************************************************************** */}
        <div style={{ paddingTop: 25 }}>
          <Accordion expanded={expanded === 'panel1'} elevation={6} onChange={handleChangeAccordion('panel1')} >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <AlertTitle><strong style={{ fontSize: 18 }} >Comment</strong></AlertTitle>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container columns={{ xs: 4, md: 12 }} style={{ padding: "3%", paddingTop: 0 }}>
                <Grid item xs={12}>
                  {dataDetail.map(val => (
                    <Comments
                      currentUserId="1"
                      service_no={val.so}
                    />
                  ))}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel2'} elevation={4} onChange={handleChangeAccordion('panel2')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <AlertTitle><strong style={{ fontSize: 18 }} >History</strong></AlertTitle>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ paddingInline: '10%', paddingBottom: 24 }}>
                <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                  <Table size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow className={classes.tableHeader}>
                        <TableCell align="center" style={{ width: 180 }}>
                          Date
                        </TableCell>
                        <TableCell align="center" style={{ width: 180 }}>
                          User
                        </TableCell>
                        <TableCell align="center" style={{ width: 140 }}>
                          Status
                        </TableCell>
                        <TableCell align="center" style={{ width: 180 }}>
                          Reason
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataLog.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log) => (
                        <TableRow key={log.ID} className={classes.tableCellBody}>
                          <TableCell align="left">
                            {("day js DD-MM-YYYY", dayjs(log.updateDate).format('DD-MMM-YYYY HH:mm'))}
                          </TableCell>
                          <TableCell align="center">
                            {log.updateBy}
                          </TableCell>
                          <TableCell align="center">
                            {log.status}
                          </TableCell>
                          <TableCell>
                            {log.reason}
                          </TableCell>
                        </TableRow>
                      ))}
                      {dataLog.length <= 0 &&
                        <TableRow>
                          <TableCell colSpan='11' align='center'>
                            <Alert severity='info'>Empty Data</Alert>
                          </TableCell>
                        </TableRow>
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50]}
                  component="div"
                  count={dataLog.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
        <div>
          <Dialog fullWidth={true} maxWidth="lg" open={open}
            onClose={handleClose} aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <div>
              <center>
                <img src={imgFull} alt="image" style={{ maxWidth: "100%", maxHeight: "100%" }} />
              </center>
            </div>
          </Dialog>
        </div>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openBackdrop} onClick={handleCloseBackDrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container >
    </div >
  );
}
export default DetailDoc;