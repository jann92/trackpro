app.controller('FeedbackModalController', function ($scope, $uibModalInstance, $localStorage) {
    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});