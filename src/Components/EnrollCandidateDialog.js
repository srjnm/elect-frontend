import { Dialog, DialogContent, makeStyles, LinearProgress, Grid, Radio, RadioGroup, DialogTitle, DialogContentText, DialogActions, Button, FormControl, FormControlLabel } from '@material-ui/core';
import * as Yup from 'yup';
import { Form, Formik } from "formik";
import { useState } from 'react';
import axios from 'axios'

const styles = makeStyles((theme) => ({
    upload: {
        letterSpacing: 0.6,
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

const EnrollCandidateDialog = (props) => {
    const classes = styles()

    const [responseDialog, setResponseDialog] = useState(false)
    const [responseTitle, setResponseTitle] = useState('')
    const [response, setResponse] = useState('')
    const [responseIsLoading, setResponseIsLoading] = useState(false)

    const [dpUploadComplete, setDpUploadComplete] = useState(false)
    const [posterUploadComplete, setPosterUploadComplete] = useState(false)
    const [idUploadComplete, setIdUploadComplete] = useState(false)

    const validationSchema = Yup.object({
        election_id: Yup
            .string(),
        sex: Yup
            .number()
            .min(0, "invalid")
            .max(2, "invalid")
            .required("sex field is required"),
        display_picture: Yup
            .mixed()
            .required("display picture is required")
            // .test("req", "display picture is required", (value) => {
            //     return value && typeof(value) !== "undefined"
            // })
            .test("fileType", "supported file types are jpg, jpeg and png", (value) => {
                return value && (value.type === "image/jpeg" || value.type === "image/png")
            })
            .test("fileSize", "the size limit is 10MB", (value) => {
                return value && value.size <= 10000000
            }),
        poster: Yup
            .mixed()
            .required("poster is required")
            // .test("req", "poster is required", (value) => {
            //     return value && typeof(value) !== "undefined"
            // })
            .test("fileType", "supported file types are jpg, jpeg and png", (value) => {
                return value && (value.type === "image/jpeg" || value.type === "image/png")
            })
            .test("fileSize", "the size limit is 10MB", (value) => {
                return value && value.size <= 10000000
            }),
        id_proof: Yup
            .mixed()
            .required("id proof is required")
            // .test("req", "id proof is required", (value) => {
            //     return value && typeof(value) !== "undefined"
            // })
            .test("fileType", "supported file types are jpg, jpeg and png", (value) => {
                return value && (value.type === "image/jpeg" || value.type === "image/png")
            })
            .test("fileSize", "the size limit is 10MB", (value) => {
                return value && value.size <= 10000000
            }),
    })

    const handleEnrollAsCandidate = (values) => {
        setResponseIsLoading(true)

        console.log(values)
        const formData = new FormData()
        formData.append("election_id", values.election_id)
        formData.append("sex", values.sex)
        formData.append("display_picture", values.display_picture)
        formData.append("poster", values.poster)
        formData.append("id_proof", values.id_proof)

        axios.post("/api/candidate",
            formData,
            {
                withCredentials: true,
                'Content-Type': 'multipart/form-data',
            },
        ).then((res) => {
            if(res.status === 200) {
                setResponseTitle("Enroll as Candidate")
                setResponse("Enrolled successfully.")
                props.setRender(!props.render)
                props.setDialog(false)
                setResponseIsLoading(false)
                setResponseDialog(true)
            }
        }).catch((err) => {
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

    const closeEnrollCandidateDialog = () => {
        setDpUploadComplete(false)
        setPosterUploadComplete(false)
        setIdUploadComplete(false)
        props.setDialog(false)
    }

    const handleResponseDialogClose = () => {
        setResponseDialog(false)
    }

    return (
        <div>
            <Dialog
                open={props.dialog}
                onClose={closeEnrollCandidateDialog}
            >
                <DialogTitle><span style={{fontWeight: 700}}>Candidate for {props.title}</span></DialogTitle>
                <Formik
                    initialValues={{
                        election_id: props.electionId,
                        sex: 0,
                        display_picture: '',
                        poster: '',
                        id_proof: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleEnrollAsCandidate}
                >
                    {({ errors, values, setFieldValue }) => (
                        <Form>
                            <DialogContent style={{marginTop: "-1rem", paddingBottom: "1rem", maxWidth: "24rem"}}>
                                <Grid container spacing="3">
                                    <Grid item xs="12">
                                        <FormControl component="fieldset">
                                            <div>
                                                <span style={{fontSize: "18px", fontWeight: "bold"}}>Sex:</span>
                                                <RadioGroup
                                                    name="sex" 
                                                    value={values.sex.toString()} 
                                                    onChange={(event) => {
                                                        setFieldValue("sex", parseInt(event.currentTarget.value))
                                                    }}
                                                    row
                                                    style={{width: "16.9rem", marginLeft: "1rem"}}
                                                >
                                                    <FormControlLabel style={{ display: "flex" }} value={"0"} control={<Radio color="action" />} label="Male" />
                                                    <FormControlLabel style={{ display: "flex" }} value={"1"} control={<Radio color="action" />} label="Female" />
                                                    <FormControlLabel style={{ display: "flex" }} value={"2"} control={<Radio color="action" />} label="Other" />
                                                </RadioGroup>
                                            </div>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs="6">
                                        <span style={{fontSize: "18px", fontWeight: "bold"}}>Display Picture:</span>
                                        <div style={{color: "#f25050", fontSize: 12}}>
                                            {/* <ErrorMessage name="display_picture" /> */}
                                            {(errors.display_picture)?errors.display_picture:""}
                                        </div>
                                    </Grid>
                                    <Grid item xs="6" align="right">
                                        <Button
                                            variant={(dpUploadComplete)?"contained":"outlined"}
                                            component="label"
                                            color="action"
                                            className={(dpUploadComplete)?classes.uploadComplete:classes.upload}
                                            disableElevation
                                        >
                                            UPLOAD
                                            <input
                                                type="file"
                                                accept="image/png,image/jpeg"
                                                name="display_picture"
                                                onChange={(event) => {
                                                    setDpUploadComplete(true)
                                                    setFieldValue("display_picture", event.currentTarget.files[0])
                                                }}
                                                required
                                                hidden
                                            />
                                        </Button>
                                    </Grid>
                                    <Grid item xs="6">
                                        <span style={{fontSize: "18px", fontWeight: "bold"}}>Poster:</span>
                                        <div style={{color: "#f25050", fontSize: 12}}>
                                            {/* <ErrorMessage name="poster" /> */}
                                            {(errors.poster)?errors.poster:""}
                                        </div>
                                    </Grid>
                                    <Grid item xs="6" align="right">
                                        <Button
                                            variant={(posterUploadComplete)?"contained":"outlined"}
                                            component="label"
                                            color="action"
                                            className={(posterUploadComplete)?classes.uploadComplete:classes.upload}
                                            disableElevation
                                        >
                                            UPLOAD
                                            <input
                                                type="file"
                                                accept="image/png,image/jpeg"
                                                name="poster"
                                                onChange={(event) => {
                                                    setPosterUploadComplete(true)
                                                    setFieldValue("poster", event.target.files[0])
                                                }}
                                                required
                                                hidden
                                            />
                                        </Button>
                                    </Grid>
                                    <Grid item xs="6">
                                        <span style={{fontSize: "18px", fontWeight: "bold", marginRight: "4.4rem"}}>ID Proof:</span>
                                        <div style={{color: "#f25050", fontSize: 12}}>
                                            {/* <ErrorMessage name="id_proof" /> */}
                                            {(errors.id_proof)?errors.id_proof:""}
                                        </div>
                                    </Grid>
                                    <Grid item xs="6" align="right">
                                        <Button
                                            variant={(idUploadComplete)?"contained":"outlined"}
                                            component="label"
                                            color="action"
                                            className={(idUploadComplete)?classes.uploadComplete:classes.upload}
                                            disableElevation
                                        >
                                            UPLOAD
                                            <input
                                                type="file"
                                                accept="image/png,image/jpeg"
                                                name="id_proof"
                                                onChange={(event) => {
                                                    setIdUploadComplete(true)
                                                    setFieldValue("id_proof", event.target.files[0])
                                                }}
                                                required
                                                hidden
                                            />
                                        </Button>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={closeEnrollCandidateDialog} color="action">
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
                    )}
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
 
export default EnrollCandidateDialog;