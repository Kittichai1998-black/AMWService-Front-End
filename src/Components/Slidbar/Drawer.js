import React, { useEffect } from "react"
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import HomeIcon from '@mui/icons-material/Home';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AssignmentTurnedIn from '@mui/icons-material/AssignmentTurnedInOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import People from '@mui/icons-material/People';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import LogoAMW from '../../assets/logo/logo.png'
import logo2 from '../../assets/logo/logoservice2.png'
import { withRouter } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import usertemp from '../../assets/imgs/NicePng.png';
import { makeStyles } from '@mui/styles';
import Fade from '@mui/material/Fade';
const drawerWidth = 240;


const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(9)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const MiniDrawer = (props) => {
    const { history } = props;
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [openmenu, setOpenmenu] = React.useState(false);
    const [user, setUser] = React.useState(localStorage.getItem('user'));
    const [RoleID, setRoleID] = React.useState(localStorage.getItem('roleID'));
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(null)
    const [selectedMenuIndex, setSelectedMenuIndex] = React.useState(null)
    const opendrop = Boolean(anchorEl);

    useEffect(() => {
        switch (window.location.pathname) {
            case "/ServiceOrder":
                setSelectedIndex(0)
                break
            case "/DashBoard":
                setSelectedIndex(1)
                break
            default:
                break
        }
    }, [])

    const handleClickdrop = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseDrop = () => {
        setAnchorEl(null);
    };
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    // console.log(user)

    const handleDrawerOpen = () => {
        setOpen(true);
        // console.log(user)
    };

    const handleClick = (event, index) => {
        // setSelectedMenuIndex(index)
        setOpenmenu(!openmenu);
    };

    const handleListItemClick = (event, index, onclick) => {
        history.push(onclick)
        setSelectedMenuIndex(null)
        setSelectedIndex(index)
    }

    const handleListMenuItemClick = (event, index, onclick) => {
        history.push(onclick)
        setSelectedIndex(null)
        setSelectedMenuIndex(index)
    }

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("account");
        localStorage.removeItem("userID");
        localStorage.removeItem("user");
        localStorage.removeItem("roleID");
        localStorage.removeItem("expiration");
        window.location.href = "/";
        setAnchorEl(null);
    };

    const PageList = [ //เพิ่ม page ตรงนี้
        {
            text: "Home",
            icon: <HomeIcon color="primary" />,
            onclick: "/ServiceOrder"
        },
        // {
        //     text: "New Document",
        //     icon: <AssignmentOutlinedIcon color="primary" />,
        //     onclick: () => history.push("/CreateDoc")
        // }
        {
            text: "DashBoard",
            icon: <DashboardOutlinedIcon color="primary" />,
            onclick: "/DashBoard"
        }

    ];

    const rootMenus = [
        {
            text: "Setting",
            icon: <SettingsOutlinedIcon color="primary" />,
            items: [
                {
                    text: "MAProject",
                    icon: <AssignmentTurnedIn color="primary" />,
                    onclick: "/MstMAProject"
                },
                {
                    text: "Machine List",
                    icon: <PrecisionManufacturingIcon color="primary" />,
                    onclick: "/MstMachineList"
                },
                // {
                //     text: "Operator",
                //     icon: <People color="primary" />,
                //     onclick: "/MstOperator"
                // },
                {
                    text: "UserAccount",
                    icon: <PersonAddAltIcon color="primary" />,
                    onclick: "/MstUserAccount"
                },
            ]
            // onclick: () => history.push("/contact")
        }
    ]


    return (
        <Box >
            <CssBaseline />
            <AppBar style={{ background: '#2E3B55' }} open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: '36px',
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <img src={LogoAMW} style={{ maxWidth: 75, marginRight: 20 }} />

                    <Typography variant="h6" noWrap component="div" >
                        <a href={"ServiceOrder"} style={{ color: "white" }}>AMW SERVICE</a>
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}></Box>
                    <Box>
                        {/* <Grid container spacing={1}>
                            <Grid item xs={12} > */}
                                <div>
                                    <IconButton
                                        sx={{ p: 0 }}
                                        onClick={handleMenu}
                                    >
                                        <Typography noWrap component="div" style={{ color: "white" }}><AccountCircle /> {user.replace(/['"]+/g, '')} <ArrowDropDownIcon /></Typography>
                                    </IconButton>
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={anchorEl}
                                        anchorOrigin={{
                                          vertical: 'bottom',
                                          horizontal: 'left',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                          vertical: 'top',
                                          horizontal: 'left',
                                        }}
                                        open={Boolean(anchorEl)}
                                        onClose={handleCloseDrop}
                                    >
                                        {/* <MenuItem onClick={handleCloseDrop}>Profile</MenuItem> */}
                                        <MenuItem style={{ fontSize: 16}} onClick={handleLogout}>Logout</MenuItem>
                                    </Menu>
                                </div>
                                {/* )} */}
                            {/* </Grid>

                        </Grid> */}
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" PaperProps={{
                sx: {
                    backgroundColor: "#182430",
                    color: "white",
                }
            }} open={open} >
                <DrawerHeader>
                    {/* <img src={logo2} style={{ maxWidth: 140, marginRight: 10 }} /> */}
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon color="primary" /> : <ChevronLeftIcon color="primary" />}
                    </IconButton>
                </DrawerHeader>

                <List>
                    {PageList.map((page, index) => {
                        const { text, icon, onclick } = page;
                        return (
                            <ListItem
                                button key={text}
                                // disabled={index === 0}
                                selected={index === selectedIndex}
                                onClick={(event) => handleListItemClick(event, index, onclick)}>
                                <ListItemIcon>{icon}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        )
                    })}

                    {RoleID === "1" ?
                        <>
                            {rootMenus.map(({ text, items = [] }, index) => (
                                <>
                                    <ListItem onClick={(event) => handleClick(event, index)}>
                                        <ListItemIcon>
                                            <SettingsOutlinedIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText primary={text} />
                                        {openmenu ? <ExpandLess /> : <ExpandMore />}
                                    </ListItem>
                                    <Collapse in={openmenu} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {items.map((menus, index) => {
                                                const { text, icon, onclick } = menus;
                                                return (
                                                    <ListItemButton
                                                        sx={{ pl: 4, color: 'inherit' }}
                                                        key={text}
                                                        selected={index === selectedMenuIndex}
                                                        onClick={(event) => handleListMenuItemClick(event, index, onclick)}>
                                                        <ListItemIcon>
                                                            <ListItemIcon>{icon}</ListItemIcon>
                                                        </ListItemIcon>
                                                        <ListItemText primary={text} />
                                                    </ListItemButton>
                                                )
                                            })}
                                        </List>
                                    </Collapse>
                                </>
                            ))}
                        </> : ""}
                </List>

                {/* <List>
                    {['LogOut'].map((text, index) => (
                        <ListItem button key={text} onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutOutlinedIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List> */}
            </Drawer>
        </Box >
    );
};
export default withRouter(MiniDrawer);
