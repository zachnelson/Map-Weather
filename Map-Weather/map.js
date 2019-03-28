function update() {
  getCurrentTime();
  getMapAndCurrentWeather();
}

function getCurrentTime() {

  // TODO: find local time and insert here instead

  var ampm = "am";

  var date = new Date();
  var hour = date.getHours();
  var mins = date.getMinutes();

  if (hour >= 12) {
    if (hour > 12)
      hour = hour - 12;
    ampm = "pm";
  }

  hour = leadingZero(hour);
  mins = leadingZero(mins);

  var time = hour + ":" + mins + " " + ampm;
  document.getElementById('time').innerHTML = time;

  setInterval(getCurrentTime, 1000);
}

//get both the map and the current weather in one function to minimize API calls
function getMapAndCurrentWeather() {

  var zipCode = getZipCode();

  if(!zipCode)
    zipCode = 73034;
  
  $.getJSON("http://api.openweathermap.org/data/2.5/weather?zip=" + zipCode + ",us&APPID=c725cf94f5d923fe6a6a14767bd1980a", function(json) {
    weather = JSON.stringify(json.weather[0].main);
    weather = weather.replace(/\"/g, "");
    document.getElementById('weather').innerHTML = weather;

    mytemp = JSON.stringify(json.main.temp);
    mytemp = mytemp.replace(/\"/g, "");
    mytemp = Math.round(temperatureConverter(mytemp));
    document.getElementById('temp').innerHTML = mytemp + "°";

    city = JSON.stringify(json.name);
    city = city.replace(/\"/g, "");
    document.getElementById('city').innerHTML = city;

    lon = JSON.stringify(json.coord.lon);

    lat = JSON.stringify(json.coord.lat);

    //to center at UCO
    if (zipCode == 73034){
      lat = 35.6549;
      lon = -97.4715;
    }
    myMap(lat, lon);

  });

  setInterval(getCurrentWeather, 300000);
}

function myMap(lat, lon) {

var mapOptions = {
    center: new google.maps.LatLng(lat, lon),
    zoom: 19,
    mapTypeId: google.maps.MapTypeId.HYBRID
};
var map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

function getZipCode(){

  var zip = document.getElementById("zipCode").elements[0].value;

  if (!zip){}
  else if (zip.length != 5)
    alert("Please enter a 5 digit zip code.") 
  else return zip;
}



/*MATH FUNCTIONS*/

function leadingZero(n) {
  return (n < 10) ? ("0" + n) : n;
}

function temperatureConverter(valNum) {
  valNum = parseFloat(valNum);
  return ((valNum - 273.15) * 1.8) + 32;
}