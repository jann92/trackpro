app.controller('NavController', ['$scope', '$localStorage', '$rootScope','CommonFactory', function ($scope, $localStorage, $rootScope,CommonFactory) {
    $localStorage.module = null;
    $scope.updateModule = function (module) {
        if ($localStorage.module == module)
            $localStorage.module = null
        else
            $localStorage.module = module;
        if (module === 'AssetInformation') {
            if ($('#rspmi-asset-information').hasClass('active-icon')) {
                if (CommonFactory.getAsset() != null) {
                    $rootScope.$emit("setAssetInformation", {});
                }
            }
        }
        else if (module == 'AssetZones') {
            $rootScope.$emit("getAssetZoneList", {});
        } else if (module == 'AssetRoute') {
            $rootScope.$emit("getAssetRouteList", {});
            //$rootScope.$emit("getAssetNewRouteList", {});
        } else if (module == 'AssetDelivery') {
            $rootScope.$emit("getDeliveriesData", {});
        } else if (module == 'AssetDriver') {
            $rootScope.$emit("getDriverData", {});
        } else if (module == 'AssetCounter') {
            if ($('#lspmi-asset-counter').hasClass('side-panel-menu-item-active')) {
                $rootScope.$emit("getAssetCounterList", {});
            }
        }
    };

    $scope.notifbadgecount = 0;
    $scope.notifbadge = true;
    $scope.alertImageURL = '../../contents/images/alerts/bell.svg';

    $scope.isMute = false;
    $scope.soundText = "Alert sound is on.";

    $scope.setAlertMute = function () {
        if (!$scope.isMute) {
            //audioReminder.muted = true;
            $scope.isMute = true;
            $scope.soundText = "Alert sound is off.";
            $scope.alertImageURL = '../../contents/images/alerts/bell_off.svg'
        }
        else {
            //audioReminder.muted = false;
            $scope.isMute = false;
            $scope.soundText = "Alert sound is on.";
            $scope.alertImageURL = '../../contents/images/alerts/bell.svg';
        }
        $rootScope.$emit("setAlertMute", {});
    };

    $rootScope.$on("setReminderAlert", function (event, result) {
        $scope.notifbadgecount = result;
        $scope.notifbadge = true;
    });
  
    $scope.notifBadgeClick = function () {

        $rootScope.$emit("setReminderAlertStop", {});
        $scope.notifbadge = false;
    }

}]);