import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { useField, useFormikContext, ErrorMessage } from "formik";
import DateMomentUtils from '@date-io/moment';

const DateTimeInput = ({label, ...props}) => {
    const [field, meta] = useField(props)
    const { setFieldValue } = useFormikContext()

    return (
        <MuiPickersUtilsProvider utils={DateMomentUtils}>
            <DateTimePicker
                label={label}
                {...field}
                {...props}
                error={meta.error}
                onChange={(value)=>{
                    setFieldValue(field.name, value)
                }}
            />
            <div style={{color: "#f25050", fontSize: 12, marginLeft: "10px"}}>
                <ErrorMessage name={field.name} />
            </div>
        </MuiPickersUtilsProvider>
    );
}

export default DateTimeInput;