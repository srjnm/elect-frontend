import { useContext } from 'react'
import { AuthContext } from '../Context/AuthContext'

// eslint-disable-next-line
export default () => {
    const {user} = useContext(AuthContext)

    //console.log("admin: "+(user.role === "1" && user.user_id !== "" && user.email !==""))
    return (user.role === "1" && user.user_id !== "" && user.email !=="")
}