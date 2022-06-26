import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { FC } from "react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)({
  "&:nth-of-type(even)": {
    backgroundColor: "rgba(137,88,216,0.24)",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
});

interface MostUsedTableProps {
  rows: {
    word: string,
    count: number
  }[];
}

const MostUsedTable: FC<MostUsedTableProps> = ({ rows }) => {
  if (rows.length === 0)
    return <></>;
  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>순위</StyledTableCell>
            <StyledTableCell>주로 쓰인 단어들</StyledTableCell>
            <StyledTableCell>사용횟수</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <StyledTableRow key={idx}>
              <TableCell component="th" scope="row">
                {idx + 1}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.word}
              </TableCell>
              <TableCell>{row.count}</TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MostUsedTable;
