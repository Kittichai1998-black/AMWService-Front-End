import React, { useState, useEffect } from 'react'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material';
import Iconify from '../../Components/Iconify'
import InputAdornment from '@mui/material/InputAdornment';
import Swal from 'sweetalert2';
import { AuthenAPI } from '../../intercepetors/axios'
import axios from 'axios';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    root: {
        zIndex: 100000
    }
});

const FormChangePassword = (data) => {
    const classes = useStyles();
    const [Password, setNewPassword] = useState("");
    const [Confirm, setConfirmPassword] = useState("");
    const [err, setError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleCheck = () => {
        if (Password !== Confirm || Confirm !== Password) {
            Swal.fire({
                customClass: { container: classes.root },
                title: "Password Don't Match!"
            })
                .then((res) => {
                    setError(true)
                })
        } else {
            UpdatePassword()
        }
    }

async function UpdatePassword() {
    console.log(data)
    Swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'YES',
        customClass: {
            container: classes.root
        }
    }).then((result) => {
        if (result.isConfirmed) {
            axios({
                method: 'post',
                url: AuthenAPI.API_URL + '/ResetPassword',
                data: {
                    UserName: data.userid.UserName,
                    Password: Password,
                    ConfirmPassword: Confirm
                }
            }).then((res => {
                if (res.data.status === "Success") {
                    Swal.fire({
                        customClass: {
                            container: classes.root
                        }, title: res.data.message, icon: 'success'
                    })
                    setTimeout(() => {
                        Logout()
                        refreshPage()
                    }, 1500)
                }
            })).catch(function (error) {
                Swal.fire({
                    customClass: {
                        container: classes.root
                    }, title: 'Fail', icon: 'error'
                })
            });
        }
    })
}

const Logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = "/";
    // setAnchorEl(null);
};

function refreshPage() {
    window.location.reload(false);
}

return (
    <div>
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <h6 style={{ paddingTop: 9 }}>New Password</h6>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        id="outlined-basic"
                        className="fieldset"
                        variant="outlined"
                        size="small"
                        type={showPassword ? 'text' : 'password'}
                        sx={{ "& legend": { display: "none" } }}
                        onChange={(event) => setNewPassword(event.target.value)}
                        error={Password !== Confirm ? err : ''}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <h6 style={{ paddingTop: 9 }}>Confirm Password</h6>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        id="outlined-basic"
                        className="fieldset"
                        variant="outlined"
                        size="small"
                        type={showPassword ? 'text' : 'password'}
                        sx={{ "& legend": { display: "none" } }}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        error={Confirm !== Password ? err : ''}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
            </Grid>
            <Box textAlign='right' style={{ paddingTop: 35 }}>
                <Button style={{ textTransform: 'none' }} variant='contained' onClick={handleCheck}>
                    Save
                </Button>
            </Box>
        </Container >
    </div >
)
}
export default FormChangePassword;