import axios from 'axios';

axios.get(
        'https://api.mapbox.com/geocoding/v5/mapbox.places/Los%20Angeles.json?access_token='
        + process.env.MAPBOX_KEY
    )
    .then(result => { console.log(result) })