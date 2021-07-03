import { Button, CircularProgress, TablePagination, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContentText, DialogActions, DialogContent } from '@material-ui/core'
import { useEffect, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'
import axios from 'axios'
import { Beenhere, Cancel } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
    table: {
      minWidth: 450,
      marginTop: 20,
      marginBottom: 20,
    },
    tbhead: {
        fontWeight: 600,
    },
    loading: {
        marginTop: "12vh",
        [theme.breakpoints.down('md')]: {
            marginLeft: "45vw",
        },
        [theme.breakpoints.up('md')]: {
            marginLeft: "25vw",
        },
    }
}));

const RegisteredStudents = (props) => {
    const { dispatch } = useContext(AuthContext)
    const history = useHistory()

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [students, setStudents] = useState('')
    const [isLoading, setisLoading] = useState(true)
    const [isStudentsLoading, setisStudentsLoading] = useState(true)
    const [update, setUpdate] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(false)
    const [deleteUserID, setDeleteUserID] = useState('')
    const [deleteRegNumber, setDeleteRegNumber] = useState('')

    const classes = useStyles()

    const handleDeleteDialogClose = () => {
        setDeleteUserID('')
        setDeleteDialog(false)
    }

    function handleOpenDeleteDialog(u_id, reg_no) {
        setDeleteUserID(u_id)
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

    const emptyRows = (students === null)?(rowsPerPage-1):(students.length === 0 )?(rowsPerPage - 1):(rowsPerPage - Math.min(rowsPerPage, students.length - page * rowsPerPage))

    // const customAxios = axios.create({
    //     withCredentials: true,
    // })

    // const refresh = async () => {
    //     await customAxios.post(
    //         "/refresh",
    //     ).then((resp) => {
    //         if(resp.status === 200){
    //             return !update 
    //         }
    //     }).then((updt) => {
    //         // console.log(update)
    //         // setUpdate(!update)
    //         // console.log(update)
    //     }).catch((er) => {
    //         console.log(er)
    //         if(typeof er.response !== 'undefined') {
    //             if(er.response.status === 511) {
    //                 dispatch({
    //                     type: "LOGOUT_SUCCESS",
    //                 })
    //                 history.push("/")
    //             }
    //         }
    //     })
    // }

    // axios.interceptors.response.use(
    //     null,
    //     async (error) => {
    //         if(error.response) {
    //             if(error.response.status === 406) {
    //                 await refresh()
    //                 // console.log(error.config)
    //                 // return axios.request(error.config)
    //             }
    //             else if(error.response.status === 511) {
    //                 dispatch({
    //                     type: "LOGOUT_SUCCESS",
    //                 })
    //                 history.push("/")
    //             }
    //         }
            
    //         setUpdate(!update)
    //         return Promise.reject(error)
    //     }
    // )

    useEffect(() => {
        let mounted = true
        const getStudents = async () => {
            if(mounted) {
                axios.get(
                    "/api/registeredstudents",
                    {
                        withCredentials: true,
                    }
                ).then((res) => {
                    if(res.status === 200) {
                        setisStudentsLoading(true)
                        return res.data
                    }
                }).then((data) => {
                    if (data === null) {
                        setStudents('')
                    }
                    else {
                        setStudents(data)
                    }
                    setisStudentsLoading(false)
                    setisLoading(false)
                }).catch((err) => {
                    if(typeof err !== 'undefined') {
                        if(err.status === 400){
                            if(err.data.message){
                                if(err.data.message === "No students registered!"){
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
        }
        getStudents()

        return () => mounted=false
    // eslint-disable-next-line
    }, [update, props.render])

    function handleDelete(id) {
        axios.delete(
            "/api/registeredstudent/"+id,
            {
                withCredentials: true,
            }
        ).then((res) => {
            if(res.status === 200) {
                return !update
            }
        }).then((upd) => {
            setUpdate(upd)
        }).catch((err) => {})
        setDeleteDialog(false)
    }

    return (
        <div>
            { 
                isLoading && <CircularProgress variant="indeterminate" className={classes.loading} />
            }
            {
                !isLoading &&
                <TableContainer component={Paper} style={{marginLeft: "25px", marginBottom: "80px"}}>
                    <Table>
                        <TableHead className={classes.tbhead}>
                            <TableRow>
                                <TableCell align="center" colSpan="5" style={{ fontWeight: 600, fontSize: 16}}>REGISTERED STUDENTS</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ fontWeight: 600, }}>NAME</TableCell>
                                <TableCell align="center" style={{ fontWeight: 600, }}>REGISTER NUMBER</TableCell>
                                <TableCell align="center" style={{ fontWeight: 600, }}>EMAIL ADDRESS</TableCell>
                                <TableCell align="center" style={{ fontWeight: 600, }}>VERIFIED</TableCell>
                                <TableCell align="center" style={{ fontWeight: 600, }}>DELETE STUDENT</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                (students.length !== 0) ? students.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student) => (
                                    <TableRow key={ student.email }>
                                        <TableCell>{ student.first_name } { student.last_name }</TableCell>
                                        <TableCell align="center">{ student.reg_number }</TableCell>
                                        <TableCell align="center">{ student.email }</TableCell>
                                        <TableCell align="center">{ (student.verified)?<Beenhere style={{color: "#32a852"}} />:<Cancel color="action" /> }</TableCell>
                                        <TableCell align="center"><Button onClick={ () => { handleOpenDeleteDialog(student.user_id, student.reg_number) } } variant="contained" color="secondary" disableElevation style={{ fontWeight: 600, maxHeight: 30, }}>DELETE</Button></TableCell>
                                    </TableRow>
                                )) : (isStudentsLoading)? (
                                    <TableRow>
                                        <TableCell align="center" colSpan="5" ><CircularProgress variant="indeterminate" /></TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow>
                                        <TableCell align="center" colSpan="5" >No students registered.</TableCell>
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
                        count={students.length}
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
                        <Button type="submit" onClick={()=>{handleDelete(deleteUserID)}} color="secondary">
                            YES
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    );
}
 
export default RegisteredStudents;