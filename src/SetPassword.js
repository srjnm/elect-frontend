import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import axios from 'axios'
// eslint-disable-next-line
import { TextField, makeStyles, Button, CircularProgress, LinearProgress, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@material-ui/core'

const styles = makeStyles((theme) => ({
    root: {
        [theme.breakpoints.down('md')]: {
            height: "100%"
        },
        [theme.breakpoints.up('md')]: {
            height: "100vh",
        } 
    },
    rp: {
        width: theme.spacing(12),
        letterSpacing: 1.2,
    },
    field: {
    },
    image: {
        [theme.breakpoints.down('md')]: {
            minWidth: "200px",
            width: "35vh",
            padding: 25,
            marginTop: "2.5rem",
            marginBottom: "2.5rem",
        },
        [theme.breakpoints.up('md')]: {
            width: "80vh",
        }
    },
    cover: {
        [theme.breakpoints.down('xs')]: {
            backgroundColor: "#abdefb",
            //height: "40vh",
        },
        [theme.breakpoints.up('xs')]: {
            backgroundColor: "#abdefb",
        }
    },
    form: {
        [theme.breakpoints.up('md')]: {
            alignItems: "flex-end",
            marginBottom: "28vh",
        } 
    }
}))

const SetPassword = () => {
    const classes = styles()
    const history = useHistory()
    
    /*eslint-disable */
    const { token } = useParams()
    const [loaded, setLoaded] = useState(false)
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState(false)
    const [error, setError] = useState('')
    const [submitError, setSubmitError] = useState(false)
    const [submitIsLoading, setSubmitIsLoading] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    /*eslint-disable */

    const handleDialogClose = () => {
        setSubmitError(false)
        history.push("/")
    }

    const handleSuccessDialogClose = () => {
        setSubmitSuccess(false)
        history.push("/")
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setPasswordError(false)
        setSubmitError(false)

        if(password === '') {
            setPasswordError(true)
            return
        }

        setSubmitIsLoading(true)

        axios.post("/setpassword",
            {
                password: password,
                token: token,
            },
            {
                withCredentials: true,
            }
        ).then((res) => {
            if(res.status === 200) {
                setSubmitError(false)
                setSubmitSuccess(true)
            }
            setSubmitIsLoading(false)
        })
        .catch((err) => {
            console.log(err.response)
            if(err.response) {
                if(err.response.status === 400) {
                    setError(err.response.data.message)
                    setSubmitError(true)
                }
            }
            setSubmitIsLoading(false)
        })
    }

    useEffect(async () => {
        if(token === '') {
            history.push("/")
            return
        }

        const verify = async () => {
            await axios.post("/verifytoken/"+token,
                {},
                {
                    withCredentials: true,
                }
            ).then((res) => {
                if(res.status === 200) {
                    setLoaded(true)
                    setSubmitError(false)
                }
                else if(res.status === 400 || res.status === 401) {
                    setSubmitError(true)
                    setError(JSON.stringify(res.data.messsage))
                }
                setSubmitIsLoading(false)
            })
            .catch((err) => {
                console.log(err.response)
                if(err.response) {
                    if(err.response.status === 400) {
                        if(err.response.data.message === 'Reset Token Expired!') {
                            setError("Reset Time Expired!")
                            setLoaded(true)
                            setSubmitError(true)
                        } else {
                            history.push("/")
                        }
                    }
                }
                setSubmitIsLoading(false)
            })
        }

        verify()
    }, [])

    return (
        <div>
            {
                !loaded &&
                <div style={{height: "100%", padding: "48vh", paddingLeft: "46%"}}>
                    <CircularProgress variant="indeterminate" />
                </div>
            }
            {
                loaded &&
                <div>
                    <Grid container direction="column" className={classes.root}>
                        <Grid item xs="12" container>
                            <Grid item xs="12" md="8" className={classes.cover} justify="center" alignItems="center" container>
                                <img src="https://electstore.blob.core.windows.net/assets/LandingPageArt.png" className={classes.image} alt="Login" />
                            </Grid>
                            <Grid item xs="12" md="4" justify="center" container className={classes.form}>
                                <form noValidate autoComplete="off" onSubmit={ handleSubmit }>
                                    <Grid container direction="column" alignItems="center" spacing="2">
                                        <Grid item xs="12">
                                            <Typography color="primary" display="initial" style={{padding: "3vh", marginTop: "20%", lineHeight: "0vh", fontSize: "3.5rem", fontFamily: "Teko", letterSpacing: 0.6, textShadow: "0px 0px 4px rgba(96,183,233,0.3)"}}>
                                                ELECT
                                            </Typography>
                                        </Grid>
                                        <Grid item xs="12">
                                            <TextField
                                                onChange={ (e) => setPassword(e.target.value) }
                                                className={ classes.field }
                                                label="set password"
                                                variant="outlined"
                                                type="password"
                                                error={ passwordError }
                                            />
                                        </Grid>
                                        <Grid item xs="12">
                                            { submitIsLoading && <LinearProgress color="primary" style={{paddingRight: "4rem", paddingLeft: "4rem", paddingTop: "0.1rem", paddingBottom: "0.1rem", marginTop: "15px", marginBottom: "15px"}} /> }
                                            { !submitIsLoading &&
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary"
                                                    className={classes.rp}
                                                    disableElevation
                                                >
                                                    Submit
                                                </Button>
                                            }
                                        </Grid>
                                    </Grid>
                                </form>
                                {/* {submitError && <div style={{color: "red", marginTop: 20}}>Error: {error}</div>} */}
                                {/* <Container>
                                    <div style={{marginTop: 20}}>{ JSON.stringify(user) }</div>
                                </Container> */}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Dialog
                        open={submitError}
                        onClose={handleDialogClose}
                    >
                        <DialogTitle style={{minWidth: "15rem"}}>Failed to Set Password</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {error}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDialogClose} color="primary">
                                Okay
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        open={submitSuccess}
                        onClose={handleSuccessDialogClose}
                    >
                        <DialogTitle style={{minWidth: "15rem"}}>Set Password</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Account verified and password set successfully.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleSuccessDialogClose} color="primary">
                                Okay
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            }
        </div>
    );
}
 
export default SetPassword;