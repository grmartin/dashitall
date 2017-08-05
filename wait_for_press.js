const conditionalRequire = require("conditional_require").ifResolvable;
const dash_button = require("node-dash-button");
const HueApi = require("node-hue-api").HueApi;
const packageSettings = conditionalRequire('./.config.json') || require("./package").dashitall;

const api = new HueApi(packageSettings.hub, packageSettings.user_token);
const dash = dash_button(packageSettings.dash_macs, null, null, 'all');
const lightId = packageSettings.light;

console.log(packageSettings);

const displayStatus = function(status) {
    console.log(JSON.stringify(status, null, 2));
};

dash.on("detected", function (dash_id) {
  api.lightStatus(lightId, function(err, result) {
      if (err) throw err;
      if (result.state.on) {
        api.setLightState(lightId, {"on": false}).done();
      } else {
        api.setLightState(lightId, {"on": true}).done();
      }
  });
});
