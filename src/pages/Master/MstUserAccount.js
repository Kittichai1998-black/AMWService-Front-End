import React, { useState, useEffect, Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import moment from 'moment';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { useParams } from "react-router-dom";
import Autocomplete from '@mui/material/Autocomplete';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min';
import paginationFactory from 'react-bootstrap-table2-paginator';
import axios from 'axios';
import { AuthenAPI, DetailAPI, ViewAPI, MasterAPI } from '../../intercepetors/axios';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Button from 'react-bootstrap/Button'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import CloseIcon from '@mui/icons-material/CloseOutlined';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Box from "@mui/material/Box";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import LockResetIcon from '@mui/icons-material/LockReset';
import swal from 'sweetalert2';
import Chip from '@mui/material/Chip';
import FormRegister from '../formpage/FormRegister';
import FormChangePassword from '../formpage/FormChangePassword';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    root: {
        zIndex: -99999
    },
    table: {
        textOverflow: "ellipsis"
    },
    ellipsis: {
        maxWidth: 200, // percentage also works
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    },

});

const { SearchBar, ClearSearchButton } = Search;
const { ExportCSVButton } = CSVExport;

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

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

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

const MstUserAccount = () => {
    const classes = useStyles();
    const { ServiceID } = useParams();
    const [dataTable, setData] = useState([]);
    const [Rowdata, setRowData] = useState(0);
    const [open, setOpen] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [Permission, setPermission] = useState([])
    const [UserName, setUserName] = useState(null);
    const [FirsName, setFirsName] = useState(null);
    const [LastName, setLastName] = useState(null);
    const [Email, setEmail] = useState(null);
    const [Phone, setPhone] = useState(null);
    const [Department, setDepartment] = useState([]);
    const [ValueDepartment, setValueDepartment] = useState(null);
    const [UserID, setUserID] = useState(localStorage.getItem('userID'));
    const [RoleID, setRoleID] = useState(localStorage.getItem('roleID'));
    const [header, setHeader] = useState("")

    const [expanded, setExpanded] = useState('search');
    useEffect(() => {
        CheckPermission()
        GetUser()
        GetDepartment()
    }, [])

    useEffect(() => {
        const redata = Rowdata
        return redata
    }, [Rowdata])

    function GetDepartment() {
        axios({
            method: 'get',
            url: ViewAPI.API_URL + '/GetDepartment',
            // responseType: 'stream'
        }).then(res => {
            setDepartment(res.data)
        })
    }

    const handleClickAdd = (event) => {
        // debugger
        setHeader("Add")
        setRowData(event.target.id)
        setOpen(true);
        // console.log(event)
    };

    const handleClickEdit = (event) => {
        // debugger
        setHeader("Edit")
        setRowData(event)
        setOpen(true);
        // console.log(event)
    };

    const handleClickResetPassword = (event) => {
        setHeader("Change Password")
        setRowData(event)
        setOpen(true);
    };

    const handleClose = () => {
        if (Backdrop === true) {
            setOpenBackdrop(false)
        }
        setOpen(false);
    };

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    function CheckPermission() {
        axios.get(AuthenAPI.API_URL + '/CheckPermission', { params: { Role_ID: RoleID } }
        ).then(res => {
            setPermission(res.data)
        })
    }

    async function UpdateStatus(row, valID) {
        swal.fire({
            title: 'Are you sure?',
            // text: "เมื่อทำการอัพเดทแล้วจะไม่สามารถแก้ไขได้",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                const formData = new FormData();
                formData.append('ID', row.Id)
                formData.append('Status', valID)
                axios({
                    method: 'put',
                    url: AuthenAPI.API_URL + '/EditUser',
                    data: formData
                }).then((res => {
                    if (res.data !== undefined) {
                        swal.fire({
                            position: 'top-center',
                            icon: 'success',
                            title: 'Update Success',
                            showConfirmButton: false,
                            timer: 2000
                        })
                        GetUser()
                    }
                    else {
                        swal.fire("Failed", res.status, "error");
                    }
                }))
            }
        })
    }

    async function GetUser() {
        setOpenBackdrop(!open);
        await axios.get(MasterAPI.API_URL + '/GetUser'
            , {
                params: {
                    UserName: UserName,
                    FirsName: FirsName,
                    LastName: LastName,
                    PhoneNumber: Phone,
                    Email: Email,
                    DepartmentID: ValueDepartment
                }
            }
        ).then(res => {
            setData(res.data)
            setOpenBackdrop(false)
        })
    }

    const Actions = (cell, row, rowIndex, formatExtraData) => {
        return (
            <div>
                <div>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={0.5}
                        style={{ zoom: "90%" }}
                    >
                        {/* <Button variant="#757575" size="small"><InsertDriveFileOutlinedIcon  /></Button> */}
                        {RoleID === "1" ? <Button variant="info" size="small" onClick={() => { handleClickEdit(row) }}>Edit</Button>
                            : ""}
                        {RoleID === "1" ? <Button size="small" onClick={() => { handleClickResetPassword(row) }}><LockResetIcon /></Button>
                            : ""}
                        {RoleID === "1" && row.Status === 1 ? <Button variant="danger" size="small" onClick={() => { UpdateStatus(row, 2) }}>Remove</Button>
                            : ""}
                    </Stack>
                </div >
            </div >
        );
    };

    const getStatus = (cell, row) => {
        if (row.Status === "1" || row.Status === 1) {
            return <center><Chip label="Active" color="success" style={{ width: "75%", padding: 8, fontSize: 16, fontWeight: 'bold' }} /></center>
        } else if (row.Status === "2" || row.Status === 2) {
            return <center><Chip label="Remove" style={{ width: "75%", padding: 8, fontSize: 16, fontWeight: 'bold' }} /></center>
        }
        else {
            return null;
        }
    }

    function textoverflow(cell, row) {
        return (
            <div className={classes.ellipsis}>
                <spen>{cell}</spen>
            </div>
        )
    }

    const columns = [
        {
            dataField: 'Status',
            text: 'Status',
            formatter: getStatus,
            headerStyle: { width: 180,backgroundColor:'#748DA6'},
            headerAlign: 'center',
            align: 'center'
        },
        // {
        //     dataField: 'Customer',
        //     text: 'Custommer',
        //     headerAlign: 'center',

        // },
        {
            dataField: 'UserName',
            text: 'UserName',
            formatter: textoverflow,
            headerAlign: 'center',
            headerStyle: {backgroundColor:'#748DA6'},
            align: 'center'
        },
        {
            dataField: 'FirsName',
            text: 'FirsName',
            formatter: textoverflow,
            headerAlign: 'center',
            headerStyle: {backgroundColor:'#748DA6'},
            align: 'center'
        },
        {
            dataField: 'LastName',
            text: 'LastName',
            formatter: textoverflow,
            headerAlign: 'center',
            headerStyle: {backgroundColor:'#748DA6'},
            align: 'center'
        },
        {
            dataField: 'PhoneNumber',
            text: 'PhoneNumber',
            formatter: textoverflow,
            headerAlign: 'center',
            headerStyle: {backgroundColor:'#748DA6'},
            align: 'center'
        },
        {
            dataField: 'Email',
            text: 'Email',
            formatter: textoverflow,
            headerAlign: 'center',
            headerStyle: {backgroundColor:'#748DA6'},
            align: 'center'
        },
        {
            dataField: '',
            text: '',
            formatter: Actions,
            headerStyle: { width: 200, backgroundColor:'#748DA6' },
            align: 'center'
        },

    ];

    const selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        bgColor: (row, rowIndex) => (rowIndex > 1 ? '#85F4AA' : '#B5FE83')
    };

    const customTotal = (from, to, size) => (
        <span className="react-bootstrap-table-pagination-total">
            Showing {from} to {to} of {size} Results
        </span>
    );

    const sizePerPageRenderer = ({
        options,
        currSizePerPage,
        onSizePerPageChange
      }) => (
        <div className="btn-group" role="group">
          {
            options.map((option) => {
              const isSelect = currSizePerPage === `${option.page}`;
              return (
                <button
                  key={ option.text }
                  type="button"
                  onClick={ () => onSizePerPageChange(option.page) }
                  className={ `btn ${isSelect ? 'btn-primary' : 'btn-secondary'}` }
                >
                  { option.text }
                </button>
              );
            })
          }
        </div>
      );
    
      const options = {
        sizePerPageRenderer
      };
    // const options = {
    //     paginationSize: 4,
    //     pageStartIndex: 1,
    //     // alwaysShowAllBtns: true, // Always show next and previous button
    //     // withFirstAndLast: false, // Hide the going to First and Last page button
    //     // hideSizePerPage: true, // Hide the sizePerPage dropdown always
    //     // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
    //     firstPageText: 'First',
    //     prePageText: 'Back',
    //     nextPageText: 'Next',
    //     lastPageText: 'Last',
    //     nextPageTitle: 'First page',
    //     prePageTitle: 'Pre page',
    //     firstPageTitle: 'Next page',
    //     lastPageTitle: 'Last page',
    //     // showTotal: true,
    //     // paginationTotalRenderer: customTotal,
    //     disablePageTitle: true,
    //     sizePerPageList: [
    //         {
    //             text: '10', value: 10
    //         }, 
    //         {
    //             text: '25', value: 25
    //         }, 
    //         {
    //             text: '50', value: 50
    //         }, 
    //         // {
    //         //     text: 'All', value: dataTable.length
    //         // }
    //     ] // A numeric array is also available. the purpose of above example is custom the text
    // };

    const MyExportCSV = (props) => {
        const handleClick = () => {
            props.onExport();
        };
        return (
            <Box textAlign='right'>
                <Button variant="success" onClick={handleClick}>Export to CSV</Button>
            </Box>
        );
    };

    return (
        <>
            <div style={{ width: "100%" }}>
                <Accordion
                    // expanded={expanded === 'search'}
                    // onChange={handleChange('search')}
                    >
                    <AccordionSummary
                        // sx={{
                        //     backgroundColor: "#eeeeee"
                        // }}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography style={{ fontWeight: 600 }}>Search</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div>
                            <Box sx={{ width: '100%' }}>
                                <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                    <Grid item xs="auto">
                                        <Stack direction="row" spacing={2}>
                                            <h6 style={{ paddingTop: 9 }}>UserName</h6>
                                            <TextField
                                                id="outlined-basic"
                                                // label="Name"
                                                variant="outlined"
                                                size="small"
                                                sx={{ "& legend": { display: "none" } }}
                                                onChange={(event) => UserName(event.target.value)} />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs="auto">
                                    <Stack direction="row" spacing={2}>
                                        <h6 style={{ paddingTop: 9 }}>FirsName</h6>
                                            <TextField
                                                id="outlined-basic"
                                                // label="NameEng"
                                                variant="outlined"
                                                size="small"
                                                sx={{ "& legend": { display: "none" } }}
                                                onChange={(event) => setFirsName(event.target.value)} />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs="auto">
                                    <Stack direction="row" spacing={2}>
                                        <h6 style={{ paddingTop: 9 }}>LastName</h6>
                                            <TextField
                                                id="outlined-basic"
                                                variant="outlined"
                                                style={{ width: 200 }}
                                                size="small"
                                                sx={{ "& legend": { display: "none" } }}
                                                onChange={(event) => setLastName(event.target.value)} />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs="auto">
                                    <Stack direction="row" spacing={2}>
                                        <h6 style={{ paddingTop: 9 }}>Email</h6>
                                            <TextField
                                                id="outlined-basic"
                                                // label="Email"
                                                variant="outlined"
                                                size="small"
                                                style={{ width: 250 }}
                                                sx={{ "& legend": { display: "none" } }}
                                                onChange={(event) => setEmail(event.target.value)} />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs="auto">
                                    <Stack direction="row" spacing={2}>
                                        <h6 style={{ paddingTop: 9 }}>Phone</h6>
                                            <TextField
                                                id="outlined-basic"
                                                // label="Phone"
                                                variant="outlined"
                                                size="small"
                                                sx={{ "& legend": { display: "none" } }}
                                                onChange={(event) => setPhone(event.target.value)} />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs="auto">
                                    <Stack direction="row" spacing={2}>
                                        <h6 style={{ paddingTop: 9 }}>Departmant</h6>
                                            <Select
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                value={ValueDepartment}
                                                onChange={(event) => setValueDepartment(event.target.value)}
                                                style={{ width: 200 }}
                                                sx={{ "& legend": { display: "none" } }}
                                                size="small"
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {Department.map((items) => {
                                                    return (
                                                        <MenuItem value={items.department_Id}>{items.dP_Name}</MenuItem>
                                                    )
                                                })}
                                            </Select>
                                        </Stack>
                                    </Grid>
                                </Grid>
                                <Grid container justifyContent="right" style={{ paddingTop: 10 }}>
                                    <Grid item xs={12} sm={'auto'}>
                                        <Button variant="primary" size="small" onClick={() => { GetUser() }}>Search</Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </div>
                    </AccordionDetails>
                </Accordion>
                <Paper elevation={6} style={{ padding: 20, marginTop: 20 }}>
                    <ToolkitProvider
                        keyField="id"
                        data={dataTable}
                        columns={columns}
                        search
                        exportCSV
                    >
                        {
                            props => (
                                <div>
                                    <Stack justifyContent="flex-end" direction="row" spacing={2}>
                                        {/* {RoleID === "1" ? */}
                                        <div>
                                            <Button variant="primary" style={{ marginBottom: 10 }} onClick={handleClickAdd}>Add User</Button>
                                        </div>
                                        {/* : ""} */}
                                        <MyExportCSV {...props.csvProps} />
                                    </Stack>
                                    <hr />
                                    <div >
                                        <BootstrapTable
                                            striped
                                            hover
                                            keyField="id"
                                            data={dataTable}
                                            columns={columns}
                                            style={{ zoom: "85%" ,overflowX: "auto"}}
                                            pagination={
                                                paginationFactory(options)
                                            }
                                            {...props.baseProps}
                                            wrapperClasses="table"
                                        />
                                    </div >

                                </div>
                            )
                        }
                    </ToolkitProvider>
                    <BootstrapDialog
                        maxWidth="sm"
                        // style={{ zoom: "85%"}}
                        fullWidth={true}
                        onClose={handleClose}
                        aria-labelledby="customized-dialog-title"
                        open={open}
                    >
                        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                            {header}
                        </BootstrapDialogTitle>
                        <DialogContent dividers>
                            {header === "Change Password" ?
                                <FormChangePassword
                                    userid={Rowdata} />
                                :
                                <FormRegister
                                    userid={Rowdata}
                                />
                            }
                        </DialogContent>
                    </BootstrapDialog>
                </Paper>
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openBackdrop} onClick={handleClose}>
                    <CircularProgress color="inherit" />
                </Backdrop>

            </div>
        </>
    )
}

export default MstUserAccount;

