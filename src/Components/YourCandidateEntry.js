import { makeStyles, Dialog, DialogTitle, DialogContent, DialogActions, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@material-ui/core";
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

const YourCandidateEntry = (props) => {
    const [imageDialog, setImageDialog] = useState(false)
    const [dialogTitle, setDialogTitle] = useState('')
    const [imgUrl, setImgUrl] = useState('')

    const classes = useStyles()

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
            <TableContainer component={Paper} elevation="3" style={{backgroundColor: "#fdfdfd", maxWidth: 800, marginLeft: "1rem", marginRight: "1rem"}}>
                <Table>
                    <TableHead className={classes.tbhead}>
                        <TableRow>
                            <TableCell align="center" colSpan="7" style={{ fontWeight: 600, fontSize: 16}}>YOUR CANDIDATE ENTRY</TableCell>
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
                        <TableRow>
                            <TableCell align="center">{ props.candidate.register_no }</TableCell>
                            <TableCell align="center">{ props.candidate.first_name } { props.candidate.last_name }</TableCell>
                            <TableCell align="center">{ (props.candidate.sex === 0)?"Male":(props.candidate.sex === 1)?"Female":(props.candidate.sex === 2)?"Other":"-" }</TableCell>
                            <TableCell align="center">
                                <Button
                                    variant="contained"
                                    disableElevation
                                    className={classes.viewButton}
                                    onClick={() => {openImageDialog(props.candidate.id_proof, "ID Proof")}}
                                >
                                    VIEW
                                </Button>
                            </TableCell>
                            <TableCell align="center">
                                <Button
                                    variant="contained"
                                    disableElevation
                                    className={classes.viewButton}
                                    onClick={() => {openImageDialog(props.candidate.display_picture, "Display Picture")}}
                                >
                                    VIEW
                                </Button>
                            </TableCell>
                            <TableCell align="center">
                                <Button
                                    variant="contained"
                                    disableElevation
                                    className={classes.viewButton}
                                    onClick={() => {openImageDialog(props.candidate.poster, "Poster")}}
                                >
                                    VIEW
                                </Button>
                            </TableCell>
                            <TableCell align="center">{ (props.candidate.approved)?<VerifiedUser style={{color: "#32a852"}} />:<RemoveCircle color="secondary" /> }</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
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
 
export default YourCandidateEntry;