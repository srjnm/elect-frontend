import { CircularProgress, Grid, makeStyles, Paper, Typography } from "@material-ui/core"
import { useState, useContext, useEffect } from "react"
import { useHistory } from "react-router"
import { AuthContext } from './Context/AuthContext'
import Header from "./Components/Header"
import axios from 'axios'
import moment from "moment"
import ViewParticipants from "./Components/ViewParticipants"
import ViewCandidatesForStudents from "./Components/ViewCandidatesForStudents"
import ViewCandidates from "./Components/ViewCandidates"

const styles = makeStyles((theme) => ({
    paper: {
        height: "100%",
        paddingTop: "2.5rem",
        paddingBottom: "3.5rem",
        [theme.breakpoints.down('md')]: {
            paddingLeft: "2rem",
            paddingRight: "2rem",
        },
        [theme.breakpoints.up('md')]: {
            paddingLeft: "5rem",
            paddingRight: "5rem",
        },
    },
    mainDiv: {
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
        //height: "65vh",
    },
    field: {
        //paddingTop: "1.5rem",
    },
}))

const ViewElection = (props) => {
    const classes = styles()

    const history = useHistory()
    const {user, dispatch } = useContext(AuthContext)

    const [election, setElection] = useState(null)
    const [loading, setLoading] = useState(true)

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
        if(props.location.state === "") {
            history.push("/")
        }

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
    // eslint-disable-next-line
    }, [])

    return (
        <div>
            <Header />
            <div className={classes.mainDiv}>
                <Paper className={classes.paper} style={{height: (loading)?"65vh":""}}>
                { 
                    loading && <div style={{height: "100%",}}>
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
                            <Typography variant="h4" style={{fontWeight: "bold"}}>
                                {election.title}
                            </Typography>
                            <Typography variant="subtitle1">
                                {(election.gender_specific)?" [Gender Specific]":""}
                            </Typography>
                        </Grid>
                        <Grid item xs="12" align="center" className={classes.field}>
                            <Typography variant="h6" style={{fontWeight: "bold"}}>
                                Locking At
                            </Typography>
                            <div>
                                { moment(election.locking_at, "YYYY-MM-DD HH:mm:ss ZZ z").format("ddd Do MMM, YYYY h:mm a").toString() }
                            </div>
                        </Grid>
                        <Grid item xs="6" className={classes.field}>
                            <Typography variant="h6" style={{fontWeight: "bold"}}>
                                Starting At
                            </Typography>
                            <div>
                                { moment(election.starting_at, "YYYY-MM-DD HH:mm:ss ZZ z").format("ddd Do MMM, YYYY h:mm a").toString() }
                            </div>
                        </Grid>
                        <Grid item xs="6" align="right" className={classes.field}>
                            <Typography variant="h6" style={{fontWeight: "bold"}}>
                                Ending At
                            </Typography>
                            <div>
                                { moment(election.ending_at, "YYYY-MM-DD HH:mm:ss ZZ z").format("ddd Do MMM, YYYY h:mm a").toString() }
                            </div>
                        </Grid>
                        {
                            (user.role === "0")?
                            <Grid item xs="12" align="center">
                                <ViewCandidatesForStudents candidates={election.candidates} />
                            </Grid>
                            :
                            <Grid item container spacing="4">
                                <Grid item xs="12" lg="4" align="center">
                                    <ViewParticipants participants={election.participants} />
                                </Grid>
                                <Grid item xs="12" lg="8" align="center">
                                    <ViewCandidates candidates={election.candidates} />
                                </Grid>
                            </Grid>
                        }
                        
                    </Grid>
                }
                </Paper>
            </div>
        </div>
    );
}
 
export default ViewElection