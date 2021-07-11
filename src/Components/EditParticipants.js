import { Button, CircularProgress, makeStyles, TablePagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContentText, DialogActions, DialogContent } from "@material-ui/core";
import { useEffect, useState, useContext } from "react";
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
    tbhead: {
        fontWeight: 600,
    },
    table: {
        maxWidth: 500,
        margin: "2rem",
        marginTop: "1rem"
    },
    loading: {
        marginTop: "25%"
    },
}))

const EditParticipants = (props) => {
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)

    const { dispatch } = useContext(AuthContext)
    const history = useHistory()

    const classes = useStyles()

    // eslint-disable-next-line
    const [election, setElection] = useState(null)
    const [participants, setParticipants] = useState(null)
    const [loading, setLoading] = useState(true)
    const [deleteDialog, setDeleteDialog] = useState(false)
    const [deleteParticipantID, setDeleteParticipantID] = useState('')
    const [deleteRegNumber, setDeleteRegNumber] = useState('')

    const customAxios = axios.create({
        withCredentials: true,
    })

    const refresh = async () => {
        await customAxios.post(
            "/refresh",
        ).then((resp) => {
            if(resp.status === 200){
                return true
            }
        }).then((updt) => {
            // console.log(update)
            // setUpdate(!update)
            // console.log(update)
        }).catch((er) => {
            //console.log(er)
            if(typeof er.response !== 'undefined') {
                if(er.response.status === 511) {
                    dispatch({
                        type: "LOGOUT_SUCCESS",
                    })
                    history.push("/")
                }
            }
        })
    }

    axios.interceptors.response.use(
        null,
        async (error) => {
            if(error.response) {
                if(error.response.status === 406) {
                    await refresh()
                    //console.log(error.config)
                    return axios.request(error.config)
                }
                else if(error.response.status === 511) {
                    dispatch({
                        type: "LOGOUT_SUCCESS",
                    })
                    history.push("/")
                }
            }
            
            return Promise.reject(error.config)
        }
    )

    const getElection = async () => {
        axios.get(
            "/api/election/"+props.electionId,
            {
                withCredentials: true,
            }
        ).then((res) => {
            //console.log(res)
            if(res.status === 200) {
                return res.data
            }
        }).then((data) => {
            setElection(data)
            return (typeof data.participants === 'undefined')?null:data.participants
        }).then((part) => {
            setParticipants(part)
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

    // eslint-disable-next-line
    useEffect(() => {
        if(props.electionId === "") {
            history.push("/")
        }

        setElection(props.election)
        setParticipants((typeof props.election.participants === 'undefined')?null:props.election.participants)
        setLoading(false)
    // eslint-disable-next-line
    }, [])

    // eslint-disable-next-line
    useEffect(async () => {
        if(props.electionId === "") {
            history.push("/")
        }

        await getElection()
    // eslint-disable-next-line
    }, [props.addedParticipant])

    async function handleDelete(id) {
        await axios.delete("/api/participant",{
            withCredentials: true,
            data: {
                election_id: props.electionId,
                participant_id: id,
            },
        }).then((res) => {
            if(res.status === 200) {
                return true
            }
        })
        .catch((err) => {})
        getElection()
        setDeleteDialog(false)
    }

    const handleDeleteDialogClose = () => {
        setDeleteParticipantID('')
        setDeleteDialog(false)
    }

    function handleOpenDeleteDialog(p_id, reg_no) {
        setDeleteParticipantID(p_id)
        setDeleteRegNumber(reg_no)
        setDeleteDialog(true)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const emptyRows = (typeof participants === 'undefined')?(rowsPerPage-1):(participants === null)?(rowsPerPage-1):(participants.length === 0 )?(rowsPerPage - 1):(rowsPerPage - Math.min(rowsPerPage, participants.length - page * rowsPerPage))

    return (
        <div className={classes.table}>
            { 
                loading && <Paper style={{height: "40vh"}}><CircularProgress variant="indeterminate" className={classes.loading} /></Paper>
            }
            {
                !loading &&
                <TableContainer component={Paper} elevation="3" style={{backgroundColor: "#fdfdfd"}}>
                    <Table>
                        <TableHead className={classes.tbhead}>
                            <TableRow>
                                <TableCell align="center" colSpan="3" style={{ fontWeight: 600, fontSize: 16}}>PARTICIPANTS</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="center" style={{ fontWeight: 600, }}>REGISTER NUMBER</TableCell>
                                <TableCell align="center" style={{ fontWeight: 600, }}>NAME</TableCell>
                                <TableCell align="center" style={{ fontWeight: 600, }}>DELETE PARTICIPANT</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                (participants === null) ? (
                                    <TableRow>
                                        <TableCell align="center" colSpan="3" >No students participating.</TableCell>
                                    </TableRow>
                                ) : (participants.length !== 0) ? participants.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((participant) => (
                                    <TableRow key={ participant.participant_id }>
                                        <TableCell align="center">{ participant.register_number }</TableCell>
                                        <TableCell align="center">{ participant.first_name } { participant.last_name }</TableCell>
                                        <TableCell align="center"><Button onClick={ () => { handleOpenDeleteDialog(participant.participant_id, participant.register_number) } } variant="contained" color="secondary" disableElevation style={{ fontWeight: 600, maxHeight: 30, }}>DELETE</Button></TableCell>
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
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={(participants === null)?0:participants.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </TableContainer>
            }
            <Dialog
                open={deleteDialog}
                onClose={handleDeleteDialogClose}
            >
                <DialogTitle style={{minWidth: "15rem"}}>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    { "Are you sure you want to delete '" + deleteRegNumber + "'?" }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button onClick={handleDeleteDialogClose} color="grey">
                            NO
                        </Button>
                        <Button type="submit" onClick={()=>{handleDelete(deleteParticipantID)}} color="secondary">
                            YES
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    );
}
 
export default EditParticipants;