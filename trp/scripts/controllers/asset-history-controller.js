app.controller('AssetHistoryController', ['$scope', '$localStorage', '$location', '$filter', 'CommonFactory', 'MapHistoryFactory', 'AssetHistoryFactory','$rootScope', function ($scope, $localStorage, $location, $filter, CommonFactory, MapHistoryFactory, AssetHistoryFactory, $rootScope) {
    $scope.history = [];

    $scope.historyDayOptions = [{ id: 1, value: '1 day'},{ id: 2, value: '2 days'},{ id: 3, value: '3 days'}, {id: 4, value: '4 days'},{ id: 5, value: '5 days'}, {id: 6, value: '6 days'}, {id: 7, value: '7 days' }];
    $scope.selectedHistoryDayOption = $scope.historyDayOptions[0];

    $scope.polylinegclist = [];
    $scope.loading = false;
    $scope.hasAsset = false;
    $scope.markerInstance = {};
    $scope.playButton = "Play";
    $scope.isStop = false;
    $scope.period = {
        start: getPreviousDay().date,
        end: getDateNoTimeToday() + ' 23:59',
        prevday: getPreviousDay().day,
        prevmonth: getPreviousDay().month,
        prevyear: getPreviousDay().year
    };

    
    $scope.prevday = getPreviousDay().day;
    $scope.prevmonth = getPreviousDay().month;
    $scope.prevyear = getPreviousDay().year;

    $scope.isPlayHistory = false;

  
    $scope.ZoneNewMode = null;

    $scope.$watch(function () {
        return $scope.playbackToggle;
    }, function (data) {
        if (data != null) {
            if (!data) {
                $scope.playButton = "Play";
                $scope.isStop = false;
            }
        }
    }, true);


    $scope.$watch(function () {
        return $scope.period;
    }, function (data) {
        $scope.period.start = data.start;
        $scope.period.end = data.end;
        $scope.period.prevday = data.prevday;
        $scope.period.prevmonth = data.prevmonth;
        $scope.period.prevyear = data.prevyear;
    }, true);

    $scope.historyDayChange = function () {
        $scope.period.start = getYesterDay($scope.selectedHistoryDayOption.id).date;
    }


    $scope.openAssetList = function () {
        $('.left-side-panel-menu-item').removeClass('side-panel-menu-item-active active-icon');
        $('.left-side-content-container').hide("slide");
        $('#lspmi-asset').addClass('side-panel-menu-item-active active-icon');
        $('#asset').show("slide");
    };


    $scope.polyOptions = function (color, area) {
        return {
            strokeColor: color,
            strokeOpacity: 1,
            strokeWeight: 6
        }
    };


    $rootScope.$on("clearAssetHistory", function () {
        $scope.hasAsset = false;
        $scope.clearHistory();
    });


    $scope.$watch(function () {
        return $scope.ZoneNewMode;
    }, function (data) {
        CommonFactory.setZoneNewMode(data);
    });


    $scope.$watch(function () {
        return CommonFactory.getAsset();
    }, function (data) {
        if (data != null) {
            if (data.length != 0) {
                $scope.hasAsset = true;
                if ($scope.assetName != data.Name) {
                    $scope.assetName = data.Name;
                    $scope.clearHistory();
                }
            } else {
                $scope.hasAsset = false;
                $scope.history = [];
            }
        }
    }, true);



    $scope.queryHistory = function () {
        $localStorage.module = 'AssetZones';
        $rootScope.$emit("getAssetZoneList", {});

        $scope.loading = true;
        $scope.asset = CommonFactory.getAsset();
        var assetName = $scope.asset.Name;
        $scope.assetName = assetName;
        $scope.isStop = false;

        if ($scope.asset != {}) {

            if ($scope.period.start < $scope.period.end) {

                //get difference of start date and end date in hours
                var hours = Math.floor(Math.abs(new Date($scope.period.start) - new Date($scope.period.end)) / 36e5);
                var diffMs = Math.abs(new Date($scope.period.end) - new Date($scope.period.start));
                var minutes = Math.floor((diffMs / 1000) / 60);

                if (minutes <= 10080) {

                    AssetHistoryFactory.getHistory($scope.period, $scope.asset.AssetID, function (success) {
                        success.forEach(function (e) {

                            if (e.Location)

                                e.GPSTimeStart = CommonFactory.convertTimeZone(e.GPSTimeStart);
                            e.GPSTimeEnd = CommonFactory.convertTimeZone(e.GPSTimeEnd);
                            if (e.Status.Description === "Driving") {
                                e.GPSTime = e.GPSTimeStart;
                            } else {
                                if (e.GPSTimeStart === e.GPSTimeEnd) {
                                    e.GPSTime = e.GPSTimeStart;
                                } else {
                                    e.GPSTime = e.GPSTimeStart + ' to ' + e.GPSTimeEnd;
                                }
                            }
                        });

                        $scope.history = success;
                        $scope.loading = false;

                        if (success.length == 0) {
                            CommonFactory.createAlert("No Data Found", '');

                        }
                        $scope.isPlayHistory = false;

                    }, function (error) {
                        $scope.loading = false;
                        CommonFactory.createAlert("No Data Found", '');
                    });
                } else {
                    $scope.loading = false;
                    CommonFactory.createAlert("Error","You can only query history for maximum of 7 days.");
                }

            } else {
                $scope.loading = false;
                CommonFactory.createAlert("Error", "Start date should not greater than End date.");
            }

            
        } else {
            CommonFactory.createAlert("No data found.", "Failed to establish connection. Please contact your administrator for more information.");
        }
    }


    //downloads
    $scope.downloadDailyCSV = function () {
        $scope.asset = CommonFactory.getAsset();


        if ($scope.period.start < $scope.period.end) {

            //get difference of start date and end date in hours
            var hours = Math.floor(Math.abs(new Date($scope.period.start) - new Date($scope.period.end)) / 36e5);
            var diffMs = Math.abs(new Date($scope.period.end) - new Date($scope.period.start));
            var minutes = Math.floor((diffMs / 1000) / 60);


            if (minutes <= 10080) {

                if ($scope.asset != null) {
                    var params = {
                        SelectedAsset: $scope.asset.AssetID,
                        DateTimePeriod: {
                            Start: $scope.period.start,
                            End: $scope.period.end
                        }
                    }

                    AssetHistoryFactory.getDownloadsList(params, function (res) {
                        $scope.DownloadsList = res;
                    }, function (error) {
                        $scope.DownloadsList = [];
                        CommonFactory.CreateAlert("No Data Found", '');
                    })
              
                }
            } else {
                CommonFactory.createAlert("Error", "You can only query history for maximum of 7 days.");
            }

        }


    };



    $scope.clearHistory = function () {
        if ($scope.history.length > 0) {
            CommonFactory.setHistoryRun(false);
            $scope.history = [];
            $scope.line = [];
            $scope.isStop = false;
            MapHistoryFactory.stopAnimateHistoryMarker();
            MapHistoryFactory.clearHistory();
            $scope.playButton = "Play";
            $("#historyMap").hide("slide");
            $("#map-search-input").show();
            $("#map-search-input-history").hide();
        }
    }

    $scope.stopAnimateHistoryMarker = function () {
        $scope.markerInstance = MapHistoryFactory.stopAnimateHistoryMarker();
        $scope.playButton = "Play";
    }

    $scope.addPicker = function () {
        localStorage.setItem('history', 'from');
    }

    $scope.statusColor = function (status) {
        return CommonFactory.getStatusLeftBorderColor(status);
    }


    createPolylineObject = function (line,marker) {

        $scope.polylinegclist = [];

        line.forEach(function (gc, index) {
                var point = MapHistoryFactory.createPoint(gc.Latitude, gc.Longitude);
                $scope.polylinegclist.push(point);
        });
        var polyline = MapHistoryFactory.createPolyline($scope.polylinegclist, $scope.polyOptions("#eb6e80"), $scope.asset.AssetID, marker);

        MapHistoryFactory.addPolyline(polyline, 'history');

        return polyline;
    }


    $scope.fullScreen = function () {
        $("#historyMap").css({ "position": "fixed", "height": "100%", "width": "100%", "display": "block", "right": "0px" }, function () {
            MapHistoryFactory.refreshMap();
        });

    }


    $scope.panMarker = function (history) {
        MapHistoryFactory.panMarker(history);
    };


    $scope.playbackhistory = function () {
        $scope.isPlayHistory = true;
        MapHistoryFactory.placeSearch("map-search-input-history");
        $("#map-search-input").hide();
        $("#map-search-input-history").show();
        if ($scope.playButton === "Play") {

            var hmap = MapHistoryFactory.createMap('history-map-canvas');
            $("#historyMap").slideDown("fast", function () {

                MapHistoryFactory.refreshMap();

                var asset = CommonFactory.getAsset();

                var marker = ($scope.markerInstance['id']) ? $scope.markerInstance : createAssetMarker($scope.history[0]);
                var polyline = createPolylineObject($scope.history, marker);

                if ($scope.isStop === true) {

                    MapHistoryFactory.animateHistoryMarker(marker, $scope.line);
                }
                else {

                    $scope.line = [];

                    $scope.history.forEach(function (gc) {
                            var content = {};
                            var directionDegrees = parseInt(gc.DirectionDegrees);
                            var icon = CommonFactory.getObjectIconUrl(marker.content.TypeName, CommonFactory.getMarkerStatus(gc.Status, true));
                            var markerOptions = {
                                draggable: false
                              , visible: true
                              , labelClass: 'label-map'
                            };

                            marker = null;
                            marker = createAssetMarker(gc);

                            gc['icon'] = marker.icon;
                            var hMarker = plotMarker(gc);

                            gc['historyContent'] = hMarker;
                            $scope.line.push(gc);
                
                    });
                    MapHistoryFactory.animateHistoryMarker(marker, $scope.line);
                    $scope.isStop = true;
                }

                //create zones for selected asset.
                $rootScope.$emit("historyCreateZones", {});
            });

            CommonFactory.setHistoryRun(true);
        } else {

            $scope.markerInstance = MapHistoryFactory.stopAnimateHistoryMarker();
            $scope.playButton = "Play";
        }
    }


    createAssetMarker = function (gps) {
        var asset = CommonFactory.getAsset();
        var content = {
            AssetID: asset.AssetID
                         , Name: asset.Name
                         , Latitude: gps.Latitude
                         , Longitude: gps.Longitude
                         , TypeName: asset.TypeName
                         , Location: gps.Location
                         , GPSTime: gps.GPSTime
                         , Speed: gps.Speed
                         , DirectionCardinal: gps.DirectionCardinal
                         , DirectionDegrees: gps.DirectionDegrees
                         , Status: gps.Status
        };

        var marker = CommonFactory.createHistoryMarker(
                        'asset-history' + asset.AssetID
                        , asset.Name
                        , content
                        , 'history'
                        , false
                        , true
                        , 'label-map'
                        ,$scope);

        return marker;
    }


    $scope.createHistoryMarker = function (content, id) {

        var markerOptions = {
            draggable: false
          , visible: true
          , labelClass: 'label-map'
          , labelAnchor: { x: 30, y: 15 }
          , color: CommonFactory.getStatusColor(content.Status)
        };

        content['labelContent'] = "";

        var marker = MapHistoryFactory.createHistoryMarker(markerOptions, content, null, id, 'history',$scope);

        return marker;
    }


    plotMarker = function (res) {
        var content = {
            AssetID: res.AssetID
                , TrackID: res.TrackID
                , Latitude: res.Latitude
                , Longitude: res.Longitude
                , Location: res.Location
                , GPSTime: res.GPSTime
                , Speed: res.Speed
                , DirectionCardinal: res.DirectionCardinal
                , DirectionDegrees: res.DirectionDegrees
                , Status: res.Status
        };
        return $scope.createHistoryMarker(content, res.TrackID);
    }


    $scope.exportFileType = false;
    $scope.exportPanel = function () {
        if ($scope.exportFileType == false) {
            $scope.exportFileType = true;
            $('#export-file-history').show("slide");
        } else {
            $scope.exportFileType = false;
            $('#export-file-history').hide("slide");
        }
    }


    $scope.exportXLSX = false;
    $scope.exportCSV = false;


    $scope.exportArray = [];
    $scope.exportFile = function (fileType) {
        if (fileType === 'xlsx') {
            $scope.exportXLSX = true;
        } else if (fileType === 'csv') {
            $scope.exportCSV = true;
        }

        AssetHistoryFactory.getHistoryRow($scope.period, $scope.asset.AssetID, function (success) {
            console.log(success)
            if (fileType === 'xlsx') {
                $scope.exportXLSX = false;
            } else if (fileType === 'csv') {
                $scope.exportCSV = false;
            }

            $scope.exportArray = [];
            $scope.historyExport = angular.copy(success);
            $scope.historyExport.forEach(function (csv) {
                
                csv.GPSTime = CommonFactory.convertTimeZone(csv.GPSTime);
                $scope.CsvFileName = $localStorage.username + '-' + getDateTimeToday() + '(' + $scope.assetName + ').' + fileType;
                $scope.exportArray.push({
                    'Name': $scope.asset.Name,
                    'Latitude': csv.Latitude,
                    'Longitude': csv.Longitude,
                    'SpeedCourse': csv.Speed + ' kph, ' + csv.DirectionDegrees + ' ' + csv.DirectionCardinal,
                    'GPSTime': csv.GPSTime.replace('GMT+08:00',''),//$filter('date')(csv.GPSTime, "yyyy-MM-dd HH:mm:ss"),
                    'Status': csv.Status,
                    'Odometer': csv.Odometer,
                    'Fuel': csv.Fuel,
                    'Customer': $scope.asset.customerName,
                    'Location': csv.Location
                });

            });
            
            setTimeout(function () {
                TableToExcel.convert(document.getElementById("asset-history-table-export"), {
                    name: $localStorage.username + '-' + getDateTimeToday() + '(' + $scope.assetName + ').' + fileType
                });
            }, 1500);

            //alasql('SELECT * INTO XLSX("' + $scope.CsvFileName + '",{headers:true}) FROM ?', [$scope.exportArray]);

        }, function (error) {

            if (fileType === 'xlsx') {
                $scope.exportXLSX = false;
            } else if (fileType === 'csv') {
                $scope.exportCSV = false;
            }
        });
    };


    $scope.exportKML = false;


    $scope.exportToKML = function () {

        $scope.exportKML = true;

        $scope.exportKML = false;

        $scope.exportArray = [];


        var KMLPoints = "";

        $scope.history.forEach(function (data) {


            //get status color of icon
            var iconStatusColor = CommonFactory.getStatusColorKML(data.Status);

            if (iconStatusColor) {
                data.IconStatusColor = iconStatusColor;
            }

            //set polyline KML points
            KMLPoints += data.Longitude + "," + data.Latitude + ",0 ";

            $scope.exportArray.push(data);

        });

        $scope.exportArray['KMLPoints'] = KMLPoints;

        var result = MapHistoryFactory.exportFileKML($scope.exportArray, 'history');


        downloadFileString($localStorage.username + '-' + getDateTimeToday() + '(Asset-History) - (' + $scope.asset.Name + ')' + '.kml', result);


    };

}]);
