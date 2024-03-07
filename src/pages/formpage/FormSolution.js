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

const FormSolution = (statusid) => {
    const classes = useStyles();
    const queryParams = new URLSearchParams(window.location.search);
    const [UserID, setUserID] = useState(localStorage.getItem('userID'));
    const ServiceID = queryParams.get('ServiceID')
    const [cause, setCause] = useState("");
    const [solution, setSolution] = useState("");
    const [effort, setEffort] = useState("");
    const [err, setError] = useState(false);
    // const [showPassword, setShowPassword] = useState(false);

    // useEffect(() => {
    //     console.log(effort)
    // },[effort])

    async function SaveCause() {
        const formData = new FormData();
        formData.append('CauseName', cause)
        formData.append('HowToFix', solution)
        formData.append('Effort', effort)
        formData.append('CreateBy', UserID)
        formData.append('Service_ID', ServiceID)

        if (cause !== null && solution !== null) {
            await axios({
                method: 'post',
                url: DetailAPI.API_URL + '/HowToFix',
                data: formData
            })
            //   UpdateStatusSO(StatusID + 1)
        }
        // else if (cause !== null && fix !== null && docid !== null) {
        //   UpdateStatusSO(StatusID + 1)
        // }
    }

    function UpdateStatusSO(val) {
        if (cause === "" && solution === "") {
            swal.fire({
                customClass: {
                    container: classes.root //Alert หน้าสุด
                },
                title: 'Please specify Cause and Solution.',
                icon: 'warning',
            })
        }
        if (effort === "") {
            setError(true)
            swal.fire({
                customClass: {
                    container: classes.root //Alert หน้าสุด
                },
                title: 'Please specify Effort.',
                icon: 'warning',
            })
        }
        else {
            setError(false)
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
            }).then((result) => {
                if (result.isConfirmed) {
                    // SaveCause()
                    axios({
                        method: 'put',
                        url: DetailAPI.API_URL + '/UpdateStatusSO=' + ServiceID,
                        data: {
                            ID: ServiceID,
                            Status_Id: val,
                            UpdateBy: UserID,
                            UpdateDate: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
                        }
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
                            SaveCause()
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
            });
        }
    }
    return (
        <div>
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <h6 style={{ paddingTop: 9 }}>Cause</h6>
                    </Grid>
                    <Grid item xs={10}>
                        <TextField
                            autoFocus
                            autoComplete='off'
                            id="outlined-basic"
                            // label="Cause"
                            size="small"
                            fullWidth
                            onChange={(e) => setCause(e.target.value)}
                            sx={{ "& legend": { display: "none" } }}
                            InputProps={{
                            }}
                            // placeholder="Search customer"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <h6>Solution</h6>
                    </Grid>
                    <Grid item xs={10}>
                        <TextField
                            // defaultValue={values.desc}
                            // label="Text"
                            id="outlined-multiline-static"
                            size="small"
                            multiline
                            rows={5}
                            style={{ width: '100%' }}
                            sx={{ "& legend": { display: "none" } }}
                            variant="outlined"
                            // error={HowToFix !== null ? null : err}
                            onChange={(e) => setSolution(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <h6>Effort</h6>
                    </Grid>
                    <Grid item xs={10}>
                        <TextField
                            error={effort !== "" ? "": err}
                            autoComplete='off'
                            // inputFormat="HH.mm"
                            type="text"
                            size="small"
                            style={{ width: 120 }}
                            sx={{ "& legend": { display: "none" }}}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">hours</InputAdornment>,
                            }}
                            inputProps={{
                                maxLength: 4
                              }}
                            onChange={(e) => setEffort(e.target.value)}
                        />
                        <h8 style={{color:"#3120E0",padding:10}}>**Example 1 or 1.30**</h8>
                    </Grid>

                </Grid>
                <Box textAlign='right' style={{ paddingTop: 35 }}>
                    <Button style={{ textTransform: 'none' }} variant='contained' onClick={() => UpdateStatusSO(statusid.statusid + 1)}>
                        Save
                    </Button>
                </Box>
            </Container >
        </div >
    )
}
export default FormSolution;