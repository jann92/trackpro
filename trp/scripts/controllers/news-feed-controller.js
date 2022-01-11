app.controller('NewsFeedController', ['$scope', '$localStorage','CommonFactory', '$location', '$filter', '$rootScope', function ($scope, $localStorage, CommonFactory, $location, $filter, $rootScope) {


    $scope.newsFeedList = [];

    $rootScope.$on("loadNewsFeed", function () {
        $scope.loadNewsFeed();
    });


    $rootScope.$on("loadNewsFeedDelivery", function (event,data) {

        data.News = data.NewsFeedStatus + data.deliveryNumber;
        data.Name = data.Asset.Name;
        data.AssetID = data.Asset.AssetID;
        data.Time = new Date();
        console.log(data);
        $scope.pushData(data);

    });

    $scope.pushData = function (asset) {
        //$scope.newsFeedList.push(
        //                {
        //                    AssetID: asset.AssetID,
        //                    Asset: asset.Name,
        //                    News: asset.News,
        //                    Time: asset.GPSTime,
        //                    NewsFeedStatus: asset.NewsFeedStatus
        //                });
    }


    $scope.loadNewsFeedDelivery = function () {

    }

    $scope.loadNewsFeed = function () {
        var cus = CommonFactory.getCustomerList();
        if (cus.length > 0) {

            var AssetList = [];
            cus.forEach(function (customer) {
                customer.AssetList.forEach(function (gps) {
                    gps.GPSTime = CommonFactory.convertTimeZone(gps.GPSTime);
                    AssetList.push(gps);
                })
            });

            //asset not inactive list
            var AssetNotInactiveList = $.grep(AssetList, function (e) {
                if (e.Status != undefined) {
                    return e.Status.InActive !== true;
                }
            });



            AssetNotInactiveList.forEach(function (asset) {

                if (asset.Status.Driving === true) {

                    //check if gps time is still the same on news feed list.
                    if ($scope.newsFeedList.length > 0) {
                        var checkNewsFeed = $.grep($scope.newsFeedList, function (e) {
                            return e.AssetID === asset.AssetID && e.Time === asset.GPSTime && e.NewsFeedStatus === "Driving";
                        });

                        if (checkNewsFeed.length === 0) {
                            //push data on news feed
                            asset.News = "is Driving.";
                            asset.NewsFeedStatus = "Driving";
                            $scope.pushData(asset);
                            //console.log("les");
                        }
                    } else {

                        //push data on news feed
                        asset.News = "is Driving.";
                        asset.NewsFeedStatus = "Driving";
                        $scope.pushData(asset);

                    }
                 
                }

            });

            //console.log($scope.newsFeedList);

        }
    };
}]);