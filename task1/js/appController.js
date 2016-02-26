angular.module('AWWA.controllers', [])
.controller('weatherController', function($scope, $http) {
  
  var map;
  var marker
  // Open Weather Map App Key ID
  $scope.appid = "44db6a862fba0b067b1930da0d769e98";

  // Initializing APP
  $scope.init = function () {

    // Initializing Google Map
    var latlng = new google.maps.LatLng(-22.892386, -42.031631);
    var options = {
      zoom: 5,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"), options);
    marker = new google.maps.Marker({
      position: latlng,
      map: map
    });

    // Getting user location
    $scope.getLocation();
  }
  

  // Find: Ask the weather to the API
  $scope.prefind = function() {
    if($scope.location_search != null)
      $scope.find($scope.location_search, null, null, null);
    else
      $scope.find(null, $scope.location_search_zip, null, null);
  }

  // Find: Ask the weather to the API
  $scope.find = function(query, zip, lat, lng) {
    
    var url = "";
    var url_query = "http://api.openweathermap.org/data/2.5/weather?q=" + query;
    var url_zip = "http://api.openweathermap.org/data/2.5/weather?zip=" + zip;
    var url_latlng = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng;

    // Selecting url
    if(query != null)
      url = url_query;
    else if(zip != null)
      url = url_zip;
    else
      url = url_latlng;

    // Calling API
    $http.get(url + "&appid=" + $scope.appid + "&units=metric").then(function(response) {
      
      data = response.data;

      // Setting marker new position
      var latlng = new google.maps.LatLng(data.coord.lat, data.coord.lon);
      marker.setPosition(latlng);
      map.setCenter(latlng);

      $scope.result_city = data.name + ", " + data.sys.country;
      $scope.result_temp = data.main.temp;
      $scope.result_temp_max = data.main.temp_max;
      $scope.result_temp_min = data.main.temp_min;
      $scope.result_sea_level = data.main.sea_level;
      $scope.result_pressure = data.main.pressure;
      $scope.result_humidity = data.main.humidity;

      $scope.result_weather = ": " + data.weather[0].description;

    });

  };

  // getLocation: Ask the user location, using the browser's object, navigator.
  $scope.getLocation = function(){
    if (navigator.geolocation) {
        $scope.result_city = "Searching...";
        navigator.geolocation.getCurrentPosition($scope.showPosition, function (error) { $("#location_error").show();});
    } else {
        // Shows error to user
        $("#location_error").show();
    }
  }

  // showPosition: Callback function triggered by navigator object
  $scope.showPosition = function(position) {
    $("#location_error").hide();

    $scope.find(null, null, position.coords.latitude, position.coords.longitude);
  }

  // Init
  $scope.init();

});