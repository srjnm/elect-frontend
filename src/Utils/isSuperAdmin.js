import { useContext } from 'react'
import { AuthContext } from '../Context/AuthContext'

// eslint-disable-next-line
export default () => {
    const {user} = useContext(AuthContext)

    //console.log("student: "+(user.role === "2" && user.user_id !== "" && user.email !==""))
    return (user.role === "2" && user.user_id !== "" && user.email !=="")
}