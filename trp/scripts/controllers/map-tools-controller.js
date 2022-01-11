app.controller('MapToolsController', ['$scope', '$localStorage', 'AssetFilterFactory', '$location', '$filter', 'CommonFactory', 'MapFactory','$rootScope', function ($scope, $localStorage, AssetFilterFactory, $location, $filter, CommonFactory, MapFactory, $rootScope) {

    $scope.showAllMarkers = false;
    $scope.assetRefresh = true;
    $scope.trafficLayer = false;
    $scope.mapSource = false;
    $scope.mapView = false;
    var mapInstance = MapFactory.getMap();
    $scope.clusterAllMarkers = false;

    $scope.PlaceListData = [];

    $rootScope.$on("clusterMarker", function () {
        $scope.clusterAllAssetMarkers();
    });


    $rootScope.$on("clearMap", function (data) {
        //hide zones and landmarks
        $scope.showAllLandmarks = false;
        $scope.showAllPolygons = false;

        //uncheck the checkboxes in assetlist
        CommonFactory.getCustomerList().forEach(function (cus) {
            cus.isChecked = false;
            cus.AssetList.forEach(function (a) {
                a.isChecked = false;
            });
        });

        //clear satellite
        $scope.mapView = false;
        MapFactory.changeMapType("Road");

        //clear traffic
        $scope.trafficLayer = false;
        MapFactory.showTraffic($scope.trafficLayer);

        //hide all zones
        MapFactory.toggleGeoJSONZone(false);
     
        $scope.showAllMarkers = false;
        $scope.clusterAllMarkers = false;

        $rootScope.$emit("clearAssetTracer", {});
        $rootScope.$emit("clearAssetZoneList", {});
        $rootScope.$emit("clearAssetInformation", {});
        $rootScope.$emit("clearAssetDeliveries", {});
        $rootScope.$emit("clearAssetDriver", {});
        $rootScope.$emit("clearAssetHistory", {});

    });


    //Place Search
    $scope.placeSearch = function () {
        MapFactory.placeSearch("map-search-input");
    }


    $scope.$watch(function () {
        return CommonFactory.getShowAllLandmarks();
    }, function (data) {

        $scope.showAllLandmarks = data;

    }, true);

    $scope.$watch(function () {
        return CommonFactory.getShowAllZones();
    }, function (data) {
        $scope.showAllPolygons = data;
    }, true);


    $scope.toggleViewPolygon = function () {

        CommonFactory.setShowAllZones($scope.showAllPolygons);

        if ($scope.showAllPolygons === false) {

            MapFactory.toggleGeoJSONZone(false);

        } else {

            MapFactory.toggleGeoJSONZone(true);

        }
    }


    $scope.toggleViewLandmarks = function () {

        CommonFactory.setShowAllLandmarks($scope.showAllLandmarks);

        if ($scope.showAllLandmarks == false) {

            MapFactory.toggleVisibilityLandmark(false);

        } else {

            MapFactory.toggleVisibilityLandmark(true);

        }

    }


    $scope.toggleMapSource = function () {
        $("#map-canvas").toggle();

        MapFactory.refreshMap();

        $("#map-canvas-osm").toggle();

        CommonFactory.setUserZoneList('');

        var cus = CommonFactory.getCustomerList();

        if ($scope.mapSource === true) {

            MapFactory.setCurrentMap('omap');
            MapFactory.getMap().map.on('mousemove click', function (e) {
                var latlng = e.latlng.lng.toFixed(3) + "," + e.latlng.lat.toFixed(3);
                $(".cursor-coordinates").text(latlng);
            });

        }
        else {

            MapFactory.setCurrentMap('gmap');
            google.maps.event.addListener(MapFactory.getMap().map, 'mousemove', function (e) {
                var latlng = e.latLng.lng().toFixed(3) + "," + e.latLng.lat().toFixed(3);
                $(".cursor-coordinates").text(latlng);
            });

        }

        $scope.showAllMarkers = false;
        CommonFactory.setShowAllMarkers(false);
        MapFactory.toggleAllMarkers($scope.showAllMarkers);

        MapFactory.setMeasureRouteObjects('');
        MapFactory.rulerOff();
        $scope.toggleMapView();

    }


    $scope.toggleMapView = function () {

        if ($scope.mapView === false) {
            MapFactory.changeMapType("Road");
        } else {

            MapFactory.changeMapType("Satellite");
        }

        CommonFactory.setClearMap(false);
    };


    $scope.showTraffic = function () {

        MapFactory.showTraffic($scope.trafficLayer);
        CommonFactory.setClearMap(false);

    };


    //refresh map
    $scope.setRefreshAssets = function () {
        CommonFactory.setIntervalAssets($scope.assetRefresh);
    }


    //show all markers
    $scope.showAllAssetMarkers = function () {

        CommonFactory.setShowAllMarkers($scope.showAllMarkers);
        MapFactory.toggleAllMarkers($scope.showAllMarkers);

        if ($scope.showAllMarkers === true) {

            MapFactory.toggleAllMarkers(true);

            if ($localStorage.AssetCount > 300) {
                $scope.clusterAllMarkers = true;
                CommonFactory.setClusterAllMarkers(true);
                MapFactory.markerCluster(true);
            } else {
                $scope.clusterAllMarkers = false;
                MapFactory.markerCluster(false);
            }

          

            CommonFactory.getCustomerList().forEach(function (cus) {
                cus.isChecked = true;
                cus.AssetList.forEach(function (a) {
                    a.isChecked = true;
                });
            });

        } else {
            $scope.clusterAllAssetMarkers();
            MapFactory.toggleAllMarkers(false);
            $rootScope.$emit("removeFocusAsset", {});

            CommonFactory.getCustomerList().forEach(function (cus) {
                cus.isChecked = false;
                cus.AssetList.forEach(function (a) {
                    a.isChecked = false;
                });
            });
        }
        
    }


    //cluster markers
    $scope.clusterAllAssetMarkers = function () {
        CommonFactory.setClusterAllMarkers($scope.clusterAllMarkers);

        if ($scope.clusterAllMarkers === true) {

            MapFactory.markerCluster(true);

        } else {
            MapFactory.markerCluster(false);
        }
        CommonFactory.setClearMap(false);
    }


    $scope.mapContainer = true;
    $scope.mapToggle = function () {
        if ($scope.mapContainer) {
            $scope.mapContainer = false;
            $('.map-control').slideToggle({ direction: "up" }, 300);
            $('.left-side-panel-menu-container').css('top', '80px');
            $('.right-side-panel-menu-container').css('top', '81px');
            $('.side-panel-absolute').css('top', '220px');
            $('.history-window').addClass('history-window-top-220px');
        } else {
            $scope.mapContainer = true;
            $('.map-control').slideToggle({ direction: "down" }, 300);
            $('.left-side-panel-menu-container').css('top', '33px');
            $('.right-side-panel-menu-container').css('top', '35px');
            $('.side-panel-absolute').css('top', '170px');
            $('.history-window').removeClass('history-window-top-220px');
        }
    };

    $scope.placeSearchChange = function (event) {
        if (event.which == 13) {
            $.getJSON("https://nominatim.openstreetmap.org/search?format=json&limit=5&q=" + $scope.placeText, function (data) {
                $scope.PlaceListData = data;
            });
        }
        if (event.currentTarget.value == "") {
            $scope.PlaceListData = [];
            MapFactory.removePinMarker();
        }
    };

    $scope.placeClick = function (_pos) {
        var pos = { lat: _pos.lat, lng: _pos.lon };
        MapFactory.pinMarker(pos);
    }


    $scope.$watch(function () {
        return CommonFactory.getShowAllMarkers();
    }, function (data) {
        var customer = CommonFactory.getCustomerList();
        if (data == false) {
            customer.forEach(function (cus) {
                cus.AssetList.forEach(function (asset) {
                    asset.showOnMap = false;
                });
            });

        } else {

            customer.forEach(function (cus) {
                cus.AssetList.forEach(function (asset) {
                    asset.showOnMap = true;
                });
            });
        }

    });

    //Search Asset
    $scope._selected;
    $scope.searchAsset = function () {
        var customer = CommonFactory.getCustomerList();
        var assetList = [];
        customer.forEach(function (cus) {
            cus.AssetList.forEach(function (asset) {
                assetList.push(asset);
            })
        })
        $scope.filterAsset = assetList;
    }


    $scope.ngModelOptionsSelected = function (value) {
        if (arguments.length) {
            $scope._selected = value;
        } else {
            return $scope._selected;
        }
    };


    $scope.modelOptions = {
        debounce: {
            default: 500,
            blur: 250
        },
        getterSetter: true
    };


    $scope.$watch(function () {
        return $scope._selected;
    }, function (data) {
        if (data != null) {

            if (angular.isObject(data)) {

                MapFactory.mapZoom();
                MapFactory.panMarker('asset' + data.AssetID);
                data.showOnMap = true;
                CommonFactory.setAsset(data);
                MapFactory.showMarker("asset" + data.AssetID, true);

            }
        }
    }, true);
    //End Search Asset

    //$scope.placeSearch();

    setTimeout(function () {
        var count = $localStorage.AssetCount;
        if (count > 300) {
            $("#td-cbx-cluster").hide();
        } else {
            $("#td-cbx-cluster").show();
        }
    }, 2000);
}]);

