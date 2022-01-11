app.controller('NotificationsController', ['$scope', '$localStorage', 'CommonFactory','MapFactory','$location', '$filter', '$interval', function ($scope, $localStorage, CommonFactory,MapFactory, $location, $filter, $interval) {

    var customerList = [];
    $scope.alertmute = false;

    //get notification list
    //$scope.$watch(function () {
    //    return CommonFactory.getCustomerList();
    //}, function (data) {
    //    if (data.length > 0) {
    //        var assetList = [];
    //        var customerList = data;
    //        customerList.forEach(function (customer) {
    //            customer.AssetList.forEach(function (asset) {
    //                assetList.push(asset);

    //            });
    //        });

    //        var notiftypes = CommonFactory.getNotificationTypes();

    //        if (notiftypes.length > 0) {

    //            var notiflist = $.grep(assetList, function (e) {
    //                if (e.Status != undefined) {
    //                    return (e.Status.PowerCut === true && e.Status.InActive === false && notiftypes[4].isCheck === true) || (e.Status.GPSCut === true && e.Status.InActive === false && notiftypes[3].isCheck === true)
    //                        || (e.Status.EngineStop === true && e.Status.InActive === false && notiftypes[5].isCheck === true) || (e.Status.SOS === true && e.Status.InActive === false && notiftypes[2].isCheck === true)
    //                        || (e.Status.OverIdling === true && e.Status.InActive === false && notiftypes[1].isCheck === true) || (e.Status.OverSpeeding === true && e.Status.InActive === false && notiftypes[0].isCheck === true)
    //                }
    //            });

    //            $scope.assetNotificationList = notiflist;

    //            notiflist.forEach(function (e, index) {
    //                var checkifexist = $.grep($scope.assetNotificationList, function (c) { return c.AssetID == e.AssetID && c.Status.Description == e.Status.Description; });
    //                if (checkifexist.length > 0) {
    //                    $scope.assetNotificationList.splice($scope.assetNotificationList.indexOf(checkifexist[0]), 1);
    //                    $scope.assetNotificationList.push(e);
    //                } else {
    //                    $scope.assetNotificationList.push(e);
    //                }

    //            });

    //            CommonFactory.setNotificationCount($scope.assetNotificationList.length);
    //        }
    //    }
       
    //}, true);


    //on and off alert
    $scope.alertMute = function () {
        if ($scope.alertmute == false) {
            $scope.alertmute = true;
        } else {
            $scope.alertmute = false;
        }
        CommonFactory.setAlertMute($scope.alertmute);
    };


    //view information of asset
    $scope.infoAsset = function (asset) {
        $scope.isClicked = asset.AssetID;
        MapFactory.mapZoom();
        MapFactory.panMarker('asset' + asset.AssetID);
        asset.showOnMap = true;
        MapFactory.showMarker('asset' + asset.AssetID, true);
        CommonFactory.setAsset(asset);

        //slide tab information
        $(".right-side-panel-menu-item").removeClass('side-panel-menu-item-active active-icon');
        $('.right-side-content-container').hide("slide");
        $("#rspmi-asset-information").addClass('side-panel-menu-item-active active-icon');
        var target = $('#rspmi-asset-information').attr('data-slidetoggle');
        $('#' + target).show("slide");
    };

}]);