import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
    Box,
    Button,
    Paper,
    Card,
    CardHeader,
    TableContainer,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    Tooltip
} from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Chip from '@mui/material/Chip';

import { SeverityPill } from './severity-pill';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    tableHeader: {
        "& .MuiTableCell-head": {
            color: "white",
            backgroundColor: "#839AA8",
            fontSize: 18
        },
    },
    tableCellBody: {
        "& .MuiTableCell-body": {
            fontSize: 16
        }
    }
});


const getStatus = (row) => {
    if (row === "1" || row === 1) {
        return <Chip label="Back Log" style={{ width: 150, padding: 8, fontSize: 16, fontWeight: 'bold' }} />
    } else if (row === "2" || row === 2) {
        return <Chip label="To Do" variant="outlined" color="primary" style={{ width: 150, padding: 8, fontSize: 16, fontWeight: 'bold' }} />
    } else if (row === "3" || row === 3) {
        return <Chip label="Doing" color="primary" style={{ width: 150, padding: 8, fontSize: 16, fontWeight: 'bold' }} />
    } else if (row === "4" || row === 4) {
        return <Chip label="Solve" variant="outlined" color="success" style={{ width: 150, padding: 8, fontSize: 16, fontWeight: 'bold' }} />
    } else if (row === "5" || row === 5) {
        return <Chip label="Done" color="success" style={{ width: 150, padding: 8, fontSize: 16, fontWeight: 'bold' }} />
    } else if (row === "6" || row === 6) {
        return <Chip label="Charge" variant="outlined" color="warning" style={{ width: 150, padding: 8, fontSize: 16, fontWeight: 'bold' }} />
    } else if (row === "7" || row === 7) {
        return <Chip label="Closed" color="warning" style={{ width: 150, padding: 8, fontSize: 16, fontWeight: 'bold' }} />
    } else if (row === "8" || row === 8) {
        return <Chip label="Reject" color="error" style={{ width: 150, padding: 8, fontSize: 16, fontWeight: 'bold' }} />
        // <h5><center><Badge text='light' variant="outlined" style={{ width: "75%", padding: 8 }}>Reject</Badge></center></h5>

    }
    else {
        return null;
    }
}

const statusdefault = [
    { status: 1 },
    { status: 2 },
    { status: 3 },
    { status: 4 },
    { status: 5 },
    { status: 6 },
    { status: 7 },
    { status: 8 }
];

export const Status = ({ data }) => {
    const classes = useStyles();
    return (
        <>
            <Card>
                <CardHeader title="All Document" />
                <PerfectScrollbar>
                    <Box p={2}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow className={classes.tableHeader}>
                                        <TableCell align="center">Status</TableCell>
                                        <TableCell align="center">Count</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {statusdefault.map((status) => (
                                        <TableRow className={classes.tableCellBody}>
                                            <TableCell align="center">{getStatus(status.status)}</TableCell>
                                            <TableCell align="center"><h5>{data.filter((x) => x.StatusID === status.status).length}</h5></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </PerfectScrollbar>
            </Card>
        </>
    )
};