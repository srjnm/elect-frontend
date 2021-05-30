import { Button, CircularProgress, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@material-ui/core"
import moment from "moment";
import { useEffect, useState, useContext } from "react";
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'
import axios from 'axios'

const styles = makeStyles((theme) => ({
    electionButton: {
        fontSize: 11,
        fontWeight: "bold",
        borderRadius: "50px",
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 8,
        paddingRight: 8,
        maxHeight: "25px",
    },
    befLockEButton: {
        minWidth: "140px",
    },
    lockedButton: {
        minWidth: "105px",
    },
    resultsButton: {
        minWidth: "100px",
    },
    loading: {
        marginTop: "12vh",
        [theme.breakpoints.down('md')]: {
            marginLeft: "45vw",
        },
        [theme.breakpoints.up('md')]: {
            marginLeft: "30vw",
        },
    },
    table: {
        minWidth: 800,
    },
    tableContainer: {
        [theme.breakpoints.down('sm')]: {
            marginLeft: "2vw",
        },
        marginBottom: "5vh",
    },
}))

const AdminElections = (props) => {
    const classes = styles()

    const { dispatch } = useContext(AuthContext)
    const history = useHistory()

    const currentDate = new Date()

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [isLoading, setisLoading] = useState(true)
    const [isElectionsLoading, setisElectionsLoading] = useState(true)
    const [elections, setElections] = useState(null)

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const emptyRows = (elections === null)?(rowsPerPage-1):(elections.length === 0 )?(rowsPerPage - 1):(rowsPerPage - Math.min(rowsPerPage, elections.length - page * rowsPerPage))

    useEffect(() => {
        const getElections = async () => {
            axios.get(
                "https://e1ect.herokuapp.com/api/elections",
                {
                    withCredentials: true,
                }
            ).then((res) => {
                if(res.status === 200) {
                    setisElectionsLoading(true)
                    return res.data
                }
            }).then((data) => {
                if (data === null) {
                    setElections('')
                }
                else {
                    setElections(data)
                }
                setisElectionsLoading(false)
                setisLoading(false)
            }).catch((err) => {
                if(typeof err !== 'undefined') {
                    if(err.status === 400){
                        if(err.data.message){
                            if(err.data.message === "No elections created!"){
                                return false
                            }
                        }
                    }
                    else if(err.status === 511){
                        dispatch({
                            type: "LOGOUT_SUCCESS",
                        })
                        history.push("/")
                    }
                }
            }).then((errresp) => {
                setisLoading(errresp)
            })
        }
        getElections()
    // eslint-disable-next-line
    }, [props.render])

    return (
        <div>
            { 
                isLoading && <CircularProgress variant="indeterminate" className={classes.loading} />
            }
            {
                !isLoading &&
                <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" colSpan="5" style={{ fontWeight: 600, fontSize: 16}}>ELECTIONS</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="center" style={{ fontWeight: 600, }}>TITLE</TableCell>
                                <TableCell align="center" style={{ fontWeight: 600, }}>LOCKING AT</TableCell>
                                <TableCell align="center" style={{ fontWeight: 600, }}>STARTING AT</TableCell>
                                <TableCell align="center" style={{ fontWeight: 600, }}>ENDING AT</TableCell>
                                <TableCell align="center" style={{ fontWeight: 600, }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                (elections.length !== 0)?elections.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((election) => (
                                    <TableRow>
                                        <TableCell align="center">{ election.title }</TableCell>
                                        <TableCell align="center">{ moment(election.locking_at, "YYYY-MM-DD HH:mm:ss ZZ z").format("ddd Do MMM, YYYY h:mm a").toString() }</TableCell>
                                        <TableCell align="center">{ moment(election.starting_at, "YYYY-MM-DD HH:mm:ss ZZ z").format("ddd Do MMM, YYYY h:mm a").toString() }</TableCell>
                                        <TableCell align="center">{ moment(election.ending_at, "YYYY-MM-DD HH:mm:ss ZZ z").format("ddd Do MMM, YYYY h:mm a").toString() }</TableCell>
                                        <TableCell align="center">
                                            {
                                                (moment(election.locking_at, "YYYY-MM-DD HH:mm:ss ZZ z").toDate() > currentDate)?
                                                    <Button className={[classes.electionButton, classes.befLockEButton]} color="action" style={{backgroundColor: "#ededed"}} variant="outlined">View/Edit Election</Button>
                                                    :(moment(election.starting_at, "YYYY-MM-DD HH:mm:ss ZZ z").toDate() > currentDate)?
                                                        <Button className={[classes.electionButton, classes.lockedButton]} color="success" style={{backgroundColor: "#e0ffe2", color: "#2e8f32"}} variant="outlined">View Election</Button>
                                                        :(moment(election.ending_at, "YYYY-MM-DD HH:mm:ss ZZ z").toDate() > currentDate)?
                                                            <Button className={classes.electionButton} color="secondary" style={{backgroundColor: "#ffe6e6"}} variant="outlined">In Progress</Button>
                                                            :<Button className={[classes.electionButton, classes.resultsButton]} color="primary" style={{backgroundColor: "#f0faff"}} variant="outlined">View Results</Button>

                                            }
                                        </TableCell>
                                    </TableRow>
                                ))
                                :
                                (isElectionsLoading)? (
                                    <TableRow>
                                        <TableCell align="center" colSpan="5" ><CircularProgress variant="indeterminate" /></TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow>
                                        <TableCell align="center" colSpan="5" >No elections created.</TableCell>
                                    </TableRow>
                                )
                            }
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={5} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <TablePagination 
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={elections.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </TableContainer>
            }
        </div>
    );
}
 
export default AdminElections;