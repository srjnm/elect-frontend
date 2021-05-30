import { Button, Grid, Paper, } from '@material-ui/core';
import React, { useState } from 'react'
import * as Yup from 'yup';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from "@material-ui/core/styles";
import { Formik,Form} from 'formik';
//import TextfieldWrapper from './TextfieldWrapper.js';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DateMomentUtils from '@date-io/moment';
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import TextfieldWrapper from './TextfieldWrapper.js';

const useStyles = makeStyles(theme =>({
  root:{
        '& .MuiFormControl-root':{
          width: '80%',
          margin: theme.spacing(1)
        }
  },
  input: {
    display: 'none',
  },
  paper: {
    margin: theme.spacing(1),
    paddingLeft: '30px',

  },
  sbt: {
    backgroundColor: "#60B7E9",
    color: "black",
    border: "1px solid #60B7E9",
  },
  pageContent:{
    margin: theme.spacing(5),
    padding: theme.spacing(3)
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


export default function CreateElection() {
 
  const classes = useStyles();
  const [StartingTime, StartingTimeChange] = useState(new Date());
  const [EndingTime, EndingTimeChange] = useState(new Date());
  const [LockingTime, LockingTimeChange] = useState(new Date());

  const [checked, setChecked] = useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
   
    <Paper className={classes.pageContent}>
    <Formik
    initialValues = {{
      ...INITIAL_FORM_STATE
    }}
    validationSchema = {FORM_VALIDATION}
    onSubmit = {values => {
      console.log(values);
    }}
    >
   
    <Form className={classes.root}>
      <Grid container>
        <Grid item xs={12}><h3>Create Election</h3></Grid>
        <Grid item xs={6}>

        <TextfieldWrapper  name="title"  label="Title" /><br/>
          
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
        //minDate={new Date("2018-01-01T00:00")}
        //format="yyyy/MM/dd hh:mm a"
      />
    </MuiPickersUtilsProvider>
        </Grid>
        
          <Grid item xs={4}><b>Gender Specific</b><br/>(meant for Student Council Elections)<br/>
          <br/>
          <Paper elevation={3} className={classes.paper}>upload a excel file with column 'Register_No'</Paper>
          </Grid>
           
         
          <Grid item xs={2}> 
            Yes<Checkbox  color='default' />
            No<Checkbox checked={checked} onChange={handleChange} color='default' /><br/><br/>
            <input
              accept="/*"
              className={classes.input}
              id="contained-button-file"
              multiple
              type="file"
          />
      <label htmlFor="contained-button-file">
            <Button variant="contained" color="default" startIcon={<CloudUploadIcon />} component="span">
          Upload 
        </Button>
        </label>
        <br/>
        <br/>
          <br/>
          <Button className={classes.sbt}variant="outlined">SUBMIT</Button>
          </Grid>

    
        
      </Grid>

    </Form>
    </Formik>
    </Paper>
  )
}
