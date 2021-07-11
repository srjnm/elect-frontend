import { Grid, makeStyles, Typography, Menu, MenuItem, Button, Link } from '@material-ui/core'
import axios from 'axios'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from "@material-ui/icons/AccountCircle"
import { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'
import ChangePasswordDialog from './ChangePasswordDialog'

const styles = makeStyles((theme) => ({
    root: {
        minHeight: "60px",
        backgroundColor: "#fdfdfd",
        boxShadow: "0px 0px 52px 12px rgba(0,0,0,0.06)",
        height: "10%",
        width: "100%",
        margin: 0,
        padding: 0,
        paddingRight: "50px",
        paddingLeft: "30px",
    },
    pages: {
        [theme.breakpoints.down('sm')]: {
            "visibility": "hidden",
        },
    },
    bottomPages: {
        [theme.breakpoints.down('md')]: {
            paddingTop: 15,
            paddingLeft: 50,
        },
        [theme.breakpoints.up('md')]: {
            padding: 0,
            margin: 0,
            height: 0,
            "visibility": "hidden",
        },
    }
}))

const Header = (props) => {
    /*eslint-disable */
    const classes = styles()

    const { user, dispatch } = useContext(AuthContext)
    const history = useHistory()

    const [menu, setMenu] = useState(null)
    const [changePassword, setChangePassword] = useState(false)
    const [register, setRegister] = useState(false)
    /*eslint-disable */

    const handleProfileButton = (e) => {
        setMenu(e.currentTarget)
    }

    const handleMenuClose = () => {
        setMenu(null)
    }

    const handleChangePassword = () => {
        setChangePassword(true)
    }

    const handleLogout = (e) => {
        e.preventDefault()

        axios.post("/ulogout",
            {},
            {
                withCredentials: true,
            },
        ).then((res) => {
            if(res.status === 200) {
                dispatch({
                    type: "LOGOUT_SUCCESS",
                })
                window.location.assign("https://e1ect.herokuapp.com/")
            }
        })
        .catch((err) => {
            //console.log(err)
        })
    }

    return (
        <div>
            <Grid container alignItems="center" justify="center" className={classes.root}>
                <Grid item xs="2" align="center">
                    <Link href="/" underline="none">
                        <Typography color="primary" display="initial" style={{fontSize: "3.5rem", fontFamily: "Teko", letterSpacing: 0.6, textShadow: "0px 0px 4px rgba(96,183,233,0.3)"}}>
                            ELECT
                        </Typography>
                    </Link>
                </Grid>
                <Grid item xs="4" className={classes.pages}>
                    {
                        props.setRegister && 
                        <div>
                            <Button
                                color="primary"
                                variant={(!props.register)?"contained":"outlined"}
                                onClick={()=>{props.setRegister(false)}}
                                disableElevation
                                style={{marginRight: "15px"}}
                            >
                                ELECTIONS
                            </Button>
                            <Button
                                color="primary"
                                variant={(props.register)?"contained":"outlined"}
                                onClick={()=>{props.setRegister(true)}}
                                disableElevation
                            >
                                REGISTER
                            </Button>
                        </div>
                    }
                </Grid>
                <Grid item xs="5">
                </Grid>
                <Grid item xs="1" align="center">
                    <IconButton onClick={handleProfileButton}>
                        <AccountCircle color="grey" fontSize="large" />
                    </IconButton>
                    <Menu
                        anchorEl={menu}
                        keepMounted
                        open={Boolean(menu)}
                        onClose={handleMenuClose}
                        PaperProps={{variant: "outlined", color: "#fdfdfd", elevation: 0}}
                    >
                        <MenuItem onClick={handleChangePassword}>Change Password</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Grid>
            </Grid>
            {
                props.setRegister &&
                <div className={classes.bottomPages}>
                    <Button
                        color="primary"
                        variant={(!props.register)?"contained":"outlined"}
                        onClick={()=>{props.setRegister(false)}}
                        disableElevation
                        style={{backgroundColor: (props.register)?"white":null, marginRight: "15px"}}
                    >
                        ELECTIONS
                    </Button>
                    <Button
                        color="primary"
                        variant={(props.register)?"contained":"outlined"}
                        onClick={()=>{props.setRegister(true)}}
                        disableElevation
                        style={{backgroundColor: (!props.register)?"white":null}}
                    >
                        REGISTER
                    </Button>
                </div>
            }
            <ChangePasswordDialog dialog={changePassword} setDialog={setChangePassword} />
        </div>
    );
}
 
export default Header;