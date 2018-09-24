import qs from 'querystring';
import config from './config.js';

function request_yelp(get_location) {
    const url = 'https://api.yelp.com/v3/businesses/search?'

    let default_parameters = {
        categories: 'animalshelters',
    };

     function locationOrCoords(get_location){
       console.log('location?', get_location)
       var result = get_location.split(',').map(Number);
       console.log('result', result);
       if(result[1]) { //contains a comma and therefore is lat / long
           default_parameters.latitude = result[0]; 
           default_parameters.longitude = result[1];
       } else { //is a zip or a location name
           default_parameters.location = get_location;
        };
    };

    locationOrCoords(get_location);
    const queryString = qs.stringify(default_parameters);
    const thisQuery = url + queryString;
    //just return the query, do the fetching later
    return thisQuery;
};

exports.request_yelp = request_yelp;

