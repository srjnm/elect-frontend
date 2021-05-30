import { useField, ErrorMessage } from "formik";
import { TextField } from "@material-ui/core";

const TextFieldInput = ({label, ...props}) => {
    const [field, meta] = useField(props)

    return (
        <div>
            <TextField
                label={label}
                error={meta.error}
                {...field}
                {...props}
            />
            <div style={{color: "#f25050", fontSize: 12}}>
                <ErrorMessage name={field.name} />
            </div>
        </div>
    );
}
 
export default TextFieldInput;