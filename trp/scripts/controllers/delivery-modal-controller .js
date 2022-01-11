app.controller('DeliveryModalController', function ($scope, $uibModalInstance, AssetID, $localStorage, CommonFactory, DeliveryFactory) {
    $scope.isLoading = false;

    $scope.unassignedDelivery = function () {

        $scope.isLoading = true;

        DeliveryFactory.getUnassignedDelivery(function (data) {

            $scope.isLoading = false;
            $scope.UnassignedDelivery = data;
            CommonFactory.setUnassignedDelivery(data);

        }, function (error) { });
    }


    $scope.unassignedDelivery();
    $scope.assignDelivery = function (_deliveryNumber) {

        var params = {
            deliveryNumber: _deliveryNumber,
            objectID: AssetID
        };

        DeliveryFactory.assignDelivery(params, function (data) {
            DeliveryFactory.getObjectDelivery(
            AssetID, function (res) {

                CommonFactory.setObjectDeliveryList(res);

            },
            function (error) {
            });
            $scope.unassignedDelivery();

            CommonFactory.setAddDeliveryMode(false);
            CommonFactory.createAlert("Success", data);

        }, function (error) {

        });
    }


    $scope.ok = function () {
        $uibModalInstance.close();
    };


    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});