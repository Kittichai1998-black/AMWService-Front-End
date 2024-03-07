import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs'
import 'dayjs/locale/th'
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

const LatestOrders = ({ data }) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  const getStatus = (row) => {
    if (row === "1" || row === 1) {
      return <Chip label="Back Log" style={{ width: 200, padding: 8, fontSize: 16, fontWeight: 'bold' }} />
    } else if (row === "2" || row === 2) {
      return <Chip label="To Do" variant="outlined" color="primary" style={{ width: 200, padding: 8, fontSize: 16, fontWeight: 'bold' }} />
    } else if (row === "3" || row === 3) {
      return <Chip label="Doing" color="primary" style={{ width: 200, padding: 8, fontSize: 16, fontWeight: 'bold' }} />
    } else if (row === "4" || row === 4) {
      return <Chip label="Solve" variant="outlined" color="success" style={{ width: 200, padding: 8, fontSize: 16, fontWeight: 'bold' }} />
    } else if (row === "5" || row === 5) {
      return <Chip label="Done" color="success" style={{ width: 200, padding: 8, fontSize: 16, fontWeight: 'bold' }} />
    } else if (row === "6" || row === 6) {
      return <Chip label="Charge" variant="outlined" color="warning" style={{ width: 200, padding: 8, fontSize: 16, fontWeight: 'bold' }} />
    } else if (row === "7" || row === 7) {
      return <Chip label="Closed" color="warning" style={{ width: 200, padding: 8, fontSize: 16, fontWeight: 'bold' }} />
    } else if (row === "8" || row === 8) {
      return <Chip label="Reject" color="error" style={{ width: 200, padding: 8, fontSize: 16, fontWeight: 'bold' }} />
      // <h5><center><Badge text='light' variant="outlined" style={{ width: "75%", padding: 8 }}>Reject</Badge></center></h5>

    }
    else {
      return null;
    }
  }

  const DateTimeFormat = (row) => {
    return (
      <h6>{("day js DD-MM-YYYY", dayjs(row).format('DD-MMMM-YYYY'))}</h6>
    );
  }

  return (
    <>
      <Card style={{ height: '100%' }}>
        <CardHeader title="Last Orders" />
        <Box p={2}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow className={classes.tableHeader}>
                  <TableCell align="center">
                    Status
                  </TableCell>
                  <TableCell align="center">
                    Order Ref
                  </TableCell>
                  <TableCell align="center">
                    Customer
                  </TableCell>
                  <TableCell align="center">
                    Problems
                  </TableCell>
                  <TableCell align="center">
                    Priolity
                  </TableCell>
                  <TableCell align="center">
                    DueDate
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order, index) => (
                  <TableRow key={order.ID} className={classes.tableCellBody}>
                    <TableCell align="center">
                      {getStatus(order.StatusID)}
                    </TableCell>
                    <TableCell align="center">
                      {order.ServiceOrder}
                    </TableCell>
                    <TableCell align="center">
                      {order.Customer}
                    </TableCell>
                    <TableCell align="center">
                      {order.CauseName}
                    </TableCell>
                    <TableCell align="center">
                      {order.priorityName}
                    </TableCell>
                    <TableCell align="center">
                      {DateTimeFormat(order.DueDate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Button
            color="primary"
            endIcon={<ArrowRightIcon fontSize="small" />}
            size="small"
            variant="text"
            href={"ServiceOrder"}
          >
            View all
          </Button>
        </Box>
      </Card>
    </>
  )
}
export default LatestOrders