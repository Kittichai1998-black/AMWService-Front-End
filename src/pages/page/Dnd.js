import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuid } from 'uuid';
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Input } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import swal from 'sweetalert2';
import { ViewAPI } from '../../intercepetors/axios'
import NativeSelect from "@mui/material/NativeSelect";
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import SimpleImageSlider from "react-simple-image-slider";

import axios from 'axios';
// import { borders } from "@mui/system";


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

const images = require('../../assets/imgs/image-gallery.png')

function App() {

    const column = [ //HeaderDialogCreate
        { header: 'Project' },
        { header: 'Problem' },
        { header: 'Description' },
        { header: 'Date' },
        { header: 'Priolity' },
        { header: 'Owner' }
    ]

    const columnsFromBackend = [
        { id: 1, name: "Back Log" },
        { id: 2, name: "To do" },
        { id: 3, name: "In Progress" },
        { id: 4, name: "Solve" },
        { id: 5, name: "Done" }
    ];
    // debugger
    const onDragEnd = (result, columns, setColumns) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            });
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            });
        }
    };


    const [columns, setColumns] = useState(columnsFromBackend);
    const [open, setOpen] = React.useState(false);
    // const [selection, setSelection] = useState();
    const [scroll, setScroll] = React.useState('paper');
    const [Custommer, setCustommer] = useState([]);
    const [ValueCustommer, setValueCustommer] = useState(null);
    const [Rootcause, setRootcause] = useState([]);
    const [valueCause, setCause] = useState(null);
    const [Description, setDescription] = useState(null);
    const [Priolity, setPriolity] = useState([]);
    const [valuePriolity, setvaluePriolity] = useState(null);
    const [ImageName, setImageName] = useState("")
    const [User, setUser] = useState({});
    const [state, setState] = useState(images);
    const [file, setFile] = useState()
    const [err, setError] = useState(false)
    const [UserOwner, setOwner] = useState([]);
    const [dataSO, setDataSO] = useState([]);
    const [statusSO, setStatus] = useState("");
    const [ServiceID, setSOID] = useState("");

    // const [Column, setColumn] = useState([]);

    useEffect(() => {
        if (statusSO !== "") {
            UpdateStatus()
            setStatus("")
        }

        GetSos()
    }, [statusSO])

    async function GetSos() {
        await axios({
            method: 'get',
            url: ViewAPI.API_URL + '/GetSOs',
            responseType: 'stream'
        }).then(res => {
            setDataSO(res.data)
        })
    }

    const PreviewImg = e => {
        setImageName(e.target.value)
        setFile(e.target.files[0])
        const reader = new FileReader();
        reader.onload = () => {
            // setState(e.target.file[0])
            if (reader.readyState === 2) {
                setState(reader.result)

            }
        }
        reader.readAsDataURL(e.target.files[0])
    };

    async function SOtoUser() {
        for (let i of Object.keys(UserOwner)) {
            const id = UserOwner[i];
            console.log(id.userID)
            let genid = uuid();
            const formData = new FormData();
            formData.append('id', 0)
            formData.append('uuid', genid)
            formData.append('so', "test")
            formData.append('CustommerID', ValueCustommer.id)
            formData.append('StatusID', 1)
            formData.append('PriorityID', valuePriolity.id)
            formData.append('TypeID', 1)
            formData.append('RootcauseID', valueCause.id)
            formData.append('Problem', Description)
            formData.append('Image', ImageName.replace(/^.*[\\\/]/, ''))
            formData.append('UserID', id.userID)

            formData.append('ImageFile', file)

            await axios({
                method: 'post',
                url: ViewAPI.API_URL,
                // headers: { 'Content-Type': 'application/problem+json; charset=utf-8 ' },
                data: formData
            }).then((res) => {
                if (res.data.status === "Success") {
                    swal.fire({ icon: 'success', title: "บันทึกข้อมูลสำเร็จ" })
                    setOpen(false); //ปิด Dialog
                }
                else {
                    swal.fire({ icon: 'error', title: "Failed", text: "ข้อมูลไม่ถูกต้อง" });
                }
                console.log(res);
                // console.log(id.userID)
            })
        }
    }

    function UpdateStatus() {
        axios({
            method: 'put',
            url: ViewAPI.API_URL + '/ServiceID=' + ServiceID,
            data: { ID: ServiceID, StatusID: statusSO }
        })
    }

    async function GetCustommer() {
        await axios({
            method: 'get',
            url: ViewAPI.API_URL + '/GetCustommer',
            responseType: 'stream'
        }).then(res => {
            setCustommer(res.data)
        })
    }

    async function GetRootcause() {
        await axios({
            method: 'get',
            url: ViewAPI.API_URL + '/GetRootcause',
            responseType: 'stream'
        }).then(res => {
            setRootcause(res.data)
        })

    }

    async function GetPriolity() {
        await axios({
            method: 'get',
            url: ViewAPI.API_URL + '/GetPriolity',
            responseType: 'stream'
        }).then(res => {
            setPriolity(res.data)
        })

    }

    async function GetUser() {
        await axios({
            method: 'get',
            url: ViewAPI.API_URL + '/GetUser',
            responseType: 'stream'
        }).then(res => {
            setUser(res.data)
        })

    }

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    const handleClickOpen = (scrollType) => {
        setOpen(true);
        setScroll(scrollType);
        GetCustommer()
        GetRootcause()
        GetPriolity()
        GetUser()
    };
    const handleClose = () => {
        setOpen(false);
        setError(false);
        setState(images);
        setValueCustommer(null);
        setCause(null);
        setDescription(null);
        setvaluePriolity(null);
        setOwner(null);

    };

    const handleCreate = () => {
        if (ValueCustommer === null || ValueCustommer === undefined) { setError(true) }
        if (valueCause === null || valueCause === undefined) { setError(true) }
        if (valuePriolity === null || valuePriolity === undefined) { setError(true) }
        if (Description === null || ValueCustommer === undefined) { setError(true) }
        else {
            console.log(ValueCustommer)
            console.log(valueCause)
            console.log(valuePriolity)
            console.log(ImageName.replace(/^.*[\\\/]/, ''))
            console.log(Description)
            console.log(file)
            // console.log(UserOwner)
            SOtoUser()
            setState(images)
        }
    }

    // const AlertCheck = (event,val) => {
    //     setStatus(event.target.value);
    //     // setSOID(val.ID)
    //     console.log(statusSO)
    //     // console.log(ServiceID)
    // }
    // function handlechange(event,val) {
    //     setValueCustommer(val)
    //     setCause(val)
    // }
    return (
        <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
            <div>
                <Button variant="contained" onClick={handleClickOpen}>+</Button>
            </div>
            <DragDropContext
                onDragEnd={result => onDragEnd(result, columns, setColumns)}
            >
                {Object.entries(columns).map(([columnId, column], index) => {
                    return (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}
                            key={columnId}
                        >
                            <h2>{column.name}</h2>
                            <div style={{ margin: 8 }}>
                                <Droppable droppableId={columnId} key={columnId}>
                                    {(provided, snapshot) => {
                                        return (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                style={{
                                                    backgroundColor: snapshot.isDragging
                                                        ? "#EFEFEF"
                                                        : "#EFEFEF",
                                                    padding: 4,
                                                    paddingBottom: 50,
                                                    width: 300,
                                                    maxHeight: 800,
                                                    borderRadius: 10,
                                                    overflowY: 'scroll'
                                                    //minHeight: 500
                                                }}
                                            >
                                                {dataSO.filter(x => { return x.statusID === column.id }).map((item, index) => {
                                                    return (
                                                        <Draggable
                                                            key={item.id}
                                                            draggableId={item.id.toString()}
                                                            index={index}
                                                        >
                                                            {(provided, snapshot) => {
                                                                return (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        style={{
                                                                            userSelect: "none",
                                                                            padding: 16,
                                                                            margin: "0 0 8px 0",
                                                                            minHeight: "50px",
                                                                            borderRadius: 10,
                                                                            backgroundColor: snapshot.isDragging
                                                                                ? "#B5DEFF"
                                                                                : "#FFFFFF",
                                                                            color: "#000000",
                                                                            ...provided.draggableProps.style
                                                                        }}
                                                                    >
                                                                        <div
                                                                        // key={grp.title}
                                                                        // className="dnd-group"
                                                                        // onDragEnter={dragging && !grp.items.length ? (e) => handleDragEnter(e, { grpI, itemI: 0 }) : null}
                                                                        >
                                                                            <div className="group-title">
                                                                                <Grid container rowSpacing={1}>
                                                                                    <Grid item xs={5}>
                                                                                        <h4>{item.so}</h4>
                                                                                    </Grid>
                                                                                    <Grid item xs={3}>
                                                                                        <h5>{item.priorityName}</h5>
                                                                                    </Grid>
                                                                                    <Grid item xs={4}>
                                                                                        <NativeSelect
                                                                                            // defaultValue={30}
                                                                                            inputProps={{ name: 'status', id: 'uncontrolled-native' }}
                                                                                            value={item.statusID}
                                                                                            onChange={(e) => { setStatus(e.target.value); setSOID(item.id) }}
                                                                                        >
                                                                                            <option value={1}>{"BackLog"}</option>
                                                                                            <option value={2}>{"ToDo"}</option>
                                                                                            <option value={3}>{"InProgress"}</option>
                                                                                            <option value={4}>{"Sovel"}</option>
                                                                                            <option value={5}>{"Done"}</option>
                                                                                        </NativeSelect>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </div>
                                                                            {/* {grp.items.map((item, itemI) => ( */}
                                                                            <div
                                                                            >
                                                                                <Card sx={{ maxWidth: 345 }}>
                                                                                    <CardMedia
                                                                                        component="img"
                                                                                        height="160"
                                                                                        image={item.imageSrc}
                                                                                        alt="image"
                                                                                        style={{ padding: 14 }}
                                                                                    />
                                                                                </Card>
                                                                                <Typography gutterBottom variant="h5" component="div">
                                                                                    {item.problem}
                                                                                </Typography>
                                                                                <Typography variant="body2" color="text.secondary">
                                                                                    Lizards are a widespread group of squamate reptiles.
                                                                                </Typography>
                                                                                {/* Map User Person แสดงผู้รับผิดชอบ*/}
                                                                                <AvatarGroup max={10} style={{paddingTop:10}}>
                                                                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" sx={{ width: 32, height: 32 }}/>
                                                                                </AvatarGroup>
                                                                            </div>
                                                                            {/* ))} */}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }}
                                                        </Draggable>
                                                    );

                                                })}
                                                {provided.placeholder}

                                            </div>
                                        );
                                    }}
                                </Droppable>
                            </div>
                        </div>

                    );
                })}

            </DragDropContext>


            <div>
                <BootstrapDialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    fullWidth="auto"
                    maxWidth="sm"
                    open={open}
                >
                    <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                        Add Progress
                    </BootstrapDialogTitle>
                    <DialogContent dividers >
                        <div>
                            {column.map((edit) => {
                                if (edit.header === 'Project') {
                                    // eslint-disable-next-line no-lone-blocks
                                    {
                                        return (
                                            <Box sx={{ width: '100%' }}>
                                                <Grid container rowSpacing={1}>
                                                    <Grid item xs={4}>
                                                        <h4 style={{ textAlign: 'center', padding: 14 }}>ชื่อโครงการ :</h4>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Autocomplete
                                                            disablePortal
                                                            id="combo-box-demo"
                                                            options={Custommer}
                                                            getOptionLabel={(option) => option.custommer}
                                                            onChange={(event, val) => { setValueCustommer(val) }}
                                                            sx={{ width: 300 }}
                                                            renderInput={(params) =>
                                                                <TextField {...params}
                                                                    label="Project"
                                                                    error={ValueCustommer !== null ? null : err}
                                                                />}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        );
                                    }
                                }
                                if (edit.header === 'Problem') {
                                    return (
                                        <Box sx={{ width: '100%', marginTop: '30px' }}>
                                            <Grid container rowSpacing={1}>
                                                <Grid item xs={4}>
                                                    <h4 style={{ textAlign: 'center', padding: 14 }}>หัวข้อปัญหา :</h4>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Autocomplete
                                                        disablePortal
                                                        id="combo-box-demo"
                                                        options={Rootcause}
                                                        getOptionLabel={(option) => option.name}
                                                        onChange={(event, val) => { setCause(val) }}
                                                        sx={{ width: 300 }}
                                                        renderInput={(params) =>
                                                            <TextField {...params}
                                                                label="Problem"
                                                                error={valueCause !== null ? null : err}
                                                            />}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    );
                                }
                                if (edit.header === 'Description') {
                                    return (
                                        <Box sx={{ width: '100%', marginTop: '30px' }}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={4}>
                                                    <h4 style={{ textAlign: 'center', padding: 14 }}>รายละเอียด :</h4>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <img src={state} style={{ maxWidth: 200, marginLeft: 35 }} />
                                                    <Input multiple
                                                        type="file"
                                                        accept="image/*"
                                                        id="contained-button-file"
                                                        style={{ paddingTop: 15 }}
                                                        onChange={(event) => PreviewImg(event)} />
                                                    <TextField
                                                        id="outlined-multiline-static"
                                                        // defaultValue={values.desc}
                                                        label="ข้อความ"
                                                        multiline
                                                        rows={3}
                                                        style={{ width: 300, marginTop: 15 }}
                                                        variant="outlined"
                                                        error={Description !== null ? null : err}
                                                        onChange={(event) => setDescription(event.target.value)}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    );
                                }

                                if (edit.header === 'Priolity') {
                                    return (
                                        <Box sx={{ width: '100%', marginTop: '30px' }}>
                                            <Grid container rowSpacing={1}>
                                                <Grid item xs={4}>
                                                    <h4 style={{ textAlign: 'center', padding: 14 }}>ความสำคัญ :</h4>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Autocomplete
                                                        disablePortal
                                                        id="combo-box-demo"
                                                        options={Priolity}
                                                        getOptionLabel={(option) => option.name + ' ' + '(' + option.description + ')'}
                                                        sx={{ width: 300 }}
                                                        onChange={(event, val) => { setvaluePriolity(val) }}
                                                        renderInput={(params) =>
                                                            <TextField {...params}
                                                                label="Priolity"
                                                                error={valuePriolity !== null ? null : err}
                                                            />}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    );
                                }

                                if (edit.header === 'Owner') {
                                    return (
                                        <Box sx={{ width: '100%', marginTop: '30px' }}>
                                            <Grid container rowSpacing={1}>
                                                <Grid item xs={4}>
                                                    <h4 style={{ textAlign: 'center', padding: 14 }}>ผู้รับผิดชอบ :</h4>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <Autocomplete
                                                        multiple
                                                        id="checkboxes-tags-demo"
                                                        options={User}
                                                        disableCloseOnSelect
                                                        getOptionLabel={(option) => option.userName}
                                                        renderOption={(props, option, { selected }) => (
                                                            <li {...props}>
                                                                <Checkbox
                                                                    icon={icon}
                                                                    checkedIcon={checkedIcon}
                                                                    style={{ marginRight: 8 }}
                                                                    checked={selected}
                                                                />
                                                                {option.userName}
                                                            </li>
                                                        )}
                                                        style={{ width: 300 }}
                                                        onChange={(event, val) => setOwner(val)}
                                                        renderInput={(params) => (
                                                            <TextField {...params}
                                                                label="Responsible person"
                                                                placeholder="เพิ่ม"
                                                            // error={UserOwner !== null? null:err} 
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    );
                                }

                            })}
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" autoFocus onClick={handleCreate}>
                            บันทึก
                        </Button>
                    </DialogActions>
                </BootstrapDialog>
            </div>
        </div >

    );

}

export default App;
