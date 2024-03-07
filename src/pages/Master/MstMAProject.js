import React, { useState, useEffect, Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import moment from 'moment';
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import { useParams } from "react-router-dom";
import Container from '@mui/material/Container';
import PropTypes from 'prop-types';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min';
import paginationFactory from 'react-bootstrap-table2-paginator';
import axios from 'axios';
import { AuthenAPI, DetailAPI, ViewAPI, MasterAPI } from '../../intercepetors/axios'
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from 'react-bootstrap/Button'
import FormControl from '@mui/material/FormControl';
import CloseIcon from '@mui/icons-material/CloseOutlined';
import CheckIcon from '@mui/icons-material/CheckOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import Dialog from '@mui/material/Dialog';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import ClearIcon from '@mui/icons-material/Clear';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";
import Link from '@mui/material/Link';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import swal from 'sweetalert2';
import Chip from '@mui/material/Chip';
import FormMA from '../formpage/FormMA'
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
    }

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
                <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
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

const MstMAProject = () => {
    const classes = useStyles();
    const { ServiceID } = useParams();
    const [dataTable, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [Permission, setPermission] = useState([])
    const [Rowdata, setRowData] = useState(0);
    const [Status, setStatus] = useState([]);
    const [ValStatus, setValStatus] = useState(null);
    const [Custommers, setCustommer] = useState([]);
    const [ValCustomers, setValCustomers] = useState(null);
    const [Code, setCode] = useState(null);
    const [Name, setName] = useState(null);
    const [Startdate, setStatedate] = useState(null);
    const [Enddate, setEnddate] = useState(null);
    const [UserID, setUserID] = useState(localStorage.getItem('userID'));
    const [RoleID, setRoleID] = useState(localStorage.getItem('roleID'));
    const [page, setPage] = useState(2);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [header, setHeader] = useState("")

    const [expanded, setExpanded] = useState('search');

    useEffect(() => {
        // GetMA()
        GetMAProject()
        GetCustommer()
    }, []);

    useEffect(() => {
        const redata = Rowdata
        return redata
    }, [Rowdata])

    // async function GetMA() {
    //     setOpenBackdrop(!open);
    //     axios({
    //         method: 'get',
    //         url: MasterAPI.API_URL + '/GetMA',
    //         responseType: 'stream'
    //     })
    //         .then(response => {
    //             setData(response.data);
    //             setOpenBackdrop(false);
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // }

    async function GetMAProject() {
        setOpenBackdrop(!open);
        await axios.get(MasterAPI.API_URL + '/GetMAProject'
            , {
                params: {
                    // StatusID: ValStatus,
                    CustomerID: ValCustomers,
                    Code: Code,
                    Name: Name,
                    Startdate: Startdate,
                    Enddate: Enddate
                }
            }
        ).then(res => {
            setData(res.data)
            setOpenBackdrop(false)
        })
    }

    function GetCustommer() {
        axios({
            method: 'get',
            url: ViewAPI.API_URL + '/GetCustommer',
            responseType: 'stream'
        }).then(res => {
            setCustommer(res.data)
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

    const handleClose = () => {
        if (Backdrop === true) {
            setOpenBackdrop(false)
        }
        setOpen(false);
    };

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    async function UpdateStatus(row, valID) {
        swal.fire({
            title: 'Are you sure?',
            // text: "เมื่อทำการอัพเดทแล้วจะไม่สามารถย้อนกลับได้",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                const formData = new FormData();
                formData.append('ID', row.id)
                formData.append('Status', valID)
                // formData.append('UpdateDate', moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'))
                formData.append('UpdateBy', UserID)
                axios({
                    method: 'put',
                    url: MasterAPI.API_URL + '/MAProjectID=' + row.id,
                    data: formData
                }).then((res => {
                    if (res.data !== undefined) {
                        swal.fire({
                            position: 'top-center',
                            icon: 'success',
                            title: 'Remove Success',
                            showConfirmButton: false,
                            timer: 2000
                        })
                        GetMAProject();
                    }
                    else {
                        swal.fire("Failed", res.status, "error");
                    }
                }))
            }
        })
    }

    const Document = (cell, row, rowIndex, formatExtraData) => {
        return (
            <>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="center">
                    <Link style={{ cursor: 'pointer' }} onClick={() => window.open(row.fileSrc)}>Download</Link>
                    {/* <IconButton aria-label="delete" onClick={() => window.open(row.fileSrc)}>
                        <InsertDriveFileOutlinedIcon />
                    </IconButton> */}
                </Stack>
            </>
        )
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
                        {RoleID === "1" && row.status === 1 ? <Button variant="danger" size="small" onClick={() => { UpdateStatus(row, 2) }}>Remove</Button>
                            : ""}
                    </Stack>
                </div >
            </div >
        );
    };

    const getStatus = (cell, row) => {
        if (row.status === "1" || row.status === 1) {
            return <center><Chip label="Active" color="success" style={{ width: "75%", padding: 8, fontSize: 16, fontWeight: 'bold' }} /></center>
        } else if (row.status === "2" || row.status === 2) {
            return <center><Chip label="Remove" style={{ width: "75%", padding: 8, fontSize: 16, fontWeight: 'bold' }} /></center>
        }
        else {
            return null;
        }
    }

    function DateTimeFormat(cell, row) {
        return (
            <h6>{("day js DD-MM-YYYY", dayjs(cell).format('DD-MMMM-YYYY'))}</h6>
        );
    }

    function textoverflow(cell, row) {
        return (
            <div className={classes.ellipsis}>
                <spen>{cell}</spen>
            </div>
        )
    }

    const Iconcheck = (cell, row) => {
        if (cell === true) {
            return <div ><center><CheckIcon fontSize="large" color="success" /></center></div>
        } else {
            return <div><center><CloseIcon fontSize="large" color="error" /></center></div>
        }
    }

    const columns = [
        {
            dataField: 'status',
            text: 'Status',
            formatter: getStatus,
            headerStyle: { width: 180 ,backgroundColor:'#748DA6'},
            headerAlign: 'center',
        },

        {
            dataField: 'customer',
            text: 'Custommer',
            formatter: textoverflow,
            headerAlign: 'center',
            headerStyle: {backgroundColor:'#748DA6'},
            align: 'center'
        },
        {
            dataField: 'mA_Code',
            text: 'Code',
            formatter: textoverflow,
            headerAlign: 'center',
            headerStyle: {backgroundColor:'#748DA6'},
            align: 'center'
        },
        {
            dataField: 'mA_Name',
            text: 'Name',
            formatter: textoverflow,
            headerAlign: 'center',
            headerStyle: {backgroundColor:'#748DA6'},
            align: 'center'
        },
        {
            dataField: 'mA_PM',
            text: 'PM',
            formatter: Iconcheck,
            headerAlign: 'center',
            headerStyle: {backgroundColor:'#748DA6'},
            align: 'center'
        },
        {
            dataField: 'mA_Service',
            text: 'Service',
            formatter: Iconcheck,
            headerAlign: 'center',
            headerStyle: {backgroundColor:'#748DA6'},
            align: 'center'
        },
        {
            dataField: 'mA_Insurance',
            text: 'Insurance',
            formatter: Iconcheck,
            headerAlign: 'center',
            headerStyle: {backgroundColor:'#748DA6'},
            align: 'center'
        },
        // {
        //     dataField: 'mA_Detail',
        //     text: 'Detail',
        //     formatter: textoverflow

        // },
        {
            dataField: 'mA_Effective_Start',
            text: 'Start',
            formatter: DateTimeFormat,
            headerAlign: 'center',
            headerStyle: {backgroundColor:'#748DA6'},
            align: 'center'

        },
        {
            dataField: 'mA_Effective_End',
            text: 'End',
            formatter: DateTimeFormat,
            headerAlign: 'center',
            headerStyle: {backgroundColor:'#748DA6'},
            align: 'center'

        },
        {
            dataField: '',
            text: 'File',
            formatter: Document,
            headerStyle: { width: '100px',backgroundColor:'#748DA6' },
            headerAlign: 'center',
            align: 'center'
        },
        {
            dataField: '',
            text: '',
            formatter: Actions,
            headerStyle: { width: '150px' ,backgroundColor:'#748DA6'},
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
                            key={option.text}
                            type="button"
                            onClick={() => onSizePerPageChange(option.page)}
                            className={`btn ${isSelect ? 'btn-primary' : 'btn-secondary'}`}
                        >
                            {option.text}
                        </button>
                    );
                })
            }
        </div>
    );

    const options = {
        sizePerPageRenderer
    };

    const MyExportCSV = (props) => {
        const handleClick = () => {
            props.onExport();
        };
        return (
            <Box textAlign='right'>
                <Button variant="success" onClick={handleClick}>Export CSV</Button>
            </Box>
        );
    };

    return (
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
                                        <h6 style={{ paddingTop: 9 }}>Customer</h6>
                                        <Select
                                            MenuProps={{ style: { maxWidth: 0, maxHeight: 300, position: 'absolute', }, disableScrollLock: true, }}
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            value={ValCustomers}
                                            onChange={(event) => setValCustomers(event.target.value)}
                                            style={{ width: 180 }}
                                            sx={{ "& legend": { display: "none" } }}
                                            size="small"
                                        >
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            {Custommers.map((items) => {
                                                return (
                                                    <MenuItem value={items.id}>{items.customer}</MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </Stack>
                                </Grid>
                                <Grid item xs="auto">
                                    <Stack direction="row" spacing={2}>
                                        <h6 style={{ paddingTop: 9 }}>Code</h6>
                                        <TextField
                                            id="outlined-basic"
                                            // label="Code"
                                            variant="outlined"
                                            size="small"
                                            style={{ width: 180 }}
                                            sx={{ "& legend": { display: "none" } }}
                                            onChange={(event) => setCode(event.target.value)} />
                                    </Stack>
                                </Grid>
                                <Grid item xs="auto">
                                    <Stack direction="row" spacing={2}>
                                        <h6 style={{ paddingTop: 9 }}>Name</h6>
                                        <TextField
                                            id="outlined-basic"
                                            // label="Name"
                                            variant="outlined"
                                            size="small"
                                            style={{ width: 180 }}
                                            sx={{ "& legend": { display: "none" } }}
                                            onChange={(event) => setName(event.target.value)} />
                                    </Stack>
                                </Grid>
                                <Grid item xs="auto">
                                    <Stack direction="row" spacing={2}>
                                        <h6 style={{ paddingTop: 9 }}>Date</h6>
                                        <LocalizationProvider dateAdapter={AdapterDateFns} >
                                            <DesktopDatePicker
                                                label="Start"
                                                value={Startdate}
                                                inputFormat="dd/MM/yyyy"
                                                // minDate={new Date('2017-01-01')}
                                                onChange={(newValue) => {
                                                    setStatedate(newValue);
                                                }}
                                                renderInput={(params) => <TextField {...params} style={{ width: 150 }} size="small" />}
                                            />
                                        </LocalizationProvider>
                                        <h6 style={{ paddingTop: 9 }}> - </h6>
                                        <LocalizationProvider dateAdapter={AdapterDateFns} >
                                            <DesktopDatePicker
                                                label="End"
                                                value={Enddate}
                                                inputFormat="dd/MM/yyyy"
                                                // minDate={new Date('2017-01-01')}
                                                onChange={(newValue) => {
                                                    setEnddate(newValue);
                                                }}
                                                size="small"
                                                renderInput={(params) => <TextField {...params} style={{ width: 150 }} size="small" />}
                                            />
                                        </LocalizationProvider>
                                    </Stack>
                                </Grid>

                            </Grid>

                            <Grid container justifyContent="right" style={{ paddingTop: 10 }}>
                                <Grid item xs={12} sm={'auto'}>
                                    <Button variant="primary" size="small" onClick={() => { GetMAProject() }}>Search</Button>
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
                                        <Button variant="primary" style={{ marginBottom: 10 }} onClick={handleClickAdd}>Add MA</Button>
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
                    maxWidth="md"
                    // style={{ zoom: "85%" }}
                    fullWidth={true}
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}

                >
                    <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                        {header}
                    </BootstrapDialogTitle>
                    <DialogContent dividers>
                        <FormMA maproject={Rowdata} />
                    </DialogContent>
                </BootstrapDialog>
            </Paper>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openBackdrop} onClick={handleClose}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    )
}

export default MstMAProject;

