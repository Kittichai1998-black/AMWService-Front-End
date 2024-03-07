import React, { useState, useEffect } from 'react'
import { AuthenAPI, DetailAPI, ViewAPI, MasterAPI } from '../../intercepetors/axios'
import moment from 'moment';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AlertTitle from '@mui/material/AlertTitle';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';
import { v4 as uuid } from 'uuid';
import Swal from 'sweetalert2';
import axios from 'axios';

const useStyles = makeStyles({
    root: {
        zIndex: 10000
    },
});

const Input = styled('input')({
    display: 'none',
  });

const FromMA = (maproject) => {
    const classes = useStyles();
    const [Customer, setCustomer] = useState([]);
    const [MAid, setMAid] = useState(maproject.maproject.id);
    const [ProjectCode, setProjectCode] = useState(maproject.maproject.mA_Code);
    const [ProjectName, setProjectName] = useState(maproject.maproject.mA_Name);
    const [ProjectPM, setProjectPM] = useState(maproject.maproject.mA_PM);
    const [Service, setService] = useState(maproject.maproject.mA_Service);
    const [Insurance, setInsurance] = useState(maproject.maproject === '' ? false : maproject.maproject.mA_Insurance);
    // const [Detail, setDetail] = useState(maproject.maproject.mA_Detail);
    const [EffectiveStart, setEffectiveStart] = useState(maproject.maproject.mA_Effective_Start);
    const [EffectiveEnd, setEffectiveEnd] = useState(maproject.maproject.mA_Effective_End);
    const [ValueCustomer, setValueCustomer] = useState(maproject.maproject.mA_Customer_Id);
    const [file, setFile] = useState()
    const [FileName, setFileName] = useState("")
    const [UserID, setUserID] = useState(localStorage.getItem("userID"));
    const [open, setOpen] = useState(false);
    const [err, setError] = useState(false)
    const [toast, setToast] = useState({ msg: null, open: false, type: null });

    useEffect(() => {
        GetCustommer()
    }, [Insurance])

    function GetCustommer() {
        axios({
            method: 'get',
            url: ViewAPI.API_URL + '/GetCustommer',
            responseType: 'stream'
        }).then(res => {
            setCustomer(res.data)
        })
    }

    async function SaveMA() {
        const formData = new FormData();
        formData.append('MA_Customer_Id', ValueCustomer.id)
        formData.append('MA_Code', ProjectCode)
        formData.append('MA_Name', ProjectName)
        formData.append('MA_PM', ProjectPM)
        formData.append('MA_Service', Service)
        formData.append('MA_Insurance', Insurance)
        formData.append('MA_Effective_Start', moment(EffectiveStart).format('YYYY-MM-DDTHH:mm:ss'))
        formData.append('MA_Effective_End', moment(EffectiveEnd).format('YYYY-MM-DDTHH:mm:ss'))
        formData.append('Status', 1)
        formData.append('CreateDate', moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'))
        formData.append('CreateBy', UserID)

        await axios({
            method: 'post',
            url: MasterAPI.API_URL + '/MAProject',
            data: formData
        }).then((res) => {
            if (res.data.status === "Success") {
                setOpen(false); //ปิด Dialog
                Swal.fire({
                    customClass: {
                        container: classes.root //Alert หน้าสุด
                    }, title: 'Success', icon: 'success'
                })
                // setToast({ msg: "บันทึกข้อมูลสำเร็จ", open: true, type: 'success' })
                SaveFileMA()

                setTimeout(() => {
                    refreshPage()
                }, 2000)
            }
        }).catch(function (error){
            Swal.fire({
                customClass: {
                    container: classes.root //Alert หน้าสุด
                }, title: 'Fail', icon: 'error'
            })
        });
    }

    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const FileMA = (e) => {
        setFile(e.target.files[0])
        setFileName(uuid())
    };

    async function SaveFileMA() {
        // for (let i of Object.keys(ImageName)) {
        const formData = new FormData();
        // formData.append('MA_Project_Id', val)
        formData.append('MA_Project_Name', ProjectName)
        formData.append('File_Name', FileName)
        formData.append('MAFile', file)

        // console.log(file);

        await axios({
            method: 'post',
            url: MasterAPI.API_URL + '/FileMA',
            data: formData
        }).then((res) => {
            // if (res.data.status === "Success") {
            // else {
            //   swal.fire({ icon: 'error', title: "Failed", text: "ข้อมูลไม่ถูกต้อง" });
            // }
        })

    }

    async function UpdateMA() {
        const formData = new FormData();
        formData.append('ID', MAid)
        formData.append('MA_Customer_Id', ValueCustomer)
        formData.append('MA_Code', ProjectCode)
        formData.append('MA_Name', ProjectName)
        formData.append('MA_PM', ProjectPM)
        formData.append('MA_Service', Service)
        formData.append('MA_Insurance', Insurance)
        // formData.append('MA_Detail', Detail)
        formData.append('MA_Effective_Start', moment(EffectiveStart).format('YYYY-MM-DDTHH:mm:ss'))
        formData.append('MA_Effective_End', moment(EffectiveEnd).format('YYYY-MM-DDTHH:mm:ss'))
        formData.append('UpdateBy', UserID)

        await axios({
            method: 'put',
            url: MasterAPI.API_URL + '/MAProjectID=' + MAid,
            data: formData
        }).then((res) => {
            if (res.data.status === "Success") {
                setOpen(false); //ปิด Dialog
                Swal.fire({
                    customClass: {
                        container: classes.root //Alert หน้าสุด
                    }, title: 'Success', icon: 'success'
                })
                setTimeout(() => {
                    refreshPage()
                }, 2000)
            }
        }).catch(function (error){
            Swal.fire({
                customClass: {
                    container: classes.root //Alert หน้าสุด
                }, title: 'Fail', icon: 'error'
            })
        });
    }

    const Confirm = () => {
        Swal.fire({
            customClass: {
                container: classes.root //Alert หน้าสุด
            },
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                // console.log(ValueCustomer.id)
                SaveMA() //บันทึกลง
            }
        })
    }

    const Update = () => {
        Swal.fire({
            customClass: {
                container: classes.root //Alert หน้าสุด
            },
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                UpdateMA() //บันทึกลง
            }
        })
    }

    const handleCheckInsert = () => { //บังคับกรอกข้อความ

        if (ValueCustomer === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (ProjectCode === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (ProjectName === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        // if (Detail === null || Detail === undefined) { setError(true) }
        else {
            Confirm();
        }
    }

    const handleCheckUpdate = () => { //บังคับกรอกข้อความ
        if (ValueCustomer === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (ProjectCode === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (ProjectName === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        // if (Detail === null || Detail === undefined) { setError(true) }
        else {
            console.log(ValueCustomer)
            Update();
        }
    }

    function refreshPage() {
        window.location.reload(false);
    }
    return (
        <div>
            <Container>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={2}>
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}><b>Customer</b></h6>
                    </Grid>
                    <Grid item xs={12} sm={10}>
                        {maproject.maproject === '' ?
                            <Autocomplete
                                id="clear-on-escape"
                                clearOnEscape
                                options={Customer}
                                getOptionLabel={(option) => option.customer}
                                onChange={(event, val) => setValueCustomer(val)}
                                style={{ width: 500 }}
                                // fullWidth
                                renderInput={(params) =>
                                    <TextField {...params}
                                        variant="standard"
                                        error={ValueCustomer !== undefined ? undefined : err}
                                    />}
                            />
                            : <Autocomplete
                                id="clear-on-escape"
                                clearOnEscape
                                options={Customer}
                                getOptionLabel={(option) => option.customer || maproject.maproject.customer}
                                defaultValue={ValueCustomer}
                                onChange={(event, val) => setValueCustomer(val.id)}
                                style={{ width: 500 }}
                                renderInput={(params) =>
                                    <TextField {...params}
                                        variant="standard"
                                        error={ValueCustomer !== undefined ? undefined : err}
                                    />}
                            />}
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}><b>Project Code</b></h6>
                    </Grid>
                    <Grid item xs={12} sm={10}>
                        {maproject.maproject === '' ?
                            <TextField
                                // label="Code"
                                id="standard-basic"
                                fullWidth
                                variant="standard"
                                style={{ width: 500 }}
                                onChange={(event) => setProjectCode(event.target.value)}
                                error={ProjectCode !== undefined ? undefined : err}
                            />
                            :
                            <TextField 
                                defaultValue={ProjectCode}
                                id="standard-basic"
                                variant="standard"
                                style={{ width: 500 }}
                                onChange={(event) => setProjectCode(event.target.value)}
                                error={ProjectCode !== undefined ? undefined : err}
                            />
                        }
                    </Grid>

                    <Grid item xs={12} sm={2}>
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}><b>Name Project</b></h6>
                    </Grid>
                    <Grid item xs={12} sm={10}>
                        {maproject.maproject === '' ?
                            <TextField
                                id="standard-basic"
                                fullWidth
                                variant="standard"
                                style={{ width: 500 }}
                                onChange={(event) => setProjectName(event.target.value)}
                                error={ProjectName !== undefined ? undefined : err}
                            />
                            :
                            <TextField 
                                defaultValue={ProjectName}
                                id="standard-basic"
                                variant="standard"
                                style={{ width: 500 }}
                                onChange={(event) => setProjectName(event.target.value)}
                                error={ProjectName !== undefined ? undefined : err}
                            />
                        }
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}><b>PM</b></h6>
                    </Grid>
                    <Grid item xs={12} sm={10}>
                        {maproject.maproject === '' ?
                            <Checkbox checked={ProjectPM} style={{ transform: "scale(1.5)" }} onChange={(event) => setProjectPM(event.target.checked)} />
                            :
                            <Checkbox checked={ProjectPM} defaultChecked={ProjectPM} style={{ transform: "scale(1.5)" }} onChange={(event) => setProjectPM(event.target.checked)} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}><b>Insurance</b></h6>
                    </Grid>
                    <Grid item xs={12} sm={10}>
                        {maproject.maproject === '' ?
                            <Checkbox checked={Insurance} style={{ transform: "scale(1.5)" }} onChange={(event) => setInsurance(event.target.checked)} />
                            :
                            <Checkbox checked={Insurance} defaultChecked={Insurance} style={{ transform: "scale(1.5)" }} onChange={(event) => setInsurance(event.target.checked)} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}><b>Service</b></h6>
                    </Grid>
                    <Grid item xs={12} sm={10}>
                        {maproject.maproject === '' ?
                            <Checkbox checked={Service} style={{ transform: "scale(1.5)" }} onChange={(event) => setService(event.target.checked)} />
                            :
                            <Checkbox checked={Service} defaultChecked={Service} style={{ transform: "scale(1.5)" }} onChange={(event) => setService(event.target.checked)} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}><b>Date</b></h6>
                    </Grid>
                    <Grid item xs={12} sm={10}>
                        <Stack direction="row" spacing={2}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DesktopDatePicker
                                    // disabled={Insurance === false}
                                    label="Start"
                                    value={EffectiveStart}
                                    // minDate={new Date('2017-01-01')}
                                    onChange={(newValue) => {
                                        setEffectiveStart(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} style={{ width: 200 }} size="small" />}
                                />
                            </LocalizationProvider>

                            <h6 style={{ textAlign: 'center', paddingTop: 16 }}> to </h6>

                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DesktopDatePicker
                                    // disabled={Insurance === false}
                                    label="End"
                                    value={EffectiveEnd}
                                    // minDate={new Date('2017-01-01')}
                                    onChange={(newValue) => {
                                        setEffectiveEnd(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} style={{ width: 200 }} size="small" />}
                                />
                            </LocalizationProvider>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                        {maproject.maproject === '' ?
                            <h6 style={{ textAlign: 'right', paddingTop: 5 }}><b>Upload File</b></h6>
                            : ""}
                    </Grid>
                    <Grid item xs={12} sm={10}>
                        {maproject.maproject === '' ?
                            <>
                                <label htmlFor="contained-button-file">
                                    <Input id="contained-button-file" type="file" onChange={FileMA}/>
                                    <Button style={{textTransform: 'none'}} variant="outlined" component="span">
                                        Upload File
                                    </Button>
                                </label>
                            </>

                            : ""}
                    </Grid>
                    {/* <input id="my-input"  type="file" onChange={FileMA} /> */}
                </Grid>

                <Box textAlign='right' style={{ paddingTop: 20 }}>
                    {maproject.maproject === '' ?
                        <Button style={{textTransform: 'none'}} variant='contained' onClick={handleCheckInsert}>
                            Save
                        </Button>
                        :
                        <Button style={{textTransform: 'none'}} variant='contained' onClick={handleCheckUpdate}>
                            Update
                        </Button>
                    }
                </Box>

                {toast.open &&
                    <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={toast.open} autoHideDuration={5000} onClose={() => setToast({ msg: "", open: false, type: "" })}>
                        <Alert elevation={6} variant="filled" onClose={() => setToast({ msg: "", open: false, type: "" })} severity={toast.type}>
                            {toast.msg}
                        </Alert>
                    </Snackbar>
                }
            </Container>

        </div>
    )
}
export default FromMA;