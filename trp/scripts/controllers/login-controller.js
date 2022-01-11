app.controller('LoginController', ['$scope', '$localStorage', 'LoginFactory', function ($scope, $localStorage, LoginFactory) {
    $(".loading-panel-login").hide();
    $scope.selected = { Name: "Loading Servers..." };
    $scope.isForgotPassword = false;
    
    $scope.serverListView = false;

    var hostname = window.location.host

    if (hostname == "login.philgps.com" || hostname == "app2.indotrack.com") {
        $scope.logo_url = null;
    } else {
        $scope.logo_url = "http://login.philgps.com/imgres/logo/" + hostname.replace(".philgps.com", "") + ".jpg";
        console.log($scope.logo_url);
    }




    var roles = [];

    //Server list data from API    
    LoginFactory.getServerList().success(function (response) {
        $scope.serverlist = response;
        $scope.selected = response[0];        
        $scope.getSelected($scope.selected);
        $(".loading-panel-server").hide();

    });


    $scope.textPasswordChange = function (password) {
        if (password) {
            $(".password-fa-eye").addClass("show-fa-eye");
        } else {
            $(".password-fa-eye").removeClass("show-fa-eye");
        }
    };
    

    $scope.showPassword = function () {
        var obj = document.getElementById('text-password');
        obj.type = 'text';
    };


    $scope.hidePassword = function () {
        var obj = document.getElementById('text-password');
        obj.type = 'password';
    }


    $scope.getSelected = function (data) {
        $scope.selected = data;

        $('.server-list-container').slideUp()

        $scope.serverCode = data.Code;
        $scope.serverUrl = data.Url;
        $scope.defaultCoordinates = data.DefaultCoordinates;
        $localStorage.serverCode_TRP = $scope.serverCode;
        $localStorage.serverUrl_TRP = $scope.serverUrl;
        $localStorage.defaultCoordinates_TRP = $scope.defaultCoordinates;
        $localStorage.imagesUrl_TRP = data.ImagesUrl;
        $scope.db = data.ConfigurationName;

        //Login function
        $scope.login = function () {
            $(".loading-panel-login").show();
            $("#error-container").text("");
            $("#login-account").parsley().validate();


            if ($("#login-account").parsley().isValid()) {

                var loginUrl =  $localStorage.serverUrl_TRP + "token";

                var formData = { //Get form data
                    grant_type: 'password',                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                    username: $scope.username,
                    password: $scope.password,
                    db: $scope.db
                }

                //Posting data in server.js
                $.getJSON("https://jsonip.com?callback=?", function (ip) {

                    var formData = { //Get form data
                        grant_type: 'password',
                        username: $scope.username,
                        password: $scope.password,
                        db: $scope.db,
                        IPAdd: ip.ip
                    }

                    LoginFactory.login(loginUrl, formData, function (res) {

                        if (res.token_type) {

                            $localStorage.access_token_TRP = res.access_token;
                            $localStorage.expires_in_TRP = res.expires_in;
                            $localStorage.serverCode_TRP = $scope.serverCode;
                            $localStorage.serverUrl_TRP = $scope.serverUrl;
                            $localStorage.username = $scope.username;
                            $localStorage.defaultCoordinates_TRP = $scope.defaultCoordinates;

                            $localStorage.googleClientID = res.GoogleClientID;
                            $localStorage.googleAPIKey = res.GoogleAPIKey;

     
                            $localStorage.roles_TRP = roles;

                            $localStorage.moduleRoles_TRP = [];


                            //reportpro
                            $localStorage.access_token_TRR = res.access_token;
                            $localStorage.expires_in_TRR = res.expires_in;
                            $localStorage.serverCode_TRR = $scope.serverCode;
                            $localStorage.serverUrl_TRR = $scope.serverUrl;
                            $localStorage.username_TRR = $scope.username;
                            $localStorage.defaultCoordinates_TRR = $scope.defaultCoordinates;
                            $localStorage.moduleRoles_TRR = [];


                            //maintenance token
                            var curUser = { "username": $scope.username, "token": res.access_token };

                            localStorage.setItem("currentUser_MTP", JSON.stringify(curUser));
                            localStorage.setItem("currentUser_RPT", JSON.stringify(curUser));

                            LoginFactory.getRolesList(function (res) {

                                if (res != null) {
                                    $localStorage.moduleRoles_TRP = res;
                                }

                                window.location = "../monitor/";

                            }, function (error) {
                            });


                            //get user sensorlabels
                            LoginFactory.getAccountUserSensorLabels(function (res) {

                                $localStorage.AccountSensor1Label = res.Sensor1Label == "" || res.Sensor1Label == null ? "Sensor 1" : res.Sensor1Label;
                                $localStorage.AccountSensor2Label = res.Sensor2Label == "" || res.Sensor2Label == null ? "Sensor 2" : res.Sensor2Label;

                            }, function (error) {
                                $localStorage.AccountSensor1Label = "Sensor 1";
                                $localStorage.AccountSensor2Label = "Sensor 2";
                            });



                            LoginFactory.getUserEmail(function (success) {
                                if (success == 'No Email') {
                                    $localStorage.userEmail_TRP = '';
                                } else {
                                    $localStorage.userEmail_TRP = success;
                                }
                            }, function (error) {

                            });



                        }
                    }, function (error) {

                        //Error message for API
                        if (error == null) {
                            $("#error-container").text("Unable to load data. Please contact your adiminstrator.");
                        }
                        else {
                            var message = JSON.parse(error.responseText);
                            $("#error-container").text(message.error_description);
                        }

                        $(".loading-panel-login").hide();
                    });

                });
            }
        };
    }


    //Login page info
    $scope.info = {
        version: '2.2.0.0',
        lastUpdated: '2016-05-04'
    };


    $scope.serverContainer = function () {
        if (!$scope.serverListView) {
            $scope.serverListView = true;
            $('.server-list-container').slideToggle({ direction: "down" }, 300);

        } else {
            $scope.serverListView = false;
            $('.server-list-container').slideToggle({ direction: "up" }, 300);
        }
    };


    $scope.forgotPasswordModal = function () {
        $scope.isForgotPassword = true;
        $("#send-email").show();

    }


    $scope.cancelForgotPassword = function () {
        $scope.isForgotPassword = false;
    }


    $scope.sendEmail = function () {
        $("#send-email").parsley().validate();

        if ($("#send-email").parsley().isValid()) {

            var randString = randomString(10, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
            var newPassword = "Philgps" + randString;

            var jsonObj = {
                Username: $scope.usernameForgot,
                NewPassword: newPassword,
            }

            LoginFactory.updateUserPassword(jsonObj, function (res) {

                var param = {
                    to: res,
                    cc: "",
                    subject: "TrackPro Password Recovery",
                    body: "<p>Hi " + jsonObj.Username + ",</p><table><tr><td  align='justify' style='width:60%;'>You have requested to reset your current  password on " + new Date() + " please use the following password to access your account.</td><td></td></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr><td>Password: <b>" + newPassword + "</b><br /></td></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr><td align='justify' style='width:60%;'>Please be reminded that this password is  only temporary and we highly suggest that you change it immediately.</td> </tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr><td align='justify' style='width:60%;'>You can change your password through the Trackpro app.Go to User Settings > Accounts > Change Password.</td></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr><td align='justify'>If you have any other concerns, or you did not request to reset your password, please e-mail us at support@philgps.com.</td></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr><td>Sincerely yours,</td></tr><tr><td>Philgps</td></tr></table>",
                    isHtml: true,
                }

                LoginFactory.utilitiesAPIMailSend(param, function (res) {

                    $("#error-container-forgot").html(res);

                }, function (error) {

                    $("#error-container-forgot").html("Email can't send.");

                });

            }, function (error) {
                console.log(error.Message);
                $("#error-container-forgot").html(error.Message);
                $scope.usernameForgot = null;
            });
        }
    }

}]);