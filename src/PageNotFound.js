import {makeStyles, Grid, Typography, Button} from '@material-ui/core'
import { useHistory } from 'react-router-dom'

const styles = makeStyles((theme) => ({
    root: {
        [theme.breakpoints.down('md')]: {
            height: "100%"
        },
        [theme.breakpoints.up('md')]: {
            height: "100vh",
        } 
    },
    image: {
        [theme.breakpoints.down('md')]: {
            minWidth: "200px",
            width: "35vh",
            padding: 25,
            marginTop: "2.5rem",
            marginBottom: "2.5rem",
        },
        [theme.breakpoints.up('md')]: {
            width: "80vh",
        }
    },
    cover: {
        [theme.breakpoints.down('xs')]: {
            backgroundColor: "#abdefb",
            //height: "40vh",
        },
        [theme.breakpoints.up('xs')]: {
            backgroundColor: "#abdefb",
        }
    },
    form: {
        [theme.breakpoints.up('md')]: {
            alignItems: "flex-end",
            marginBottom: "28vh",
        } 
    }
}))

const PageNotFound = () => {
    const classes = styles()

    const history = useHistory()

    return (
        <div>
            <Grid container direction="column" className={classes.root}>
                <Grid item xs="12" container>
                    <Grid item xs="12" md="8" className={classes.cover} justify="center" alignItems="center" container>
                        <img src="https://electstore.blob.core.windows.net/assets/LandingPageArt.png" className={classes.image} alt="Login" />
                    </Grid>
                    <Grid item xs="12" md="4" justify="center" container className={classes.form}>
                        <form noValidate autoComplete="off" onSubmit={ () => {} }>
                            <Grid container direction="column" alignItems="center" spacing="2">
                                <Grid item xs="12">
                                    <Typography color="primary" display="initial" style={{padding: "3vh", paddingBottom: "0vh", marginTop: "20%", lineHeight: "0vh", fontSize: "3.5rem", fontFamily: "Teko", letterSpacing: 0.6, textShadow: "0px 0px 4px rgba(96,183,233,0.3)"}}>
                                        ELECT
                                    </Typography>
                                </Grid>
                                <Grid item xs="12">
                                    <Typography color="primary" style={{fontFamily: "Teko", fontSize: 29}}>
                                        ERROR 404
                                    </Typography>
                                </Grid>
                                <Grid item xs="12">
                                    <Button disableElevation variant="contained" color="primary" style={{fontWeight: "bold"}} onClick={() => {history.push("/")}}>
                                        HOME
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}
 
export default PageNotFound;