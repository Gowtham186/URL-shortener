import { useEffect, useReducer } from "react"
import AuthContext from "../contexts/AuthContext"
import userReducer from "../reducers/userReducer"
import urlReducer from "../reducers/urlReducer"
import axios from "axios"
import _ from 'lodash'

const userInitialState = {
    user:{},
    isLoggedIn:false
}

const urlInitialState = {
    myurls:{},
    analytics:{}
}

export default function AuthProvider(props){    
    const [userState, userDispatch] = useReducer(userReducer, userInitialState)

    const [urlState, urlDispatch] = useReducer(urlReducer, urlInitialState)

    useEffect(()=>{
        (async()=>{
            if(localStorage.getItem('token')){
                const response = await axios.get('http://localhost:3300/api/users/profile',
                    { headers : { Authorization : localStorage.getItem('token')}}
                )
                const user = _.pick(response.data, ['_id','username'])
                handleLogin(user)
            }
        })()
    },[])


    const handleLogin = (user)=>{
        userDispatch({type : 'LOGIN', payload: {isLoggedIn : true, user:user}})
    }

    const handleLogout = ()=>{
        userDispatch({type: 'LOGOUT', payload : {isLoggedIn : false}})
    }
    

    return(
        <AuthContext.Provider value={{handleLogin, userState, urlState, urlDispatch, handleLogout }}>
            {props.children}
        </AuthContext.Provider>
    )   
}