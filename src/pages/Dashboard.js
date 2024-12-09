import { useContext, useEffect, useState } from "react"
import AuthContext from "../contexts/AuthContext"
//import DatePicker from 'react-datepicker'
//import "react-datepicker/dist/react-datepicker.css";
import axios from "axios"

export default function Dashboard(){
    const {userState} = useContext(AuthContext)
    const [longUrl , setLongUrl] = useState("")
    const [expireDate, setExpireDate] = useState("")
    const [shortUrl, setShortUrl] = useState("")

    useEffect(()=>{
        (async()=>{
            if(localStorage.getItem('shortUrl')){
                setShortUrl(localStorage.getItem('shortUrl'))
            }
            if(localStorage.getItem('longUrl')){
                setLongUrl(localStorage.getItem('longUrl'))
            }
        })()
    },[])

    const handleUrl = async(event)=>{
        event.preventDefault()
        //console.log(longUrl)
        try{
            if(localStorage.getItem('token')){
                const shortUrl = await axios.post('http://localhost:3300/api/urls', {longUrl : longUrl, expireDate : expireDate}, 
                    { headers : { Authorization : localStorage.getItem('token')}}
                )
                // localStorage.setItem('longUrl', longUrl)
                // localStorage.setItem('shortUrl', shortUrl.data)

                setShortUrl(shortUrl.data)
            }
        }catch(err){
            console.log(err)
        }
        
    }
    return(
        <>
            <h2>Dashboard Component</h2>
            <h3>Username : {userState.user?.username}</h3>
            <label>Give long Url </label>
            <form onSubmit={handleUrl}>
                <input type="text"
                    value={longUrl}
                    onChange={(e)=>setLongUrl(e.target.value)} 
                    />
                 {/* <DatePicker
                selected={expireDate}
                onChange={(date) => setExpireDate(date)}
                minDate={new Date()} 
                placeholderText="Select a date"
            /> */}
                <input type="submit" value="submit" />
            </form>
            {shortUrl && <h3>Short Url - {`http://localhost:3300/${shortUrl}`}</h3>}
            
        </>
    )
}
