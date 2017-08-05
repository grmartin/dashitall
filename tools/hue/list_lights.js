var HueApi = require("node-hue-api").HueApi;

const packageSettings = require("./package").dashitall;

var hostname = packageSettings.hub,  // IP of the Philips Hue Bridge
    userName = packageSettings.user_token;  // The Hue Bridge will generate a User ID

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

const api = new HueApi(hostname, userName);

// --------------------------
// Using a promise
api.lights()
    .then(displayResult)
    .done();

// --------------------------
// Using a callback
api.lights(function(err, lights) {
    if (err) throw err;
    displayResult(lights);
});
