import { Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, LinearProgress } from "@material-ui/core";
import { Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from 'yup';
import TextFieldInput from "./FormTextInput";
import axios from 'axios'

const ChangePasswordDialog = (props) => {
    /*eslint-disable */
    const [responseDialog, setResponseDialog] = useState(false)
    const [responseTitle, setResponseTitle] = useState('')
    const [response, setResponse] = useState('')
    const [responseIsLoading, setResponseIsLoading] = useState(false)
    /*eslint-disable */

    const validationSchema = Yup.object({
        current_password: Yup
            .string()
            .required("this is a required field"),
        new_password: Yup
            .string()
            .required("this is a required field"),
        confirm_password: Yup
            .string()
            .oneOf([Yup.ref('new_password')], "passwords do not match")
            .required("this is a required field"),
    })

    const customAxios = axios.create({
        withCredentials: true,
    })

    const refresh = async () => {
        await customAxios.post(
            "https://e1ect.herokuapp.com/refresh",
        ).then((resp) => {
            if(resp.status === 200){
                return !update 
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
                    setUpdate(!update)
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

    const handleChangePassword = (values) => {
        setResponseIsLoading(true)
        axios.post("https://e1ect.herokuapp.com/changepassword",
            {
                current_password: values.current_password,
                new_password: values.new_password,
            },
            {
                withCredentials: true,
            }
        ).then((res) => {
            if(res.status === 200) {
                setResponseTitle("Change Password")
                setResponse("Password changed successfully.")
                props.setDialog(false)
            }
            setResponseIsLoading(false)
            setResponseDialog(true)
        })
        .catch((err) => {
            if(err){
                if(err.response) {
                    console.log(err.response)
                    if(err.response.status === 400) {
                        setResponseTitle("Change Password")
                        setResponse("Failed to change password!")
                        props.setRender(!props.render)
                        props.setDialog(false)
                    }
                }
            }
            setResponseIsLoading(false)
            setResponseDialog(true)
        })
    }

    const closeChangePasswordDialog = () => {
        props.setDialog(false)
    }

    const handleResponseDialogClose = () => {
        setResponseDialog(false)
    }

    return (
        <div>
            <Dialog
                open={props.dialog}
                onClose={closeChangePasswordDialog}
            >
                <DialogTitle style={{minWidth: "15rem", marginBottom: "-3%", fontWeight: "bold"}}>Change Password</DialogTitle>
                <Formik
                    initialValues={{
                        current_password: "",
                        new_password: "",
                        confirm_password: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleChangePassword}
                >
                    <Form>
                        <DialogContent style={{paddingTop: "1rem", paddingBottom: "1rem", paddingLeft: "5%", paddingRight: "5%", width: "89.5%"}}>
                            <Grid container spacing="3">
                                <Grid item xs="12">
                                    <TextFieldInput
                                        name="current_password"
                                        label="current password"
                                        type="password"
                                        variant="outlined"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs="12">
                                    <TextFieldInput
                                        name="new_password"
                                        label="new password"
                                        type="password"
                                        variant="outlined"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs="12">
                                    <TextFieldInput
                                        name="confirm_password"
                                        label="confirm password"
                                        type="password"
                                        variant="outlined"
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeChangePasswordDialog} color="action">
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
 
export default ChangePasswordDialog;