import { Grid, Paper } from '@material-ui/core'
import React from 'react'
import Header from './Components/Header'
import { makeStyles,  withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

const BorderLinearProgress = withStyles((theme) => ({
    root: {
      height: 20,
      borderRadius: 5
    },
    colorPrimary: {
      backgroundColor:
        theme.palette.grey[theme.palette.type === "light" ? 200 : 700]
    },
    bar: {
      borderRadius: 5,
      backgroundColor: "#1a90ff"
    }
  }))(LinearProgress);


const useStyles = makeStyles({
    box: {
      margin:'60px',
      padding:'30px'
    },
    toptext:{
        textAlign: 'center',
        textIndent: '50px',
        letterSpacing: '3px',
        fontFamily:'Helvetica',
        fontSize:'20px'
    },
    title:{
      textAlign: 'center'
    }
  });

export default function AdminResults() {

    const classes = useStyles();

    return (
        <div>
            <Header/>
            <Paper className={classes.box}>
                <Grid container>
                    <Grid item xs={12}>
                        <h5 className={classes.toptext}>ELECTION</h5>
                    <h3 className={classes.title}>I Bcom A Class Representatives</h3>
                    <h5 className={classes.toptext}>RESULT</h5>
                    </Grid>
                    
                    <Grid item xs={12}>
                           <h4>Suraj NM</h4>
                            <BorderLinearProgress variant="determinate" value={80} />
                            <h4>Uday Kumar</h4>
                            <BorderLinearProgress variant="determinate" value={70} />
                            <h4>Adarsh Unathil</h4>
                            <BorderLinearProgress variant="determinate" value={50} />
                            <h4>Praveen</h4>
                            <BorderLinearProgress variant="determinate" value={20} />
                     </Grid>     
                </Grid>
            </Paper>
            
        </div>
    )
}











