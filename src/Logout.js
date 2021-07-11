import { useEffect } from "react";
import { AuthContext } from './Context/AuthContext';
import { useContext } from "react";
import axios from 'axios';
import { useHistory } from "react-router-dom";

const Logout = () => {
    const history = useHistory()
    const { dispatch } = useContext(AuthContext)

    // eslint-disable-next-line
    useEffect(async () => {
        await axios.post("/slogout",
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
            //console.log(err)
        })
    // eslint-disable-next-line
    }, [])

    return (
    <div />
    );
}
 
export default Logout;