import { makeStyles, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, TablePagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, createMuiTheme, ThemeProvider, LinearProgress, CircularProgress } from "@material-ui/core";
import { useEffect, useState, useContext } from "react";
import axios from 'axios'
import { useHistory } from "react-router"
import { AuthContext } from '../Context/AuthContext'

const approve = createMuiTheme({
    palette: {
        primary: {
            main: '#32a852',
            contrastText: '#ffffff',
        },
    },
})

const useStyles = makeStyles((theme) => ({
    tbhead: {
        fontWeight: 600,
    },
    table: {
        maxWidth: 850,
        margin: "2rem",
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
    loading: {
        marginTop: "25%"
    },
}))

const EditCandidates = (props) => {
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(7)
    const [imageDialog, setImageDialog] = useState(false)
    const [dialogTitle, setDialogTitle] = useState('')
    const [imgUrl, setImgUrl] = useState('')
    const [loading, setLoading] = useState(true)
    const [responseDialog, setResponseDialog] = useState(false)
    const [responseTitle, setResponseTitle] = useState('')
    const [response, setResponse] = useState('')
    // eslint-disable-next-line
    const [election, setElection] = useState(null)
    const [candidates, setCandidates] = useState(null)
    const [approvalIsLoading, setApprovalIsLoading] = useState(false)

    const history = useHistory()
    const { dispatch } = useContext(AuthContext)

    const classes = useStyles()

    const getElection = async () => {
        axios.get(
            "https://e1ect.herokuapp.com/api/election/"+props.electionId,
            {
                withCredentials: true,
            }
        ).then((res) => {
            if(res.status === 200) {
                return res.data
            }
        }).then((data) => {
            setElection(data)
            return (typeof data.candidates === 'undefined')?null:data.candidates
        }).then((cand) => {
            setCandidates(cand)
            setLoading(false)
        }).catch((err) => {
            if(typeof err !== 'undefined') {
                if(err.status === 511){
                    dispatch({
                        type: "LOGOUT_SUCCESS",
                    })
                    history.push("/")
                }
            }
        })
    }

    async function approveCandidate(id) {
        setApprovalIsLoading(true)
        await axios.post(
            "https://e1ect.herokuapp.com/api/candidate/approve/"+id,
            {},
            {
                withCredentials: true,
            }
        ).then(async (res) => {
            if(res.status === 200) {
                return true
            }
        }).catch((err) => {
            if(typeof err !== 'undefined') {
                if(err.status === 511){
                    dispatch({
                        type: "LOGOUT_SUCCESS",
                    })
                    history.push("/")
                }
                else if(err.status === 400) {
                    if(err.data.message) {
                        setResponseTitle("Approve Candidate")
                        setResponse("Error: "+err.data.message)
                        setResponseDialog(true)
                    }
                }
            }
        })
        await getElection()
        setApprovalIsLoading(false)
    }

    async function unapproveCandidate(id) {
        setApprovalIsLoading(true)
        await axios.post(
            "https://e1ect.herokuapp.com/api/candidate/unapprove/"+id,
            {},
            {
                withCredentials: true,
            }
        ).then(async (res) => {
            if(res.status === 200) {
                return true
            }
        }).catch((err) => {
            if(typeof err !== 'undefined') {
                if(err.status === 511){
                    dispatch({
                        type: "LOGOUT_SUCCESS",
                    })
                    history.push("/")
                }
                else if(err.status === 400) {
                    if(err.data.message) {
                        setResponseTitle("Deny Candidate")
                        setResponse("Error: "+err.data.message)
                        setResponseDialog(true)
                    }
                }
            }
        })
        await getElection()
        setApprovalIsLoading(false)
    }

    const handleResponseDialogClose = () => {
        setResponseDialog(false)
    }

    // eslint-disable-next-line
    useEffect(async () => {
        if(props.electionId === "") {
            history.push("/")
        }

        await getElection()
    // eslint-disable-next-line
    }, [])

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
                { 
                    loading && <Paper style={{height: "80vh"}}><CircularProgress variant="indeterminate" className={classes.loading} /></Paper>
                }
                {
                    !loading &&
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
                                    (candidates === null) ? (
                                        <TableRow>
                                            <TableCell align="center" colSpan="7" >No candidates enrolled.</TableCell>
                                        </TableRow>
                                    ):(candidates.length !== 0) ? candidates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((candidate) => (
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
                                            <TableCell align="center" style={{minWidth: "200px"}}>
                                                {
                                                    approvalIsLoading && <div><LinearProgress color="primary" style={{width: "80%", height: "4px", marginTop: "10px", marginBottom: "10px", marginLeft: "10%", marginRight: "10%"}} /></div>
                                                }
                                                {
                                                    !approvalIsLoading && 
                                                    <div>
                                                        <ThemeProvider theme={approve}>
                                                            <Button
                                                                style={{height: "26px", width:"80px", marginRight: "10px", fontSize: 12}}
                                                                color="primary"
                                                                disableElevation
                                                                variant={(candidate.approved)?"contained":"outlined"}
                                                                disableRipple={(candidate.approved)?true:false}
                                                                
                                                                onClick={(candidate.approved)?()=>{}:()=>{approveCandidate(candidate.candidate_id)}}
                                                            >
                                                                {(candidate.approved)?"APPROVED":"APPROVE"}
                                                            </Button>
                                                        </ThemeProvider>
                                                        <Button
                                                            style={{height: "26px", width:"80px", fontSize: 12, fontWeight: "bold"}}
                                                            color="secondary"
                                                            disableElevation
                                                            variant={(!candidate.approved)?"contained":"outlined"}
                                                            disableRipple={(!candidate.approved)?true:false}
                                                            onClick={(!candidate.approved)?()=>{}:()=>{unapproveCandidate(candidate.candidate_id)}}
                                                        >
                                                            {(!candidate.approved)?"DENIED":"DENY"}
                                                        </Button>
                                                    </div>
                                                }
                                            </TableCell>
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
                            rowsPerPageOptions={[7, 10, 25]}
                            component="div"
                            count={(candidates === null)?0:candidates.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                }
            </div>
            <Dialog
                open={imageDialog}
                onClose={handleImageDialogClose}
            >
                <DialogTitle style={{minWidth: "15rem"}}>{dialogTitle}</DialogTitle>
                <DialogContent align="center">
                    <div>
                        <img src={imgUrl} style={{objectFit: "cover", maxHeight: "60vh", maxWidth: "100%"}} alt={dialogTitle} />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleImageDialogClose} color="action">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={responseDialog}
                onClose={handleResponseDialogClose}
            >
                <DialogTitle style={{minWidth: "15rem"}}>{responseTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {response}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleResponseDialogClose} color="primary">
                        Okay
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
 
export default EditCandidates;