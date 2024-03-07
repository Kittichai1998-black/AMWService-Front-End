import React, { useState, useEffect } from 'react'
import { AuthenAPI, DetailAPI, ViewAPI, MasterAPI } from '../../intercepetors/axios'
import moment from 'moment';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
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

const FormMachineList = (machines) => {
    const classes = useStyles();
    const [Customer, setCustomer] = useState([]);
    const [MCid, setMCid] = useState(machines.machines.ID);
    const [ValueCustomer, setValueCustomer] = useState(machines.machines.MC_Customer_Id);
    const [MachineCode, setMachineCode] = useState(machines.machines.MC_Code);
    const [MachineName, setMachineName] = useState(machines.machines.MC_Name);
    const [MachineSize, setMachineSize] = useState(machines.machines.MC_Size);
    const [MachineCount, setMachineCount] = useState(machines.machines.MC_Count);
    const [UserID, setUserID] = useState(localStorage.getItem("userID"));
    const [open, setOpen] = useState(false);
    const [err, setError] = useState(false)
    const [toast, setToast] = useState({ msg: null, open: false, type: null });
    const Size = [{ id: 1, label: "S" }, { id: 2, label: "M" }, { id: 3, label: "L" }, { id: 4, label: "XL" }]

    useEffect(() => {
        GetCustommer()
    }, [MachineSize])

    function GetCustommer() {
        axios({
            method: 'get',
            url: ViewAPI.API_URL + '/GetCustommer',
            responseType: 'stream'
        }).then(res => {
            setCustomer(res.data)
        })
    }

    async function SaveMC() {
        const formData = new FormData();
        formData.append('MC_Customer_Id', ValueCustomer.id)
        formData.append('MC_Code', MachineCode)
        formData.append('MC_Name', MachineName)
        formData.append('MC_Size', MachineSize)
        formData.append('MC_Count', MachineCount)
        formData.append('Status', 1)
        formData.append('CreateDate', moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'))
        formData.append('CreateBy', UserID)

        await axios({
            method: 'post',
            url: MasterAPI.API_URL + '/MachineList',
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

    async function UpdateMC() {
        const formData = new FormData();
        formData.append('ID', MCid)
        formData.append('MC_Customer_Id', ValueCustomer)
        formData.append('MC_Code', MachineCode)
        formData.append('MC_Name', MachineName)
        formData.append('MC_Size', MachineSize)
        formData.append('MC_Count', MachineCount)
        formData.append('UpdateBy', UserID)

        await axios({
            method: 'put',
            url: MasterAPI.API_URL + '/MachineListID=' + MCid,
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

                SaveMC() //บันทึกลง
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
                UpdateMC() //บันทึกลง
            }
        })
    }

    const handleCheckInsert = () => { //บังคับกรอกข้อความ
        if (ValueCustomer === null || ValueCustomer === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (MachineCode === null || MachineCode === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (MachineName === null || MachineName === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (MachineSize === null || MachineSize === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (MachineCount === null || MachineCount === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        // if (Detail === null || Detail === undefined) { setError(true) }
        else {
            Confirm();
        }
    }

    const handleCheckUpdate = () => { //บังคับกรอกข้อความ
        if (ValueCustomer === null || ValueCustomer === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (MachineCode === null || MachineCode === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (MachineName === null || MachineName === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (MachineSize === null || MachineSize === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (MachineCount === null || MachineCount === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        // if (Detail === null || Detail === undefined) { setError(true) }
        else {
            Update();
        }
    }

    function refreshPage() {
        window.location.reload(false);
    }
    return (
        <div>
            <Container>
                {/* <Typography variant="h6" gutterBottom>
                    M
                </Typography> */}
                <Grid container spacing={3}>
                    {/* <Grid item xs={12} sm={3}>
                        {machines.machines !== '' ?
                            <h6 style={{ textAlign: 'right', paddingTop: 5 }}>MachinesID :</h6> : ''
                        }
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        {machines.machines !== '' ?
                            <TextField
                                // label="Code"
                                value={machines.machines.id}
                                disabled
                                id="standard-basic"
                                fullWidth
                                variant="standard"
                                InputProps={{
                                    disableUnderline: true,
                                }}
                            // onChange={(event) => setOPid(operatorid)}
                            // error={OPName !== null ? null : err}
                            />
                            : ''
                        }
                    </Grid> */}
                    <Grid item xs={12} sm={3}>
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}>Customer</h6>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        {machines.machines === '' ?
                            <Autocomplete
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
                                getOptionLabel={(option) => option.customer || machines.machines.Customer}
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
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}>Machine Code</h6>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        {machines.machines === '' ?
                            <TextField
                                // label="Code"
                                id="standard-basic"
                                fullWidth
                                variant="standard"
                                onChange={(event) => setMachineCode(event.target.value)}
                                error={MachineCode !== undefined ? undefined : err}
                            />
                            : <TextField defaultValue={MachineCode} id="standard-basic" fullWidth variant="standard"
                                onChange={(event) => setMachineCode(event.target.value)}
                                error={MachineCode !== undefined ? undefined : err}
                            />}
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}>Machine Name</h6>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        {machines.machines === '' ?
                            <TextField
                                id="standard-basic"
                                fullWidth
                                variant="standard"
                                onChange={(event) => setMachineName(event.target.value)}
                                error={MachineName !== undefined ? undefined : err}
                            />
                            :
                            <TextField defaultValue={MachineName} id="standard-basic" fullWidth variant="standard"
                                onChange={(event) => setMachineName(event.target.value)}
                                error={MachineName !== undefined ? undefined : err}
                            />
                        }
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}>Machine Size</h6>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        {machines.machines === '' ?
                            <Autocomplete
                                id="clear-on-escape"
                                clearOnEscape
                                options={Size}
                                getOptionLabel={(option) => option.label}
                                onChange={(event, val) => setMachineSize(val.label)}
                                style={{ width: "auto" }}
                                // fullWidth
                                renderInput={(params) =>
                                    <TextField {...params}
                                        variant="standard"
                                        error={MachineSize !== undefined ? undefined : err}
                                    />}
                            />
                            :
                            <Autocomplete
                                id="combo-box-demo"
                                options={Size}
                                getOptionLabel={(option) => option.label || machines.machines.MC_Size}
                                defaultValue={MachineSize}
                                onChange={(event, val) => setMachineSize(val.label)}
                                style={{ width: "auto" }}
                                // fullWidth
                                renderInput={(params) =>
                                    <TextField {...params}
                                        variant="standard"
                                        error={MachineSize !== undefined ? undefined : err}
                                    />}
                            />}
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}>Machine Count</h6>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        {machines.machines === '' ?
                            <TextField
                                id="standard-basic"
                                fullWidth
                                variant="standard"
                                onChange={(event) => setMachineCount(event.target.value)}
                                type="number"
                                error={MachineCount !== undefined ? undefined : err}
                            />
                            :
                            <TextField type="number" defaultValue={MachineCount} id="standard-basic" fullWidth variant="standard"
                                onChange={(event) => setMachineCount(event.target.value)}
                                error={MachineCount !== undefined ? undefined : err}
                            />
                        }
                    </Grid>
                </Grid>

                <Box textAlign='right' style={{ paddingTop: 35 }}>
                    {machines.machines === '' ?
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
export default FormMachineList;