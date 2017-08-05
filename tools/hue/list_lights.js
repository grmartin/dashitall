const conditionalRequire = require("conditional_require").ifResolvable();
const HueApi = require("node-hue-api").HueApi;

const packageSettings = conditionalRequire('../../.config.json') || require("../../package").dashitall;

const hostname = packageSettings.hub,
    userName = packageSettings.user_token;

const displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

const api = new HueApi(hostname, userName);

api.lights(function(err, lights) {
    if (err) throw err;
    displayResult(lights);
});
