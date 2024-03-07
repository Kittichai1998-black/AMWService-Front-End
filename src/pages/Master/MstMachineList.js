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
import filterFactory, { selectFilter, textFilter, dateFilter, customFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min';
import paginationFactory, { PaginationProvider } from 'react-bootstrap-table2-paginator';
import axios from 'axios';
import { AuthenAPI, DetailAPI, ViewAPI, MasterAPI } from '../../intercepetors/axios'
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from 'react-bootstrap/Button'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import CloseIcon from '@mui/icons-material/CloseOutlined';
import CheckIcon from '@mui/icons-material/CheckOutlined';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from "@mui/material/Box";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import swal from 'sweetalert2';
import Chip from '@mui/material/Chip';
import FormMachineList from '../formpage/FormMachineList'
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    root: {
        zIndex: -99999
    },
    table: {
        textOverflow: "ellipsis"
    },
    ellipsis: {
        maxWidth: 200,
        whiteSpace: "nowrap",
        overflow: "hidden",
        // textOverflow: "ellipsis"
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

const MstMachineList = () => {
    const classes = useStyles();
    const { ServiceID } = useParams();
    const [dataTable, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [Permission, setPermission] = useState([]);
    const [ValStatus, setValStatus] = useState(null);
    const [Custommers, setCustommer] = useState([]);
    const [ValCustomers, setValCustomers] = useState(null);
    const [Code, setCode] = useState(null);
    const [Name, setName] = useState(null);
    const [MachineSize, setMachineSize] = useState('');
    const [Rowdata, setRowData] = useState(0);
    const [UserID, setUserID] = useState(localStorage.getItem('userID'));
    const [RoleID, setRoleID] = useState(localStorage.getItem('roleID'));
    const [page, setPage] = React.useState(2);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [expanded, setExpanded] = useState('search');
    const [header, setHeader] = useState("")

    const Size = [{ id: 1, label: "S" }, { id: 2, label: "M" }, { id: 3, label: "L" }, { id: 4, label: "XL" }]

    useEffect(() => {
        GetMachineList()
        GetCustommer()
    }, []);

    useEffect(() => {
        const redata = Rowdata
        return redata
    }, [Rowdata])

    // useEffect(() => {
    //     console.log(MachineSize)
    // }, [MachineSize])

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

    async function GetMachineList() {
        setOpenBackdrop(!open);
        await axios.get(MasterAPI.API_URL + '/GetMachineList'
            , {
                params: {
                    // StatusID: ValStatus,
                    CustomerID: ValCustomers,
                    Code: Code,
                    Name: Name,
                    Size: MachineSize
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

    async function UpdateStatus(row, valID) {
        swal.fire({
            title: 'Are you sure?',
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
                    url: MasterAPI.API_URL + '/MachineListID=' + row.id,
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
                        GetMachineList();
                    }
                    else {
                        swal.fire("Failed", res.status, "error");
                    }
                }))
            }
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
                        {RoleID === "1" ? <Button variant="info" onClick={() => { handleClickEdit(row) }}>Edit</Button>
                            : ""}
                        {RoleID === "1" && row.Status === 1 ? <Button variant="danger" onClick={() => { UpdateStatus(row, 2) }}>Remove</Button>
                            : ""}
                    </Stack>

                </div>
            </div>
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
            dataField: 'Status',
            text: 'Status',
            formatter: getStatus,
            headerStyle: { width: 180 ,backgroundColor:'#748DA6'},
            headerAlign: 'center',
            align: 'center'
        },

        {
            dataField: 'Customer',
            text: 'Custommer',
            formatter: textoverflow,
            headerAlign: 'center',
            headerStyle: {backgroundColor:'#748DA6'},
            align: 'center'
        },
        {
            dataField: 'MC_Code',
            text: 'Code',
            formatter: textoverflow,
            headerAlign: 'center',
            headerStyle: {backgroundColor:'#748DA6'},
            align: 'center'
        },
        {
            dataField: 'MC_Name',
            text: 'Name',
            formatter: textoverflow,
            headerAlign: 'center',
            headerStyle: {backgroundColor:'#748DA6'},
            align: 'center'
        },
        {
            dataField: 'MC_Size',
            text: 'MachineSize',
            headerAlign: 'center',
            headerStyle: {backgroundColor:'#748DA6'},
            align: 'center'
            // formatter: Iconcheck
        },
        {
            dataField: 'MC_Count',
            text: 'Count',
            headerAlign: 'center',
            headerStyle: {backgroundColor:'#748DA6'},
            align: 'center'
            // formatter: Iconcheck
        },
        {
            dataField: '',
            text: '',
            formatter: Actions,
            headerStyle: { width: '150px',backgroundColor:'#748DA6' },
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
                <Button variant="success" onClick={handleClick}>Export to CSV</Button>
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
                                            style={{ width: 200 }}
                                            sx={{ "& legend": { display: "none" } }}
                                            size="small"
                                        // label="Customer"
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
                                            sx={{ "& legend": { display: "none" } }}
                                            onChange={(event) => setName(event.target.value)} />
                                    </Stack>
                                </Grid>
                                <Grid item xs="auto">
                                    <Stack direction="row" spacing={2}>
                                        <h6 style={{ paddingTop: 9 }}>Size</h6>
                                        <Select
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            // value={MachineSize}
                                            onChange={(event) => setMachineSize(event.target.value)}
                                            style={{ width: 200 }}
                                            sx={{ "& legend": { display: "none" } }}
                                            size="small"
                                        >
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            {Size.map((items) => {
                                                return (
                                                    <MenuItem value={items.id}>{items.label}</MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </Stack>
                                </Grid>

                            </Grid>

                            <Grid container justifyContent="right" style={{ paddingTop: 10 }}>
                                <Grid item xs={12} sm={'auto'}>
                                    <Button variant="primary" size="small" style={{ textAlign: 'right', marginTop: 10 }} onClick={() => { GetMachineList() }}>Search</Button>
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
                                        <Button variant="primary" style={{ marginBottom: 10 }} onClick={handleClickAdd}>Add Machine</Button>
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
                    maxWidth="sm"
                    // style={{ zoom: "85%" }}
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}

                >
                    <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                        {header}
                    </BootstrapDialogTitle>
                    <DialogContent dividers>
                        <FormMachineList machines={Rowdata} />
                    </DialogContent>
                </BootstrapDialog>
            </Paper>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openBackdrop} onClick={handleClose}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    )
}

export default MstMachineList;

