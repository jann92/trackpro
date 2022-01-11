app.controller('TrackMyTruckController', ['$scope', '$localStorage', '$interval', 'AssetFactory', function ($scope, $localStorage, $interval, AssetFactory) {

    var url = new URL(window.location.href);
    var assetid = url.searchParams.get("assetid");
    var assetname = url.searchParams.get("assetname");
    var username = url.searchParams.get("username");

    var imagesURL = "http://login.philgps.com/imgres/";

    $scope.AssetGPSInformation = null;

    $scope.convertTimeZone = function (gpsTime) {
        var offset = (new Date().getTimezoneOffset() / 60) * -1;
        var gpsTime = Date.parse(gpsTime);
        var date = moment(gpsTime).utcOffset(offset).format('YYYY-MM-DD HH:mm:ss');
        return date;
    }

    if (assetid)
    {
        AssetFactory.getTrackMyTruckGPSInfoByID(assetid, username, function (success) {

            success.GPSTime = $scope.convertTimeZone(success.GPSTime);

            $scope.AssetGPSInformation = success;

            var longlat = { lat: success.Latitude, lng: success.Longitude };

            var map = new google.maps.Map(
                document.getElementById('map'), { zoom: 10, center: longlat });

            var m = $scope.getMarkerIconSpecifications(success.TypeName, success.Status, success.DirectionDegrees, success.Speed);

            var marker = new google.maps.Marker({
                position: longlat,
                map: map,
                icon: {
                    url: m.url,
                    scaledSize: new google.maps.Size(100, 100),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(50, 50)
                }
            });
        }, function (error) {
            console.log(error);
            $scope.createAlert("Error", "Asset ID or Username is Incorrect.");
        });

    }
    else if (assetname)
    {
        AssetFactory.getTrackMyTruckGPSInfoByName(assetname, username, function (success) {

            success.GPSTime = $scope.convertTimeZone(success.GPSTime);

            $scope.AssetGPSInformation = success;

            var longlat = { lat: success.Latitude, lng: success.Longitude };

            var map = new google.maps.Map(
                document.getElementById('map'), { zoom: 10, center: longlat });

            var m = $scope.getMarkerIconSpecifications(success.TypeName, success.Status, success.DirectionDegrees, success.Speed);

            var marker = new google.maps.Marker({
                position: longlat,
                map: map,
                icon: {
                    url: m.url,
                    scaledSize: new google.maps.Size(100, 100),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(50, 50)
                }
            });
        }, function (error) {
            console.log(error);
            $scope.createAlert("Error", "Asset Name or Username is Incorrect.");
        });

    }
    

    $scope.getMarkerIconSpecifications = function (typeName, status, directionDegrees, speed) {
        var color;
        if (status != undefined) {
            if (status.indexOf("Inactive,") != -1) {
                color = 'rgb(136, 136, 136);';
            }
            else {
                if (status.indexOf("Active") != -1) {
                } if (status.indexOf("Driving") != -1) {
                    color = '#22b573';
                } if (status.indexOf("Parking") != -1 || status.indexOf("Over Park") != -1) {
                    color = 'rgb(0, 51, 153)';
                } if (status.indexOf("Idling") != -1) {
                    color = '#F4D600';
                } if (status.indexOf("Over Speed") == true) {
                    color = 'rgb(102, 255, 102)';
                } if (status.indexOf("Over Idle") == true) {
                    color = 'rgb(229, 157, 31)';
                } if (status.indexOf("SOS") == true) {
                    color = 'rgb(255, 0, 0)';
                } if (status.indexOf("Battery Cut") == true) {
                    color = 'rgb(255, 0, 0)';
                } if (status.indexOf("Power Cut") == true) {
                    color = 'rgb(255, 0, 0)';
                } if (status.indexOf("Engine Stop") == true) {
                    color = '#CC3333';
                }
            }
        }


        var direction = "";
        var smoke = "";
        var assetStatus = "";

        if (status != undefined) {

            if (status.indexOf("Inactive") != -1) {
                direction = '';
                assetStatus = 'inactive';
            } else {
            

                if ((status.indexOf("Engine Stop") != -1) || (status.indexOf("Battery Cut") != -1) || (status.indexOf("OverIdle") != -1) || (status.indexOf("OverSpeed") != -1) || (status.indexOf("SOS") != -1)) {
                    if (status.indexOf("Driving") != -1) {
                        assetStatus = "alert_";
                    } else if (status.indexOf("Parking") != -1 || status.indexOf("OverPark") != -1) {
                        assetStatus = "parking_alert";
                    } else if (status.indexOf("Idling") != -1 || status.indexOf("OverIdle") != -1) {
                        assetStatus = "idling_alert";
                    }
                } else {
                    if (status.indexOf("Driving") != -1) {
                        assetStatus = "driving_";
                    } else if (status.indexOf("Parking") != -1) {
                        assetStatus = "parking";
                    } else if (status.indexOf("Idling") != -1) {
                        assetStatus = "idling";
                    } 
                   
                }


                if (directionDegrees <= 22.5) {
                    direction = 'N';
                } else if (directionDegrees <= 67.5) {
                    direction = 'NE';
                } else if (directionDegrees <= 112.5) {
                    direction = 'E';
                } else if (directionDegrees <= 157.5) {
                    direction = 'SE';
                } else if (directionDegrees <= 202.5) {
                    direction = 'S';
                } else if (directionDegrees <= 247.5) {
                    direction = 'SW';
                } else if (directionDegrees <= 292.5) {
                    direction = 'W';
                } else if (directionDegrees <= 337.5) {
                    direction = 'NW';
                } else {
                    direction = 'N';
                }

                if (status.indexOf("Parking") != -1 || status.indexOf("Idling") != -1 || status.indexOf("OverIdle") != -1 || status.indexOf("Overpark") != -1) {
                    direction = "";
                }
            }

        }
        
        var iconURL = '';
        if (assetStatus == '') {
            iconURL = imagesURL + 'assets/' + typeName + '/' + typeName + '.gif';
        } else {
            iconURL = imagesURL + 'assets/' + typeName + '/' + typeName + "_" + assetStatus + direction + '.gif';
        }

        var scale = (directionDegrees >= 0 && directionDegrees < 180) ? -1 : 1;
        var translate = (directionDegrees >= 0 && directionDegrees < 180) ? 100 : 0;

        var specifications = {
            translateX: 0
            , scaleX: scale
            , url: iconURL
            , statusColor: color
        };

        return specifications;

    };
    

    $scope.createAlert = function (title,message) {
        $('#alert_placeholder').show('slide');
        message = (message == null ? "Please contact your administrator for more information." : message);
        $('#alert_placeholder').html('<div class="alert alert-custom"><div class="dismiss alert-custom-header"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><span class="font-15px">' + title + '</span></div><div class="alert-custom-body"><span class="font-11px">' + message + '</span></div></div>')
        setTimeout(function () {
            $('#alert_placeholder').hide('slide');
        }, 8000);
    }
 
}]);