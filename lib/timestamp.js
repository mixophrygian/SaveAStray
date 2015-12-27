
var timestamp = function() {
    var ts = Math.floor(new Date().getTime() / 1000);
    var stamp = ts.toString().substr(0,10)
    return stamp;
}

module.exports = timestamp;



