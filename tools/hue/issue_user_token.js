const conditionalRequire = require("conditional_require").ifResolvable();
const HueApi = require("node-hue-api").HueApi;
const colors = require('colors');

const packageSettings = conditionalRequire('../../.config.json') || require("../../package").dashitall;

const hostname = packageSettings.hub,
    newUserName = null,
    userDescription = "DashItAll System";

const displayUserResult = function(result) {
    console.log(`Created user: '${JSON.stringify(result).grey.underline}'.`);
};

const displayError = function(err) {
    console.log(err);
};

const hue = new HueApi();

hue.registerUser(hostname, newUserName, userDescription)
    .then(displayUserResult)
    .fail(displayError)
    .done();
