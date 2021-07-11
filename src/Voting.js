import { Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, LinearProgress, Typography, Radio, RadioGroup, FormControl, FormControlLabel, Button, makeStyles, Grid } from "@material-ui/core"
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import Header from "./Components/Header"
import { useState, useContext, useEffect } from "react"
import { useHistory } from "react-router"
import { AuthContext } from './Context/AuthContext'
import axios from 'axios'
import { Send } from "@material-ui/icons"
import moment from "moment"

const styles = makeStyles((theme) => ({
    paper: {
        padding: "3rem",
        [theme.breakpoints.down('md')]: {
            marginTop: "1.5rem",
            marginBottom: "2rem",
            marginLeft: "1rem",
            marginRight: "1rem",
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
        marginTop: "2rem"
    }
}))

const Voting = (props) => {
    const classes = styles()

    const history = useHistory()
    // eslint-disable-next-line
    const currentDate = new Date()
    const { dispatch } = useContext(AuthContext)
    const [responseDialog, setResponseDialog] = useState(false)
    const [responseTitle, setResponseTitle] = useState('')
    const [response, setResponse] = useState('')
    const [responseIsLoading, setResponseIsLoading] = useState(false)

    useEffect(() => {
        if(typeof(props.location.state) === "undefined") {
            history.push("/")
        }

        if(moment(props.location.state.ending_at, "YYYY-MM-DD HH:mm:ss ZZ z").toDate() < currentDate) {
            history.push("/")
        }
    // eslint-disable-next-line
    }, [])

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
            //console.log(er)
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
                    //console.log(error.config)
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

    const validationSchema = Yup.object({
        candidate: Yup
            .string()
            .required("cannot be empty")
    })

    const handleProceed = (values) => {
        setResponseIsLoading(true)
        axios.post("/api/vote",
            {
                election_id: props.location.state.election_id,
                candidate_id: values.candidate,
            },
            {
                withCredentials: true,
            }
        ).then((res) => {
            if(res.status === 200) {
                setResponseTitle("Cast Vote")
                setResponse("Voting complete!")
                setResponseIsLoading(false)
                setResponseDialog(true)
            }
        })
        .catch((err) => {
            if(typeof err !== "undefined") {
                if(err.response) {
                    //console.log(err.response)
                    if(err.response.status === 400) {
                        setResponseTitle("Cast Vote")
                        setResponse("Failed to cast the vote!")
                        setResponseIsLoading(false)
                        setResponseDialog(true)
                    }
                }
            }
        })
    }

    const handleResponseDialogClose = () => {
        setResponseDialog(false)
        history.push("/student")
    }

    return (
        <div>
            <Header />
            <Paper className={classes.paper}>
                <Grid container spacing="4">
                    <Grid item xs="12" align="center">
                        <Typography style={{fontSize: "18px", fontWeight: 300}}>
                            ELECTION
                        </Typography>
                        <Typography variant="h4" style={{fontWeight: "bold"}}>
                            {(props.location.state)?props.location.state.title:""}
                        </Typography>
                        <Typography variant="subtitle1">
                            {(props.location.state)?(props.location.state.gender_specific)?" [Gender Specific]":"":""}
                        </Typography>
                    </Grid>
                    <Grid item xs="12" align="center">
                        <Typography style={{fontSize: "18px", fontWeight: 300}}>
                            CAST YOUR VOTE
                        </Typography>
                    </Grid>
                    <Grid item xs="12" align="center" style={{marginTop: "-1rem", marginBottom: "1rem"}}>
                        <Formik
                            initialValues={{
                                candidate: "",
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleProceed}
                        >
                            {({ values, setFieldValue }) => (
                                <Form>
                                    <FormControl component="fieldset">
                                        <RadioGroup
                                            name="candidate" 
                                            value={values.candidate} 
                                            onChange={(event) => {
                                                if(values.candidate === event.currentTarget.value) {
                                                    setFieldValue("candidate", "")
                                                } else {
                                                    setFieldValue("candidate", event.currentTarget.value)
                                                }
                                            }}
                                        >
                                            <Grid item container justify="center">
                                            {
                                                (props.location.state)?
                                                props.location.state.candidates.map((candidate) => (
                                                    <Grid item xs="12" align="center">
                                                        <Button fullWidth variant="outlined" style={{textTransform: "none", width: "60vw", backgroundColor: "#f4f4f4", fontSize: 22, fontWeight: 500}} onClick={()=>{
                                                            if(values.candidate === candidate.candidate_id) {
                                                                setFieldValue("candidate", "")
                                                            } else {
                                                                setFieldValue("candidate", candidate.candidate_id)}
                                                            }}
                                                        >
                                                            <FormControlLabel
                                                                value={candidate.candidate_id}
                                                                control={
                                                                    <Radio disableRipple disableTouchRipple color="primary" />
                                                                }
                                                                style={{margin: 0}}
                                                            />
                                                            {candidate.first_name+" "+candidate.last_name+", "+candidate.register_no}
                                                        </Button>
                                                    </Grid>
                                                ))
                                                :
                                                <div />
                                            }
                                            </Grid>
                                        </RadioGroup>
                                    </FormControl>
                                    <Grid item xs="12" align="center">
                                        {
                                            (responseIsLoading)?
                                            <LinearProgress color="primary" style={{marginTop: "3rem", marginBottom: "1.2rem", width: "4rem", paddingRight: "2rem", paddingLeft: "2.3rem", marginRight: "0.5rem", paddingTop: "0.1rem", paddingBottom: "0.1rem"}} />
                                            :
                                            <Button type="submit" className={classes.proceed}><span style={{fontSize: 16, marginLeft: "0.4rem", marginRight: "0.8rem", marginTop: "2px"}}>PROCEED</span><Send style={{fontSize: 18}} color="white" /></Button>
                                        }
                                    </Grid>
                                </Form>
                            )}
                        </Formik>
                    </Grid>
                </Grid>
            </Paper>
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
 
export default Voting;