app.controller('AssetTracerController', ['$scope', '$localStorage', '$filter', 'CommonFactory', 'MapFactory', 'AssetInformationFactory', 'AssetHistoryFactory', '$interval', '$rootScope', function ($scope, $localStorage, $filter, CommonFactory, MapFactory, AssetInformationFactory, AssetHistoryFactory, $interval, $rootScope) {
    $scope.assetTracerList = [];
    $scope.tracing = false;
    $scope.SelectedAsset = null;
    var intervalCount = 0;


    $rootScope.$on("clearAssetTracer", function () {
        $scope.SelectedAsset = null;
        $scope.clearTracer();
    });


    $rootScope.$on("assetTracerInterval", function () {
        if ($scope.tracing) {
            $scope.getCurrentGPS();
        }
    });


    $rootScope.$on("assetTracer", function () {
        //$scope.assetActiveTrace = CommonFactory.getAsset();
        if (!$scope.tracing) {
            if ($scope.SelectedAsset != null) {
                //$scope.clearTracer();
            }

            $scope.SelectedAsset = CommonFactory.getAsset();
        }
    });


    $scope.$watch(function () {
        return CommonFactory.getTracer();
    }, function (data) {
        //$scope.assetTracer = [];
        if (data != null) {
            if ($scope.tracing) {
                if (data.AssetID !== $scope.SelectedAsset.AssetID) {
                    $scope.RemovePolyline($scope.assetTracerList);
                    //$scope.clearTracer();
                    $scope.tracer();
                }
                else {
                    $scope.stopTracer();
                }
            }
        }
    }, true);


    $scope.openAssetList = function () {
        $('.left-side-panel-menu-item').removeClass('side-panel-menu-item-active active-icon');
        $('.left-side-content-container').hide("slide");
        $('#lspmi-asset').addClass('side-panel-menu-item-active active-icon');
        $('#asset').show("slide");
    };


    //tracer
    $scope.tracer = function () {
        if (!$scope.tracing) {
            $scope.assetTracerList = [];
            $scope.tracing = true;
            $scope.getCurrentGPS();
        }
        else {
            $scope.tracing = false;
            $scope.stopTracer();
        }
    }


    //stop tracer
    $scope.stopTracer = function () {
        $scope.tracing = false;
        //remove focus asset
        $rootScope.$emit("removeFocusAsset", {});
        var data = $scope.assetActiveTrace;

        if (data != null) {

            data.focusOnMap = false;
            CommonFactory.setFocusAsset(data);
        }
    }


    //clear tracer
    $scope.clearTracer = function () {
        //set tracing to false
        $scope.tracing = false;

        //remove polyline and marker
        $scope.RemovePolyline($scope.assetTracerList);

        //remove focus asset
        $rootScope.$emit("removeFocusAsset", {});
        var data = $scope.assetActiveTrace;

        if (data != null) {

            data.focusOnMap = false;
            CommonFactory.setFocusAsset(data);
        }

        $scope.assetTracerList = [];

        if ($scope.SelectedAsset !== null) {

            if ($scope.SelectedAsset.AssetID !== CommonFactory.getAsset().AssetID) {
                //replace selected data with the current selected
                $scope.SelectedAsset = CommonFactory.getAsset()
            }
            else {
                //remove data from variables
                //$scope.SelectedAsset = null;
            }
        }


    }


    //get gps data every interval
    $scope.getCurrentGPS = function () {

        MapFactory.panMarker('asset' + $scope.SelectedAsset.AssetID);

        var assetGPSData;
        $rootScope.$emit("setAssetInformation", {});

        AssetInformationFactory.getAssetGPSInformation($scope.SelectedAsset.AssetID, function (result) {
            assetGPSData = result;

            var assetData = {
                Status: assetGPSData.Status,
                Location: assetGPSData.Location,
                GPSTime: CommonFactory.convertTimeZone(assetGPSData.GPSTime),
                GPSTimeRaw: assetGPSData.GPSTime,
                Speed: assetGPSData.Speed,
                Latitude: assetGPSData.Latitude,
                Longitude: assetGPSData.Longitude,
                DirectionDegrees: assetGPSData.DirectionDegrees,
                DirectionCardinal: assetGPSData.DirectionCardinal,
                SIMNumber: assetGPSData.SIMNumber,
                CustomerName: assetGPSData.CustomerName,
                AssetName: assetGPSData.assetName,
                Name: assetGPSData.Name,
                Odometer: assetGPSData.Odometer,
                AssetID: assetGPSData.AssetID
            };

            var data = $scope.SelectedAsset;
            if ($scope.assetTracerList.length > 0) {
                var tracerListCheck = $.grep($scope.assetTracerList, function (e) {
                    return e.GPSTime === formatDateTime(assetData.GPSTimeRaw);
                });

                if (tracerListCheck.length === 0) {
                    $scope.assetTracerList.push(assetData);
                    ////
                    //focus asset 
                    //remove focus on all assets
                    var cus = CommonFactory.getCustomerList();
                    cus.forEach(function (customer) {
                        customer.AssetList.forEach(function (gps) {
                            gps.focusOnMap = false;
                        });
                    });

                }

            }
            else {
                $scope.assetTracerList.push(assetData);

            }
            //set focus to true on current selected asset
            data.focusOnMap = true;
            CommonFactory.setFocusAsset(data);
            $scope.DrawPolylineTrace();


        }, function (error) {

        });




    }


    //draw polyline on map
    $scope.DrawPolylineTrace = function () {

        var pointsCollection = [];
        $scope.RemovePolyline($scope.assetTracerList);

        $scope.assetTracerList = $scope.assetTracerList.filter(function (elem, index, self) {
            return index == self.indexOf(elem);
        });

        $scope.assetTracerList.forEach(function (g) {
            var pt = MapFactory.createPoint(g.Latitude, g.Longitude);
            pointsCollection.push(pt);
            var color = CommonFactory.getStatusColor(g.Status);

            var tracerMarker = MapFactory.createTracerMarker({ labelAnchor: { x: 30, y: 15 }, color: color }, { directionDegrees: g.DirectionDegrees, Latitude: g.Latitude, Longitude: g.Longitude, AssetID: g.AssetID }, g.AssetID);
            MapFactory.addMarker(tracerMarker, 'tracer');

        });

        var tracerPoly = MapFactory.createPolyline(pointsCollection, { strokeWeight: 10, strokeColor: '#22b573', strokeOpacity: 0.5 }, 'assetTracer');
        MapFactory.addPolyline(tracerPoly, 'tracer');
    }


    //remove polyine
    $scope.RemovePolyline = function (traceData) {
        traceData.forEach(function (g) {
            MapFactory.removeMarker(g.AssetID, 'tracer');
        });
        MapFactory.removePolyline('assetTracer');
    }


    //pan tracer marker
    $scope.panMarker = function (data) {
        $scope.isClicked = data.AssetID;
        MapFactory.panMap(data.Latitude, data.Longitude);
    };


    //export
    $scope.exportArray = [];
    $scope.exportFile = function (fileType) {
        $scope.exportArray = [];
        $scope.assetTracerList.forEach(function (csv) {
            $scope.CsvFileName = $localStorage.username + '-' + getDateTimeToday() + '(Asset Tracer) - ('+ csv.AssetName +').' + fileType;
            $scope.exportArray.push({
                'Name': csv.Name,
                'Coordinates': csv.Latitude + ', ' + csv.Longitude,
                'Speed-Course': csv.Speed + ' kph, ' + csv.DirectionDegrees + ' ' + csv.DirectionCardinal,
                'GPSTime': $filter('date')(csv.GPSTime, "yyyy-MM-dd HH:mm:ss"),
                'Status': csv.Status,
                'Odometer': csv.Odometer,
                'Customer': csv.CustomerName,
                'SIM Number': csv.SIMNumber,
                'Location': csv.Location
            });
        });
        var exportData = $scope.exportArray.sort(function (a, b) {
            return new Date(b.GPSTime) - new Date(a.GPSTime)
        });
        alasql('SELECT * INTO XLSX("' + $scope.CsvFileName + '",{headers:true}) FROM ?', [exportData]);
    };

    $scope.exportFileType = false;

    $scope.exportPanel = function () {
        if ($scope.exportFileType == false) {
            $scope.exportFileType = true;
            $('#export-file-asset-tracer').show("slide");
        } else {
            $scope.exportFileType = false;
            $('#export-file-asset-tracer').hide("slide");
        }

    }


    //export to kml
    $scope.exportToKML = function (_list, _type) {

        $scope.exportArray = [];
        var polylinePoints = [];

        var KMLPoints = "";

        $scope.assetTracerList.forEach(function (trace) {

            //get status color of icon
            var iconStatusColor = CommonFactory.getStatusColorKML(trace.Status);

            if (iconStatusColor) {
                trace.IconStatusColor = iconStatusColor;
            }

            //set polyline KML points
            KMLPoints += trace.Longitude + "," + trace.Latitude + ",0 ";


            $scope.exportArray.push(trace);

        });

        $scope.exportArray['KMLPoints'] = KMLPoints;

        var result = MapFactory.exportToKML($scope.exportArray, 'tracer');

        downloadFileString($localStorage.username + '-' + getDateTimeToday() + '(Asset-Tracer) - (' + $scope.assetTracerList[0].AssetName + ')' + '.kml', result);

    }
}]);
