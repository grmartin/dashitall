const conditionalRequire = require("conditional_require").ifResolvable();
const dash_button = require("node-dash-button");
const HueApi = require("node-hue-api").HueApi;
const colors = require('colors');
const packageSettings = conditionalRequire('./.config.json') || require("./package").dashitall;

// TODO: Load in global api stuff via a context and namespacing.
const api = new HueApi(packageSettings.hub, packageSettings.user_token);

console.log("Configuration: ".bold);
console.log(JSON.stringify(packageSettings, null, 2).black.italic);
console.log(" ");

const subroutines = { }; // TODO: Scan folder; Load in.


console.log("Events: ".bold);
for (const mac in packageSettings.dash) {
  if (!packageSettings.dash.hasOwnProperty(mac)) continue;

  const dashSettings = packageSettings.dash[mac];

  console.log(`* Registering subroutine '${dashSettings.subroutine.yellow}' for device '${mac.black}' with configuration:`);
  console.log(JSON.stringify(dashSettings, null, 2).grey.italic);
  console.log(" ");

  // TODO: Skip missing.
  subroutines[dashSettings.subroutine](mac, packageSettings, dashSettings.parameters);
}

console.log("Log: ".bold);
