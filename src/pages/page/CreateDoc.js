import React, { useState, useEffect } from 'react'
import Board, { moveCard } from "@lourenci/react-kanban";
import { ViewAPI, MasterAPI } from '../../intercepetors/axios'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import moment from 'moment';
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import CloseIcon from '@mui/icons-material/Close';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Typography from '@mui/material/Typography';
import { v4 as uuid } from 'uuid';
import { makeStyles } from '@mui/styles';
import swal from 'sweetalert2';
import axios from 'axios';

const useStyles = makeStyles({
  hide: {
    zIndex: 999999
  },
})

const Input = styled('input')({
  display: 'none',
});

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function CreateDoc(props) {
  const classes = useStyles();
  const images = require('../../assets/imgs/gallery.png')
  const [open, setOpen] = React.useState(false);
  const date = new Date().toLocaleString().split(",")[0];
  const [scroll, setScroll] = React.useState("paper");
  const [Custommer, setCustommer] = useState([]);
  const [Project, setProject] = useState([]);
  const [Operator, setOperator] = useState([]);
  const [Operator2, setOperator2] = useState([]);
  const [Company, setCompany] = useState([]);
  const [ValueCustommer, setValueCustommer] = useState();
  const [ValueProject, setValueProject] = useState({ id: 0 });
  const [ValueOperator, setValueOperator] = useState();
  const [Rootcause, setRootcause] = useState([]);
  const [valueCause, setCause] = useState();
  const [Description, setDescription] = useState();
  const [Priolity, setPriolity] = useState([]);
  const [ValuePriolity, setvaluePriolity] = useState("3");
  const [User, setUser] = useState({});
  const [state, setState] = useState(images);
  const [err, setError] = useState(false)
  const [UserOwner, setOwner] = useState([]);
  const [dataSO, setDataSO] = useState([]);
  const [statusSO, setStatus] = useState("");
  const [ServiceID, setSOID] = useState("");
  const [file, setFile] = useState([])
  const [imgFile, setImgFile] = useState([]);
  const [ImageName, setImageName] = useState([])
  const [fileNamemig, setfileNamemig] = useState(null);
  const [Account, setAccount] = React.useState(localStorage.getItem("user"));
  const [UserID, setUserID] = useState(localStorage.getItem("userID"));
  const [datadepartment, setdataDepartment] = useState("");
  const [department, setDepartment] = useState(0);
  const [GroupID, setGroupID] = useState([])
  const [GroupName, setGroupName] = useState([])
  const [DueDate, setDueDate] = useState(dayjs());
  const [toast, setToast] = useState({ msg: null, open: false, type: null });

  //*************GetData***********//
  useEffect(() => {
    GetCustommer()
    // GetOperator()
    GetDepartment()
    GetRootcause()
    GetPriolity()
  }, [])

  useEffect(() => {
    GetOperator()
    GetCompany()
    GetProject()
  }, [ValueCustommer])

  useEffect(() => {
    GetOperator2()
  }, [ValueOperator])

  useEffect(() => {
    GetUser()
  }, [department])

  useEffect(() => {
    console.log(imgFile)
  }, [imgFile])

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const PreviewImg = (e) => {
    const reader = new FileReader();
    let namefie = [];
    let chkfiles = [...e.target.files];
    let urlimg = [];
    let fileNameArray = [];
    let imgArray = "";

    for (let i = 0; i < chkfiles.length; i++) {
      // debugger
      namefie[i] = chkfiles[i].name;
      file.push(chkfiles[i])
    }
    chkfiles.forEach(async (x) => {
      let y = URL.createObjectURL(x);
      urlimg.push(y);
      // console.log(fileBase64);
      let namef = uuid();
      imgArray += "|" + namef;
      fileNameArray.push(namef);
      if (imgArray !== "" || imgArray !== null) {
        setfileNamemig(imgArray.replace("|", ""));
      }

      if (namefie.length > 0) {
        setFile([...file])
        setImgFile([...imgFile.concat(urlimg)])
        setImageName([...ImageName.concat(fileNameArray)]);
      } else {
        setImgFile([]);
      }
    })

  };

  const handleRemoveImg = (index) => {
    ImageName.splice(index, 1)
    setImageName([...ImageName])
    imgFile.splice(index, 1)
    setImgFile([...imgFile])
    file.splice(index, 1)
    setFile([...file])
    // console.log(index)
  };

  async function SaveServiceOrder() {
    swal.fire({
      customClass: {
        container: classes.hide //Alert หน้าสุด
      },
      title: 'Are you sure?',
      // text: "เมื่อทำการอัพเดทแล้วจะไม่สามารถย้อนกลับได้",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'YES'
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('Customer_Id', ValueCustommer.id)
        formData.append('Project_Id', ValueProject.id)
        formData.append('Priority_Id', ValuePriolity)
        formData.append('Rootcause_Id', valueCause.id)
        formData.append('Problem', Description)
        formData.append('CreateBy', UserID)
        // formData.append('Department_Id', department.department_Id)
        // formData.append('Department_Id', department)
        // formData.append('User_Id', UserID)
        // formData.append('Operator_Id', ValueOperator.id)
        // formData.append('DueDate', dayjs(DueDate).format('YYYY-MM-DDTHH:mm:ss'))

        axios({
          method: 'post',
          url: ViewAPI.API_URL,
          data: formData,
        }).then((res) => {
          if (res.data.status === 1) {
            setOpen(false); //ปิด Dialog
            // setToast({ msg: "บันทึกข้อมูลสำเร็จ", open: true, type: 'success' })
            swal.fire({
              customClass: {
                container: classes.hide //Alert หน้าสุด
              }, title: 'Success', icon: 'success'
            })
            if (file.length !== 0) {
              SaveImage(res.data.id) // ส่ง id ไปยัง function
            }
            if (UserOwner.length !== 0){
              SaveWorkGroup(res.data.id)
            }

            // Notify(res.data)
            setTimeout(() => {
              window.location.reload(false);
            }, 1500)
          }
        }).catch(function (error) {
          swal.fire({
            customClass: {
              container: classes.hide //Alert หน้าสุด
            }, title: 'Fail', icon: 'error'
          })
        });
      }
    })
  }

  async function SaveImage(val) {
    // console.log(val)
    for (let i of Object.keys(ImageName)) {
      const formData = new FormData();
      formData.append('Pic_Repair_Id', 0)
      formData.append('PR_Name', ImageName)
      formData.append('PR_Repair_Id', val)  //ดึง id เก็บ
      formData.append('ImageFile', file[i])

      await axios({
        method: 'post',
        url: ViewAPI.API_URL + '/ImageFile',
        data: formData
      }).then((res) => {
      })
    }
  }

  async function SaveWorkGroup(id) {
    // console.log(UserOwner)
    // console.log(OwnerGroup)
    for (let i of Object.keys(UserOwner)) {
      const formData = new FormData();
      formData.append('Service_ID', id)
      formData.append('UserID', UserOwner.map((uid) => { return (uid.userID) })[i])
      formData.append('UserName', UserOwner.map((uid) => { return (uid.userName) })[i])
      formData.append('FirsName', UserOwner.map((uid) => { return (uid.firsName) })[i])
      formData.append('DepartmentID', UserOwner.map((uid) => { return (uid.departmentID) })[i])
      formData.append('Status', 1)
      formData.append('CreateDate', moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'))
      formData.append('CreateBy', UserID)

      await axios({
        method: 'post',
        url: ViewAPI.API_URL + '/WorkGroup',
        data: formData
      })
    }
  }

  async function Notify(val) {
    console.log(val)
    const Message = "ServiceOrder:" + val.code + "\n" +
      "Customer: AMW" + "\n" +
      "ปัญหา:" + val.problem + "\n" +
      "http://191.20.110.4:8090/DetailDoc?ServiceID=" + val.id
    const formData = new FormData();
    formData.append('message', "test api")
    await axios({
      method: 'post',
      url: ViewAPI.API_URL + '/LineNotify',
      data: {
        lineToken: "1wWzUdGrrW0u7DZhXUWHgqnpCqwjr0Gf4HAUGCtxiAd", //linetoken 
        message: Message //ใส่ข้อความ
      }
    })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
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

  async function GetProject() {
    await axios.get(MasterAPI.API_URL + '/GetMAProject', { params: { CustomerID: ValueCustommer.id } }
    ).then(res => {
      setProject(res.data)
      // console.log(ValueCustommer.id)
    })
  }

  async function GetOperator() {
    await axios.get(ViewAPI.API_URL + '/GetOperator', { params: { Customer_id: ValueCustommer.id } }
    ).then(res => {
      setOperator(res.data)
    })
  }
  async function GetOperator2() {
    await axios.get(ViewAPI.API_URL + '/GetOperator', { params: { Operator_id: ValueOperator.id } }
    ).then(res => {
      setOperator2(res.data)
    })
  }
  async function GetCompany() {
    await axios.get(ViewAPI.API_URL + '/GetCompany', { params: { Customer_id: ValueCustommer.id } }
    ).then(res => {
      setCompany(res.data)
      // console.log(ValueCustommer.id)
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
  async function GetDepartment() {
    await axios({
      method: 'get',
      url: ViewAPI.API_URL + '/GetDepartment',
      responseType: 'stream'
    }).then(res => {
      setdataDepartment(res.data)
    })

  }

  async function GetUser() {
    await axios.get(ViewAPI.API_URL + '/GetUser', { params: { Department_id: department.department_Id } }
    ).then(res => {
      setUser(res.data)
      // console.log(department.department_Id)
    })
  }

  const SaveOrder = () => {
    // Notify()
    // console.log(valueCause)
    if (ValueCustommer === undefined) { swal.fire({ customClass: { container: classes.hide }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
    // if (ValueOperator === undefined) { swal.fire({ customClass: { container: classes.hide }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
    if (valueCause === undefined) { swal.fire({ customClass: { container: classes.hide }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
    // if (ValueProject === undefined) { swal.fire({ customClass: { container: classes.hide }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
    if (department === undefined) { swal.fire({ customClass: { container: classes.hide }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
    if (UserOwner === undefined) { swal.fire({ customClass: { container: classes.hide }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
    if (Description === undefined) { swal.fire({ customClass: { container: classes.hide }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
    else {
      SaveServiceOrder()
    }
  }

  return (
    <div className={classes.root}>
      <Container maxWidth="xl">
        <Paper elevation={8}>
          <Box p={1} style={{ display: 'flex', borderRadius: 4, textAlign: 'center' }}>
            {/* <AlertTitle><strong style={{ fontSize: 18 }} ></strong></AlertTitle> */}
          </Box>
          <div style={{ paddingInline: '8%' }}>
            <Grid container spacing={3} columns={{ xs: 4, md: 12 }} style={{ padding: 15 }}>
              <Grid item xs={12} sm={2}>
                <b>Customer</b>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  id="combo-box-demo"
                  // disableClearable
                  size="small"
                  options={Custommer}
                  getOptionLabel={(option) => option.customer}
                  onChange={(event, val) => setValueCustommer(val)}
                  // style={{ width: "auto" }}
                  sx={{ width: 'auto' }}
                  renderInput={(params) =>
                    <TextField {...params}
                      // label="Customer"
                      sx={{ "& legend": { display: "none" } }}
                      // variant="standard"
                      error={ValueCustommer !== undefined ? undefined : err}
                    />}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <b>Project</b>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  id="combo-box-demo"
                  // disableClearable
                  size="small"
                  options={Project}
                  defaultValue={Project.mA_Name}
                  getOptionLabel={(option) => option.mA_Name}
                  onChange={(event, val) => { setValueProject(val) }}
                  style={{ width: "auto" }}
                  // fullWidth
                  renderInput={(params) =>
                    <TextField {...params}
                      // label="project"
                      sx={{ "& legend": { display: "none" } }}
                      // variant="standard"
                      error={ValueProject !== undefined ? undefined : err}
                    />}
                />
              </Grid>
            </Grid>
          </div>
          <hr />
          <Box p={2}>
            <Typography variant="h5" gutterBottom component="div">
              Detail Customer
            </Typography>
          </Box>
          {Company.map(Address => {
            return (
              <div style={{ paddingInline: '8%' }}>
                <Grid container spacing={3} columns={{ xs: 4, md: 12 }} style={{ padding: 15 }}>

                  <Grid item xs={12} sm={2}>
                    <b>Email</b>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <label>{Address.cP_Email}</label>
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <b>Phone Number</b>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <label>{Address.cP_Phone}</label>
                  </Grid>
                </Grid>
              </div>
            )
          })}
          {(Company.length <= 0) &&
            <Alert severity="info" style={{ fontSize: 16 }}>Empty Data!</Alert>
          }
          <hr />
          {/* ******************************************************************************************** */}
          <Box p={2}>
            <Typography variant="h5" gutterBottom component="div">
              Problem Details
            </Typography>
          </Box>
          <div style={{ paddingInline: '8%' }}>
            <Grid container spacing={3} columns={{ xs: 4, md: 12 }} style={{ padding: 15 }}>
              <Grid item xs={12} sm={2}>
                <b>Problem</b>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  id="combo-box-demo"
                  // disableClearable
                  size="small"
                  options={Rootcause}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, val) => { setCause(val) }}
                  style={{ width: 300 }}
                  fullWidth
                  renderInput={(params) =>
                    <TextField {...params}
                      // label="Problems"
                      sx={{ "& legend": { display: "none" } }}
                      // variant="standard"
                      error={valueCause !== undefined ? undefined : err}
                    />}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} columns={{ xs: 4, md: 12 }} style={{ padding: 15 }}>
              <Grid item xs={12} sm={2}>
                <b style={{ paddingTop: 5 }}>Priolity</b>
              </Grid>
              <Grid item xs={12} sm={10}>
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={ValuePriolity}
                    onChange={(e) => setvaluePriolity(e.target.value)}
                  >
                    <FormControlLabel value="3" control={<Radio color="success" />} label="Normal / Wait more 24 Hr." />
                    <FormControlLabel value="2" control={<Radio color="warning" />} label="Wait in 24 Hr." />
                    <FormControlLabel value="1" control={<Radio color="error" />} label="Immediate" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={3} columns={{ xs: 4, md: 12 }} style={{ padding: 15 }}>
              <Grid item xs={12} sm={2}>
                <b>Detail</b>
              </Grid>
              <Grid item xs={12} sm={10}>
                <TextField
                  id="outlined-multiline-static"
                  // defaultValue={values.desc}
                  // label="Text"
                  multiline
                  rows={4}
                  sx={{ "& legend": { display: "none" } }}
                  style={{ width: '100%' }}
                  variant="outlined"
                  error={Description !== undefined ? undefined : err}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={2.4}>
                <b>Upload Image</b>
              </Grid>
              <Grid item xs={12} sm={9.6}>
                <ImageList sx={{ width: 'auto', maxHight: 'auto', paddingTop: 2 }} cols={3} gap={8}>
                  {imgFile &&
                    imgFile.map((photo, index) => (
                      <ImageListItem key={photo.img}>
                        <Box textAlign='right'>
                          <IconButton style={{ backgroundColor: "#eee", }} title="Remove Image" size="small" onClick={() => handleRemoveImg(index)}>
                            <CloseIcon />
                          </IconButton>
                        </Box>
                        <img key={index} src={photo} style={{ width: 160, height: 160, margin: 16, border: '1px solid', borderRadius: 10 }} />
                      </ImageListItem>
                    ))}
                </ImageList>
                <Box>
                  <Stack
                    direction="row"
                    spacing={3}
                  >
                    <label htmlFor="contained-button-file">
                      <Input accept="image/*" id="contained-button-file" multiple type="file" onChange={PreviewImg} />
                      <Button style={{ textTransform: 'none' }} variant="outlined" component="span" size="small">
                        Upload Image
                      </Button>
                    </label>
                  </Stack>
                </Box>
              </Grid>

            </Grid>
            <Grid container spacing={3} columns={{ xs: 4, md: 12 }} style={{ padding: 15 }}>
              <Grid item xs={12} sm={2}>
                <b>Department</b>
              </Grid>
              <Grid item xs={12} sm={10}>
                <Autocomplete
                  id="combo-box-demo"
                  // disableClearable
                  size="small"
                  options={datadepartment}
                  defaultValue={datadepartment.dP_Name}
                  getOptionLabel={(option) => option.dP_Name}
                  onChange={(event, val) => { setDepartment(val) }}
                  style={{ width: 300 }}
                  fullWidth
                  renderInput={(params) =>
                    <TextField {...params}
                      // label="Department"
                      sx={{ "& legend": { display: "none" } }}
                      // variant="standard"
                      error={department !== undefined ? undefined : err}
                    />}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <b>Employee</b>
              </Grid>
              <Grid item xs={12} sm={10}>
                <Autocomplete
                  disabled={department === undefined}
                  multiple
                  id="checkboxes-tags-demo"
                  disableCloseOnSelect
                  options={User}
                  getOptionLabel={(option) => option.firsName}
                  style={{ width: 500 }}
                  onChange={(event, val) => setOwner(val)}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.firsName}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField {...params}
                      // label="Add"
                      sx={{ "& legend": { display: "none" } }}
                      // variant="standard"
                      // placeholder="Add"
                      error={UserOwner !== undefined ? undefined : err}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <b>Due Date</b>
              </Grid>
              <Grid item xs={12} sm={10}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    // disabled={Insurance === false}
                    // label="Due Date"
                    value={DueDate}
                    inputFormat="dd/MM/yyyy"
                    // minDate={new Date('2017-01-01')}
                    onChange={(newValue) => {
                      setDueDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} style={{ width: 200 }} sx={{ "& legend": { display: "none" } }} size="small" />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </div>
          <hr />
          <Box textAlign='right' sx={{ p: 2 }}>
            <Button style={{ textTransform: 'none' }} variant='contained' onClick={SaveOrder}>
              Save
            </Button>
          </Box>
        </Paper>
        {toast.open &&
          <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={toast.open} autoHideDuration={5000} onClose={() => setToast({ msg: "", open: false, type: "" })}>
            <Alert elevation={6} variant="filled" onClose={() => setToast({ msg: "", open: false, type: "" })} severity={toast.type}>
              {toast.msg}
            </Alert>
          </Snackbar>
        }
      </Container>
    </div >
  );
}

export default CreateDoc;