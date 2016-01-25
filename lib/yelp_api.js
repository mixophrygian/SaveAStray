<<<<<<< HEAD
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
=======
var qs = require('querystring');  
var _ = require('lodash');
var nonce = require('./nonce.js');
var timestamp = require('./timestamp.js');
var config = require('./config.js');
var oauthSignature = require('oauth-signature');  

var request_yelp = function(get_location) {
    var httpMethod = 'GET';

    var url = 'http://api.yelp.com/v2/search';
    //TODO add some logic to detect if the query is lat/long or city/zip. 
    var default_parameters = {
>>>>>>> a26ee014749f50b70e5f3368c0033ad1b32a8e2c
        category_filter: 'animalshelters',
        sort: '2',
        term: 'rescue'
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

<<<<<<< HEAD
    let parameters = _.assign(default_parameters, required_parameters);;
=======
    var parameters = _.assign(default_parameters, required_parameters);;
>>>>>>> a26ee014749f50b70e5f3368c0033ad1b32a8e2c

    const consumerSecret = config.consumerSecret;
    const tokenSecret = config.tokenSecret;
    const signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});

    parameters.oauth_signature = signature;
<<<<<<< HEAD

    const paramURL = qs.stringify(parameters);
    const apiURL = url+'?'+ paramURL;

    console.log(apiURL);    
=======
    var paramURL = qs.stringify(parameters);
    var apiURL = url+'?'+ paramURL;

    console.log('FULLURL: ' + apiURL);
    
>>>>>>> a26ee014749f50b70e5f3368c0033ad1b32a8e2c
    return apiURL;

};

exports.request_yelp = request_yelp;

