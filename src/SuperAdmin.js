import axios from 'axios'
import { useEffect } from 'react';
import { useState } from 'react';

const SuperAdmin = () => {
    const [page, setPage] = useState(null)

    useEffect(() => {
        axios.get(
            "https://e1ect.herokuapp.com/admin/",
            {
                withCredentials: true,
            }
        ).then((res) => {
            console.log(res.data)
            setPage(res.data)
        })
    }, [])

    return (
        <div dangerouslySetInnerHTML={{ __html: page}}>
        </div>
    );
}
 
export default SuperAdmin;