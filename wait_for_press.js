const conditionalRequire = require("conditional_require").ifResolvable();
const dash_button = require("node-dash-button");
const HueApi = require("node-hue-api").HueApi;
const colors = require('colors');
const packageSettings = conditionalRequire('./.config.json') || require("./package").dashitall;

const api = new HueApi(packageSettings.hub, packageSettings.user_token);

console.log("Configuration: ".bold);
console.log(JSON.stringify(packageSettings, null, 2).black.italic);
console.log(" ");

const subroutines = {
  "hue:onOff": function _hue_onOff(mac, globalSettings, deviceParams) {
    const dash = dash_button(mac, null, null, 'all');
    const lightId = deviceParams.light;


    dash.on("detected", function (dash_id) {
      console.log(`+ Device '${mac.black}' activated:`);
      api.lightStatus(lightId, function (err, result) {
        if (err) throw err;
        if (result.state.on) {
          console.log(`   Target device is on, switching off.`);
          api.setLightState(lightId, {"on": false}).done();
        } else {
          console.log(`   Target device is off, switching on.`);
          api.setLightState(lightId, {"on": true}).done();
        }
      });
    });
  }
};

console.log("Events: ".bold);
for (const mac in packageSettings.dash) {
  if (!packageSettings.dash.hasOwnProperty(mac)) continue;

  const dashSettings = packageSettings.dash[mac];

  console.log(`* Registering subroutine '${dashSettings.subroutine.yellow}' for device '${mac.black}' with configuration:`);
  console.log(JSON.stringify(dashSettings, null, 2).grey.italic);
  console.log(" ");

  subroutines[dashSettings.subroutine](mac, packageSettings, dashSettings.parameters);
}

console.log("Log: ".bold);
