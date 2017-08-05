var HueApi = require("node-hue-api").HueApi;
const packageSettings = require("./package").dashitall;

var hostname = packageSettings.hub,  // IP of the Philips Hue Bridge
    newUserName = null;  // The Hue Bridge will generate a User ID
    userDescription = "Noras Room Dash Button";

var displayUserResult = function(result) {
    console.log("Created user: " + JSON.stringify(result));
};

var displayError = function(err) {
    console.log(err);
};

var hue = new HueApi();

hue.registerUser(hostname, newUserName, userDescription)
    .then(displayUserResult)
    .fail(displayError)
    .done();
