import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import axios from "axios";
import _ from "lodash";
import { useParams } from "react-router-dom";
import { Chart } from 'react-google-charts'

export default function UrlAnalytics() {
    const { urlState, urlDispatch } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const { id } = useParams()
    
    useEffect(() => {
        (async()=>{
            if (id) {
                try {
                    const token = localStorage.getItem("token");
                    if (!token) {
                        throw new Error("No token found");
                    }

                    const response = await axios.get(`http://localhost:3300/api/urls/${id}`, {
                        headers: { Authorization: token },
                    });

                    const urlData = _.pick(response.data.url, ["longUrl", "shortUrl", "expireDate", "_id"]);
                    const analytics = _.pick(response.data.analytics, ["clicks", "devices", "countries"]);
                    urlDispatch({ type: "get_url_analytics", payload: { ...urlData, ...analytics } });
                } catch (err) {
                    console.error("Error fetching analytics:", err);
                } finally {
                    setLoading(false); 
                }
            }
        
        })()
           
       
    }, [id, urlDispatch, urlState]);

    const countryObj = urlState?.analytics?.countries

    const data = countryObj ? [["country", "count"], ...Object.entries(countryObj)] : []

    const devicesObj = urlState?.analytics?.devices
    //console.log(devicesObj)
    const devicesData = devicesObj ? [["device", "counts"], ...Object.entries(devicesObj)] : []

    return (
        <>
            <h1>Analytics</h1>
            {loading ? (
                <p>Loading analytics...</p>
            ) : (
                <>
                    <h1>URL Details</h1>
                    <h4>Clicks - {urlState.analytics?.clicks || 0}</h4>
                    <h4>Devices</h4>
                    <p>Desktop: {urlState.analytics?.devices?.desktop || 0}</p>
                    <p>Mobile: {urlState.analytics?.devices?.mobile || 0}</p>
                    <h4>Countries:</h4>
                    {urlState?.analytics?.countries &&  Object.entries(countryObj).map(([key,value])=>(
                        <p key={key}>{key} - {value}</p>
                    ))}
                    

                    <Chart
                        chartEvents={[
                            {
                            eventName: "select",
                            callback: ({ chartWrapper }) => {
                                const chart = chartWrapper.getChart();
                                const selection = chart.getSelection();
                                if (selection.length === 0) return;
                                const region = data[selection[0].row + 1];
                                console.log("Selected : " + region);
                            },
                            },
                        ]}
                        chartType="GeoChart"
                        width="90%"
                        height="70%"
                        data={data}
                    />

                    <Chart
                        chartType="PieChart"
                        data={devicesData}
                        width={"100%"}
                        height={"400px"}
                        />


                    
                </>
            )}
        </>
    );
}
