import { useState, useContext, useEffect } from "react"
import { useHistory } from "react-router"
import { AuthContext } from './Context/AuthContext'
import { Field, Form, Formik } from "formik";
import DateTimeInput from "./Components/FormDateTimeInput";
import * as Yup from 'yup';
import TextFieldInput from "./Components/FormTextInput";
import { Grid, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Checkbox, makeStyles, Typography, CircularProgress } from "@material-ui/core";
import Header from "./Components/Header";
import axios from 'axios'
import moment from "moment"
import { CloudDownload } from '@material-ui/icons'
import EditParticipants from "./Components/EditParticipants";
import EditCandidates from "./Components/EditCandidates";

const styles = makeStyles((theme) => ({
    paper: {
        padding: "2rem",
        margin: "2rem"
    },
    upload: {
        letterSpacing: 0.6,
        backgroundColor: "black",
        color: "white",
        "&:hover": {
            backgroundColor: "#292929"
        },
    },
    uploadComplete: {
        letterSpacing: 0.6,
        backgroundColor: "green",
        color: "white",
        "&:hover": {
            backgroundColor: "#32a852"
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

const EditElection = (props) => {
    const classes = styles()

    const history = useHistory()
    const { dispatch } = useContext(AuthContext)

    const [responseDialog, setResponseDialog] = useState(false)
    const [responseTitle, setResponseTitle] = useState('')
    const [response, setResponse] = useState('')
    const [election, setElection] = useState(null)
    const [loading, setLoading] = useState(true)
    const [participantsRespLoading, setParticipantsRespLoading] = useState(false)
    const [file, setFile] = useState(null)
    const [uploadComplete, setUploadComplete] = useState(false)
    const [addedParticipant, setAddedParticipant] = useState(false)

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

    // eslint-disable-next-line
    useEffect(async () => {
        if(props.location.state === "") {
            history.push("/")
        }

        await getElection()
    // eslint-disable-next-line
    }, [])

    const validationSchema = Yup.object({
        title: Yup
            .string(),
        starting_at: Yup
            .date()
            .min(new Date(), "election can't be started in the past"),
        ending_at: Yup
            .date()
            .min(Yup.ref('starting_at'), "election cannot end before starting"),
        locking_at: Yup
            .date()
            .min(new Date(), "election can't be locked in the past")
            .max(Yup.ref('starting_at'), "election cannot be locked after starting"),
        gender_specific: Yup
            .boolean(),
    })

    const handleEditElection = (values) => {
        setLoading(true)
        axios.put("https://e1ect.herokuapp.com/api/election",
            {
                election_id: props.location.state,
                title: values.title,
                starting_at: values.starting_at.toString(),
                ending_at: values.ending_at.toString(),
                locking_at: values.locking_at.toString(),
                gender_specific: values.gender_specific,
            },
            {
                withCredentials: true,
            }
        ).then((res) => {
            if(res.status === 200) {
                return true
            }
        }).then(async (data) => {
            await getElection()
        })
        .catch((err) => {
            if(typeof err !== "undefined") {
                if(err.response) {
                    console.log(err.response)
                    if(err.response.status === 400) {
                        setResponseTitle("Edit Election")
                        setResponse("Failed to edit election!")
                        setResponseDialog(true)
                        setLoading(false)
                    }
                }
            }
        })
    }

    const handleResponseDialogClose = () => {
        setResponseDialog(false)
    }

    const handleRegisterSubmit = (e) => {
        e.preventDefault()

        if(file === null) {
            setResponseTitle("Add Participants")
            setResponse("Empty file!")
            setParticipantsRespLoading(false)
            setResponseDialog(true)
            return
        }

        const formData = new FormData()
        formData.append('participants', file)

        setParticipantsRespLoading(true)

        axios.post("https://e1ect.herokuapp.com/api/participants/"+props.location.state,
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
            setResponseTitle("Add Participants")
            setResponse(data.message)
            setParticipantsRespLoading(false)
            setUploadComplete(false)
            setFile(null)
            setResponseDialog(true)
            setAddedParticipant(!addedParticipant)
        }).catch((error) => {
            if(typeof error !== 'undefined') {
                if(error.status === 400){
                    if(error.data.message){
                        setResponseTitle("Add Participants")
                        setResponse(error.data.message)
                        setParticipantsRespLoading(false)
                        setUploadComplete(false)
                        setFile(null)
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

    return ( 
        <div>
            <Header />
            <Grid container>
                <Grid item xs="12" md="5" align="center">
                    <Paper className={classes.paper} elevation="3" style={{height: (loading)?"65vh":""}}>
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
                        <Formik
                            initialValues={{
                                title: election.title,
                                starting_at: moment(election.starting_at, "YYYY-MM-DD HH:mm:ss ZZ z").toDate(),
                                ending_at: moment(election.ending_at, "YYYY-MM-DD HH:mm:ss ZZ z").toDate(),
                                locking_at: moment(election.locking_at, "YYYY-MM-DD HH:mm:ss ZZ z").toDate(),
                                gender_specific: (typeof election.gender_specific === 'undefined')?false:election.gender_specific,
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleEditElection}
                        >
                            <Form>
                                <Grid container spacing="3">
                                    <Grid item xs="12" align="center">
                                        <Typography variant="h5" style={{fontWeight: "bold"}}>
                                            EDIT ELECTION
                                        </Typography>
                                    </Grid>
                                    <Grid item xs="12">
                                        <TextFieldInput
                                            name="title"
                                            label="title"
                                            type="text"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs="12">
                                        <DateTimeInput 
                                            name="starting_at"
                                            label="starting at"
                                            inputVariant="outlined"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs="12">
                                        <DateTimeInput 
                                            name="ending_at"
                                            label="ending at"
                                            inputVariant="outlined"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs="12">
                                        <DateTimeInput 
                                            name="locking_at"
                                            label="locking at"
                                            inputVariant="outlined"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs="12" justify="center" style={{marginTop: "-1%"}}>
                                        <Grid item xs="12" container>
                                            <Grid item xs="6" sm="4">
                                                <Grid container>
                                                    <Grid item xs="12">
                                                        Gender Specific
                                                    </Grid>
                                                    <Grid item xs="12" style={{fontSize: 12}}>
                                                        (Default: unchecked, meant for Student Council Elections)
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs="1">
                                                <Field
                                                    name="gender_specific"
                                                    label="gender specific"
                                                    type="checkbox"
                                                    color="action"
                                                    as={Checkbox}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs="12">
                                        <Grid container spacing="4">
                                            <Grid item align="right" xs="6">
                                                <Button type="submit" variant="contained" disableElevation color="primary">
                                                    Edit
                                                </Button>
                                            </Grid>
                                            <Grid item align="left" xs="6">
                                                <Button type="reset" variant="outlined" color="action">
                                                    Reset
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Form>
                        </Formik>
                    }
                    </Paper>
                </Grid>
                <Grid item xs="12" md="7" align="center">
                    <EditCandidates electionId={props.location.state} />
                </Grid>
                <Grid item xs="12" align="center">
                    <EditParticipants electionId={props.location.state} addedParticipant={addedParticipant} />
                </Grid>
                <Grid item xs="12" align="center">
                    <div style={{maxWidth: "400px", minWidth: "400px"}}>
                        <Paper style={{paddingBottom: "1.2rem", paddingTop: "1.2rem"}}>
                            <form noValidate onSubmit={handleRegisterSubmit}>
                                <Grid container justify="center" alignItems="center" alignContent="center">
                                    <Grid item xs="7" sm="8" align="center">
                                        <Typography align="left" className={classes.uploadText}>UPLOAD THE EXCEL FILE TO ADD PARTICIPANTS</Typography>
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
                                    <Grid item xs="12" align="center" style={{paddingTop: "10px"}}>
                                        {
                                            (participantsRespLoading)?
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
                <Grid item xs="12" align="center">
                    <div style={{paddingLeft: 25, paddingRight: 25, paddingTop: 10, paddingBottom: 25, minWidth: "240px", maxWidth: "240px"}}>
                        <Paper>
                            <Typography style={{padding: "0.991rem", display: "inline"}}>Download Template</Typography>
                            <Button
                                disableElevation
                                color="primary"
                                variant="contained"
                                style={{borderBottomLeftRadius: 0, borderTopLeftRadius: 0}}
                                target="_blank"
                                href="https://electstore.blob.core.windows.net/assets/Elect-ParticipantsTemplate.xlsx"
                            >
                                <CloudDownload color="white"></CloudDownload>
                            </Button>
                        </Paper>
                    </div>
                </Grid>
            </Grid>
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
 
export default EditElection;