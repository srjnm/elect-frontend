import { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from './Context/AuthContext'
import { Button, Grid, makeStyles, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress } from '@material-ui/core'
import RegisteredStudents from './Components/RegisteredStudents'
import Header from './Components/Header'
import { CloudDownload } from '@material-ui/icons'
import CreateElectionDialog from './Components/CreateElection'
import AdminElections from './Components/AdminElectionList'

const styles = makeStyles((theme) => ({
    root: {

    },
    upload: {
        letterSpacing: 0.6,
        backgroundColor: "black",
        color: "white",
        "&:hover": {
            backgroundColor: "#292929"
        },
        [theme.breakpoints.up('sm')]: {
            marginRight: "-2rem"
        },
    },
    uploadComplete: {
        letterSpacing: 0.6,
        backgroundColor: "green",
        color: "white",
        "&:hover": {
            backgroundColor: "#32a852"
        },
        [theme.breakpoints.up('sm')]: {
            marginRight: "-2rem"
        },
    },
    uploadText: {
        fontWeight: "bold",
        [theme.breakpoints.down('md')]: {
            marginLeft: "1.0rem"
        },
        [theme.breakpoints.up('md')]: {
            marginLeft: "2.0rem"
        },
    },
}))

const Admin = () => {
    /*eslint-disable */
    const classes = styles()

    const { user, dispatch } = useContext(AuthContext)
    const history = useHistory()

    const [file, setFile] = useState(null)
    const [register, setRegister] = useState(false)
    const [registerRespLoading, setRegisterRespLoading] = useState(false)
    const [responseDialog, setResponseDialog] = useState(false)
    const [responseTitle, setResponseTitle] = useState('')
    const [response, setResponse] = useState('')
    const [uploadComplete, setUploadComplete] = useState(false)
    const [update, setUpdate] = useState(false)
    const [createElectionDialog, setCreateElectionDialog] = useState(false)
    /*eslint-disable */

    const customAxios = axios.create({
        withCredentials: true,
    })

    const refresh = async () => {
        await customAxios.post(
            "https://e1ect.herokuapp.com/refresh",
        ).then((resp) => {
            if(resp.status === 200){
                return !update 
            }
        }).then((updt) => {
            // console.log(update)
            // setUpdate(!update)
            // console.log(update)
        }).catch((er) => {
            console.log(er)
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
                    console.log(error.config)
                    setUpdate(!update)
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

    const handleRegisterSubmit = (e) => {
        e.preventDefault()

        if(file === null) {
            setResponseTitle("Register Students")
            setResponse("Empty file!")
            setRegisterRespLoading(false)
            setResponseDialog(true)
            return
        }

        const formData = new FormData()
        formData.append('register', file)

        setRegisterRespLoading(true)

        axios.post("https://e1ect.herokuapp.com/api/registerstudents",
            formData,
            {
                withCredentials: true,
                'Content-Type': 'multipart/form-data',
            },
        ).then((res) => {
            if(res.status === 200) {
                return res.data
            }
        }).then((data) => {
            setResponseTitle("Register Students")
            setResponse(data.message)
            setRegisterRespLoading(false)
            setUploadComplete(false)
            setFile(null)
            setUpdate(!update)
            setResponseDialog(true)
        }).catch((error) => {
            if(typeof error !== 'undefined') {
                if(error.status === 400){
                    if(error.data.message){
                        setResponseTitle("Resgister Students")
                        setResponse(error.data.message)
                        setRegisterRespLoading(false)
                        setUploadComplete(false)
                        setFile(null)
                        setUpdate(!update)
                        setResponseDialog(true)
                    }
                }
                else if(error.status === 511){
                    dispatch({
                        type: "LOGOUT_SUCCESS",
                    })
                    history.push("/")
                }
            }
        })
    }

    const onFileChange = (e) => {
        setFile(e.target.files[0])
        setUploadComplete(true)
    }

    const handleResponseDialogClose = () => {
        setResponseDialog(false)
    }

    return (
        <div>
            <Header register={register} setRegister={setRegister} />
            { (register)?
                <div style={{marginRight: "50px"}}>
                    <Grid container direction="column" alignItems="flex-start" className={classes.root}>
                        <Grid item xs="12">
                            <div style={{paddingLeft: 25, marginRight: -25, paddingTop: 25}}>
                                <Paper style={{paddingBottom: "1.2rem", paddingTop: "1.2rem"}}>
                                    <form noValidate onSubmit={handleRegisterSubmit}>
                                        <Grid container justify="center" alignItems="center" alignContent="center">
                                            <Grid item xs="7" sm="8" align="center">
                                                <Typography align="left" className={classes.uploadText}>UPLOAD THE EXCEL FILE TO REGISTER THE STUDENTS</Typography>
                                            </Grid>
                                            <Grid item xs="5" sm="4" align="center">
                                                <Button
                                                    variant="contained"
                                                    component="label"
                                                    color="action"
                                                    className={(uploadComplete)?classes.uploadComplete:classes.upload}
                                                    disableElevation
                                                >
                                                    UPLOAD
                                                    <input
                                                        type="file"
                                                        onChange={onFileChange}
                                                        accept=".xlsx"
                                                        required
                                                        hidden
                                                    />
                                                </Button>
                                            </Grid>
                                            <Grid item xs="12" align="center">
                                                {
                                                    (registerRespLoading)?
                                                        <CircularProgress variant="indeterminate" />
                                                    :
                                                        <Button
                                                            variant="outlined"
                                                            color="action"
                                                            disableElevation
                                                            type="submit"
                                                        >
                                                            SUBMIT
                                                        </Button>
                                                }
                                            </Grid>
                                        </Grid>
                                    </form>
                                </Paper>
                            </div>
                        </Grid>
                        <Grid item xs="12">
                            <div style={{paddingLeft: 25, paddingRight: 25, paddingTop: 10, paddingBottom: 25}}>
                                <Paper>
                                    <Typography style={{padding: "1rem", display: "inline"}}>Download Template</Typography>
                                    <Button
                                        disableElevation
                                        color="primary"
                                        variant="contained"
                                        style={{borderBottomLeftRadius: 0, borderTopLeftRadius: 0}}
                                        target="_blank"
                                        href="https://electstore.blob.core.windows.net/assets/ELECT-RegisterStudentsTemplate.xlsx"
                                    >
                                        <CloudDownload color="white"></CloudDownload>
                                    </Button>
                                </Paper>
                            </div>
                        </Grid>
                        <Grid item xs="12" alignItems="center">
                            <div style={{margin: "3rem"}}>
                                <RegisteredStudents render={update} />
                            </div>
                        </Grid>
                    </Grid>
                </div>
                :
                <div>
                    <Grid container className={classes.root}>
                        <Grid item xs="12">
                            <div style={{paddingLeft: "3rem"}}>
                                <Button
                                    color="primary"
                                    variant="outlined"
                                    onClick={()=>{setCreateElectionDialog(true)}}
                                    style={{backgroundColor: "white", marginTop: "1.5rem", width: "160px"}}
                                >
                                    Create Election
                                </Button>
                            </div>
                        </Grid>
                        <Grid item xs="12" align="center">
                            <div style={{margin: "3rem", marginTop: "1rem"}}>
                                <AdminElections render={update} />
                            </div>
                        </Grid>
                    </Grid>
                </div>
            }
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
            <CreateElectionDialog dialog={createElectionDialog} setDialog={setCreateElectionDialog} render={update} setRender={setUpdate} />
        </div>
    );
}
 
export default Admin;