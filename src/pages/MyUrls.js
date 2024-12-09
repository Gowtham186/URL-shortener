import { useContext, useEffect, useState } from "react"
import axios from "axios"
import AuthContext from "../contexts/AuthContext"
import '../App.css'
//import DatePicker from 'react-datepicker'
//import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom"

export default function MyUrls(){
    const { urlState, urlDispatch } = useContext(AuthContext)
    const [showEditForm, setShowEditForm] = useState(false)
    const [editUrl, setEditUrl] = useState({})
    
    const [editForm, setEditForm] = useState({
        shortUrl : "",
        expireDate : new Date()
    })

    const navigate = useNavigate()

    useEffect(()=>{
        setEditForm({
            shortUrl: editUrl.shortUrl || "",
            expireDate: editUrl.expireDate || "",
        });
    },[editUrl])

    useEffect(()=>{
        (async()=>{

            try{
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token found");
                }
            
                const response = await axios.get('http://localhost:3300/api/urls/myurls', 
                    { headers : { Authorization : localStorage.getItem('token')}}
                )
                //console.log(myurls.data)
                urlDispatch({type : 'my_urls', payload:{myurls : response.data}})
            }catch(err){
                console.log(err)
            }
        })()
    },[urlDispatch])


    const handleDelete = async(id)=>{
        try{
            const userConfirm = window.confirm("Are you sure?")
            if(userConfirm){
                
                const response = await axios.delete(`http://localhost:3300/api/urls/${id}`, 
                    { headers : { Authorization : localStorage.getItem('token')}}
                )
                //console.log('Deleted data :', response.data)
                urlDispatch({ type: 'delete_url', payload:response.data._id})
            }
        }catch(err){
            console.log(err)
        }
    }



    const handleAnalytics =  async(id)=>{
        navigate(`/analytics/${id}`)

    }


    const handleEdit = (ele)=>{
        setShowEditForm((prev)=> !prev)
        setEditUrl(ele)

    }

    const handleSubmit = async(e)=>{
        e.preventDefault()

        try{
            const response = await axios.put(`http://localhost:3300/api/urls/${editUrl._id}`, editForm,
                { headers : { Authorization : localStorage.getItem('token')}}
            )
            urlDispatch({type : 'update_url', payload:response.data})
            //console.log(response.data)
            setShowEditForm(false)
        }catch(err){
            console.log(err)
        }

    }

    return(
        <>
            <h1>My Urls</h1>
            
            {urlState?.myurls?.length > 0 ? (
                <div>
                <h2>Total Urls - {urlState.myurls.length}</h2>
                <div>
                    {urlState.myurls.map(ele=>{
                        return (
                            <div className="urls" key={ele._id}>
                                <h2>{ele._id}</h2>
                                <h3>{ele.longUrl}</h3>
                                <h3><a href={`http://localhost:3300/${ele.shortUrl}`} target="_blank" rel="noopener noreferrer">{ele.shortUrl}</a></h3>
                                <p>created at - {ele.createdAt}</p>
                                <p>expire at - {ele.expireDate}</p>
                                <button onClick={()=>handleEdit(ele)}>Edit</button>
                                <button onClick={()=>handleDelete(ele._id)}>Delete</button>
                                <button onClick={()=>handleAnalytics(ele._id)}>view analytics</button>
                            </div>
                        )
                    })}
                    </div>
                </div>
            ) : <p>Loading...</p>}
            {showEditForm && (
                <div>
                    <h2>Edit form</h2>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="longurl">Long Url</label>
                        <input
                            type="text"
                            value={editUrl.longUrl}
                            disabled
                        /><br />
                        
                        <label htmlFor="shorturl">Short Url</label>
                        <input
                            type="text"
                            value={editForm.shortUrl}
                            onChange={(e) => setEditForm({ ...editForm, shortUrl: e.target.value })}
                        />
                        
                        
                        
                        <input type="submit" value="Save" />
                    </form>

                </div>
            )}
        </>
    )
}