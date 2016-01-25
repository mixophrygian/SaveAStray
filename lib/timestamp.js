
function timestamp() {
    const ts = Math.floor(new Date().getTime() / 1000);
    const stamp = ts.toString().substr(0,10)
    return stamp;
}

module.exports = timestamp;



