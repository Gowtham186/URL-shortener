import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function PrivateRoute(props){
    const { userState } = useContext(AuthContext)
    if(!localStorage.getItem('token') && !userState.user){
        return <Navigate to="/login" state={{from : location.pathname}} replace/>
    }else{
        return props.children
    }
}