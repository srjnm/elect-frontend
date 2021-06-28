import { Grid, makeStyles, Typography, Menu, MenuItem, Button } from '@material-ui/core'
import axios from 'axios'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from "@material-ui/icons/AccountCircle"
import { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'

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
    const [register, setRegister] = useState(false)
    /*eslint-disable */

    const handleProfileButton = (e) => {
        setMenu(e.currentTarget)
    }

    const handleMenuClose = () => {
        setMenu(null)
    }

    const handleLogout = (e) => {
        e.preventDefault()

        if(user.role === '') {
            history.push("/")
            return
        }

        axios.post("https://e1ect.herokuapp.com/logout",
            {},
            {
                withCredentials: true,
            },
        ).then((res) => {
            if(res.status === 200) {
                dispatch({
                    type: "LOGOUT_SUCCESS",
                })
                history.push("/")
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }

    return (
        <div>
            <Grid container alignItems="center" justify="center" className={classes.root}>
                <Grid item xs="2" align="center">
                    <Typography color="primary" display="initial" style={{fontSize: "3.5rem", fontFamily: "Teko", letterSpacing: 0.6, textShadow: "0px 0px 4px rgba(96,183,233,0.3)"}}>
                        ELECT
                    </Typography>
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
                        <MenuItem onClick={handleMenuClose}>Change Password</MenuItem>
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
        </div>
    );
}
 
export default Header;