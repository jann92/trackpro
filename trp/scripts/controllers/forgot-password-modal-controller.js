app.controller('ForgotPassworModalController', function ($scope, $uibModalInstance, LoginFactory) {
    $scope.sendEmail = function () {
        var jsonObj = {
            username: $scope.usernameForgot,
        }
        var username = "";
        LoginFactory.sendPasswordEmail(jsonObj, function (res) {
            //LoginFactory.createAlert("Success", res);
            console.log(res);
            username = res;
            
        }, function (error) {
            console.log(error);
            LoginFactory.createAlert("Error", "Username does not exist");
            $scope.usernameForgot = null;
        });
        

        //$scope.ok();
    }

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});