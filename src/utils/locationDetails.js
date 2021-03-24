import axios from 'axios';

// https://docs.mapbox.com/api/search/geocoding/
// /geocoding/v5/{endpoint}/{longitude},{latitude}.json

const getLocFromCoords = async (latitude, longitude) => {
    const {data} = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/
        ${longitude},${latitude}.json?access_token=${process.env.MAPBOX_KEY}`
    )
    
    if(data.features.length === 0){return null}
    
    let landmark = data.features[0].text
    let [streetAddress, city, state, country] = data.features[0].place_name.split(',').map(item => item.trim())

    return {country, state, city, streetAddress, landmark}
}

export default getLocFromCoords;