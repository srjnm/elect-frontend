import { makeStyles, Dialog, DialogTitle, DialogContent, DialogActions, TablePagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@material-ui/core";
import { RemoveCircle, VerifiedUser } from "@material-ui/icons";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
    tbhead: {
        fontWeight: 600,
    },
    table: {
        maxWidth: 800,
    },
    viewButton: {
        backgroundColor: "#333333",
        color: "white",
        fontWeight: "bold",
        fontSize: 12,
        height: "26px",
        "&:hover": {
            backgroundColor: "#444444"
        },
    },
}))

const ViewCandidates = (props) => {
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(3)
    const [imageDialog, setImageDialog] = useState(false)
    const [dialogTitle, setDialogTitle] = useState('')
    const [imgUrl, setImgUrl] = useState('')

    const classes = useStyles()

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const emptyRows = (typeof props.candidates === 'undefined')?(rowsPerPage-1):(props.candidates === null)?(rowsPerPage-1):(props.candidates.length === 0 )?(rowsPerPage - 1):(rowsPerPage - Math.min(rowsPerPage, props.candidates.length - page * rowsPerPage))

    const handleImageDialogClose = () => {
        setImageDialog(false)
    }

    const openImageDialog = (url, title) => {
        setImgUrl(url)
        setDialogTitle(title)
        setImageDialog(true)
    }

    return (
        <div>
            <div className={classes.table}>
                <TableContainer component={Paper} elevation="3" style={{backgroundColor: "#fdfdfd"}}>
                    <Table>
                        <TableHead className={classes.tbhead}>
                            <TableRow>
                                <TableCell align="center" colSpan="7" style={{ fontWeight: 600, fontSize: 16}}>CANDIDATES</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="center" style={{ fontWeight: 600, }}>REGISTER NUMBER</TableCell>
                                <TableCell align="center" style={{ fontWeight: 600, }}>NAME</TableCell>
                                <TableCell align="center" style={{ fontWeight: 600, }}>SEX</TableCell>
                                <TableCell align="center" style={{ fontWeight: 600, }}>ID PROOF</TableCell>
                                <TableCell align="center" style={{ fontWeight: 600, }}>DP</TableCell>
                                <TableCell align="center" style={{ fontWeight: 600, }}>POSTER</TableCell>
                                <TableCell align="center" style={{ fontWeight: 600, }}>APPROVAL</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                (typeof props.candidates === 'undefined')?(
                                    <TableRow>
                                        <TableCell align="center" colSpan="7" >No candidates enrolled.</TableCell>
                                    </TableRow>
                                ):(props.candidates.length !== 0) ? props.candidates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((candidate) => (
                                    <TableRow key={ candidate.candidate_id }>
                                        <TableCell align="center">{ candidate.register_no }</TableCell>
                                        <TableCell align="center">{ candidate.first_name } { candidate.last_name }</TableCell>
                                        <TableCell align="center">{ (candidate.sex === 0)?"Male":(candidate.sex === 1)?"Female":(candidate.sex === 2)?"Other":"-" }</TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="contained"
                                                disableElevation
                                                className={classes.viewButton}
                                                onClick={() => {openImageDialog(candidate.id_proof, "ID Proof")}}
                                            >
                                                VIEW
                                            </Button>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="contained"
                                                disableElevation
                                                className={classes.viewButton}
                                                onClick={() => {openImageDialog(candidate.display_picture, "Display Picture")}}
                                            >
                                                VIEW
                                            </Button>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="contained"
                                                disableElevation
                                                className={classes.viewButton}
                                                onClick={() => {openImageDialog(candidate.poster, "Poster")}}
                                            >
                                                VIEW
                                            </Button>
                                        </TableCell>
                                        <TableCell align="center">{ (candidate.approved)?<VerifiedUser color="#32a852" />:<RemoveCircle color="secondary" /> }</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell align="center" colSpan="7" >No candidates enrolled.</TableCell>
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
                        count={(typeof props.candidates === 'undefined')?0:props.candidates.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </TableContainer>
            </div>
            <Dialog
                open={imageDialog}
                onClose={handleImageDialogClose}
            >
                <DialogTitle style={{minWidth: "15rem"}}>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <img src={imgUrl} style={{width: "100%"}} alt={dialogTitle} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleImageDialogClose} color="action">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
 
export default ViewCandidates;