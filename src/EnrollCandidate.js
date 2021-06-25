import { Grid, Paper } from '@material-ui/core'
import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CandidateTable from './CandidateTable';
const useStyles = makeStyles({
    box: {
      margin:'60px',
      padding:'30px'
    },
    headings:{
        fontWeight:'120px',
        marginBottom: '10px',
        fontFamily: 'Helvetica',
    },
    btn:{
            color: 'white',
            fontWeight:'bold',
            backgroundColor: '#60B7E9',
    },
});    


export default function EnrollCandidate() {

    const classes = useStyles();

    return (
        <div>
            <Paper className={classes.box}>
            <Grid container>
                <Grid item xs={12}>
                
                     <h3 className={classes.headings}  >Title</h3>
                    <Typography variant="body1" display="block" gutterBottom>
                       IT Club - President and Vice President
                    </Typography>
                    
                    <h3 className={classes.headings}  >Starting Time</h3>
                    <Typography variant="body1" display="block" gutterBottom>
                       Wednesday, July 31 2021- 1:30pm
                    </Typography>

                   
                    <h3 className={classes.headings}  >Ending time</h3>
                    <Typography variant="body1" display="block" gutterBottom>
                       Wednesday, July 31 2021- 3:30pm
                    </Typography>

                    <h3 className={classes.headings}  >Lock-In Time</h3>
                    <Typography variant="body1" display="block" gutterBottom>
                       Wednesday, July 31 2021- 2:30pm
                    </Typography>
                    <h3 className={classes.headings}  >Candidates</h3>
                    <CandidateTable/>
                    {/* <Divider/> */}
                    <br/>
                    <Button variant="contained" className={classes.btn} disableElevation>
                     + ENROLL AS CANDIDATE
                    </Button>

                </Grid>
            </Grid>
        </Paper>
        
        </div>
    )
}
