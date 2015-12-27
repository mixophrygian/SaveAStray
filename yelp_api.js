var qs = require('querystring');  
var _ = require('lodash');
var nonce = require('./nonce.js')();
var oauthSignature = require('oauth-signature');  

var request_yelp = function(get_location) {
    var httpMethod = "GET";

    var url = "http://api.yelp.com/v2/search";

    var default_parameters = {
        location: get_location,
        term: 'no-kill',
        category_filter: "animalshelters",
        sort: "2"
    };

    var randomString = function(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for(var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    var ts = Math.floor(new Date().getTime() / 1000);
    var timestamp = ts.toString();

    var required_parameters = {
        oauth_consumer_key : 'ie42Qg-zgR76dEDQ_upnuw', 
        oauth_token : 'yvYMnzjFkCWsm6M8zMTI9seC3t7F1WPA',
        oauth_nonce : nonce(),
        oauth_timestamp : timestamp.substr(0,10),
        oauth_signature_method : 'HMAC-SHA1',
        oauth_version : '1.0'
    };

    var parameters = _.assign(default_parameters, required_parameters);

    var consumerSecret = 'wBi8kJX0uLlpNIN1reApgELO6B8';
    var tokenSecret = 'YpACNtOgaA7ZGZRUk-PiEFiq4b4';
    var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});

       /* We add the signature to the list of paramters */
    parameters.oauth_signature = signature;

    /* Then we turn the paramters object, to a query string */
    var paramURL = qs.stringify(parameters);

    /* Add the query string to the url */
    var apiURL = url+"?"+paramURL;
    return apiURL;
    /* Then we use request to send make the API Request 
    request(apiURL, function(error, response, body){
        return callback(error, response, body);
    });
*/
};
exports.request_yelp = request_yelp;
