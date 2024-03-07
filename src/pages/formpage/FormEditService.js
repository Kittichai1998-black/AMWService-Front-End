import React, { useState, useEffect } from 'react'
import Board, { moveCard } from "@lourenci/react-kanban";
import { ViewAPI, MasterAPI, DetailAPI } from '../../intercepetors/axios'
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
import { set } from 'date-fns/esm';

const useStyles = makeStyles({
    root: {
        width: "100%",
        // zoom: "80%"
        // zIndex: -99999
    },
    hide: {
        zIndex: 10000
    },

})

const Input = styled('input')({
    display: 'none',
});

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function FormEditService(Rowdata) {
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
    const [ValueCustommer, setValueCustommer] = useState(Rowdata.Rowdata.Customer_Id);
    const [ValueProject, setValueProject] = useState(Rowdata.Rowdata.Project_Id);
    const [ValueOperator, setValueOperator] = useState(Rowdata.Rowdata.Operator_Id);
    const [Rootcause, setRootcause] = useState([]);
    const [valueCause, setCause] = useState(Rowdata.Rowdata.CauseID);
    const [Description, setDescription] = useState(Rowdata.Rowdata.Problem);
    const [Priolity, setPriolity] = useState([]);
    const [ValuePriolity, setvaluePriolity] = useState(Rowdata.Rowdata.Priority_Id);
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
    const [Account, setAccount] = useState(localStorage.getItem("user"));
    const [UserID, setUserID] = useState(localStorage.getItem("userID"));
    const [datadepartment, setdataDepartment] = useState("");
    const [department, setDepartment] = useState(Rowdata.Rowdata.DepartmentID);
    const [BeforeOwner, setBeforeOwner] = useState()
    const [AddOwner, setAddOwner] = useState([]);
    const [RemoveOwner, setRemoveOwner] = useState([]);
    const [DueDate, setDueDate] = useState(Rowdata.Rowdata.DueDate);
    const [toast, setToast] = useState({ msg: null, open: false, type: null });

    //*************GetData***********//
    useEffect(() => {
        GetCustommer()
        // GetOperator()
        GetDepartment()
        GetRootcause()
        GetPriolity()
        GetWorkGroup()
        GetUser()
        console.log(Rowdata)
    }, [])

    useEffect(() => {
        // GetOperator()
        GetCompany()
        GetMAProject()
        // console.log(ValueCustommer)
    }, [ValueCustommer])

    // useEffect(() => {
    //     GetOperator2()
    // }, [ValueOperator])

    useEffect(() => {
        GetUser()
    }, [department])

    // useEffect(() => {
    //     console.log(UserOwner)
    //     console.log(RemoveOwner)
    //     // console.log(GroupName)
    // }, [UserOwner, RemoveOwner])

    async function GetSos() {
        await axios({
            method: 'get',
            url: ViewAPI.API_URL + '/GetSOs',
            responseType: 'stream'
        }).then(res => {
            setDataSO(res.data)
        })
    }

    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    async function UpdateServiceOrder() {
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
                formData.append('ID', Rowdata.Rowdata.ID)
                formData.append('Customer_Id', ValueCustommer)
                formData.append('Project_Id', ValueProject)
                formData.append('Priority_Id', ValuePriolity)
                formData.append('Rootcause_Id', valueCause)
                formData.append('Problem', Description)
                formData.append('Department_Id', department)
                // formData.append('Operator_Id', ValueOperator)
                formData.append('DueDate', dayjs(DueDate).format('YYYY-MM-DDTHH:mm:ss'))
                formData.append('UpdateBy', UserID)
                axios({
                    method: 'put',
                    url: ViewAPI.API_URL + '/Service=' + Rowdata.Rowdata.ID,
                    data: formData
                }).then((res) => {
                    if (res.data.status === "Success") {
                        setOpen(false); //ปิด Dialog
                        swal.fire({
                            customClass: {
                                container: classes.hide //Alert หน้าสุด
                            }, title: 'Success', icon: 'success'
                        })
                        InsertWorkGroup() //บันทึกลง WorkGroup
                        if (RemoveOwner !== []) {
                            UpdateWorkGroup();
                        }
                        if (Rowdata.Rowdata.StatusID === 8) {
                            UpdateStatusSO(2)
                        }

                        setTimeout(() => {
                            refreshPage()
                        }, 1500)
                    }
                }).catch(function (error) {
                    swal.fire({
                        customClass: {
                            container: classes.root //Alert หน้าสุด
                        }, title: 'Fail', icon: 'error'
                    })
                });
            }
        })
    }

    function UpdateStatusSO(val) {
        axios({
            method: 'put',
            url: DetailAPI.API_URL + '/UpdateStatusSO=' + Rowdata.Rowdata.ID,
            data: {
                ID: Rowdata.Rowdata.ID,
                Status_Id: val,
                UpdateBy: UserID,
                UpdateDate: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
            }
        })
    }

    //   async function SaveImage(val) {
    //     console.log(val)
    //     for (let i of Object.keys(ImageName)) {
    //       const formData = new FormData();
    //       formData.append('Pic_Repair_Id', 0)
    //       formData.append('PR_Name', ImageName)
    //       formData.append('PR_Repair_Id', val)  //ดึง id เก็บ
    //       formData.append('ImageFile', file[i])
    //       // formData.append('ImageSrc', '1')
    //       console.log(file);

    //       await axios({
    //         method: 'post',
    //         url: ViewAPI.API_URL + '/ImageFile',
    //         data: formData
    //       }).then((res) => {
    //       })
    //     }
    //   }

    async function InsertWorkGroup() {
        // console.log(UserOwner)
        // console.log(OwnerGroup)
        let bfuo = BeforeOwner.map((x) => { return x.userID })
        let isuo = UserOwner.map((uid) => { return (uid.userID) })
        let fil = isuo.filter(function (e) { return this.indexOf(e) < 0; }, bfuo);
        // console.log(bfuo)
        // console.log(fil)
        for (let i of Object.keys(fil)) {
            let fil2 = isuo.filter(function (e) { return this.indexOf(e) < 0; }, bfuo);
            let filun = UserOwner.filter((x) => x.userID === fil2[i]).map((x) => { return x.userName });
            let fildp = UserOwner.filter((x) => x.userID === fil2[i]).map((x) => { return x.departmentID });

            const formData = new FormData();
            formData.append('Service_Id', Rowdata.Rowdata.ID)
            formData.append('UserID', fil[i])
            formData.append('UserName', filun)
            formData.append('DepartmentID', fildp)
            formData.append('Status', 1)
            formData.append('CreateDate', moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'))
            formData.append('CreateBy', UserID)

            if (UserOwner !== BeforeOwner) {
                await axios({
                    method: 'post',
                    url: ViewAPI.API_URL + '/WorkGroup',
                    data: formData
                })
            }
            else {
                console.log("Fail Information Not Matching")
            }

        }
    }

    async function UpdateWorkGroup() {
        for (let i of Object.keys(RemoveOwner)) {
            let rmuo = RemoveOwner.filter((v, i, a) => a.indexOf(v) === i).map((uid) => { return (uid.userID) })[i]
            let uid = RemoveOwner.filter((v, i, a) => a.indexOf(v) === i).map((uid) => { return (uid.id) })[i]
            const formData = new FormData();
            formData.append('ID', uid)
            formData.append('Service_Id', Rowdata.Rowdata.ID)
            formData.append('User_Id', rmuo)
            formData.append('Status', 2)
            formData.append('UpdateBy', UserID)

            await axios({
                method: 'put',
                url: ViewAPI.API_URL + '/EditWorkGroup=' + uid,
                data: formData
            })
        }
    }
    // 
    async function GetCustommer() {
        await axios({
            method: 'get',
            url: ViewAPI.API_URL + '/GetCustommer',
            responseType: 'stream'
        }).then(res => {
            setCustommer(res.data)
        })
    }

    async function GetMAProject() {
        // setOpenBackdrop(!open);
        // for (let i of Object.keys(Rowdata)) {
        await axios.get(MasterAPI.API_URL + '/GetMAProject'
            , { params: { CustomerID: Rowdata.Rowdata.Customer_Id } }
        ).then(res => {
            setProject(res.data)
            // setOpenBackdrop(false)
        })
        // }
    }

    // async function GetOperator() {
    //     await axios.get(ViewAPI.API_URL + '/GetOperator', { params: { Customer_id: ValueCustommer } }
    //     ).then(res => {
    //         setOperator(res.data)
    //     })
    // }
    // async function GetOperator2() {
    //     await axios.get(ViewAPI.API_URL + '/GetOperator', { params: { Operator_id: ValueOperator } }
    //     ).then(res => {
    //         setOperator2(res.data)
    //     })
    // }

    async function GetCompany() {
        await axios.get(ViewAPI.API_URL + '/GetCompany', { params: { Customer_id: ValueCustommer } }
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
        await axios.get(ViewAPI.API_URL + '/GetUser', { params: { Department_id: department } }
        ).then(res => {
            setUser(res.data)
            console.log(department.department_Id)
        })
    }

    async function GetWorkGroup() {
        await axios.get(ViewAPI.API_URL + '/GetWorkGroup', { params: { service_id: Rowdata.Rowdata.ID } }
        ).then(res => {
            setOwner(res.data)
            setBeforeOwner(res.data)
            // console.log(department.department_Id)
        })
    }

    function refreshPage() {
        window.location.reload(false);
    }
    const SaveOrder = () => {
        // console.log(valueCause)
        if (ValueCustommer === undefined) { swal.fire({ customClass: { container: classes.hide }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        // if (ValueOperator === undefined) { swal.fire({ customClass: { container: classes.hide }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (valueCause === undefined) { swal.fire({ customClass: { container: classes.hide }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (ValueProject === undefined) { swal.fire({ customClass: { container: classes.hide }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (department === undefined) { swal.fire({ customClass: { container: classes.hide }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (UserOwner === null || UserOwner === undefined) { swal.fire({ customClass: { container: classes.hide }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (Description === undefined) { swal.fire({ customClass: { container: classes.hide }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        else {
            UpdateServiceOrder()
        }
    }

    const handleRemove = (event, Value, reason, option) => {
        let rmo = option.option
        if (reason === "removeOption") {
            for (let i = 0; i < rmo.length; i++) {
                RemoveOwner.push(rmo[i])
            }
            setRemoveOwner([...RemoveOwner.concat(rmo)])
            setOwner(Value);
            // console.log("delete value",option.option)
        } else {
            setOwner(Value);
        }
    };

    return (
        <div className={classes.root}>
            <Container maxWidth="xl">
                <Paper elevation={8}>
                    <Box p={1} style={{ display: 'flex', borderRadius: 4, textAlign: 'center' }}>
                        <AlertTitle><strong style={{ fontSize: 18 }} ></strong></AlertTitle>
                    </Box>
                    <div style={{ paddingInline: '8%' }}>
                        {/* <Box textAlign='right' sx={{ p: 2 }}>
                <label>วันที่ : {moment(date).add(543, "Y").format("DD/MM/YYYY")}</label>
              </Box> */}
                        {/* <Box textAlign='center' sx={{ p: 2 }}>
                            <h2>Service Orders</h2>
                        </Box> */}
                        {/* <Grid container spacing={3} columns={{ xs: 4, md: 12 }} style={{ padding: 15 }}>
                            <Grid item xs={12} sm={2}>
                                <b>Customer</b>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Autocomplete
                                    // id="clear-on-escape"
                                    id="combo-box-demo"
                                    size="small"
                                    clearOnEscape
                                    options={Custommer}
                                    getOptionLabel={(option) => option.customer || Rowdata.Rowdata.Customer}
                                    defaultValue={ValueCustommer}
                                    onChange={(event, val) => setValueCustommer(val.id)}
                                    style={{ width: "auto" }}
                                    // fullWidth
                                    renderInput={(params) =>
                                        <TextField {...params}
                                            // variant="standard"
                                            sx={{ "& legend": { display: "none" } }}
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
                                    size="small"
                                    clearOnEscape
                                    options={Project}
                                    defaultValue={Rowdata.Rowdata.MA_Name}
                                    getOptionLabel={(option) => option.MA_Name || Rowdata.Rowdata.MA_Name}
                                    // value={ValueProject}
                                    onChange={(event, val) => { setValueProject(val) }}
                                    style={{ width: "auto" }}
                                    fullWidth
                                    renderInput={(params) =>
                                        <TextField {...params}
                                            // variant="standard"
                                            sx={{ "& legend": { display: "none" } }}
                                            error={ValueProject !== undefined ? undefined : err}
                                        />}
                                />
                            </Grid>
                        </Grid> */}
                    </div>
                    {/* <hr /> */}
                    {/* <Box p={1} bgcolor="#2196f3" color="primary.contrastText" style={{ display: 'flex', borderRadius: 4 }}>
                        <AlertTitle><strong style={{ fontSize: 18 }} >Detail Customer</strong></AlertTitle>
                    </Box> */}
                    <Box p={2}>
                        <Typography variant="h5" gutterBottom component="div">
                            Detail Customer
                        </Typography>
                    </Box>
                    {Company.map(Address => {
                        return (
                            <div style={{ paddingInline: '8%' }}>
                                <Grid container spacing={3} columns={{ xs: 4, md: 12 }} style={{ padding: 15 }}>
                                    {/* <Grid item xs={12} sm={2}>
                                        <b>Operator</b>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Autocomplete
                                            id="combo-box-demo"
                                            size="small"
                                            disableClearable
                                            options={Operator}
                                            defaultValue={Rowdata.Rowdata.OP_Name}
                                            getOptionLabel={(option) => option.oP_Name || Rowdata.Rowdata.OP_Name}
                                            onChange={(event, val) => { setValueOperator(val.id) }}
                                            style={{ width: "auto" }}
                                            fullWidth
                                            renderInput={(params) =>
                                                <TextField {...params}
                                                    // variant="standard"
                                                    sx={{ "& legend": { display: "none" } }}
                                                    error={ValueOperator !== undefined ? undefined : err}
                                                />}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <b>Name(TH)</b>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        {Operator2.filter(x => { return x.oP_Name }).map(op => {
                                            return (
                                                <label>{op.oP_Name}</label>
                                            )
                                        })}
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <b>Name(Eng)</b>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        {Operator2.filter(x => { return x.oP_Name_Eng }).map(op => {
                                            return (
                                                <label>{op.oP_Name_Eng}</label>
                                            )
                                        })}
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <b>NickName</b>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        {Operator2.filter(x => { return x.oP_NickName }).map(op => {
                                            return (
                                                <label>{op.oP_NickName}</label>
                                            )
                                        })}
                                    </Grid> */}
                                    <Grid item xs={12} sm={2}>
                                        <b>Customer</b>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Autocomplete
                                            // id="clear-on-escape"
                                            id="combo-box-demo"
                                            size="small"
                                            clearOnEscape
                                            options={Custommer}
                                            getOptionLabel={(option) => option.customer || Rowdata.Rowdata.Customer}
                                            defaultValue={ValueCustommer}
                                            onChange={(event, val) => setValueCustommer(val.id)}
                                            style={{ width: "auto" }}
                                            // fullWidth
                                            renderInput={(params) =>
                                                <TextField {...params}
                                                    // variant="standard"
                                                    sx={{ "& legend": { display: "none" } }}
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
                                            size="small"
                                            clearOnEscape
                                            options={Project}
                                            defaultValue={Rowdata.Rowdata.MA_Name}
                                            getOptionLabel={(option) => option.MA_Name || Rowdata.Rowdata.MA_Name}
                                            // value={ValueProject}
                                            onChange={(event, val) => { setValueProject(val) }}
                                            style={{ width: "auto" }}
                                            fullWidth
                                            renderInput={(params) =>
                                                <TextField {...params}
                                                    // variant="standard"
                                                    sx={{ "& legend": { display: "none" } }}
                                                    error={ValueProject !== undefined ? undefined : err}
                                                />}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <b>Email</b>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <label>{Address.cP_Email}</label>
                                    </Grid>

                                    <Grid item xs={12} sm={3}>
                                        <b>Phone Number</b>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <label>{Address.cP_Phone}</label>
                                    </Grid>
                                    {/* <Grid item xs={12} sm={2}>
                                        <b>Line ID</b>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        {Operator2.filter(x => { return x.oP_Line_id }).map(op => {
                                            return (
                                                <label>{op.oP_Line_id}</label>
                                            )
                                        })}
                                    </Grid> */}
                                    {/* <Grid item xs={12} sm={2}>
                                        <b>Location</b>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <label>{Address.cP_Name + ',' + Address.cP_Address}</label>
                                    </Grid> */}

                                    {/* <Grid item xs={12} sm={2}>
                                        <b>Latitude</b>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <label>{Address.cP_Latitude}</label>
                                    </Grid>

                                    <Grid item xs={12} sm={2}>
                                        <b>Longitude</b>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <label>{Address.cP_Longitude}</label>
                                    </Grid> */}
                                </Grid>
                            </div>
                        )

                    })}
                    {(Company.length <= 0) &&
                        <Alert severity="info" style={{ fontSize: 16 }}>Empty Data!</Alert>
                    }
                    <hr />
                    {/* ******************************************************************************************** */}

                    {/* <Box p={1} bgcolor="#2196f3" color="primary.contrastText" style={{ display: 'flex', borderRadius: 4 }}>
                        <AlertTitle><strong style={{ fontSize: 18 }} >Problem Details</strong></AlertTitle>
                    </Box> */}
                    <Box p={2}>
                        <Typography variant="h5" gutterBottom component="div">
                            Problem Details
                        </Typography>
                    </Box>
                    <div style={{ paddingInline: '8%' }}>
                        <Grid container spacing={3} columns={{ xs: 4, md: 12 }} style={{ padding: 15 }}>
                            <Grid item xs={12} sm={3}>
                                <b>Service Order</b>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <a href={"DetailDoc?ServiceID=" + Rowdata.Rowdata.ID}>{Rowdata.Rowdata.ServiceOrder}</a>
                                {/* <label>{Rowdata.Rowdata.ServiceOrder}</label> */}
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <b>Status</b>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <label>{Rowdata.Rowdata.StatusName}</label>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <b>Problems</b>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Autocomplete
                                    id="combo-box-demo"
                                    size="small"
                                    clearOnEscape
                                    options={Rootcause}
                                    getOptionLabel={(option) => option.name || Rowdata.Rowdata.CauseName}
                                    defaultValue={Rowdata.Rowdata.CauseName}
                                    onChange={(event, val) => { setCause(val.id) }}
                                    style={{ width: 300 }}
                                    fullWidth
                                    renderInput={(params) =>
                                        <TextField {...params}
                                            // variant="standard"
                                            sx={{ "& legend": { display: "none" } }}
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
                                    defaultValue={Description}
                                    sx={{ "& legend": { display: "none" } }}
                                    multiline
                                    rows={4}
                                    style={{ width: '100%' }}
                                    variant="outlined"
                                    error={Description !== undefined ? undefined : err}
                                    onChange={(event) => setDescription(event.target.value)}
                                />
                            </Grid>

                        </Grid>


                    </div>
                    <hr />
                    <Box p={2}>
                        <Typography variant="h5" gutterBottom component="div">
                            Responsible
                        </Typography>
                    </Box>
                    <div style={{ paddingInline: '8%' }}>
                        <Grid container spacing={3} columns={{ xs: 4, md: 12 }} style={{ padding: 15 }}>
                            <Grid item xs={12} sm={2}>
                                <b>Department</b>
                            </Grid>
                            <Grid item xs={12} sm={10}>
                                <Autocomplete
                                    id="combo-box-demo"
                                    size="small"
                                    // disableClearable
                                    options={datadepartment}
                                    // defaultValue={datadepartment.dP_Name}
                                    getOptionLabel={(option) => option.dP_Name || Rowdata.Rowdata.DepartmentName}
                                    defaultValue={Rowdata.Rowdata.DepartmentName}
                                    onChange={(event, val) => { setDepartment(val.department_Id) }}
                                    style={{ width: 300 }}
                                    fullWidth
                                    renderInput={(params) =>
                                        <TextField {...params}
                                            // variant="standard"
                                            sx={{ "& legend": { display: "none" } }}
                                            error={department !== undefined ? undefined : err}
                                        />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <b>Employee</b>
                            </Grid>
                            <Grid item xs={12} sm={10}>
                                <Autocomplete
                                    // disabled={department === undefined}
                                    multiple
                                    id="combo-box-demo"
                                    size="small"
                                    disableClearable
                                    clearOnBlur={false}
                                    options={User}
                                    value={UserOwner}
                                    getOptionLabel={(option) => option.userName}
                                    isOptionEqualToValue={(option, value) => option.userID === value.userID}
                                    style={{ width: 300 }}
                                    onChange={handleRemove}
                                    // onInputChange={EditOwner}
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
                                            // variant="standard"
                                            sx={{ "& legend": { display: "none" } }}
                                            error={UserOwner === [] ? [] : err}
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
                            Update
                        </Button>
                    </Box>
                </Paper>
                {/* </Box> */}
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


export default FormEditService;