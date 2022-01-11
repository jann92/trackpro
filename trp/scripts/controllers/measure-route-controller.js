app.controller('MeasureRouteController', ['$scope', '$localStorage', 'CommonFactory', 'MapFactory', '$location', '$filter', function ($scope, $localStorage, CommonFactory, MapFactory, $location, $filter) {
    $scope.measureRouteList = [];
    $scope.rulerStraightMode = true;
    $scope.rulerSnapMode = false;

    $scope.$watch(function () {
        return MapFactory.getMeasureRouteObjects()
        //return $scope.measureRouteList
    }, function (data) {
        $scope.measureRouteList = data;
    });


    $scope.snapToRoadText = 'Snap to Road';
    $scope.straightRulerText = 'Straight Ruler';


    //snap to road
    $scope.snapToRoad = function () {

        if ($scope.snapToRoadText === 'Snap to Road') {

            CommonFactory.createAlert("Snap to Road", "Click on map to start measure.");
            MapFactory.rulerOff();
            $scope.snapToRoadText = 'Clear';
            $scope.straightRulerText = 'Straight Ruler';
            MapFactory.snapToRoadOn($scope);
            CommonFactory.setClearMap(false);

        } else {

            $scope.snapToRoadText = 'Snap to Road';
            MapFactory.rulerOff();

        }
    };


    //straight ruler
    $scope.straightRuler = function () {
        if ($scope.straightRulerText === 'Straight Ruler') {

            CommonFactory.createAlert("Straight Ruler", "Click on map to start measure.");
            MapFactory.rulerOff();
            $scope.straightRulerText = 'Clear';
            $scope.snapToRoadText = 'Snap to Road';
            MapFactory.straightRulerOn($scope);
            CommonFactory.setClearMap(false);

        } else {

            $scope.straightRulerText = 'Straight Ruler';
            MapFactory.rulerOff();

        }
    };



    //clear measure route once clear map is clicked.
    $scope.$watch(function () {
        return CommonFactory.getClearMap();
    }, function (data) {

        if (data === true) {

            if ($scope.snapToRoadText === 'Clear') {
                $scope.snapToRoad();

            }

            if ($scope.straightRulerText === 'Clear') {

                $scope.straightRuler();
            }
        }
    }, true);


    //export
    $scope.exportArray = [];
    $scope.exportFile = function (fileType) {

        $scope.exportArray = [];

        $scope.measureRouteList.forEach(function (csv) {
            $scope.CsvFileName = $localStorage.username + '-' + getDateTimeToday() + '(Measure Route).' + fileType;
            $scope.exportArray.push({
                '#': csv.name,
                'Latitude': csv.latitude,
                'Longitude': csv.longitude,
                'Distance(m)': csv.rulerlength.toFixed()
            });

            $scope.exportArray['Total'] = csv.total;

        });

        alasql('SELECT * INTO XLSX("' + $scope.CsvFileName + '",{headers:true}) FROM ?', [$scope.exportArray]);

    };


    $scope.exportFileType = false;
    $scope.exportPanel = function () {

        if ($scope.exportFileType == false) {

            $scope.exportFileType = true;
            $('#export-file-measure-route').show("slide");

        } else {

            $scope.exportFileType = false;
            $('#export-file-measure-route').hide("slide");

        }

    }

}]);