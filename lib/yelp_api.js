import qs from 'querystring';
import _ from 'lodash';
import  nonce from './nonce.js';
import timestamp from './timestamp.js';
import config from './config.js';
import oauthSignature from 'oauth-signature';

function request_yelp(get_location) {

    const httpMethod = 'GET';

    const url = 'http://api.yelp.com/v2/search';

    let default_parameters = {
        category_filter: 'animalshelters',
        sort: '1',
    };

     function locationOrCoords(get_location){
       var result = get_location.split(',').map(Number);
       if(result[1]) { //contains a comma and therefore is lat / long
           default_parameters.ll = get_location; 
       } else { //is a zip or a location name
           default_parameters.location = get_location;
        };
    };

    locationOrCoords(get_location);

    const required_parameters = {
        oauth_consumer_key : config.key, 
        oauth_nonce : nonce(16),
        oauth_signature_method : 'HMAC-SHA1',
        oauth_timestamp : timestamp(),
        oauth_token : config.token,
        oauth_version : '1.0'
    };

    let parameters = _.assign(default_parameters, required_parameters);;

    const consumerSecret = config.consumerSecret;
    const tokenSecret = config.tokenSecret;
    const signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});

    parameters.oauth_signature = signature;

    const paramURL = qs.stringify(parameters);
    const apiURL = url+'?'+ paramURL;

    console.log(apiURL);    
    return apiURL;

};

exports.request_yelp = request_yelp;

