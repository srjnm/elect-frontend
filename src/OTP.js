import { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
// eslint-disable-next-line
import { TextField, Container, makeStyles, Button, LinearProgress, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@material-ui/core'
import { AuthContext } from './Context/AuthContext'

const styles = makeStyles((theme) => ({
    root: {
        [theme.breakpoints.down('md')]: {
            height: "100%"
        },
        [theme.breakpoints.up('md')]: {
            height: "100vh",
        } 
    },
    otp: {
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

const OTP = () => {
    const classes = styles()

    const {user, dispatch} = useContext(AuthContext)
    const history = useHistory()
    
    /*eslint-disable */
    const [otp, setOtp] = useState('')
    const [error, setError] = useState('')
    const [otpError, setOtpError] = useState(false)
    const [submitError, setSubmitError] = useState(false)
    const [submitIsLoading, setSubmitIsLoading] = useState(false)
    /*eslint-disable */

    const handleDialogClose = () => {
        setSubmitError(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setOtpError(false)
        setSubmitError(false)

        if(user.email === '') {
            setError('Invalid user!')
            setSubmitError(true)
        }

        if(otp === '') {
            setOtpError(true)
            return
        }

        setSubmitIsLoading(true)

        axios.post("https://e1ect.herokuapp.com/otp",
            {
                email: user.email,
                otp: otp,
            },
            {
                withCredentials: true,
            }
        ).then((res) => {
            if(res.status === 200) {
                dispatch({
                    type: "OTP_SUCCESS",
                    user_id: res.data.user_id,
                    email: res.data.email,
                    role: res.data.role,
                })
                setSubmitError(false)
                history.push("/admin")
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
                    setError(JSON.stringify(err.response.data.message))
                    setSubmitError(true)
                }
            }
            setSubmitIsLoading(false)
        })
    }

    return (
        <div>
            <Grid container direction="column" className={classes.root}>
                <Grid item xs="12" container>
                    <Grid item xs="12" md="8" className={classes.cover} justify="center" alignItems="center" container>
                        <img src="https://electuploadstorage.blob.core.windows.net/assets/LandingPageArt.png" className={classes.image} alt="Login" />
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
                                        onChange={ (e) => setOtp(e.target.value) }
                                        className={ classes.field }
                                        label="otp"
                                        variant="outlined"
                                        error={ otpError }
                                    />
                                </Grid>
                                <Grid item xs="12">
                                    { submitIsLoading && <LinearProgress color="primary" style={{paddingRight: "4rem", paddingLeft: "4rem", paddingTop: "0.1rem", paddingBottom: "0.1rem"}} /> }
                                    { !submitIsLoading &&
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            className={classes.otp}
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
                <DialogTitle style={{minWidth: "15rem"}}>Failed to submit One Time Password</DialogTitle>
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
        </div>
    );
}
 
export default OTP;