import React, { useState } from 'react'
import Header from './Components/Header';
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, Typography } from '@material-ui/core';
import { Form, Formik } from 'formik';
import Checkbox from '@material-ui/core/Checkbox';
import * as Yup from 'yup';
import TextFieldInput from './Components/FormTextInput';
import DateMomentUtils from '@date-io/moment';
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import ParticipantsTable from './Components/ParticipantsTable'
import EnrolledTable from './Components/EnrolledTable';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';




const useStyles = makeStyles((theme) => ({
  subhead: {
   fontWeight:'bold',
   padding:'2%'
  },
  root:{
    '& .MuiFormControl-root':{
      width: '80%',
      margin: theme.spacing(1),
    },
    marginLeft:'40px',
    padding: '20px'

},
form:{
  marginLeft:'40px',
  marginRight:'180px',
},
note:{
  marginLeft:'40px'
},
upld:{
  fontWeight:'bold',
},
input: {
  display: 'none',
},
smbt: {
  marginLeft:'40px',
  marginTop:'40px',
  marginBottom:'50px'
},
btn:{
  
  border: '2px solid black',
}


}))   


const INITIAL_FORM_STATE = {
  title: '',
  genderSpecific: false,


};

const FORM_VALIDATION = Yup.object().shape({
  title: Yup.string()
  .required('Required'),
  genderSpecific: Yup.boolean()
  .required('required')
  
  })




export default function EditElection() { 

  const classes = useStyles();
  const [StartingTime, StartingTimeChange] = useState(new Date());
  const [EndingTime, EndingTimeChange] = useState(new Date());
  const [LockingTime, LockingTimeChange] = useState(new Date());

  const [checked, setChecked] = useState(true);


  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <div>
     
     <Header/>
<Grid container>

    <Grid item xs={12}>

    <br/>
    <Typography variant='h5'  className={classes.subhead} >Edit Election</Typography>
    
    
     <Formik
      initialValues = {{
       ...INITIAL_FORM_STATE
      }}
       validationSchema = {FORM_VALIDATION}
       onSubmit = {values => {
        console.log(values);
       }}
     >
       <Paper className={classes.form}>
        <Form className={classes.root}>
        <TextFieldInput name="title"  label="Title" /><br/>

      
        <MuiPickersUtilsProvider utils={DateMomentUtils}>
          <KeyboardDateTimePicker
        value={StartingTime}
        onChange={StartingTimeChange}
        label="Starting Time"
        onError={console.log}
      />
    </MuiPickersUtilsProvider><br/>

      
          <MuiPickersUtilsProvider utils={DateMomentUtils}>
          <KeyboardDateTimePicker
        value={EndingTime}
        onChange={EndingTimeChange}
        label="Ending Time"
        onError={console.log}
      />
    </MuiPickersUtilsProvider><br/>

    
          <MuiPickersUtilsProvider utils={DateMomentUtils}>
          <KeyboardDateTimePicker
        value={LockingTime}
        onChange={LockingTimeChange}
        label="Lock-In Time"
        onError={console.log}
      />
    </MuiPickersUtilsProvider>  
    <br/> <br/>

    <Grid item xs={4}><b>Gender Specific</b><br/>(meant for Student Council Elections)<br/>
          
          </Grid>
          <Grid item xs={2}> 
            Yes<Checkbox  color='default' />
            No<Checkbox checked={checked} onChange={handleChange} color='default' /><br/><br/>
          </Grid>
        </Form>  
        </Paper>
     </Formik>  

    </Grid>
 </Grid>
     




<Grid item xs={12}>
<Typography variant='h6'  className={classes.subhead} >Enrolled participants</Typography>
</Grid>

 <ParticipantsTable/>

 <Grid item xs={12}>
<Typography variant='h6'  className={classes.subhead} >Enrolled Candidates</Typography>
</Grid>

<EnrolledTable/>

<Grid item xs={12}>
<Typography variant='h6'  className={classes.subhead} >Enrolle Participants</Typography>
</Grid>

<Grid container xs={8}>
  <Grid item xs={6} className={classes.note}>
  <Paper className={classes.upld}>
  &nbsp;Upload a excel file containing column name 'Register_No'&nbsp;
  </Paper>
  </Grid>
  <Grid item xs={2} class>
  &nbsp;&nbsp;
  <input
        accept="/*"
        className={classes.input}
        id="contained-button-file"
        multiple
        type="file"
      />
      <label htmlFor="contained-button-file">
        <Button variant="outlined" color="default" startIcon={<CloudUploadIcon />} component="span">
          Upload 
        </Button>
        </label>



  </Grid>
</Grid>

<Grid item xs={12} className={classes.smbt}>
<Button variant="outlined" className={classes.btn}>Submit</Button>
</Grid>

    </div>
  )
}
