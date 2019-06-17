function getAreaInfo() {

  var zipCode = getZip();

  $.getJSON("http://api.openweathermap.org/data/2.5/weather?zip=" + zipCode + ",us&APPID=c725cf94f5d923fe6a6a14767bd1980a", (json) => {
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
    if (zipCode == 73034) {
      lat = 35.6549;
      lon = -97.4715;
    }

    displayMap(lat, lon);

    displayLocalTime(lat, lon);

  });
}

function getZip() {

  //Once the user clicks the submit button, get the zip code from the url
  var url = new URL(window.location.href);
  var zip = url.searchParams.get("zipCode");

  //if no zipcode is given, use 73034 as the default
  if (!zip)
    zip = 73034;

  //if the user enters an invalid zip code
  if (zip.length != 5) {
    alert("Please enter a 5 digit US zip code.");
    zip = 73034;
  }

  return zip;
}

function displayMap(lat, lon) {

  var mapOptions = {
    center: new google.maps.LatLng(lat, lon),
    zoom: 19,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

function displayLocalTime(lat, lon) {

  $.getJSON("http://api.timezonedb.com/v2.1/get-time-zone?key=SJYMRX467K4T&format=json&by=position&lat=" + lat + "&lng=" + lon, function (json) {

    time = JSON.stringify((json.formatted));

    hour = time.substring(11, 14);
    mins = time.substring(15, 17);

    ampm = "am";

    if (hour >= 12) {
      if (hour > 12)
        hour = hour - 12;
      ampm = "pm";
    }

    if(hour == 0)
      hour = 12;
  
    hour = leadingZero(hour);

    time = hour + ":" + mins + " " + ampm;

    document.getElementById('time').innerHTML = time;
  });

}

/*MATH FUNCTIONS*/

function leadingZero(n) {
  return (n < 10) ? ("0" + n) : n;
}

function temperatureConverter(valNum) {
  valNum = parseFloat(valNum);
  return ((valNum - 273.15) * 1.8) + 32;
}