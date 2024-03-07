import React, { useState, useEffect } from 'react'
import { AuthenAPI, DetailAPI, ViewAPI, MasterAPI } from '../../intercepetors/axios'
import moment from 'moment';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import AlertTitle from '@mui/material/AlertTitle';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import Swal from 'sweetalert2';
import axios from 'axios';

const useStyles = makeStyles({
    root: {
        zIndex: 10000
    },
});

const FormOperator = (operatorid) => {
    const classes = useStyles();
    const [Customer, setCustomer] = useState([]);
    const [ValueCustomer, setValueCustomer] = useState(operatorid.operatorid.OP_Customer_id);
    const [OPid, setOPid] = useState(operatorid.operatorid.ID);
    const [OPName, setOPName] = useState('' || operatorid.operatorid.OP_Name);
    const [OPNameEng, setOPNameEng] = useState('' || operatorid.operatorid.OP_Name_Eng);
    const [OPNickName, setOPNickName] = useState('' || operatorid.operatorid.OP_NickName);
    const [OPPhone, setOPPhone] = useState('' || operatorid.operatorid.OP_Phone);
    const [OPEmail, setOPEmail] = useState('' || operatorid.operatorid.OP_Email);
    const [OPLineId, setOPLineId] = useState('' || operatorid.operatorid.OP_Line_id);
    const [OPLinePic, setOPLinePic] = useState('');
    const [UserID, setUserID] = useState(localStorage.getItem("userID"));
    const [open, setOpen] = useState(false);
    const [err, setError] = useState(false)
    const [toast, setToast] = useState({ msg: null, open: false, type: null });

    useEffect(() => {
        GetCustommer()
        // console.log(operatorid)
        // console.log(ValueCustomer)
    }, [])

    function GetCustommer() {
        axios({
            method: 'get',
            url: ViewAPI.API_URL + '/GetCustommer',
            responseType: 'stream'
        }).then(res => {
            setCustomer(res.data)
        })
    }

    async function SaveOP() {
        const formData = new FormData();
        formData.append('OP_Customer_id', ValueCustomer.id)
        formData.append('OP_Name', OPName)
        formData.append('OP_Name_Eng', OPNameEng)
        formData.append('OP_NickName', OPNickName)
        formData.append('OP_Phone', OPPhone)
        formData.append('OP_Email', OPEmail)
        formData.append('OP_Phone', OPPhone)
        formData.append('OP_Line_id', OPLineId)
        formData.append('OP_Line_Pic', OPLinePic)
        formData.append('Status', 1)
        formData.append('CreateDate', moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'))
        formData.append('CreateBy', UserID)

        await axios({
            method: 'post',
            url: MasterAPI.API_URL + '/Operator',
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
                setTimeout(() => {
                    refreshPage()
                }, 1500)
            }
        }).catch(function (error){
            Swal.fire({
                customClass: {
                    container: classes.root //Alert หน้าสุด
                }, title: 'Fail', icon: 'error'
            })
        });
    }

    async function UpdateOP() {
        const formData = new FormData();
        formData.append('ID', OPid)
        formData.append('OP_Customer_id', ValueCustomer)
        formData.append('OP_Name', OPName)
        formData.append('OP_Name_Eng', OPNameEng)
        formData.append('OP_NickName', OPNickName)
        formData.append('OP_Email', OPEmail)
        formData.append('OP_Phone', OPPhone)
        formData.append('OP_Line_id', OPLineId)
        formData.append('UpdateBy', UserID)

        await axios({
            method: 'put',
            url: MasterAPI.API_URL + '/OperatorID=' + OPid,
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
                SaveOP() //บันทึกลง
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
                UpdateOP() //บันทึกลง
            }
        })
    }

    const handleCheckInsert = () => { //บังคับกรอกข้อความ
        // console.log(ValueCustomer)
        if (ValueCustomer === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (OPName === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (OPNameEng === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (OPNickName === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (OPPhone === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (OPEmail === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (OPLineId === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        // if (OPLinePic === null || OPLinePic === undefined) { setError(true) }
        // if (Detail === null || Detail === undefined) { setError(true) }
        else {
            Confirm()
        }
    }

    const handleCheckUpdate = () => { //บังคับกรอกข้อความ
        // console.log(ValueCustomer)
        if (ValueCustomer === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (OPName === null || OPName === '') { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (OPNameEng === null || OPNameEng === '') { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (OPNickName === null || OPNickName === '') { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (OPPhone === null || OPPhone === '') { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (OPEmail === null || OPEmail === '') { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (OPLineId === null || OPLineId === '') { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        // if (OPLinePic === null || OPLinePic === undefined) { setError(true) }
        // if (Detail === null || Detail === undefined) { setError(true) }
        else {
            Update()
        }
    }

    function refreshPage() {
        window.location.reload(false);
    }
    return (
        <div>
            <Container>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={3}>
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}>Customer</h6>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        {operatorid.operatorid === '' ?
                            <Autocomplete
                                autoFocus={true}
                                id="clear-on-escape"
                                clearOnEscape
                                options={Customer}
                                getOptionLabel={(option) => option.customer}
                                onChange={(event, val) => setValueCustomer(val)}
                                style={{ width: "auto" }}
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
                                getOptionLabel={(option) => option.customer || operatorid.operatorid.Customer}
                                defaultValue={ValueCustomer}
                                onChange={(event, val) => setValueCustomer(val.id)}
                                style={{ width: "auto" }}
                                renderInput={(params) =>
                                    <TextField {...params}
                                        variant="standard"
                                        error={ValueCustomer !== undefined ? undefined : err}
                                    />}

                            />}
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}>Name(TH)</h6>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        {operatorid.operatorid === '' ?
                            <TextField
                                // label="Code"
                                id="standard-basic"
                                fullWidth
                                variant="standard"
                                onChange={(event) => setOPName(event.target.value)}
                                error={OPName !== undefined ? undefined : err}
                            />
                            : <TextField defaultValue={OPName} id="standard-basic" fullWidth variant="standard"
                                onChange={(event) => setOPName(event.target.value)}
                                error={OPName !== undefined ? null : err}
                            />}
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}>Name(Eng)</h6>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        {operatorid.operatorid === '' ?
                            <TextField
                                id="standard-basic"
                                fullWidth
                                variant="standard"
                                onChange={(event) => setOPNameEng(event.target.value)}
                                error={OPNameEng !== undefined ? undefined : err}
                            />
                            : <TextField defaultValue={OPNameEng} id="standard-basic" fullWidth variant="standard"
                                onChange={(event) => setOPNameEng(event.target.value)}
                                error={OPNameEng !== null ? null : err}
                            />}
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}>NickName</h6>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        {operatorid.operatorid === '' ?
                            <TextField
                                // label="Code"
                                id="standard-basic"
                                fullWidth
                                variant="standard"
                                onChange={(event) => setOPNickName(event.target.value)}
                                error={OPNickName !== undefined ? undefined : err}
                            />
                            : <TextField defaultValue={OPNickName} id="standard-basic" fullWidth variant="standard"
                                onChange={(event) => setOPNickName(event.target.value)}
                                error={OPNickName !== null ? null : err}
                            />}
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}>PhoneNumber</h6>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        {operatorid.operatorid === '' ?
                            <TextField
                                // autoFocus={true}
                                name="name"
                                // defaultValue={operatorid.operatorid.oP_Phone}
                                onChange={(event) => setOPPhone(event.target.value)}
                                // placeholder="placeholder"
                                id="filled-basic"
                                variant="filled"
                                size="small"
                                type="number"
                                fullWidth
                                inputProps={{
                                    maxLength: 10,
                                }}
                                error={OPPhone !== null ? null : err}
                            />
                            :
                            <TextField
                                // autoFocus={true}
                                name="name"
                                defaultValue={OPPhone}
                                onChange={(event) => setOPPhone(event.target.value)}
                                // placeholder="placeholder"
                                id="filled-basic"
                                variant="filled"
                                size="small"
                                type="number"
                                fullWidth
                                inputProps={{
                                    maxLength: 10,
                                }}
                                error={OPPhone !== null ? null : err}
                            />
                        }
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}>Email</h6>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        {operatorid.operatorid === '' ?
                            <TextField
                                id="standard-basic"
                                fullWidth
                                variant="standard"
                                onChange={(event) => setOPEmail(event.target.value)}
                                error={OPEmail !== undefined ? undefined : err}
                            />
                            : <TextField defaultValue={OPEmail} id="standard-basic" fullWidth variant="standard"
                                onChange={(event) => setOPEmail(event.target.value)}
                                error={OPEmail !== null ? null : err}
                            />}
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}>Line ID</h6>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        {operatorid.operatorid === '' ?
                            <TextField
                                id="standard-basic"
                                fullWidth
                                variant="standard"
                                onChange={(event) => setOPLineId(event.target.value)}
                                error={OPLineId !== undefined ? undefined : err}
                            />
                            : <TextField defaultValue={OPLineId} id="standard-basic" fullWidth variant="standard"
                                onChange={(event) => setOPLineId(event.target.value)}
                                error={OPLineId !== null ? null : err}
                            />}
                    </Grid>
                </Grid>

                <Box textAlign='right' style={{ paddingTop: 35 }}>
                    {operatorid.operatorid === '' ?
                        <Button style={{ textTransform: 'none' }} variant='contained' onClick={handleCheckInsert}>
                            Save
                        </Button>
                        :
                        <Button style={{ textTransform: 'none' }} variant='contained' onClick={handleCheckUpdate}>
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

        </div >
    )
}
export default FormOperator;