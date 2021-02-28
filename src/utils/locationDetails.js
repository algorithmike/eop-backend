import axios from 'axios';

// https://docs.mapbox.com/api/search/geocoding/
// /geocoding/v5/{endpoint}/{longitude},{latitude}.json

const getLocFromCoords = async (latitude, longitude) => {
    const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/
        ${longitude},${latitude}.json?access_token=${process.env.MAPBOX_KEY}`
    )
    return response.data
}

export default getLocFromCoords;