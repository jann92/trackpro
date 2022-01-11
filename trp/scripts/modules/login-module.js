var app = angular.module("Login", ['ngStorage', 'angular-loading-bar', 'ngAnimate', 'ui.bootstrap']);
//To check local storage | intercept route and location
app.run(function ($rootScope, $location, $localStorage, LoginFactory) {
    $rootScope.$on("$locationChangeStart", function (event, next, current) {
        if ($localStorage.access_token_TRP != null) {
            var roles = [];
            //LoginFactory.getRoles(function (res) {
            //    res.forEach(function (e) {
            //        roles.push(e);
            //    });
                $localStorage.roles_TRP = roles;
                window.location = "../monitor/";
            //}, function (error) {
            //});
        } else {
            //   $localStorage.$reset();
            //window.location = "../login/";
        }
    });
});

//Forgot Password Modal
app.directive('forgotPasswordModal', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/modal/modal-forgotpassword.html',
    }
});