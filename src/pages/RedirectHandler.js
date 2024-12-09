import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function RedirectHandler() {
    const { shortUrl } = useParams(); // Get shortUrl from URL parameters
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                // Make the backend request to get the longUrl
                const response = await axios.get(`http://localhost:3300/${shortUrl}`);
                
                // Extract the longUrl from the response
                const longUrl = response.data.longUrl; // Ensure the backend response contains 'longUrl'

                if (longUrl) {
                    console.log('Redirecting to:', longUrl);
                    window.location.href = longUrl; // Perform the redirection
                } else {
                    console.error('No long URL found in response');
                    navigate('/error'); // Redirect to an error page if no URL is found
                }
            } catch (error) {
                console.error('Error fetching long URL:', error);
                navigate('/error'); // Navigate to an error page if an error occurs
            }
        })();
    }, [shortUrl, navigate]);

    return <p>Redirecting...</p>; // Inform the user of the redirect
}
