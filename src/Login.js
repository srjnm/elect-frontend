import { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
// eslint-disable-next-line
import { TextField, Container, makeStyles, Button, Grid, Typography, Link, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, LinearProgress } from '@material-ui/core'
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
    login: {
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
            marginTop: "1rem",
            marginBottom: "1rem",
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
            marginBottom: "20vh",
        } 
    }
}))

const Login = (props) => {
    const classes = styles()

    // eslint-disable-next-line
    const { user, dispatch } = useContext(AuthContext)
    const history = useHistory()

    /*eslint-disable */
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [loginError, setLoginError] = useState(false)
    const [loginIsLoading, setLoginIsLoading] = useState(false)
    const [fPasswordDialog, setfPasswordDialogState] = useState(false)
    const [fEmail, setfEmail] = useState('')
    const [fEmailError, setfEmailError] = useState(false)
    const [fPasswordResponseIsLoading, setfPasswordResponseIsLoading] = useState(false)
    const [fPasswordResponse, setfPasswordResponse] = useState('')
    const [fPasswordResponseDialog, setfPasswordResponseDialogState] = useState(false)
    const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    /*eslint-disable */

    const handleSubmit = (e) => {
        e.preventDefault()
        setEmailError(false)
        setPasswordError(false)

        if(email === '') {
            setEmailError(true)
        }

        if(password === '') {
            setPasswordError(true)
        }

        if(!emailRegex.test(email)) {
            setEmailError(true)
            return
        }

        if(emailError || passwordError) {
            return
        }

        setLoginIsLoading(true)

        axios.post("/login",
            {
                email: email,
                password: password,
            },
            {
                withCredentials: true,
            }
        ).then((res) => {
            if(res.status === 200) {
                dispatch({
                    type: "LOGIN_SUCCESS",
                    email: res.data.email,
                })
                setLoginError(false)
                history.push("/otp")
            }
            else if(res.status === 400 || res.status === 401) {
                setLoginError(true)
                setError(JSON.stringify(res.data.messsage))
            }
            setLoginIsLoading(false)
        })
        .catch((err) => {
            if(err) {
                if(err.response) {
                    if(err.response.status === 400) {
                        setError(err.response.data.message)
                        setLoginError(true)
                    }
                }
            }
            setLoginIsLoading(false)
        })
    }

    const requestForgotPassword = () => {
        setfEmailError(false)

        if(fEmail === "") {
            setfEmailError(true)
            return
        }

        if(!emailRegex.test(fEmail)) {
            setfEmailError(true)
            return
        }

        setfPasswordResponseIsLoading(true)

        axios.post("/createresettoken",
            {
                email: fEmail,
            },
            {
                withCredentials: true,
            }
        ).then((res) => {
            if(res.status === 200) {
                return res.data
            }
        }).then((data) => {
            setfPasswordResponse("Email to reset password has been sent to "+fEmail)
            setfPasswordResponseDialogState(true)
            setfPasswordDialogState(false)
            setfPasswordResponseIsLoading(false)
        })
        .catch((err) => {
            //console.log(err.response)
            if(err.response) {
                if(err.response.status === 400) {
                    setfPasswordResponse(JSON.stringify(err.response.data.message))
                    setfPasswordResponseDialogState(true)
                }
            }
            setfPasswordResponseIsLoading(false)
        })
    }

    const handleForgotPassword = (e) => {
        e.preventDefault()
        setfPasswordDialogState(true)
    }

    const handleErrorDialogClose = () => {
        setLoginError(false)
    }

    const handlefPasswordDialogClose = () => {
        setfEmailError(false)
        setfPasswordDialogState(false)
    }

    const handlefPasswordResponseDialogClose = () => {
        setfPasswordResponseDialogState(false)
    }

    return (
        <div>
            <Grid container direction="column" className={classes.root}>
                <Grid item xs="12" container>
                    <Grid item xs="12" md="8" className={classes.cover} justify="center" alignItems="center" container>
                        <img src="https://electstore.blob.core.windows.net/assets/LandingPageArt.png" className={classes.image} alt="Login" />
                    </Grid>
                    <Grid item xs="12" md="4" justify="center" container className={classes.form}>
                        <form noValidate onSubmit={ handleSubmit }>
                            <Grid container direction="column" alignItems="center" spacing="2">
                                <Grid item xs="12">
                                    <Typography color="primary" display="initial" style={{padding: "3vh", marginTop: "20%", lineHeight: "0vh", fontSize: "3.5rem", fontFamily: "Teko", letterSpacing: 0.6, textShadow: "0px 0px 4px rgba(96,183,233,0.3)"}}>
                                        ELECT
                                    </Typography>
                                </Grid>
                                <Grid item xs="12">
                                    <TextField
                                        onChange={ (e) => setEmail(e.target.value) }
                                        type="email"
                                        label="email"
                                        variant="outlined"
                                        error={ emailError }
                                    />
                                </Grid>
                                <Grid item xs="12">
                                    <TextField
                                        onChange={ (e) => setPassword(e.target.value) }
                                        label="password"
                                        type="password"
                                        variant="outlined"
                                        error={ passwordError }
                                    />
                                </Grid>
                                <Grid item xs="12">
                                    { loginIsLoading && <LinearProgress color="primary" style={{paddingRight: "4rem", paddingLeft: "4rem", paddingTop: "0.1rem", paddingBottom: "0.1rem", marginTop: "15px", marginBottom: "15px"}} /> }
                                    { !loginIsLoading &&
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            className={classes.login}
                                            disableElevation
                                        >
                                            Login
                                        </Button>
                                    }
                                </Grid>
                                <Grid item xs="12">
                                    <Link href="" color="primary" onClick={ handleForgotPassword } style={{fontSize: "0.9rem"}}>
                                        Forgot password?
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                        {/* {loginError && <div style={{color: "red", marginTop: 20}}>Error: {error}</div>} */}
                        {/* <Container>
                            <div style={{marginTop: 20}}>{ JSON.stringify(user) }</div>
                        </Container> */}
                    </Grid>
                </Grid>
            </Grid>
            <Dialog
                open={loginError}
                onClose={handleErrorDialogClose}
            >
                <DialogTitle style={{minWidth: "15rem"}}>Failed to Login</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {error}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleErrorDialogClose} color="primary">
                        Okay
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={fPasswordDialog}
                onClose={handlefPasswordDialogClose}
            >
                <DialogTitle style={{minWidth: "15rem"}}>Enter your registered email</DialogTitle>
                <DialogContent>
                    <TextField
                        onChange={ (e) => setfEmail(e.target.value) }
                        label="email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        error={ fEmailError }
                    />
                </DialogContent>
                <DialogActions style={fPasswordResponseIsLoading ? {justifyContent: "center"}:null}>
                    { fPasswordResponseIsLoading && <LinearProgress color="primary" style={{paddingRight: "4rem", paddingLeft: "4rem", paddingTop: "0.1rem", paddingBottom: "0.1rem", marginBottom: "0.6rem"}} />}
                    {
                      !fPasswordResponseIsLoading &&
                        <div>
                            <Button onClick={handlefPasswordDialogClose} color="grey">
                                Cancel
                            </Button>
                            <Button type="submit" onClick={requestForgotPassword} color="primary">
                                Submit
                            </Button>
                        </div>
                    }
                </DialogActions>
            </Dialog>
            <Dialog
                open={fPasswordResponseDialog}
                onClose={handlefPasswordResponseDialogClose}
            >
                <DialogTitle style={{minWidth: "15rem"}}>Forgot Password</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {fPasswordResponse}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handlefPasswordResponseDialogClose} color="primary">
                        Okay
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
 
export default Login;