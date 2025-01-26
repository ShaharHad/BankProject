import {useState} from 'react';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import {Button} from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));


const CustomTable = (tableData) => {

    const columns = tableData.columns;
    const data = tableData.data;
    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleData = 7;

    const getCurrentData = () => {
        return data.slice(currentIndex, currentIndex + visibleData);
    }

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - visibleData, 0));
    }

    const handleNext = () => {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + visibleData, data.length - visibleData));
    }



    return (
      <TableContainer component={Paper} sx={{boxShadow: 10, backgroundColor: "rgba(255, 255, 255, 0.8)"}}>
          <Table sx={{minWidth: 650}} aria-label="customized table">
              <TableHead>
                  <TableRow>
                      {columns.map((column) => (
                          <StyledTableCell key={column.key} align="center">{column.header}</StyledTableCell>
                      ))}
                  </TableRow>
              </TableHead>
              <TableBody>
                  {getCurrentData().map((row, rowIndex) => {
                      return (
                          <TableRow key={rowIndex} sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                          }}>
                              {columns.map((column) => {
                                return(
                                  <TableCell key={column.key} align="center">{row[column.key]}</TableCell>
                                )})}
                          </TableRow>
                      )
                  })}
              </TableBody>
          </Table>
          <Box
              sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 3,
              borderRadius: 2,
              minWidth: 650,
              boxShadow: 0
          }}>
              <Button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  type="button"
                  variant="contained"
                  color="primary"
                  sx={{margin: 2}}
              >
                  Previous
              </Button>
              <Button
                  onClick={handleNext}
                  disabled={currentIndex + visibleData >= data.length}
                  type="button"
                  variant="contained"
                  color="primary"
                  sx={{margin: 2}}
              >
                  Next
              </Button>
          </Box>
      </TableContainer>
    );
}


export default CustomTable;