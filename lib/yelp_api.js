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
        category_filter: 'animalshelters',
        sort: '2',
        term: 'rescue'
    };

    var locationOrCoords = function(get_location){
       var result = get_location.split(',').map(Number);
       if(result[0]) {
           default_parameters.ll = get_location; 
       } else {
           default_parameters.location = get_location;
        };
    };

    locationOrCoords(get_location);

    var required_parameters = {
        oauth_consumer_key : config.key, 
        oauth_nonce : nonce(16),
        oauth_signature_method : 'HMAC-SHA1',
        oauth_timestamp : timestamp(),
        oauth_token : config.token,
        oauth_version : '1.0'
    };

    var parameters = _.assign(default_parameters, required_parameters);;

    var consumerSecret = config.consumerSecret;
    var tokenSecret = config.tokenSecret;
    var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});

    parameters.oauth_signature = signature;
    var paramURL = qs.stringify(parameters);
    var apiURL = url+'?'+ paramURL;

    console.log('FULLURL: ' + apiURL);
    
    return apiURL;

};

exports.request_yelp = request_yelp;

