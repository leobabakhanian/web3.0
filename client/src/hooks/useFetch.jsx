import { useEffect, useState } from 'react';

const API_KEY = import.meta.env.VITE_GIPHY_API;

const useFetch = ({gif}) => {
    const [gifUrl, setGifUrl] = useState("");

    const fetchGifs = async () => {
        try{
            const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${gif.split(" ").join("")}&limit=1`);
            const { data } = await response.json();

            setGifUrl(data[0]?.images?.downsized_medium.url);
        } catch(error) {
            setGifUrl("https://acegif.com/wp-content/uploads/gif-shaking-head-38.gif");
        }
    }

    useEffect(() => {
        if(gif) fetchGifs();
    }, [gif]);

    return gifUrl;
}

export default useFetch;