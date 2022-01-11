app.controller('NearestAssetController', ['$scope', 'CommonFactory', 'MapFactory', '$rootScope', '$filter','$localStorage', function ($scope, CommonFactory, MapFactory, $rootScope, $filter, $localStorage) {
    $scope.nearestAssetLists = [];

    var gmap = new googleMaps();

    $scope.$watch(function () {

        return MapFactory.getNearByObjects();
        //return $scope.nearestAssetLists;
    }, function (data) {
        $scope.nearestAssetLists = data;
        CommonFactory.getCustomerList().forEach(function (cus) {

            cus.AssetList.forEach(function (asset) {
                if (asset.showOnMap) {
                    MapFactory.showMarker('asset' + asset.AssetID, true);
                }
                else {
                    MapFactory.showMarker('asset' + asset.AssetID, false);
                }
            });
        });

        data.forEach(function (d) {
            MapFactory.showMarker("asset" + d.AssetID, true);
        });

    }, true);



    //pan marker
    $scope.panMarker = function (nearest) {

        $scope.isClicked = nearest.AssetID;
        MapFactory.panMarker("asset" + nearest.AssetID);
        $rootScope.$emit("setAsset", nearest.AssetID);
    };
  

    $scope.nearestAsset = [
        {
            label: '1 km',
            id: 1
        },
        {
            label: '5 km',
            id: 5
        },
        {
            label: '10 km',
            id: 10
        },

        {
            label: '20 km',
            id: 20
        },
        {
            label: '30 km',
            id: 30
        },
    ];


    $scope.selected = $scope.nearestAsset[0];


    $scope.nearestSearchText = "Search";


    //get nearest asset
    $scope.getNearestAsset = function (selected) {
        if ($scope.nearestSearchText == "Search") {

            CommonFactory.createAlert("Nearest Asset", "Click on map you want to get nearest assets");

            var limit = $scope.selected.id * 1000;
            var nearest = MapFactory.nearestAssetModeOn(limit, $scope);

            $scope.nearestSearchText = "Clear";

            CommonFactory.setClearMap(false);

        } else {

            var customer = CommonFactory.getCustomerList();
            var assetList = [];

            customer.forEach(function (cus) {

                cus.AssetList.forEach(function (asset) {

                    assetList.push(asset);
                });

            });

            $scope.nearestAssetLists.forEach(function (d) {

                var checkasset = $.grep(assetList, function (e) { return e.AssetID == d.AssetID });
                if (checkasset[0]) {

                    if (checkasset[0].showOnMap == true) {

                        MapFactory.showMarker('asset' + d.AssetID, true);

                    } else {

                        MapFactory.showMarker('asset' + d.AssetID, false);
                    }
                }
            });

            $scope.nearestSearchText = "Search";
            $scope.nearestAssetLists = [];

            MapFactory.nearestAssetModeOff();
        }

    };


    $scope.color = function (data) {
        return CommonFactory.getStatusLeftBorderColor(data);
    }


    //clear nearest asset once clear map is clicked.
    $scope.$watch(function () {

        return CommonFactory.getClearMap();

    }, function (data) {

        if (data === true) {

            if ($scope.nearestSearchText == "Clear") {

                $scope.getNearestAsset("");
            }
        }
    }, true);


    //export
    $scope.exportArray = [];
    $scope.exportFile = function (fileType) {

        $scope.exportArray = [];
        $scope.nearestAssetLists.forEach(function (csv) {

            $scope.CsvFileName = $localStorage.username + '-' + getDateTimeToday() + '( Nearest Asset ).' + fileType;

            $scope.exportArray.push({
                'Asset': csv.Name,
                'Distance (m)': csv.Distance,
                'Status': csv.Status,
                //'Location': csv.content.Location
            });

        });

        alasql('SELECT * INTO XLSX("' + $scope.CsvFileName + '",{headers:true}) FROM ?', [$scope.exportArray]);
    };



    $scope.exportFileType = false;
    $scope.exportPanel = function () {

        if ($scope.exportFileType == false) {

            $scope.exportFileType = true;
            $('#export-file-nearest-asset').show("slide");

        } else {

            $scope.exportFileType = false;
            $('#export-file-nearest-asset').hide("slide");

        }

    }
}]);