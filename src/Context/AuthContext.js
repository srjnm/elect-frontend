import { useReducer, useEffect } from 'react';
import { createContext } from 'react'
import { initialState, AuthReducer } from './authReducer.js'

export const AuthContext = createContext()

const AuthContextProvider = (props) => {
    const [user, dispatch] = useReducer(AuthReducer, initialState)

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify({user: user}));
    }, [user]);

    return (
        <AuthContext.Provider value={{user, dispatch}}>
            { props.children }
        </AuthContext.Provider>
    );
}
 
export default AuthContextProvider;