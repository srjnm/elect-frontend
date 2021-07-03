import Header from "./Components/Header"
import axios from 'axios'
import moment from "moment"
import { CircularProgress, Grid, makeStyles, Paper, Typography, Button, Card, CardActionArea, CardMedia, CardContent, Dialog, DialogActions, DialogTitle,DialogContent, createMuiTheme } from "@material-ui/core"
import { useState, useContext, useEffect } from "react"
import { useHistory } from "react-router"
import { AuthContext } from './Context/AuthContext'
import { Send } from "@material-ui/icons"
import { MuiThemeProvider } from "@material-ui/core/styles";

const styles = makeStyles((theme) => ({
    paper: {
        padding: "3rem",
        [theme.breakpoints.down('md')]: {
            marginTop: "3rem",
            marginBottom: "4rem",
            marginLeft: "2rem",
            marginRight: "2rem",
        },
        [theme.breakpoints.up('md')]: {
            marginTop: "3rem",
            marginBottom: "4rem",
            marginLeft: "5rem",
            marginRight: "5rem",
        },
    },
    proceed: {
        color: "white",
        backgroundColor: "#32a852",
        "&:hover": {
            backgroundColor: "#2e994b"
        },
        fontWeight: 900,
    }
}))

const theme = createMuiTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1500,
      },
    },
    palette: {
        primary: {
            main: '#60b7e9',
            contrastText: '#ffffff'
        },
    },
})

const VotingPreview = (props) => {
    const classes = styles()

    const history = useHistory()
    // eslint-disable-next-line
    const {user, dispatch } = useContext(AuthContext)
    const currentDate = new Date()

    const [election, setElection] = useState(null)
    const [loading, setLoading] = useState(true)
    const [imageDialog, setImageDialog] = useState(false)
    const [dialogTitle, setDialogTitle] = useState('')
    const [imgUrl, setImgUrl] = useState('')

    const handleImageDialogClose = () => {
        setImageDialog(false)
    }

    const openImageDialog = (url, title) => {
        setImgUrl(url)
        setDialogTitle(title)
        setImageDialog(true)
    }

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

    useEffect(() => {
        const getElection = async () => {
            axios.get(
                "/api/election/"+props.location.state,
                {
                    withCredentials: true,
                }
            ).then((res) => {
                if(res.status === 200) {
                    return res.data
                }
            }).then((data) => {
                setElection(data)
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
        getElection()

        if(election) {
            if(moment(election.ending_at, "YYYY-MM-DD HH:mm:ss ZZ z").toDate() < currentDate) {
                history.push("/")
            }
        }
    // eslint-disable-next-line
    }, [])

    const handleProceed = () => {
        history.push(
            {
                pathname: "/vote",
                state: election,
            }
        )
    }

    return (
        <div>
            <Header />
            <Paper className={classes.paper}>
                { 
                    loading && <div style={{height: "60vh",}}>
                        <Grid container alignItems="center" style={{height: "100%"}}>
                            <Grid item xs="12" align="center">
                                <CircularProgress variant="indeterminate" size={50} />
                            </Grid>
                        </Grid>
                    </div>
                }
                {
                    !loading &&
                    <Grid container spacing="4">
                        <Grid item xs="12" align="center">
                            <Typography style={{fontSize: "18px", fontWeight: 300}}>
                                ELECTION
                            </Typography>
                            <Typography variant="h4" style={{fontWeight: "bold"}}>
                                {election.title}
                            </Typography>
                            <Typography variant="subtitle1">
                                {(election.gender_specific)?" [Gender Specific]":""}
                            </Typography>
                        </Grid>
                        <Grid item xs="6" className={classes.field}>
                            <Typography style={{fontWeight: 300}}>
                                STARTING TIME
                            </Typography>
                            <div style={{fontWeight: "bold"}}>
                                { moment(election.starting_at, "YYYY-MM-DD HH:mm:ss ZZ z").format("ddd Do MMM, YYYY h:mm a").toString() }
                            </div>
                        </Grid>
                        <Grid item xs="6" align="right" className={classes.field}>
                            <Typography style={{fontWeight: 300}}>
                                ENDING TIME
                            </Typography>
                            <div style={{fontWeight: "bold"}}>
                                { moment(election.ending_at, "YYYY-MM-DD HH:mm:ss ZZ z").format("ddd Do MMM, YYYY h:mm a").toString() }
                            </div>
                        </Grid>
                        <Grid item xs="12" align="center">
                            {
                                (typeof(election.candidates) === "undefined")?
                                <div style={{height: "18vh", paddingTop: "18vh", fontWeight: 700, color: "#f25050"}}>
                                    ELECTION WAS CLOSED BECAUSE THERE WERE NO CANDIDATES!
                                </div>
                                :
                                <div>
                                    <Grid item container>
                                        <Grid item xs="12" align="center">
                                            <Typography style={{fontWeight: 900, fontSize: 20}}>
                                                CANDIDATES
                                            </Typography>
                                        </Grid>
                                        <Grid item xs="12" align="center" style={{padding: "1rem", paddingLeft: "2rem", paddingRight: "2rem"}}>
                                            <MuiThemeProvider theme={theme}>
                                                <Grid item container spacing="4" justify="center">
                                                    {
                                                        election.candidates.map((candidate) => (
                                                            <Grid item xs="12" sm="6" md="4" lg="3" xl="2">
                                                                <Card style={{height: "18rem", width: "11rem"}}>
                                                                    <CardActionArea>
                                                                        <CardMedia
                                                                            component="img"
                                                                            style={{height: "170px", objectFit:"scale-down"}}
                                                                            title={candidate.first_name}
                                                                            image={candidate.display_picture}
                                                                        />
                                                                    </CardActionArea>
                                                                    <CardContent>
                                                                        <Typography style={{fontSize: 18, fontWeight: 700, marginTop: "-0.7rem"}}>
                                                                            {candidate.first_name.toUpperCase()+" "+candidate.last_name.toUpperCase()}
                                                                        </Typography>
                                                                        <Typography style={{fontSize: 16, fontWeight: 300, marginTop: "-0.4rem", marginBottom: "0.5rem"}}>
                                                                            {candidate.register_no}
                                                                        </Typography>
                                                                        <Button color="primary" variant="contained" style={{fontWeight: 700}} onClick={() => {openImageDialog(candidate.poster, candidate.first_name+" "+candidate.last_name+"'s Poster")}} disableElevation>VIEW POSTER</Button>
                                                                    </CardContent>
                                                                </Card>
                                                            </Grid>
                                                        ))
                                                    }
                                                </Grid>
                                            </MuiThemeProvider>
                                        </Grid>
                                        <Grid item xs="12" align="center">
                                            <Button onClick={()=>{handleProceed()}} className={classes.proceed}><span style={{fontSize: 17, marginLeft: "0.4rem", marginRight: "0.8rem", marginTop: "2px"}}>PROCEED TO VOTE</span><Send style={{fontSize: 18}} color="white" /></Button>
                                        </Grid>
                                    </Grid>
                                </div>
                            }
                        </Grid>
                    </Grid>
                }
            </Paper>
            <Dialog
                open={imageDialog}
                onClose={handleImageDialogClose}
            >
                <DialogTitle style={{minWidth: "15rem"}}>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <img src={imgUrl} style={{width: "100%", maxHeight: "70vh"}} alt={dialogTitle} />
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
 
export default VotingPreview;