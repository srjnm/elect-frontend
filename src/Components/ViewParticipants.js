import { makeStyles, TablePagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { HighlightOff, HowToVote } from "@material-ui/icons";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
    tbhead: {
        fontWeight: 600,
    },
    table: {
        maxWidth: 500,
    },
}))

const ViewParticipants = (props) => {
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(3)

    const classes = useStyles()

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const emptyRows = (typeof props.participants === 'undefined')?(rowsPerPage-1):(props.participants === null)?(rowsPerPage-1):(props.participants.length === 0 )?(rowsPerPage - 1):(rowsPerPage - Math.min(rowsPerPage, props.participants.length - page * rowsPerPage))

    return (
        <div className={classes.table}>
            <TableContainer component={Paper} elevation="3" style={{backgroundColor: "#fdfdfd"}}>
                <Table>
                    <TableHead className={classes.tbhead}>
                        <TableRow>
                            <TableCell align="center" colSpan="3" style={{ fontWeight: 600, fontSize: 16}}>PARTICIPANTS</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="center" style={{ fontWeight: 600, }}>REGISTER NUMBER</TableCell>
                            <TableCell align="center" style={{ fontWeight: 600, }}>NAME</TableCell>
                            <TableCell align="center" style={{ fontWeight: 600, }}>VOTED</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            (typeof props.participants === 'undefined')?(
                                <TableRow>
                                    <TableCell align="center" colSpan="3" >No students participating.</TableCell>
                                </TableRow>
                            ):(props.participants.length !== 0) ? props.participants.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((participant) => (
                                <TableRow key={ participant.participant_id }>
                                    <TableCell align="center">{ participant.register_number }</TableCell>
                                    <TableCell align="center">{ participant.first_name } { participant.last_name }</TableCell>
                                    <TableCell align="center">{ (participant.voted)?<HowToVote color="primary" />:<HighlightOff color="action" /> }</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell align="center" colSpan="3" >No students participating.</TableCell>
                                </TableRow>
                            )
                        }
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={2} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[3, 10, 25]}
                    component="div"
                    count={(typeof props.participants === 'undefined')?0:props.participants.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </TableContainer>
        </div>
    );
}
 
export default ViewParticipants;