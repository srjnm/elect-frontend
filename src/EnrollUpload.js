import { Grid, Paper } from '@material-ui/core';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    box: {
      margin:'60px',
      padding:'30px'
    },
    headings:{
        fontWeight:'120px',
        marginBottom: '10px',
        fontFamily: 'Helvetica',
    },
    input: {
        display: "none"
      },
    upld:{
        borderRadius:'10px',
        fontFamily: 'Helvetica',
        paddingTop: '12px',
        paddingBottom:'12px',
        paddingLeft:'12px',
        paddingRight:'30px'

    
    },
    btn:{
        backgroundColor:'black',
        color:'white',
    },
    submit:{
        fontWeight:'bold',

    }  

})); 

export default function EnrollUpload() {

    const classes = useStyles();

    return (
        <div>
        <Paper className={classes.box} elevation={3}>
            <Grid container>
                <Grid item xs={12}>
                <h2 className={classes.headings}  >ENROLL AS CANDIDATE</h2>
                
                <h3 className={classes.headings} >Election title</h3>
                <Typography variant="body1" display="block" gutterBottom>
                       IT Club - President and Vice President
                    </Typography>
                
               
                <h3 className={classes.headings} >Upload ID Proof</h3>
                <Paper className={classes.upld}>
                     UPLOAD PDF FILE OF YOUR POSTER  <input
               accept="/*"
               className={classes.input}
               id="contained-button-file"
               type="file"
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" className={classes.btn} component="span">
          Upload <CloudUploadIcon/>
        </Button>
      </label>
                </Paper>



                <h3 className={classes.headings} >Upload Poster</h3>
                <Paper className={classes.upld}>
                     UPLOAD PDF FILE OF YOUR POSTER  <input
               accept="/*"
               className={classes.input}
               id="contained-button-file"
               type="file"
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" className={classes.btn} component="span">
          Upload <CloudUploadIcon/>
        </Button>
      </label>
                </Paper>
            <br/>
                <Button variant="outlined" size="large" className={classes.submit}>Submit</Button>
                </Grid>
             </Grid>
        </Paper>        
        </div>
    )
}
