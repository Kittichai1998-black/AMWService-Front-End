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
import { IconButton } from '@mui/material';
import Iconify from '../../Components/Iconify'
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import Swal from 'sweetalert2';
import axios from 'axios';

const useStyles = makeStyles({
    root: {
        zIndex: 10000
    },
});

const FormRegister = (userid) => {
    const classes = useStyles();
    const [UID, setUID] = useState(userid.userid.Id);
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [FirsName, setFirsName] = useState('' || userid.userid.FirsName);
    const [LastName, setLastName] = useState('' || userid.userid.LastName);
    const [Phone, setPhone] = useState('' || userid.userid.PhoneNumber);
    const [Email, setEmail] = useState('' || userid.userid.Email);
    const [Department ,setDepartment] = useState([]);
    const [RoleUser ,setRoleUser] = useState([]);
    const [ValueRole ,setValueRole] = useState(userid.userid.RoleID);
    const [ValueDepartment , setValueDepartment] = useState(userid.userid.DepartmentID);
    const [UserID, setUserID] = useState(localStorage.getItem("userID"));
    const [open, setOpen] = useState(false);
    const [err, setError] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    // const [toast, setToast] = useState({ msg: null, open: false, type: null });
    useEffect(() => {
        GetDepartment();
        GetRole()
        // console.log(userid)
    },[])

    async function SaveUser() {
        await axios({
            method: 'post',
            url: AuthenAPI.API_URL + '/Register',
            data: { 
                // UserID: 0,
                Username: Username,
                Password: Password,
                FirsName: FirsName,
                LastName: LastName,
                PhoneNumber: Phone,
                Email: Email,
                DepartmentID: ValueDepartment,
                UserRoleID: ValueRole,
                Status: 1
            }
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
        })
        .catch(function (error){
            Swal.fire({
                customClass: {
                    container: classes.root //Alert หน้าสุด
                }, title: 'Fail', icon: 'error'
            })
        });
    }

    async function UpdateUser() {
        const formData = new FormData();
        formData.append('ID', UID)
        // formData.append('Password', Password)
        formData.append('FirsName', FirsName)
        formData.append('LastName', LastName)
        formData.append('PhoneNumber', Phone)
        formData.append('Email', Email)
        formData.append('DepartmentID', ValueDepartment)
        formData.append('UserRoleID', ValueRole)

        await axios({
            method: 'put',
            url: AuthenAPI.API_URL + '/EditUser',
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
                }, 1500)
            }
           
        })
        .catch(function (error){
            Swal.fire({
                customClass: {
                    container: classes.root //Alert หน้าสุด
                }, title: 'Fail', icon: 'error'
            })
        });
    }

    function GetDepartment() {
        axios({
            method: 'get',
            url: ViewAPI.API_URL + '/GetDepartment',
            // responseType: 'stream'
        }).then(res => {
            setDepartment(res.data)
        })
    }

    function GetRole() {
        axios({
            method: 'get',
            url: ViewAPI.API_URL + '/GetRole',
            // responseType: 'stream'
        }).then(res => {
            setRoleUser(res.data)
        })
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
                SaveUser() //บันทึกลง
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
                UpdateUser() //บันทึกลง
            }
        })
    }

    const handleCheckInsert = () => { //บังคับกรอกข้อความ
        if (Username === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (FirsName === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (LastName === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (Phone === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (Email === undefined) { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        else {
            Confirm()
        }
    }

    const handleCheckUpdate = () => { //บังคับกรอกข้อความ
        if (Username === null || Username === '') { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (FirsName === null || FirsName === '') { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (LastName === null || LastName === '') { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (Phone === null || Phone === '') { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
        if (Email === null || Email === '') { Swal.fire({ customClass: { container: classes.root }, title: 'กรุณากรอกข้อมูลให้ครบถ้วน' }).then((res) => { setError(true) }) }
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
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}>UserName</h6>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        {userid.userid === '' ?
                            <TextField
                                // label="Code"
                                autoFocus={true}
                                id="standard-basic"
                                fullWidth
                                variant="standard"
                                onChange={(event) => setUsername(event.target.value)}
                                error={Username !== undefined ? undefined : err}
                            />
                            :  <TextField
                            disabled
                            defaultValue={userid.userid.UserName}
                            id="standard-basic"
                            fullWidth
                            variant="standard"
                            // onChange={(event) => setUsername(event.target.value)}
                            // error={Username !== undefined ? undefined : err}
                        />
                            }
                    </Grid>
                    {userid.userid === '' ?
                    <>
                    <Grid item xs={12} sm={3}>
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}>Password</h6>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        {userid.userid === '' ?
                            <TextField
                                // label="Code"
                                // autoFocus={true}
                                id="standard-basic"
                                fullWidth
                                variant="standard"
                                type={showPassword ? 'text' : 'password'}
                                onChange={(event) => setPassword(event.target.value)}
                                InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                          <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                                error={Password !== undefined ? undefined : err}
                            />
                            :  ''
                            }
                    </Grid>
                    </>
                    : ""}
                    <Grid item xs={12} sm={3}>
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}>FirsName</h6>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        {userid.userid === '' ?
                            <TextField
                                // label="Code"
                                id="standard-basic"
                                fullWidth
                                variant="standard"
                                onChange={(event) => setFirsName(event.target.value)}
                                error={FirsName !== undefined ? undefined : err}
                            />
                            : <TextField defaultValue={FirsName} id="standard-basic" fullWidth variant="standard"
                                onChange={(event) => setFirsName(event.target.value)}
                                error={FirsName !== undefined ? null : err}
                            />}
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}>LastName</h6>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        {userid.userid === '' ?
                            <TextField
                                id="standard-basic"
                                fullWidth
                                variant="standard"
                                onChange={(event) => setLastName(event.target.value)}
                                error={LastName !== undefined ? undefined : err}
                            />
                            : <TextField defaultValue={LastName} id="standard-basic" fullWidth variant="standard"
                                onChange={(event) => setLastName(event.target.value)}
                                error={LastName !== null ? null : err}
                            />}
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}>Email</h6>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        {userid.userid === '' ?
                            <TextField
                                // label="Code"
                                id="standard-basic"
                                fullWidth
                                variant="standard"
                                onChange={(event) => setEmail(event.target.value)}
                                error={Email !== undefined ? undefined : err}
                            />
                            : <TextField defaultValue={Email} id="standard-basic" fullWidth variant="standard"
                                onChange={(event) => setEmail(event.target.value)}
                                error={Email !== null ? null : err}
                            />}
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}>PhoneNumber</h6>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        {userid.userid === '' ?
                            <TextField
                                name="phone"
                                onChange={(event) => setPhone(event.target.value)}
                                // id="basic"
                                variant="standard"
                                size="small"
                                type="number"
                                fullWidth
                                // inputProps={{
                                //     maxLength: 10,
                                // }}
                                error={Phone !== null ? null : err}
                            />
                            :
                            <TextField
                                name="name"
                                defaultValue={Phone}
                                onChange={(event) => setPhone(event.target.value)}
                                // id="filled-basic"
                                variant="standard"
                                size="small"
                                type="number"
                                fullWidth
                                error={Phone !== null ? null : err}
                            />
                        }
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}>Department</h6>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        {userid.userid === '' ?
                            <Autocomplete
                                autoFocus={true}
                                id="clear-on-escape"
                                clearOnEscape
                                options={Department}
                                getOptionLabel={(option) => option.dP_Name}
                                onChange={(event, val) => setValueDepartment(val.department_Id)}
                                style={{ width: "auto" }}
                                // fullWidth
                                renderInput={(params) =>
                                    <TextField {...params}
                                        variant="standard"
                                        error={ValueDepartment !== undefined ? undefined : err}
                                    />}
                            />
                            : <Autocomplete
                                id="clear-on-escape"
                                clearOnEscape
                                options={Department}
                                getOptionLabel={(option) => option.dP_Name || userid.userid.DP_Name}
                                defaultValue={ValueDepartment}
                                onChange={(event, val) => setValueDepartment(val.department_Id)}
                                style={{ width: "auto" }}
                                renderInput={(params) =>
                                    <TextField {...params}
                                        variant="standard"
                                        error={ValueDepartment !== undefined ? undefined : err}
                                    />}

                            />}
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <h6 style={{ textAlign: 'right', paddingTop: 5 }}>Role</h6>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        {userid.userid === '' ?
                            <Autocomplete
                                autoFocus={true}
                                id="clear-on-escape"
                                clearOnEscape
                                options={RoleUser}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, val) => setValueRole(val.id)}
                                style={{ width: "auto" }}
                                // fullWidth
                                renderInput={(params) =>
                                    <TextField {...params}
                                        variant="standard"
                                        error={ValueDepartment !== undefined ? undefined : err}
                                    />}
                            />
                            : <Autocomplete
                                id="clear-on-escape"
                                clearOnEscape
                                options={RoleUser}
                                getOptionLabel={(option) => option.name || userid.userid.RoleName}
                                defaultValue={ValueDepartment}
                                onChange={(event, val) => setValueRole(val.id)}
                                style={{ width: "auto" }}
                                renderInput={(params) =>
                                    <TextField {...params}
                                        variant="standard"
                                        error={ValueDepartment !== undefined ? undefined : err}
                                    />}

                            />}
                    </Grid>
                </Grid>

                <Box textAlign='right' style={{ paddingTop: 35 }}>
                    {userid.userid === '' ?
                        <Button style={{ textTransform: 'none' }} variant='contained' onClick={handleCheckInsert}>
                            Save
                        </Button>
                        :
                        <Button style={{ textTransform: 'none' }} variant='contained' onClick={handleCheckUpdate}>
                            Update
                        </Button>
                    }
                </Box>

                {/* {toast.open &&
                    <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={toast.open} autoHideDuration={5000} onClose={() => setToast({ msg: "", open: false, type: "" })}>
                        <Alert elevation={6} variant="filled" onClose={() => setToast({ msg: "", open: false, type: "" })} severity={toast.type}>
                            {toast.msg}
                        </Alert>
                    </Snackbar>
                } */}
            </Container>

        </div >
    )
}
export default FormRegister;