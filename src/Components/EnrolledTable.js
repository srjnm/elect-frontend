import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";

const columns = [
  { id: "name", label: <b>NAME</b>, minWidth: 180 },
  { id: "regno", label: <b>REGISTER NUMBER</b>, minWidth: 130 },
  { id: "proof", label: <b>ID PROOF</b>, minwidth: 70 },
  { id: "Poster", label: <b>POSTER</b>, minwidth: 70 },
  { id: "approval", label: <b>Approval</b>, minwidth: 130 }
];

function createData(name, regno, proof, poster, approval) {
  return { name, regno, proof, poster, approval };
}

const rows = [
  createData("Suraj NM", 184766),
  createData("Udaya Kumar", 184769),
  createData("Adarsh Unathil", 184774),
  createData("Vishal C Bangera", 184775),
  createData("Shawn Evan Pinto", 184796),
  createData("Suraj NM 1", 184766),
  createData("Udaya Kumar 1", 184769),
  createData("Adarsh Unathil 1", 184774),
  createData("Vishal C Bangera 1", 184775),
  createData("Shawn Evan Pinto 1", 184796),
  createData("Suraj NM 2", 184766),
  createData("Udaya Kumar 2", 184769),
  createData("Adarsh Unathil 2", 184774),
  createData("Vishal C Bangera 2", 184775),
  createData("Shawn Evan Pinto 2", 184796),
  createData("Suraj NM 3", 184766),
  createData("Udaya Kumar 3", 184769),
  createData("Adarsh Unathil 3", 184774),
];

const useStyles = makeStyles({
  tab: {
    width: "60%",
    marginLeft: "40px"
  },
  container: {
    maxHeight: 440
  }
});

export default function EnrolledTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.tab}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
