import { Grid, CircularProgress, makeStyles, Paper } from "@material-ui/core";
import Header from "./Components/Header"
import { useHistory } from "react-router"
import { AuthContext } from './Context/AuthContext'
import { useContext } from "react";
import ResultBar from "./Components/ResultBar";
import { Typography } from "@material-ui/core";
import { useState } from "react";
import { useEffect } from "react";
import axios from 'axios'

const styles = makeStyles((theme) => ({
    paper: {
        // minHeight: "66vh",
        margin: "3rem",
        padding: "1rem",
        paddingTop: "1rem",
        paddingBottom: "3rem"
    },
    resultBar: {
        paddingTop: "15px",
        paddingBottom: "15px",
        borderRadius: "40px",
        boxShadow: "0px 0px 20px -7px rgba(0,0,0,0.25) inset",
        backgroundColor: "#ededed"
    },
}))

const Results = (props) => {
    const classes = styles()

    const history = useHistory()
    const { dispatch } = useContext(AuthContext)

    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(true)

    const getElectionResults = async () => {
        axios.get(
            "https://e1ect.herokuapp.com/api/results/"+props.location.state,
            {
                withCredentials: true,
            }
        ).then((res) => {
            if(res.status === 200) {
                return res.data
            }
        }).then((data) => {
            setResults(data)
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

    useEffect(() => {
        if(props.location.state === "") {
            history.push("/")
        }

        getElectionResults()
    // eslint-disable-next-line
    }, [])

    return (
        <div>
            <Header />
            <Paper className={classes.paper}>
                {
                    loading &&
                    <div style={{paddingLeft: "46%", paddingRight: "50%", paddingTop: "26.2vh", paddingBottom: "28vh"}}>
                        <CircularProgress variant="indeterminate" size={50} />
                    </div>
                }
                {
                    !loading &&
                    <Grid container style={{height: "100%"}} alignItems="center">
                        <Grid item xs="12" style={{marginTop: "30px", marginBottom: "50px"}}>
                            <Typography align="center" variant="h5" style={{fontWeight: "300"}}>
                                ELECTION RESULTS
                            </Typography>
                            <Typography align="center" variant="h4" style={{fontWeight: "700"}}>
                                {results.title}
                            </Typography>
                        </Grid>
                        <Grid item xs="12">
                            {
                                (!results.gender_specific && results.candidate_results)?<div>{results.candidate_results.map((candidate) => {
                                    return (
                                        <Grid item container spacing="4">
                                            <Grid item align="center" xs="3" style={{fontWeight:"bold", margin: "auto"}}>
                                                {candidate.name}
                                            </Grid>
                                            <Grid item align="center" xs="7">
                                                <ResultBar className={classes.resultBar} variant="determinate" value={Math.floor((candidate.votes/results.total_participants)*100)} />
                                            </Grid>
                                            <Grid item align="center" xs="2" style={{fontWeight: "bold", margin: "auto"}}>
                                                {candidate.votes}
                                            </Grid>
                                        </Grid>
                                    )
                                })}
                                {
                                    (results.total_participants !== 0 )?(
                                        <Grid item container style={{fontWeight: "900", marginTop: "3.5rem"}}>
                                            <Grid item xs="6" align="center">
                                                TOTAL VOTES: {results.total_votes}
                                            </Grid>
                                            <Grid item xs="6" align="center">
                                                TOTAL PARTICIPANTS: {results.total_participants}
                                            </Grid>
                                        </Grid>
                                    ):(<div />)
                                }
                                </div>
                                :
                                <div />
                            }
                            {
                                (results.gender_specific && (results.mcandidate_results || results.fcandidate_results || results.ocandidate_results))?<div>
                                    {
                                        (results.mcandidate_results && results.mcandidate_results.length !== 0)?
                                        <div>
                                            <Typography variant="h5">
                                                MALE CANDIDATES
                                            </Typography>
                                            {
                                                results.mcandidate_results.map((candidate) => {
                                                    return (
                                                        <Grid item container spacing="4">
                                                            <Grid item align="center" xs="3" style={{fontWeight:"bold", margin: "auto"}}>
                                                                {candidate.name}
                                                            </Grid>
                                                            <Grid item align="center" xs="7">
                                                                <ResultBar className={classes.resultBar} variant="determinate" value={Math.floor((candidate.votes/results.participants.length)*100)} />
                                                            </Grid>
                                                            <Grid item align="center" xs="2" style={{fontWeight: "bold", margin: "auto"}}>
                                                                {candidate.votes}
                                                            </Grid>
                                                        </Grid>
                                                    )
                                                })
                                            }
                                        </div>
                                        :
                                        <div />
                                    }
                                    {
                                        (results.mcandidate_results && results.mcandidate_results.length !== 0)?
                                        <div>
                                            <Typography variant="h5">
                                                FEMALE CANDIDATES
                                            </Typography>
                                            {
                                                results.fcandidate_results.map((candidate) => {
                                                    return (
                                                        <Grid item container spacing="4">
                                                            <Grid item align="center" xs="3" style={{fontWeight:"bold", margin: "auto"}}>
                                                                {candidate.name}
                                                            </Grid>
                                                            <Grid item align="center" xs="7">
                                                                <ResultBar className={classes.resultBar} variant="determinate" value={Math.floor((candidate.votes/results.participants.length)*100)} />
                                                            </Grid>
                                                            <Grid item align="center" xs="2" style={{fontWeight: "bold", margin: "auto"}}>
                                                                {candidate.votes}
                                                            </Grid>
                                                        </Grid>
                                                    )
                                                })
                                            }
                                        </div>
                                        :
                                        <div />
                                    }
                                    {
                                        (results.mcandidate_results && results.mcandidate_results.length !== 0)?
                                        <div>
                                            <Typography variant="h5">
                                                OTHER CANDIDATES
                                            </Typography>
                                            {
                                                results.ocandidate_results.map((candidate) => {
                                                    return (
                                                        <Grid item container spacing="4">
                                                            <Grid item align="center" xs="3" style={{fontWeight:"bold", margin: "auto"}}>
                                                                {candidate.name}
                                                            </Grid>
                                                            <Grid item align="center" xs="7">
                                                                <ResultBar className={classes.resultBar} variant="determinate" value={Math.floor((candidate.votes/results.participants.length)*100)} />
                                                            </Grid>
                                                            <Grid item align="center" xs="2" style={{fontWeight: "bold", margin: "auto"}}>
                                                                {candidate.votes}
                                                            </Grid>
                                                        </Grid>
                                                    )
                                                })
                                            }
                                        </div>
                                        :
                                        <div />
                                    }
                                </div>
                                :
                                <div />
                            }
                            {
                                (typeof(results.candidate_results) === "undefined" && typeof(results.mcandidate_results) === "undefined" && typeof(results.fcandidate_results) === "undefined" && typeof(results.ocandidate_results) === "undefined")?
                                <Grid item align="center" xs="12" style={{paddingTop: "19vh", paddingBottom: "19vh"}}>
                                    No candidates took part in the election!
                                </Grid>
                                :
                                <div />
                            }
                        </Grid>
                    </Grid>
                }
            </Paper>
        </div>
    );
}
 
export default Results;