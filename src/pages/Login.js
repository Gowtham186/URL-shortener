import { useContext, useState } from "react"
import axios from "axios"
import _ from 'lodash'
import AuthContext from "../contexts/AuthContext"
import { useLocation, useNavigate } from "react-router-dom"

export default function Login(){

    const { handleLogin } = useContext(AuthContext)
    const navigate = useNavigate()
    const location = useLocation()
    const [formData, setFormData] = useState({
        username:"",
        password:""
    })
    const [clientErrors, setClientErrors] = useState({})
    const [serverErrors, setServerErrors] = useState({})
    const errors = {}

    const runValidations = ()=>{
        if(formData.username.trim().length === 0){
            errors.username = 'username is required'
        }
        if(formData.password.trim().length === 0){
            errors.password = 'password is required'
        }
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        runValidations()
        if(Object.keys(errors).length === 0){
            try{
                //console.log(formData)
                const response = await axios.post('http://localhost:3300/api/users/login', formData)
                //console.log(response.data)
                localStorage.setItem('token', response.data.token)
                
                const userResponse = await axios.get('http://localhost:3300/api/users/profile', 
                    { headers : { Authorization : localStorage.getItem('token')}}
                )
                const user = _.pick(userResponse.data, ['_id','username'])

                handleLogin(user)
                const redirectTo = location.state?.from || '/dashboard'
                navigate(redirectTo)

            }catch(err){
                console.log(err)
                setServerErrors(err)
            }
        }else{
            setClientErrors(errors)
        }
        
    }

    return(
        <>
            <h2>Login Component</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username : </label>
                <input type="text" 
                    id="username" 
                    value={formData.username}
                    onChange={(e)=>setFormData({...formData, username : e.target.value})}/><br />
                <label htmlFor="password">Password : </label>
                <input type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e)=>setFormData({...formData, password:e.target.value})}/><br />
                <input type="submit"/>
            </form>
        </>
    )
}