import {useState} from 'react';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
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
    const visibleData = 10;

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
      <TableContainer component={Paper}>
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
                          <TableRow key={rowIndex} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              {columns.map((column) => {
                                return(
                                  <TableCell key={column.key} align="center">{row[column.key]}</TableCell>
                                )})}
                          </TableRow>
                      )
                  })}
              </TableBody>
          </Table>
          <div>
              <button onClick={handlePrevious} disabled={currentIndex === 0}>Previous</button>
              <button onClick={handleNext} disabled={currentIndex + visibleData >= data.length}>Next</button>
          </div>
      </TableContainer>
    );
}


export default CustomTable;