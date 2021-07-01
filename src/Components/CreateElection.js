import { Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Checkbox, LinearProgress } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import DateTimeInput from "./FormDateTimeInput";
import * as Yup from 'yup';
import TextFieldInput from "./FormTextInput";
import axios from 'axios'

const CreateElectionDialog = (props) => {
    /*eslint-disable */
    const [responseDialog, setResponseDialog] = useState(false)
    const [responseTitle, setResponseTitle] = useState('')
    const [response, setResponse] = useState('')
    const [responseIsLoading, setResponseIsLoading] = useState(false)
    /*eslint-disable */

    const validationSchema = Yup.object({
        title: Yup
            .string()
            .required("this is a required field"),
        starting_at: Yup
            .date()
            .min(new Date(), "election can't be started in the past")
            .required("this is a required field"),
        ending_at: Yup
            .date()
            .min(Yup.ref('starting_at'), "election cannot end before starting")
            .required("this is a required field"),
        locking_at: Yup
            .date()
            .min(new Date(), "election can't be locked in the past")
            .max(Yup.ref('starting_at'), "election cannot be locked after starting")
            .required("this is a required field"),
        gender_specific: Yup
            .boolean()
            .required("this is a required field"),
    })

    const handleCreateElection = (values) => {
        setResponseIsLoading(true)
        axios.post("https://e1ect.herokuapp.com/api/election",
            {
                title: values.title,
                starting_at: values.starting_at.toString(),
                ending_at: values.ending_at.toString(),
                locking_at: values.locking_at.toString(),
                gender_specific: values.gender_specific
            },
            {
                withCredentials: true,
            }
        ).then((res) => {
            if(res.status === 200) {
                setResponseTitle("Create Election")
                setResponse("Election created successfully.")
                props.setRender(!props.render)
                props.setDialog(false)
                setResponseIsLoading(false)
                setResponseDialog(true)
            }
        })
        .catch((err) => {
            if(typeof err !== "undefined") {
                if(err.response) {
                    console.log(err.response)
                    if(err.response.status === 400) {
                        setResponseTitle("Create Election")
                        setResponse("Failed to create election!")
                        props.setRender(!props.render)
                        props.setDialog(false)
                        setResponseIsLoading(false)
                        setResponseDialog(true)
                    }
                }
            }
        })
    }

    const closeCreateElectionDialog = () => {
        props.setDialog(false)
    }

    const handleResponseDialogClose = () => {
        setResponseDialog(false)
    }

    return (
        <div>
            <Dialog
                open={props.dialog}
                onClose={closeCreateElectionDialog}
            >
                <DialogTitle style={{minWidth: "15rem", marginBottom: "-3%", fontWeight: "bold"}}>Create Election</DialogTitle>
                <Formik
                    initialValues={{
                        title: "",
                        starting_at: new Date(),
                        ending_at: new Date(),
                        locking_at: new Date(),
                        gender_specific: false,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleCreateElection}
                >
                    <Form>
                        <DialogContent style={{paddingTop: "1rem", paddingBottom: "1rem", paddingLeft: "5%", paddingRight: "5%", width: "89.5%"}}>
                            <Grid container spacing="3">
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
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeCreateElectionDialog} color="action">
                                Cancel
                            </Button>
                            { responseIsLoading && <LinearProgress color="primary" style={{paddingRight: "2rem", paddingLeft: "2.3rem", marginRight: "0.5rem", paddingTop: "0.1rem", paddingBottom: "0.1rem", marginBottom: "0.1rem"}} />}
                            { !responseIsLoading &&
                              <Button type="submit" color="primary">
                                Submit
                              </Button>
                            }
                        </DialogActions>
                    </Form>
                </Formik>
            </Dialog>
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
 
export default CreateElectionDialog;