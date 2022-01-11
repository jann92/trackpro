app.controller('AssetCounterController', ['$scope', '$localStorage', 'AssetFactory', 'CommonFactory','$location', '$filter', '$interval', '$rootScope', function ($scope, $localStorage, AssetFactory, CommonFactory, $location, $filter, $interval, $rootScope) {
  
    $scope.AssetCounterList = [];

    $rootScope.$on("getAssetCounterList", function () {
        $scope.getCounterList();
    });

    $scope.getCounterList = function () {
        AssetFactory.getAssetListCount(function (res) {
            $scope.AssetCounterList = res;
        }, function (err) {

        });
    }

   // $scope.getCounterList();



}]);