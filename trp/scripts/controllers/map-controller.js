app.controller('MapController', ['$scope', '$localStorage', 'MapFactory', '$location', '$filter', function ($scope, $localStorage, MapFactory, $location, $filter) {


    google.maps.event.addDomListener(window, 'load', function () {
        MapFactory.createMap('map-canvas',$scope);
        MapFactory.setCurrentMap("gmap");
        MapFactory.createOSMMap('map-canvas-osm');

        google.maps.event.addListener(MapFactory.getMap().map, 'mousemove', function (e) {
            var latlng = e.latLng.lng().toFixed(3) + "," + e.latLng.lat().toFixed(3);
            $(".cursor-coordinates").text(latlng);

        });
    });


    

}]);
