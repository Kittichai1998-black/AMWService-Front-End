import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Autocomplete from '@mui/material/Autocomplete';
import { Input } from '@mui/material';
import TextField from '@mui/material/TextField';
import { ViewAPI } from '../../api/MstView'
import { v4 as uuid } from 'uuid';
import swal from 'sweetalert2';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import axios from 'axios';

export default function AlertDialog() {
  // const [open, setOpen] = React.useState(false);

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

  const column = [ //HeaderDialogCreate
    { header: 'Project' },
    { header: 'Problem' },
    { header: 'Description' },
    { header: 'Date' },
    { header: 'Priolity' },
    { header: 'Owner' }
  ]

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

  const images = require('../../assets/imgs/image-gallery.png')

  // const [columns, setColumns] = useState(columnsFromBackend);
  const [open, setOpen] = React.useState(false);
  // const [selection, setSelection] = useState();
  const [scroll, setScroll] = React.useState('paper');
  const [Custommer, setCustommer] = useState([]);
  const [ValueCustommer, setValueCustommer] = useState(null);
  const [Rootcause, setRootcause] = useState([]);
  const [valueCause, setCause] = useState(null);
  const [Description, setDescription] = useState(null);
  const [Priolity, setPriolity] = useState([]);
  const [valuePriolity, setvaluePriolity] = useState(null);
  const [ImageName, setImageName] = useState("")
  const [User, setUser] = useState({});
  const [state, setState] = useState(images);
  const [file, setFile] = useState()
  const [err, setError] = useState(false)
  const [UserOwner, setOwner] = useState([]);
  const [dataSO, setDataSO] = useState([]);
  const [statusSO, setStatus] = useState("");
  const [ServiceID, setSOID] = useState("");

  // const [Column, setColumn] = useState([]);

  useEffect(() => {
    if (statusSO !== "") {
      UpdateStatus()
      setStatus("")
    }

    GetSos()
  }, [statusSO])

  async function GetSos() {
    await axios({
      method: 'get',
      url: ViewAPI.API_URL + '/GetSOs',
      responseType: 'stream'
    }).then(res => {
      setDataSO(res.data)
    })
  }

  const PreviewImg = e => {
    setImageName(e.target.value)
    setFile(e.target.files[0])
    const reader = new FileReader();
    reader.onload = () => {
      // setState(e.target.file[0])
      if (reader.readyState === 2) {
        setState(reader.result)

      }
    }
    reader.readAsDataURL(e.target.files[0])
  };

  async function SOtoUser() {
    for (let i of Object.keys(UserOwner)) {
      const id = UserOwner[i];
      console.log(id.userID)
      let genid = uuid();
      const formData = new FormData();
      formData.append('id', 0)
      formData.append('uuid', genid)
      formData.append('so', "test")
      formData.append('CustommerID', ValueCustommer.id)
      formData.append('StatusID', 1)
      formData.append('PriorityID', valuePriolity.id)
      formData.append('TypeID', 1)
      formData.append('RootcauseID', valueCause.id)
      formData.append('Problem', Description)
      formData.append('Image', ImageName.replace(/^.*[\\\/]/, ''))
      formData.append('UserID', id.userID)

      formData.append('ImageFile', file)

      await axios({
        method: 'post',
        url: ViewAPI.API_URL,
        // headers: { 'Content-Type': 'application/problem+json; charset=utf-8 ' },
        data: formData
      }).then((res) => {
        if (res.data.status === "Success") {
          swal.fire({ icon: 'success', title: "บันทึกข้อมูลสำเร็จ" })
          setOpen(false); //ปิด Dialog
        }
        else {
          swal.fire({ icon: 'error', title: "Failed", text: "ข้อมูลไม่ถูกต้อง" });
        }
        console.log(res);
        // console.log(id.userID)
      })
    }
  }

  function UpdateStatus() {
    axios({
      method: 'put',
      url: ViewAPI.API_URL + '/ServiceID=' + ServiceID,
      data: { ID: ServiceID, StatusID: statusSO }
    })
  }

  async function GetCustommer() {
    await axios({
      method: 'get',
      url: ViewAPI.API_URL + '/GetCustommer',
      responseType: 'stream'
    }).then(res => {
      setCustommer(res.data)
    })
  }

  async function GetRootcause() {
    await axios({
      method: 'get',
      url: ViewAPI.API_URL + '/GetRootcause',
      responseType: 'stream'
    }).then(res => {
      setRootcause(res.data)
    })

  }

  async function GetPriolity() {
    await axios({
      method: 'get',
      url: ViewAPI.API_URL + '/GetPriolity',
      responseType: 'stream'
    }).then(res => {
      setPriolity(res.data)
    })

  }

  async function GetUser() {
    await axios({
      method: 'get',
      url: ViewAPI.API_URL + '/GetUser',
      responseType: 'stream'
    }).then(res => {
      setUser(res.data)
    })

  }

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const handleClickOpen = (scrollType) => {
    setOpen(true);
    setScroll(scrollType);
    GetCustommer()
    GetRootcause()
    GetPriolity()
    GetUser()
  };
  const handleClose = () => {
    setOpen(false);
    setError(false);
    setState(images);
    setValueCustommer(null);
    setCause(null);
    setDescription(null);
    setvaluePriolity(null);
    setOwner(null);

  };

  const handleCreate = () => {
    if (ValueCustommer === null || ValueCustommer === undefined) { setError(true) }
    if (valueCause === null || valueCause === undefined) { setError(true) }
    if (valuePriolity === null || valuePriolity === undefined) { setError(true) }
    if (Description === null || ValueCustommer === undefined) { setError(true) }
    else {
      console.log(ValueCustommer)
      console.log(valueCause)
      console.log(valuePriolity)
      console.log(ImageName.replace(/^.*[\\\/]/, ''))
      console.log(Description)
      console.log(file)
      // console.log(UserOwner)
      SOtoUser()
      setState(images)
    }
  }


  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        fullWidth="auto"
        maxWidth="sm"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Add Progress
        </BootstrapDialogTitle>
        <DialogContent dividers >
          <div>
            {column.map((edit) => {
              if (edit.header === 'Project') {
                // eslint-disable-next-line no-lone-blocks
                {
                  return (
                    <Box sx={{ width: '100%' }}>
                      <Grid container rowSpacing={1}>
                        <Grid item xs={4}>
                          <h4 style={{ textAlign: 'center', padding: 14 }}>ชื่อโครงการ :</h4>
                        </Grid>
                        <Grid item xs={6}>
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={Custommer}
                            getOptionLabel={(option) => option.custommer}
                            onChange={(event, val) => { setValueCustommer(val) }}
                            sx={{ width: 300 }}
                            renderInput={(params) =>
                              <TextField {...params}
                                label="Project"
                                error={ValueCustommer !== null ? null : err}
                              />}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  );
                }
              }
              if (edit.header === 'Problem') {
                return (
                  <Box sx={{ width: '100%', marginTop: '30px' }}>
                    <Grid container rowSpacing={1}>
                      <Grid item xs={4}>
                        <h4 style={{ textAlign: 'center', padding: 14 }}>หัวข้อปัญหา :</h4>
                      </Grid>
                      <Grid item xs={6}>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={Rootcause}
                          getOptionLabel={(option) => option.name}
                          onChange={(event, val) => { setCause(val) }}
                          sx={{ width: 300 }}
                          renderInput={(params) =>
                            <TextField {...params}
                              label="Problem"
                              error={valueCause !== null ? null : err}
                            />}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                );
              }
              if (edit.header === 'Description') {
                return (
                  <Box sx={{ width: '100%', marginTop: '30px' }}>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <h4 style={{ textAlign: 'center', padding: 14 }}>รายละเอียด :</h4>
                      </Grid>
                      <Grid item xs={8}>
                        <img src={state} style={{ maxWidth: 200, marginLeft: 35 }} />
                        <Input multiple
                          type="file"
                          accept="image/*"
                          id="contained-button-file"
                          style={{ paddingTop: 15 }}
                          onChange={(event) => PreviewImg(event)} />
                        <TextField
                          id="outlined-multiline-static"
                          // defaultValue={values.desc}
                          label="ข้อความ"
                          multiline
                          rows={3}
                          style={{ width: 300, marginTop: 15 }}
                          variant="outlined"
                          error={Description !== null ? null : err}
                          onChange={(event) => setDescription(event.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                );
              }

              if (edit.header === 'Priolity') {
                return (
                  <Box sx={{ width: '100%', marginTop: '30px' }}>
                    <Grid container rowSpacing={1}>
                      <Grid item xs={4}>
                        <h4 style={{ textAlign: 'center', padding: 14 }}>ความสำคัญ :</h4>
                      </Grid>
                      <Grid item xs={6}>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={Priolity}
                          getOptionLabel={(option) => option.name + ' ' + '(' + option.description + ')'}
                          sx={{ width: 300 }}
                          onChange={(event, val) => { setvaluePriolity(val) }}
                          renderInput={(params) =>
                            <TextField {...params}
                              label="Priolity"
                              error={valuePriolity !== null ? null : err}
                            />}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                );
              }

              if (edit.header === 'Owner') {
                return (
                  <Box sx={{ width: '100%', marginTop: '30px' }}>
                    <Grid container rowSpacing={1}>
                      <Grid item xs={4}>
                        <h4 style={{ textAlign: 'center', padding: 14 }}>ผู้รับผิดชอบ :</h4>
                      </Grid>
                      <Grid item xs={8}>
                        <Autocomplete
                          multiple
                          id="checkboxes-tags-demo"
                          options={User}
                          disableCloseOnSelect
                          getOptionLabel={(option) => option.userName}
                          renderOption={(props, option, { selected }) => (
                            <li {...props}>
                              <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                              />
                              {option.userName}
                            </li>
                          )}
                          style={{ width: 300 }}
                          onChange={(event, val) => setOwner(val)}
                          renderInput={(params) => (
                            <TextField {...params}
                              label="Responsible person"
                              placeholder="เพิ่ม"
                            // error={UserOwner !== null? null:err} 
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                );
              }

            })}
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" autoFocus onClick={handleCreate}>
            บันทึก
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}