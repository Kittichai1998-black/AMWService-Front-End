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
import swal from 'sweetalert2';
import { AuthenAPI, ViewAPI, DetailAPI } from '../../intercepetors/axios'
import axios from 'axios';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    root: {
        zIndex: 100000
    }
});

const FormReason = (service) => {
    const classes = useStyles();
    const queryParams = new URLSearchParams(window.location.search);
    const [UserID, setUserID] = useState(localStorage.getItem('userID'));
    // const ServiceID = queryParams.get('ServiceID')
    const [reason, setReason] = useState("");
    const [err, setError] = useState(false);
    const [helper, setHelper] = useState("");
    const [focusfield, setFocusfield] = useState(false);

    // useEffect(() => {
    //     console.log(service)
    // }, [service])

    // function UpdateStatusSO() {
    //     axios({
    //         method: 'put',
    //         url: DetailAPI.API_URL + '/UpdateStatusSO=' + service.service.ID,
    //         data: {
    //             ID: service.service.ID,
    //             Status_Id: service.status,
    //             UpdateBy: UserID,
    //             UpdateDate: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    //         }
    //     })
    // }

    function AddReason() {
        if (reason === "") {
            setError(true);
            setHelper("Please fill out the information before saving.")
        }
        else {
            swal.fire({
                customClass: {
                    container: classes.root //Alert หน้าสุด
                },
                title: 'Are you sure?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK'
            }).then((res) => {
                if (res.isConfirmed) {
                    // SaveCause()
                    axios({
                        method: 'put',
                        url: DetailAPI.API_URL + '/UpdateStatusSO=' + service.service.ID,
                        data: {
                            ID: service.service.ID,
                            Status_Id: service.status,
                            Reason: reason,
                            UpdateBy: UserID,
                            UpdateDate: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
                        }
                    
                    // axios({
                    //     method: 'patch',
                    //     url: ViewAPI.API_URL + '/ServiceID=' + service.service.ID,
                    //     data: [
                    //         {
                    //             "op": "add",
                    //             "path": "/Reason",
                    //             "value": reason
                    //         }
                    //     ] //Operations C# method Patch
                    }).then(res => {
                        if (res.data !== undefined) {
                            swal.fire({
                                customClass: {
                                    container: classes.root //Alert หน้าสุด
                                },
                                position: 'top-center',
                                icon: 'success',
                                title: 'Update Success',
                                showConfirmButton: false,
                                timer: 1000
                            })
                            // UpdateStatusSO()
                            setTimeout(() => {
                                window.location.reload(false);
                            }, 1000)
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
    }

    return (
        <div>
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            autoFocus
                            id="outlined-basic"
                            // label="Cause"
                            size="small"
                            fullWidth

                            sx={{ "& legend": { display: "none" } }}
                            error={reason !== "" ? "" : err}
                            helperText={helper}
                            onChange={(e) => setReason(e.target.value)}
                            InputProps={{
                            }}
                            variant="outlined"
                        />
                    </Grid>
                </Grid>
                <Box textAlign='right' style={{ paddingTop: 35 }}>
                    <Button style={{ textTransform: 'none' }} variant='contained' onClick={() => AddReason()}>
                        Save
                    </Button>
                </Box>
            </Container >
        </div >
    )
}
export default FormReason;