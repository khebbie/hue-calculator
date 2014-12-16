// https://github.com/peter-murray/node-hue-api

var SunCalc = require('suncalc');
var hue = require("node-hue-api"),
HueApi = hue.HueApi,
lightState = hue.lightState;

function getMidnight(){
  var d = new Date();
  d.setHours(0,0,0,0);
  return d;
}

function isNight(times, now){
  var midnight = getMidnight();
  if(now > midnight && now < times.dawn){return true;}
  if(now < times.dusk && now< midnight ){return true;}
  return false;
}

function isDuskOrDawn(times, now){
  if(now > times.dawn && now < times.sunrise){return true;}
  if(now < times.dusk && now > times.sunset){return true;}
  return false;
}

var times = SunCalc.getTimes(new Date(), 56.1553,9.89515);
console.log(times)


var displayResult = function(result) {
  console.log(JSON.stringify(result, null, 2));
};

var hostname = "192.168.10.101",
username = "newdeveloper",
api;

api = new HueApi(hostname, username);
var bright = 154;
var warm = 500;
var wakeUp = 400;

var now = new Date();

if(isNight(times, now)){
  console.log("it is night");
  state = lightState.create().on().white(warm, 100);
}
else if (isDuskOrDawn(times, now)){
  console.log("It is dusk or dawn");
  state = lightState.create().on().white(wakeUp, 100);
}
else{
  console.log("it is day");
  state = lightState.create().on().white(bright, 100);
}


// --------------------------
// Using a promise
api.setLightState(5, state)
.then(displayResult)
.done();

// --------------------------
// Using a callback
api.setLightState(2, state, function(err, lights) {
  if (err) throw err;
  displayResult(lights);
});
