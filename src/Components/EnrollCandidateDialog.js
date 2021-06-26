import { Dialog, DialogContent } from '@material-ui/core';
import * as Yup from 'yup';
import { Form, Formik } from "formik";

const EnrollCandidateDialog = (props) => {
    const [responseDialog, setResponseDialog] = useState(false)
    const [responseTitle, setResponseTitle] = useState('')
    const [response, setResponse] = useState('')
    const [responseIsLoading, setResponseIsLoading] = useState(false)

    const validationSchema = Yup.object({
        election_id: Yup
            .string()
            .default(props.electionId),
        sex: Yup
            .number()
            .min(0)
            .max(2)
            .required(),
        display_picture: Yup
            .mixed()
            .required()
            .test("fileSize", "the file size limit is 10MB", (value) => {
                return value && value[0].size <= 10000000
            })
            .test("fileType", "supported file types are jpg, jpeg and png", (value) => {
                return value && (value[0].type === "image/jpeg" || value[0].type === "image/png")
            }),
        poster: Yup
            .mixed()
            .required()
            .test("fileSize", "the file size limit is 10MB", (value) => {
                return value && value[0].size <= 10000000
            })
            .test("fileType", "supported file types are jpg, jpeg and png", (value) => {
                return value && (value[0].type === "image/jpeg" || value[0].type === "image/png")
            }),
        id_proof: Yup
            .mixed()
            .required()
            .test("fileSize", "the file size limit is 10MB", (value) => {
                return value && value[0].size <= 10000000
            })
            .test("fileType", "supported file types are jpg, jpeg and png", (value) => {
                return value && (value[0].type === "image/jpeg" || value[0].type === "image/png")
            }),
    })

    const closeEnrollCandidateDialog = () => {
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
                <DialogTitle>Candidate for {props.title}</DialogTitle>
                <Formik
                    initialValues={{
                        sex: 0,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleEnrollAsCandidate}
                >
                    <Form>
                        <DialogContent>

                        </DialogContent>
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
 
export default EnrollCandidateDialog;