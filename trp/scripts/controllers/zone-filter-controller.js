app.controller('ZoneFilterController', ['$scope', '$localStorage', 'ZonesFactory', 'CommonFactory', 'MapFactory', '$location', '$filter', '$rootScope', '$interval', function ($scope, $localStorage, ZonesFactory, CommonFactory, MapFactory, $location, $filter, $rootScope, $interval) {
    //CommonFactory.getRoles($scope);


    $scope.CustomerList = {};
    $scope.FilteredAssets = [];
    $scope.ZoneAssetList = [];
    $scope.isClicked = false;
    $scope.Sensor1Label = $localStorage.AccountSensor1Label;
    $scope.Sensor2Label = $localStorage.AccountSensor2Label;
    //$scope.ZoneList = [];

    $scope.SelectZoneList = [
        {
            id: 0,
            name: 'Select Zone type...',
            allowed: null
        },
        {
            id: 1,
            name: 'All Zone',
            allowed: 'all'
        },
        {
            id: 2,
            name: 'Go Zone',
            allowed: true
        },
        {
            id: 3,
            name: 'No Zone',
            allowed: false
        }

    ];

    $scope.SelectedZone = $scope.SelectZoneList[0];

    $scope.getZoneList = function () {
        ZonesFactory.getZoneList(function (data) {
            //$scope.ZoneList = data;
            //$scope.ZoneList.unshift({ ZoneID: 0, Name: "Select Zone", IsAssigned: false });
            //$scope.SelectedZone = $scope.ZoneList[0];

        }, function (error) {

        });
    }

    //$scope.getZoneList();
    $scope.loadingInsideZone = false;
    $scope.queryZoneFilter = function () {
        $scope.loadingInsideZone = true;
        var allowed = $scope.SelectedZone.allowed;

        if (allowed == 'all')
        {
            ZonesFactory.getZoneFilterInsideAssetsAll(function (data) {
                if (data != null) {
                    data.forEach(function (d) {
                        d.GPSTime = CommonFactory.convertTimeZone(d.GPSTime);
                    });
                }
                $scope.ZoneAssetList = data;
                $scope.loadingInsideZone = false;
            }, function (error) {

            }); 
        }
        else
        {
            ZonesFactory.getZoneFilterInsideAssets(allowed, function (data) {
                if (data != null) {
                    data.forEach(function (d) {
                        d.GPSTime = CommonFactory.convertTimeZone(d.GPSTime);
                    });
                }
                $scope.ZoneAssetList = data;
                $scope.loadingInsideZone = false;
            }, function (error) {

            });
        }

    }


    $scope.$watch(function () {
        return CommonFactory.getAsset();
    }, function (data) {
        if(data != undefined)
        if (data.length > 0 || data != null) {
            $scope.isClicked = data.AssetID;
        }
    }, true);

    $scope.toggleVehicle = function (data) {
        $scope.isClicked = data.AssetID;
        if (data.showOnMap) {
            data.showOnMap = false;
            MapFactory.mapZoom();
            MapFactory.panMarker('asset' + data.AssetID);
        } else {
            MapFactory.mapZoom();
            MapFactory.panMarker('asset' + data.AssetID);
            data.showOnMap = true;
        }
        CommonFactory.setAsset(data);
        MapFactory.toggleMarkerVisibility(data.AssetID);
    };

    $scope.panMarker = function (data) {
        var lastAsset = CommonFactory.getAsset();
        CommonFactory.setAsset(lastAsset);
        $scope.isClicked = data.AssetID;

        data['queryType'] = 'pan';
        data['showOnMap'] = true;
        MapFactory.panMarker('asset' + data.AssetID);
        MapFactory.showMarker('asset' + data.AssetID, true);

        //CommonFactory.setAsset(data);
        $rootScope.$emit("setAsset", data.AssetID);

        //$rootScope.$emit("setAssetInformation", {});
        $rootScope.$emit("getDeliveriesData", {});
        $rootScope.$emit("getDriverData", {});
        $rootScope.$emit("getAssetZoneList", {});
        $rootScope.$emit("assetTracer", {});
       

        CommonFactory.setClearMap(false);
    };


    $scope.setAsset = function (data) {
        CommonFactory.setAsset(data);
        $(".right-side-panel-menu-item").removeClass('side-panel-menu-item-active active-icon');
        $('.right-side-content-container').hide("slide");
        $("#rspmi-asset-information").addClass('side-panel-menu-item-active active-icon');
        var target = $('#rspmi-asset-information').attr('data-slidetoggle');
        $('#' + target).show("slide");
    };
    $scope.viewZones = function (data) {
        CommonFactory.setAsset(data);
        $localStorage.module = 'AssetZones';
        $(".right-side-panel-menu-item").removeClass('side-panel-menu-item-active active-icon');
        $('.right-side-content-container').hide("slide");
        $("#rspmi-zones").addClass('side-panel-menu-item-active active-icon');
        var target = $('#rspmi-zones').attr('data-slidetoggle');
        $('#' + target).show("slide");
    };
    $scope.viewhistory = function (data) {
        CommonFactory.setAsset(data);
        $(".right-side-panel-menu-item").removeClass('side-panel-menu-item-active active-icon');
        $('.right-side-content-container').hide("slide");
        $("#rspmi-asset-history").addClass('side-panel-menu-item-active active-icon');
        var target = $('#rspmi-asset-history').attr('data-slidetoggle');
        $('#' + target).show("slide");
    };

    $scope.exportArray = [];
    $scope.exportFile = function (fileType) {
        $scope.exportArray = [];
        $scope.ZoneAssetList.forEach(function (csv) {
            $scope.CsvFileName = $localStorage.username + '-' + getDateTimeToday() + '(' + $scope.SelectedZone.name + ').' + fileType;
            $scope.exportArray.push({
                'Name': csv.Name,
                'GPS Time': $filter('date')(csv.GPSTime, "yyyy-MM-dd HH:mm:ss"),
                'Speed-Course': csv.Speed + ' kph, ' + csv.DirectionDegrees + ' ' + csv.DirectionCardinal,
                'Status': csv.Status,
                'Fuel (L)': csv.Fuel < 0 ? 'N/A' : csv.Fuel,
                'Temp 1 (°C)': csv.Temperature1 < 0 ? "N/A" : csv.Temperature1,
                'Temp 2 (°C)': csv.Temperature2 < 0 ? "N/A" : csv.Temperature2,
                'Sensor 1': (csv.Sensor1) ? 'On' : 'Off',
                'Sensor 2': (csv.Sensor2) ? 'On' : 'Off',
                'Zone': csv.GeofenceName,
            });
        });
        alasql('SELECT * INTO XLSX("' + $scope.CsvFileName + '",{headers:true}) FROM ?', [$scope.exportArray]);
    };
    $scope.exportFileType = false;
    $scope.exportPanel = function () {
        if ($scope.exportFileType == false) {
            $scope.exportFileType = true;
            $('#export-file-zone-asset').show("slide");
        } else {
            $scope.exportFileType = false;
            $('#export-file-zone-asset').hide("slide");
        }

    }
    $scope.getMessage = function (msg) {
        return (msg) ? "Hide in Map" : "Show in Map";
    }

    $scope.orderZoneValue = function (value) {
        return value;
    }
}]);