import { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from './Context/AuthContext'
import { Button, Grid, makeStyles, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core'
import Header from './Components/Header'
import StudentElections from './Components/StudentElectionList'

const styles = makeStyles((theme) => ({
    root: {
        [theme.breakpoints.down('md')]: {
            paddingLeft: "3vw",
        },
        [theme.breakpoints.up('md')]: {
            paddingLeft: "10vw",
        },
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

const Student = () => {
    /*eslint-disable */
    const classes = styles()

    const { user, dispatch } = useContext(AuthContext)
    const history = useHistory()

    const [responseDialog, setResponseDialog] = useState(false)
    const [responseTitle, setResponseTitle] = useState('')
    const [response, setResponse] = useState('')
    const [update, setUpdate] = useState(false)
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

    const handleResponseDialogClose = () => {
        setResponseDialog(false)
    }

    return (
        <div>
            <Header />
            {   <div>
                    <Grid container direction="column" alignItems="flex-start" className={classes.root}>
                        <Grid item xs="12" style={{paddingRight: "7vw", marginTop: "3rem"}}>
                            <StudentElections render={update} />
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
        </div>
    );
}
 
export default Student;