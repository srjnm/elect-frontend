import { useEffect, useState, useContext } from 'react'
import Button from '@material-ui/core/Button';
import { Grid , makeStyles, Paper, Typography, CircularProgress, Container } from '@material-ui/core';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import HeaderAd from '../HeaderAd';
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'
import axios from 'axios'


const useStyles = makeStyles((theme) => ({
    root: {
        ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    marginLeft: theme.spacing(7),
    marginRight: theme.spacing(80),
    padding: theme.spacing(2)

    }   
    ,
    input: {
      display: 'none',
    },
    spacing:{
        padding:theme.spacing(4),
        margin:theme.spacing(2)
    },
    uploadlist:{
        fontWeight:'760'
    },
    note:{
      fontWeight:'600',
      color: "Red"
    },
    table: {
      minWidth: 650,
    }
  }));

  // Table Data 

  // const rows = [
  //   createData("Suraj NM", 184766),
  //   createData("Udaya Kumar ", 184769),
  //   createData("Adarsh Unathil", 184774),
  //   createData("Vishal C Bangera", 184775),
  //   createData("Shawn Evan Pinto", 184796)
  // ];
  // function createData(name, registerNo) {
  //   return { name, registerNo };
  // }


function AdminRegister() {
    const classes = useStyles();

    const { dispatch } = useContext(AuthContext)
    const history = useHistory()

    const [students, setStudents] = useState('')
    const [isLoading, setisLoading] = useState(true)
    const [update, setUpdate] = useState(false)

    useEffect(() => {
      const customAxios = axios.create({
          withCredentials: true,
      })

      axios.interceptors.response.use(
          null,
          (error) => {
              if(error.response) {
                  if(error.response.status === 406) {
                      customAxios.post(
                          "/refresh",
                      ).then((resp) => {
                          if(resp.status === 200){
                              return !update 
                          }
                      }).then((updt) => {
                          setUpdate(updt)
                      }).catch((er) => {
                          //console.log(er)
                      })
                  }
                  else if(error.response.status === 511) {
                      dispatch({
                          type: "LOGOUT_SUCCESS",
                      })
                      history.push("/")
                  }
              }
              
              return Promise.reject(error)
          }
      )

      axios.get(
          "/api/registeredstudents",
          {
              withCredentials: true,
          }
      ).then((res) => {
          if(res.status === 200) {
              return res.data
          }
      }).then((data) => {
        if (data === null) {
            setStudents('')
        }
        else {
            setStudents(data)
        }
          setisLoading(false)
      }).catch((err) => {
          if(err.status === 400){
              if(err.data.message){
                  if(err.data.message === "No students registered!"){
                      return false
                  }
              }
          }
      }).then((errresp) => {
          setisLoading(errresp)
      })
    // eslint-disable-next-line
    }, [update])

    function handleDelete(id) {
      axios.delete(
          "/api/registeredstudent/"+id,
          {
              withCredentials: true,
          }
      ).then((res) => {
          if(res.status === 200) {
              return !update
          }
      }).then((upd) => {
          setUpdate(upd)
      }).catch((err) => {})
  }

    return (
        <div>      
    <div><HeaderAd /></div>

    <Grid container>
    <Typography className={classes.spacing} ></Typography>
      <Grid item xs={12}>
   
      <Paper className={classes.root}>
         
        <span className={classes.uploadlist}> UPLOAD THE EXCEL FILE TO REGISTER THE STUDENTS</span> &nbsp;&nbsp;&nbsp;
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
        
        <Button variant="outlined"color="primary">Submit</Button>
        
      </label> 
      </Paper>
      </Grid>

      <Typography className={classes.spacing} ></Typography>
        <Grid item xs={12} md={6}>
          <Paper className={classes.spacing}>
        
                <span className={classes.note}>NOTE: The excel file must contain columns names 'Name', 'Register_No', 'Email' exactly</span>
        
           </Paper>
        </Grid>


        <Typography className={classes.spacing} ></Typography>
        <Typography className={classes.spacing} ></Typography>

        <Grid item xs={12} style={{ backgroundColor: "#efefef" }}>
        <Container>
            { 
                isLoading && <CircularProgress variant="indeterminate" />
            }
            {
                !isLoading &&
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead className={classes.tbhead}>
                            <TableRow>
                                <TableCell style={{ fontWeight: 600, }}> NAME</TableCell>
                                <TableCell align="center" style={{ fontWeight: 600, }}>REGISTER NUMBER</TableCell>
                                <TableCell align="center" style={{ fontWeight: 600, }}>EMAIL ADDRESS</TableCell>
                                <TableCell align="center" style={{ fontWeight: 600, }}>DELETE STUDENT</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                (students.length !== 0) ? students.map((student) => (
                                    <TableRow key={ student.email }>
                                        <TableCell>{ student.first_name } { student.last_name }</TableCell>
                                        <TableCell align="center">{ student.reg_number }</TableCell>
                                        <TableCell align="center">{ student.email }</TableCell>
                                        <TableCell align="center"><Button onClick={ () => { handleDelete(student.user_id) } } variant="contained" color="secondary" style={{ fontWeight: 600, maxHeight: 30, }}>DELETE</Button></TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell align="center" colSpan="4" >No students registered.</TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            }
        </Container>
        </Grid>

      
    </Grid>



        </div>
    )
}

export default AdminRegister
