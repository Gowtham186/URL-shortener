import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function RedirectHandler() {
    const { shortUrl } = useParams(); 
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`http://localhost:3300/${shortUrl}`);
                
                
                const longUrl = response.data.longUrl; 

                if (longUrl) {
                    console.log('Redirecting to:', longUrl);
                    window.location.href = longUrl; 
                } else {
                    console.error('No long URL found in response');
                    navigate('/error'); 
                }
            } catch (error) {
                console.error('Error fetching long URL:', error);
                navigate('/error'); 
            }
        })();
    }, [shortUrl, navigate]);

    return <p>Redirecting...</p>; 
}
