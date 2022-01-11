app.controller('AssetTypeFilterController', ['$scope', '$localStorage', 'AssetFilterFactory', 'AssetInformationFactory', '$location', '$filter', 'CommonFactory', 'MapFactory', '$rootScope', function ($scope, $localStorage, AssetFilterFactory, AssetInformationFactory, $location, $filter, CommonFactory, MapFactory, $rootScope) {

    $scope.AssetList = [];
    $scope.AssetTypeList = [{ AssetTypeID: 0, Name: "Select Asset Type...", Url: null, ObjectOrder: null, Remark: null }];
    $scope.selectedType = $scope.AssetTypeList[0];

    $scope.loadingTypeFilter = false;
    $scope.Sensor1Label = $localStorage.AccountSensor1Label;
    $scope.Sensor2Label = $localStorage.AccountSensor2Label;


    $scope.queryTypeFilter = function () {
        $scope.loadingTypeFilter = true;
        var type = $scope.selectedType.Name;
        AssetFilterFactory.getAssetTypeFilterList(type, function (data) {
            data.forEach(function (d) {
                d.Status1 = d.Status.replace('Active,', '');
                d.GPSTime = CommonFactory.convertTimeZone(d.GPSTime);
            });
            $scope.AssetList = data;
            $scope.loadingTypeFilter = false;
        }, function (err) {
            $scope.AssetList = [];
            $scope.loadingTypeFilter = false;
        });
    }

    $scope.getAssetTypeList = function () {
        AssetInformationFactory.getAssetTypeList(
            function (res) {
                if (res != null)
                {
                    res.forEach(function (data) {
                        $scope.AssetTypeList.push(data);
                    });
                }
            }, function (error) {
                console.log(error.message);
            });
    };

    $scope.getAssetTypeList();


    $scope.panMarker = function (data) {

        var lastAsset = CommonFactory.getAsset();
        CommonFactory.setAsset(lastAsset);
        $scope.isClicked = data.AssetID;

        data['queryType'] = 'pan';
        data['showOnMap'] = true;

        MapFactory.panMarker('asset' + data.AssetID);
        MapFactory.showMarker('asset' + data.AssetID, true);

        $rootScope.$emit("setAsset", data.AssetID);

        $rootScope.$emit("getDeliveriesData", {});
        $rootScope.$emit("getDriverData", {});
        $rootScope.$emit("getAssetZoneList", {});
        $rootScope.$emit("assetTracer", {});

        CommonFactory.setClearMap(false);
    };


    $scope.exportArray = [];
    $scope.exportFile = function (fileType) {

        $scope.exportArray = [];

        $scope.viewData.filtered.forEach(function (csv) {

            if ($scope.selected) {

                $scope.CsvFileName = $localStorage.username + '-' + getDateTimeToday() + '(' + $scope.selectedType.Name + ').' + fileType;
            } else {
                $scope.CsvFileName = $localStorage.username + '-' + getDateTimeToday() + '(' + $scope.selectedType.Name + ').' + fileType;
            }

            $scope.exportArray.push({
                'Name': csv.Name,
                'GPS Time': $filter('date')(csv.GPSTime, "yyyy-MM-dd HH:mm:ss"),
                'Speed-Course': csv.Speed + ' kph, ' + csv.DirectionDegrees + ' ' + csv.DirectionCardinal,
                'Status': csv.Status1,
                'Fuel (L)': csv.Fuel < 0 ? 'N/A' : csv.Fuel,
                'Temp 1 (°C)': csv.Temperature1 < 0 ? "N/A" : csv.Temperature1,
                'Temp 2 (°C)': csv.Temperature2 < 0 ? "N/A" : csv.Temperature2,
                'Sensor 1': (csv.Sensor1) ? 'On' : 'Off',
                'Sensor 2': (csv.Sensor2) ? 'On' : 'Off',
            });

        });

        alasql('SELECT * INTO XLSX("' + $scope.CsvFileName + '",{headers:true}) FROM ?', [$scope.exportArray]);
    };


    $scope.exportFileType = false;
    $scope.exportPanel = function () {

        if ($scope.exportFileType == false) {

            $scope.exportFileType = true;
            $('#export-type-filter-asset').show("slide");

        } else {

            $scope.exportFileType = false;
            $('#export-type-filter-asset').hide("slide");
        }

    }

}]);