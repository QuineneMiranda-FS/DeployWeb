import { useState, useEffect, useCallback} from 'react';
import {getTimeZone,getTimeZonebyId,createTimeZone,updateTimezone,deleteTimeZone} from "../api/timezoneAPI";

export function (){
    //
    const [timeZone,setTimeZone] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTimeZone = useCallback(async()=>{
        //
        setLoading(true);
        setError(null);
        try {
            const res = await getTimeZone()
            setTimeZone(res.data);
        } catch (error){
            setError(error);
        } finally {
            setLoading(false);
        }
    })
    const addTimeZone = async(data=>{
    setLoading(true);
    try {
        const res = await createTimeZone(data);
        setTimezone(prev => [res.data, ..prev]);

    } catch(error){
        setError(error);

    } finally {setLoading(false);}
})
}
