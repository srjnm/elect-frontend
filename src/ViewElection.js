import { Grid, makeStyles, Paper } from "@material-ui/core"

const styles = makeStyles((theme) => ({
    paper: {
        margin: "10rem",
        padding: "10rem",
    },
}))

const ViewElection = (props) => {
    const classes = styles()

    return (
        <Paper className={classes.paper}>
            <Grid container>
                <Grid item xs="12" align="center">
                    US Elections
                </Grid>
            </Grid>
        </Paper>
    );
}
 
export default ViewElection