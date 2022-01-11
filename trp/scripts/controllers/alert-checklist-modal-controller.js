app.controller('AlertCheckListModalController', function ($scope, $uibModalInstance, vio, $localStorage, CommonFactory, RoutesFactory, MapFactory, $rootScope) {

   
    $scope.vioData = vio;


    $scope.checkProtocol = function (vio) {
        var _confirm = confirm("Are you already done with this protocol?");
        if (_confirm) {
            
        } else {
            vio.check = false;
        }
        console.log(vioData.checkList);
    }

    $scope.resolve = function () {
        var _confirm = confirm("Are you sure you want to resolve the issue?");
        if (_confirm) {
            $scope.ok();
            $("#li-vio-" + vio.AssetID + "-sensor1").fadeOut("normal", function () {
                $(this).remove();
            });

            $rootScope.$emit("removeAssetPopup", {AssetID: vio.AssetID, alert: "Sensor1"});
        }
    };

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});