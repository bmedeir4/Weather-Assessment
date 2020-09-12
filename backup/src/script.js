"use strict";

angular.module("weatherApp", [])
    .controller("weatherController", function($scope, $http) {
        $scope.writtenCity = "";

        var weatherUrlStar = "https://api.openweathermap.org/data/2.5/onecall?";
        var weatherUrlEnd = "&units=metric&appid=48507c7efbe2a4ca1b59a199ea479b46";
        
  
        var geolocationUrlStart = "https://api.opencagedata.com/geocode/v1/json?q=";
        var geolocationUrlEnd = "&key=2cd88b982a4543a79df89138bb66fc41";


        // FUNCTION TO GET WEATHER USING GIVEN COORDINATES
        $scope.getWeather = function() {
            $http({
                method: "GET",
                url: $scope.currentUrl
            }).then(function (data, status) {
                if(data.data.cod === "400") {
                    $scope.cityName = "City not found";
                }
                else {
                    // CURRENT WEATHER
                    $scope.date = data.data.current.dt;
                    $scope.temperature = Math.round(data.data.current.temp);
                    $scope.feelsLike = Math.round(data.data.current.feels_like);
                    $scope.wind = data.data.current.wind_speed;
                    $scope.description = data.data.current.weather[0].description;
                    $scope.icon = "https://openweathermap.org/img/wn/" +
                        data.data.current.weather[0].icon +
                        ".png";

                    // FUTURE WEATHER
                    $scope.futureData = data.data.daily.slice(1, 6);
                    $scope.iconHttp = "https://openweathermap.org/img/wn/";
                    $scope.png = ".png";
                }
            }).error(function (data, status) {
                $scope.cityName = "City not found";
            });
        };
  
  
        // FUNCTION TO GET LAT&LON FROM CITY NAME (OpenCageData) - GEOCODING
        $scope.getGeolocation = function() {
            $http({
                method: "GET",
                url: $scope.geocodingUrl
            }).then(function (data) {
                if(data.data.results[0].components.hasOwnProperty("city")) {
                    $scope.cityName = data.data.results[0].components.city;
                } else if (data.data.results[0].components.hasOwnProperty("state")) {
                    $scope.cityName = data.data.results[0].components.state;
                } else {
                    $scope.cityName = data.data.results[0].components.country;
                }
                // REGEX .MATCH METHOD TAKES ONLY THE FIRST NUMBERS UNTIL DEGREE SIGN
                $scope.latData = data.data.results[0].annotations.DMS.lat.match(/^\d+/);
                $scope.lonData = data.data.results[0].annotations.DMS.lng.match(/^\d+/);

                $scope.currentUrl = weatherUrlStar +
                    "lat=" + $scope.latData +
                    "&lon=" + $scope.lonData +
                    weatherUrlEnd;
                $scope.getWeather();
            }, function error(data) {
                $scope.cityName = "City not found";
            });
        };


        // CREATE GEOCODING LINK FROM CITY NAME
        $scope.findCity = function() {
            // IF INPUT FIELD IS NOT EMPTY, ACCEPT THE VALUE
            if ($scope.writtenCity !== "") {
                $scope.selectedCity = $scope.writtenCity;
                $scope.geocodingUrl = geolocationUrlStart + $scope.selectedCity + geolocationUrlEnd;
                $scope.getGeolocation();
            }
        };
  
       // Add Favorites
        $scope.addFavorites = function(cityName) {
            var node = document.createElement("LI");
            var textnode = document.createTextNode(cityName);
            node.appendChild(textnode);           document.getElementById("favoritesList").appendChild(node);
        };
        $scope.addFavoritescitytemp = function(temperature) {
            var node = document.createElement("LI");
            var textnode = document.createTextNode(temperature);
            node.appendChild(textnode);           document.getElementById("favoritesList").appendChild(node);
        };
        $scope.removeFavourites = function(favoritesList) {
            var list = document.getElementById("favoritesList");
            while (list.hasChildNodes()) {  
            list.removeChild(list.firstChild);
          }
        };
  
        // AUTOMATICALLY DETECTS LOCATION
        $scope.findAutomatic = function() {
            // GETS COORDINATES FROM JSON FILE
            $http({
                method: "GET",
                url: "http://ip-api.com/json"
            }).then(function (coordinates) {
                $scope.cityName = coordinates.data.city;
                $scope.myLat = coordinates.data.lat;
                $scope.myLon = coordinates.data.lon;

                $scope.currentUrl = weatherUrlStar +
                    "lat=" + $scope.myLat +
                    "&lon=" + $scope.myLon +
                    weatherUrlEnd;
                $scope.getWeather();
            }, function error(data) {
                $scope.cityName = "No Coordinates";
            });
        };

        // TRIGGERS TO SHOW DEFAULT WEATHER ON PAGE LOAD
        $scope.init = function() {
            //$scope.getWeather();
            $scope.selectedCity = "London";
            $scope.geocodingUrl = geolocationUrlStart + $scope.selectedCity + geolocationUrlEnd;
            $scope.getGeolocation();
        };
    });
