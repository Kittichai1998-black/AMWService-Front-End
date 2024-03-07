import React, { useState, useEffect } from 'react';
import FormSolution from '../../pages/formpage/FormSolution'
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import { AuthenAPI, ViewAPI, DetailAPI } from '../../intercepetors/axios'
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import Dialog from '@mui/material/Dialog';
import Backdrop from '@mui/material/Backdrop';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ArrowBackIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/CloseOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

import swal from 'sweetalert2';
import axios from 'axios'
import { set } from 'date-fns';

const useStyles = makeStyles({
  root: {
    zIndex: 999999
  },

})

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


const Linear = ({ status_id, charge,step_id, reason, cause, fix }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(step_id);
  const [Permission, setPermission] = useState([])
  const [openDialog, setOpenDialog] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const StatusID = status_id;
  const queryParams = new URLSearchParams(window.location.search);
  const [UserID, setUserID] = useState(localStorage.getItem('userID'));
  const [RoleID, setRoleID] = useState(localStorage.getItem('roleID'));
  const ServiceID = queryParams.get('ServiceID')
  const [chargeType, setChargeType] = useState("")
  const [isClaim,setIsClaim] = useState(false);
  const [open, setOpen] = React.useState(false);
  const steps = ['Back Log', 'To Do', 'Doing', 'Solved', 'Done', charge]; // [0,1,2,3,4,5]

  const theme = createTheme({
    palette: {
      neutral: {
        main: '#64748B',
        contrastText: '#fff',
      },

      primary: {
        main: '#2196f3',
      },
      warning: {
        main: '#ff9800'
      }
    }
  });

  const handleClose = () => {
    if (Backdrop === true) {
      setOpenBackdrop(false)
    }
    setOpenDialog(false);
  };

  const UpdateBack = () => {
    if (step_id === 8) {
      // setActiveStep((step) => step - 1);
      UpdateStatusSO(5) //เปลี่ยนเป็น Done
    }
    setActiveStep((step) => step - 1);
    UpdateStatusSO(StatusID - 1)
  };

  const UpdateNext = () => {
    console.log(step_id)
    setActiveStep((step) => step + 1);
    if (step_id === 3) { //เมื่อ status Doing -> Solved : Dialog ให้กรอก Cause / solution
      setOpenDialog(true)
    }
    if (step_id === 4) { //เมื่อ status Done -> Charge : Dialog ChargeType
      swal.fire({
        title: 'Please select a change type',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonColor: '#FF9551',
        denyButtonColor: '#3085d6',
        // cancelButtonColor: '#d33',
        confirmButtonText: 'Charge',
        denyButtonText: 'Claim',
      }).then((result) => {
        if (result.isConfirmed) {
          setChargeType("Charge")
        }
        else if (result.isDenied) {
          swal.fire({
            title: 'Close this service order?',
            showDenyButton: true,
            // showCancelButton: true,
            confirmButtonColor: '#3085d6',
            denyButtonColor: '#d33',
            confirmButtonText: 'Yes',
            denyButtonText: 'No',

          }).then((res) => {
            if (res.isConfirmed) {
              setChargeType("Claim")
              setIsClaim(true)
              // UpdateStatusSO(StatusID + 2) //done -> closed
            }
            if (res.isDenied) {
              setChargeType("Claim")
              setIsClaim(false)
              // setActiveStep((step) => step + 2);
              // UpdateStatusSO(StatusID + 4)
            }
          })
        }
      });
    }
    if (step_id !== 3 && step_id !== 4) {
      UpdateStatusSO(StatusID + 1)
    }
    if(step_id === 8){
      UpdateStatusSO(7) //เปลี่ยนเป็น Closed
    }
  };

  useEffect(() => {
    if (chargeType === "Charge") { //Charge ไม่ปิดเอกสาร
      UpdateStatusSO(StatusID + 1)
    }
    if (chargeType === "Claim" && isClaim) { //Claim แล้วต้องการ closed
      UpdateStatusSO(StatusID + 2)
    }
    if(chargeType === "Claim" && !isClaim) { //Claim ไม่ต้อง Closed
      UpdateStatusSO(9)
    }
  }, [chargeType])

  useEffect(() => {
    CheckPermission()
  }, [activeStep])

  function CheckPermission() {
    axios.get(AuthenAPI.API_URL + '/CheckPermission', { params: { Role_ID: RoleID } }
    ).then(res => {
      setPermission(res.data)
    })
  }

  function UpdateStatusSO(val) {
    console.log(val)
    swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        axios({
          method: 'put',
          url: DetailAPI.API_URL + '/UpdateStatusSO=' + ServiceID,
          data: {
            ID: ServiceID,
            Status_Id: val,
            ChargeType: chargeType,
            UpdateBy: UserID,
            UpdateDate: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
          }
        }).then(res => {
          if (res.data !== undefined) {
            swal.fire({
              position: 'top-center',
              icon: 'success',
              title: 'Update Success',
              showConfirmButton: false,
              timer: 1000
            })
            // setTimeout(() => {
            //   refreshPage()
            // }, 1500)
          }
        }).catch(function (error) {
          swal.fire({
            customClass: {
              container: classes.root //Alert หน้าสุด
            }, title: 'Fail', icon: 'error'
          })
        });
      }
    });
  }

  function refreshPage() {
    window.location.reload(false);
  }

  const handleBack = () => {
    return (
      <div>
        <ThemeProvider theme={theme}>
          {
            Permission.map((role) => {
              if (step_id === 1 && role.uR_Todo_Status === true) { //Todo
                return (<Button variant='contained' color='neutral' style={{ textTransform: 'none' }} onClick={UpdateBack} startIcon={<ArrowBackIcon />}>Back Log</Button>)
              } else if (step_id === 2 && role.uR_Doing_Status === true) { //Doing
                return (<Button variant='contained' color='neutral' style={{ textTransform: 'none' }} onClick={UpdateBack} startIcon={<ArrowBackIcon />}>To Do</Button>)
              } else if (step_id === 3 && role.uR_Resolved_Status === true) { //solve
                return (<Button variant='contained' color='neutral' style={{ textTransform: 'none' }} onClick={UpdateBack} startIcon={<ArrowBackIcon />}>Doing</Button>)
              } else if (step_id === 4 && role.uR_Done_Status === true) { //Done
                return (<Button variant='contained' color='neutral' style={{ textTransform: 'none' }} onClick={UpdateBack} startIcon={<ArrowBackIcon />}>Solved</Button>)
              } else if (step_id === 5 && role.uR_Charge_Status === true) { //Charge
                return (<Button variant='contained' color='neutral' style={{ textTransform: 'none' }} onClick={UpdateBack} startIcon={<ArrowBackIcon />}>Done</Button>)
              } else if (step_id === 8) { //Charge
                return (<Button variant='contained' color='neutral' style={{ textTransform: 'none' }} onClick={UpdateBack} startIcon={<ArrowBackIcon />}>Done</Button>)
              }
            })
          }
        </ThemeProvider>
      </div>)
  }

  const handleNext = () => { //step_id [0,1,2,3,4]
    return (
      <div>
        <ThemeProvider theme={theme}>
          {
            Permission.map((role) => {
              if (step_id === 0 && role.uR_BackLog_Status === true) { //Backlog
                return (<div><Button variant='contained' color='primary' style={{ textTransform: 'none' }} onClick={UpdateNext} endIcon={<ArrowForwardIcon />}>To Do</Button></div>)
              } else if (step_id === 1 && role.uR_Todo_Status === true) { //Todo
                return (<Button variant='contained' color='primary' style={{ textTransform: 'none' }} onClick={UpdateNext} endIcon={<ArrowForwardIcon />}>Doing</Button>)
              } else if (step_id === 2 && role.uR_Doing_Status === true) { //Doing
                return (<Button variant='contained' color='primary' style={{ textTransform: 'none' }} onClick={UpdateNext} endIcon={<ArrowForwardIcon />}>Solved</Button>)
              } else if (step_id === 3 && role.uR_Resolved_Status === true) { //solve
                return (<Button variant='contained' color='primary' style={{ textTransform: 'none' }} onClick={UpdateNext} endIcon={<ArrowForwardIcon />}>Done</Button>)
              } else if (step_id === 4 && role.uR_Done_Status === true) { //Done
                return (<Button variant='contained' color='primary' style={{ textTransform: 'none' }} onClick={UpdateNext} endIcon={<ArrowForwardIcon />}>Charge</Button>)
              } else if (step_id === 5 && role.uR_Done_Status === true) {//Charge
                return (<Button variant='contained' color='warning' style={{ textTransform: 'none' }} onClick={UpdateNext} >{step_id === steps.length - 1 ? 'Closed' : ''}</Button>)
              }else if (step_id === 8 && role.uR_Done_Status === true) {//Charge
                return (<Button variant='contained' color='warning' style={{ textTransform: 'none' }} onClick={UpdateNext} endIcon={<ArrowForwardIcon />}>Closed</Button>)
              }
            })
          }
        </ThemeProvider>
      </div>
    )
  }

  const CheckStatusID = () => {
    if (step_id === steps.length) {
      return (
        <>
          <Typography textAlign={"center"} variant="h5" sx={{ mt: 2, mb: 1, color: '#64dd17', fontWeight: 'bold' }}>
            Completed <CheckCircleOutlinedIcon color='#64dd17' fontSize='large' />
          </Typography>
          <center><h5 style={{ color: '#7F8487' }}>{reason}</h5></center>
        </>
      )
    }
    if (StatusID === 8) {
      return (
        <>
          <Typography textAlign="center" variant="h4" sx={{ mt: 2, mb: 1, color: '#EB1D36', fontWeight: 'bold' }}>
            Reject <CloseIcon color='#EB1D36' fontSize='large' />
          </Typography>
          <center><h5 style={{ color: '#EB1D36' }}>{reason}</h5></center>
        </>
      )
    }

    else {
      return (
        <Stepper activeStep={step_id} alternativeLabel style={{ zoom: "140%" }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )

    }
  }


  return (
    <div style={{ width: "100%" }}>
      <Box>
        <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid item xs={2}>
            <Box textAlign='left' sx={{ p: 2 }}>
              {handleBack()}
            </Box>
          </Grid>
          <Grid item xs={8}>
            <CheckStatusID />
          </Grid>
          <Grid item xs={2}>
            <Box textAlign='right' sx={{ p: 2 }}>
              {handleNext()}
            </Box>
          </Grid>
        </Grid>
      </Box>
      <BootstrapDialog
        maxWidth="sm"
        // style={{ zoom: "85%"}}
        fullWidth={true}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openDialog}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Cause / Solution
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <FormSolution statusid={status_id} />
        </DialogContent>
      </BootstrapDialog>
    </div >
  );
};
export default Linear;