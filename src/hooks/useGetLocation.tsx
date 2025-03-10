import { useEffect, useState } from "react";

interface CordinatessResults {
    lat: number;
    lng: number;
};

interface LocationDetails {
    formattedAddress?: string;
    city?: string;
    state?: string;
    county?: string;
    country?: string;
    postCode?: string;
}
export const useGetLocation = ()=>{
    const [location,setLocation] = useState<LocationDetails | null>(null);
    const [coordinates, setCoordinates] = useState<CordinatessResults | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Get user's latitude and longitude
    const getCordinates = async () : Promise<CordinatessResults | null>=>{
        if(!navigator.geolocation){
            setError('Geolocation is not supported by this browser.');
            return null;
        };
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
              (error) => {
                setError(error.message);
                reject(null);
              }
            );
        });
    };

    const getActualLocation = async (lat:number, lng:number)=>{
        setLoading(true);
        try {
            const response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=c3a2175dbfe14dca8055b974528b8ea8`);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                setLocation({
                    formattedAddress: data.results[0].formatted,
                    city: data.results[0].city,
                    state: data.results[0].state,
                    county: data.results[0].county,
                    country: data.results[0].country,
                    postCode: data.results[0].postcode
                })
            } else {
                setError("No location found for these coordinates.")
                return null;
            }
        } catch (error) {
            console.log(error)
            setError("Failed to fetch location data.");
            return null;
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        // Fetch user's location and convert it into actual location details
        (async ()=>{
            setLoading(true);
            const cordinates = await getCordinates();
            if(cordinates){
                setCoordinates(cordinates);
                await getActualLocation(cordinates.lat, cordinates.lng)
            }
            setLoading(false);
        })();
    },[]);
    
    return {location, coordinates, error, loading};
};