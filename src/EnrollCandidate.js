import { Grid, Paper, CircularProgress } from '@material-ui/core'
import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Header from './Components/Header';
import ViewCandidates from './Components/ViewCandidatesForStudents'
import { AuthContext } from './Context/AuthContext'
import { useState, useContext, useEffect } from "react"
import { useHistory } from "react-router"
import axios from 'axios'
import moment from "moment"

const useStyles = makeStyles((theme) => ({
    box: {
        [theme.breakpoints.down('md')]: {
            margin: '2rem',
            padding: '1rem',
            paddingLeft: "1.6rem",
            paddingRight: "1.6rem"
        },
        [theme.breakpoints.up('md')]: {
            margin:'4rem',
            marginTop: '3rem',
            padding:'2rem'
        },
    },
    content:{
        marginLeft: "1rem",
    },
    headings:{
        fontWeight:'120px',
        marginBottom: '10px',
        fontFamily: 'Helvetica',
    },
    btn:{
        color: 'white',
        fontWeight:'bold',
        marginLeft: "1rem"
    },
}));    


export default function EnrollCandidate(props) {

    const classes = useStyles();

    const history = useHistory()

    // eslint-disable-next-line
    const {user, dispatch } = useContext(AuthContext)

    const [election, setElection] = useState(null)
    const [loading, setLoading] = useState(true)
    const [update, setUpdate] = useState(false)

    const getElection = async () => {
        axios.get(
            "https://e1ect.herokuapp.com/api/election/"+props.location.state,
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
            setUpdate(!update)
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

        getElection()
    // eslint-disable-next-line
    }, [update])

    return (
        <div>
            <Header />
            <Paper className={classes.box}>
                {
                    (loading)?
                    <div style={{height: "100%",}}>
                        <Grid container alignItems="center" style={{height: "100%"}}>
                            <Grid item xs="12" align="center">
                                <CircularProgress variant="indeterminate" size={50} />
                            </Grid>
                        </Grid>
                    </div>
                    :
                    <Grid container>
                        <Grid item xs={12}>
                        
                            <h3 className={classes.headings}  >Title</h3>
                            <div className={classes.content}>
                                <Typography variant="body1" display="block" gutterBottom>
                                    {election.title}
                                </Typography>
                                <Typography variant="subtitle1">
                                    {(election.gender_specific)?" [Gender Specific]":""}
                                </Typography>
                            </div>
                            <h3 className={classes.headings}  >Starting Time</h3>
                            <Typography className={classes.content} variant="body1" display="block" gutterBottom>
                                { moment(election.starting_at, "YYYY-MM-DD HH:mm:ss ZZ z").format("ddd Do MMM, YYYY h:mm a").toString() }
                            </Typography>

                        
                            <h3 className={classes.headings}  >Ending time</h3>
                            <Typography className={classes.content} variant="body1" display="block" gutterBottom>
                                { moment(election.ending_at, "YYYY-MM-DD HH:mm:ss ZZ z").format("ddd Do MMM, YYYY h:mm a").toString() }
                            </Typography>

                            <h3 className={classes.headings}  >Lock-In Time</h3>
                            <Typography className={classes.content} variant="body1" display="block" gutterBottom>
                                { moment(election.locking_at, "YYYY-MM-DD HH:mm:ss ZZ z").format("ddd Do MMM, YYYY h:mm a").toString() }
                            </Typography>
                            <h3 className={classes.headings}  >Candidates</h3>
                            <ViewCandidates candidates={election.candidates} />
                            <br/>
                            <Button variant="contained" className={classes.btn} color="primary" disableElevation>
                            + ENROLL AS CANDIDATE
                            </Button>

                        </Grid>
                    </Grid>
                }
            </Paper>
        </div>
    )
}
