app.controller('UserSettingsController', ['$scope','$rootScope', '$localStorage', 'AssetFactory', 'CommonFactory', 'UserSettingsFactory', '$location', '$filter', '$uibModal','$interval', function ($scope, $rootScope, $localStorage, AssetFactory, CommonFactory, UserSettingsFactory, $location, $filter, $uibModal, $interval) {
    //CommonFactory.getRoles($scope);
    $scope.userEmail = $localStorage.userEmail_TRP;
    $scope.notificationTypes = [];
    $scope.passwordStrength = null;

    //sensor labels
    $scope.Sensor1Label = $localStorage.AccountSensor1Label;
    $scope.Sensor2Label = $localStorage.AccountSensor2Label;


    $scope.$on("StrengthFunction", function (event, pwd) {

        var strength = {
            measureStrength: function (p) {
                var _passedMatches = 0;
                var _regex = /[$@&+#-/:-?{-~!"^_`\[\]]/g;
                if (/[a-z]+/.test(p)) {
                    _passedMatches++;
                }
                if (/[A-Z]+/.test(p)) {
                    _passedMatches++;
                }
                if (_regex.test(p)) {
                    _passedMatches++;
                }
                return _passedMatches;
            }
        };

        var c = strength.measureStrength(pwd);

        if (pwd) {
            if (pwd.length > 7 && c > 2) {
                $scope.passwordStrength = 4;
            } else if (pwd.length > 5 && c > 1) {
                $scope.passwordStrength = 3;
            } else if (pwd.length > 3 && c > 0) {
                $scope.passwordStrength = 2;
            } else if (pwd.length > 2 && c > 0) {
                $scope.passwordStrength = 1;
            } else {
                $scope.passwordStrength = 0;
            }
        } else {
            $scope.passwordStrength = null;
        }

        console.log($scope.passwordStrength);
      
    });

    $scope.passwordStrengthChange = function () {
        $rootScope.$broadcast('StrengthFunction', $scope.newPassword);
    }


    $scope.changePassword = function () {

        $("#error-container").text("");
        $("#password-settings").parsley().validate();

        $rootScope.$broadcast('StrengthFunction', $scope.newPassword);


        if ($("#password-settings").parsley().isValid() && $scope.passwordStrength >= 3) {


            var formData = { //Get form data
                'OldPassword': $scope.password,
                'NewPassword': $scope.newPassword,
            }

            //    //Posting data in server.js
            UserSettingsFactory.changePassword(formData, function (res) {
                CommonFactory.createAlert("Success", res);
                $('#password-settings')[0].reset();
            }, function (error) {

                CommonFactory.createAlert("Error", "Current Password does not exist");

                if (error == null) {

                    $("#error-container").text("Unable to load data. Please contact your adiminstrator.");

                }
                else {

                    var message = JSON.parse(error.responseText);
                    CommonFactory.createAlert("Warning", message.error_description);

                }
            });
        } else {
            CommonFactory.createAlert("Error", "Update Password Failed");
        }
    }


    $scope.changeEmail = function () {

        $("#error-container").text("");
        $("#email-settings").parsley().validate();

        if ($("#email-settings").parsley().isValid()) {

            var _confirm = confirm("Are you sure you want to update?");

            if (_confirm) {

                var formData = {
                    'Email': $scope.userEmail
                }

                UserSettingsFactory.changeUserEmail(formData, function (res) {

                    $localStorage.userEmail_TRP = res.Email;
                    CommonFactory.createAlert("Success", "User Email Updated.");

                }, function (error) {

                });

            }

        }
    }


    //update user sensor labels
    $scope.changeSensorLabels = function () {
        var json = {
            Sensor1Label: $scope.Sensor1Label,
            Sensor2Label: $scope.Sensor2Label
        };

        var _confirm = confirm("Are you sure you want to update?");

        if(_confirm)
        {
            UserSettingsFactory.updateSensorLabels(json, function (success) {
                $localStorage.AccountSensor1Label = $scope.Sensor1Label;
                $localStorage.AccountSensor2Label = $scope.Sensor2Label;

                CommonFactory.createAlert("Success", "Sensor Labels updated. Please logout and login again to take effect the changes.");
            }, function (error) {

            });
        }
    
    }

    $scope.openAssignment = function () {

        UserSettingsFactory.getAssignmentList(function (res) {
            UserSettingsFactory.getAssignmentAssetList(res[0].AccountID, function (asset) {

                UserSettingsFactory.setAssignmentCustomerList(asset);

            }, function (error) {

            });

            $scope.accessModal(res, 'Asset Assignment');

        }, function (error) {

            CommonFactory.createAlert("Warning", error.Message);

        });
    };

    $scope.openEmailNotification = function () {
        var cus = CommonFactory.getCustomerList();
        $scope.accessModal(cus, 'Setup/Edit Reports via Email');
    };

    //check or uncheck all notification
    $scope.checkAllNotification = function (data, selectAll) {
        data.forEach(function (e) {
            e.isCheck = selectAll;
        });
        $scope.checkboxNotifChange();
    };


    //auto save once check/uncheck notification
    $scope.checkboxNotifChange = function () {
        var soundnotif = 0;

        var getchecknotif = $.grep($scope.notificationTypes, function (e) {
            return e.isCheck == true;
        });

        if ($scope.notificationTypes.length == getchecknotif.length) {

            $scope.notifall = true;

        } else {

            $scope.notifall = false;
        }

        $scope.notificationTypes.forEach(function (e) {
            if(e.isCheck == true)
            {

                soundnotif += e.RoleValue;

            }
        });
        
        var jsonObj = {
            SoundNotification: soundnotif
        };

        UserSettingsFactory.updateNotification(jsonObj, function (res) {
            
        }, function (error) {

        });

    }

    $scope.getNotificationTypes = function () {
        UserSettingsFactory.getNotificationTypes(
            function (res) {

                var getchecknotif = $.grep(res, function (e) {
                    return e.isCheck == true;
                });

                if (getchecknotif.length == res.length)
                {
                    $scope.notifall = true;
                }

                $scope.notificationTypes = res;
                CommonFactory.setNotificationTypes(res);

            }, function (error) {

                console.log(error);
            });
    };

    $scope.accessModal = function (_data, _controller) {

        var size = '';

        if (_controller === 'Setup/Edit Reports via Email') {
            size = 'lg';
        }

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'userSettingsModal',
            controller: 'UserSettingsModalController',
            size: size,
            resolve: {
                data: function () {
                    return _data;
                },
                ControllerType: function () {
                    return _controller;
                }
            }
        });

    }
}]);