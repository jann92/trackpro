var app = angular.module("Home", ['ngStorage', 'angular-loading-bar', 'ngAnimate', 'ui.bootstrap']);

app.run(function ($rootScope, $location, $localStorage, LoginFactory) {
    if ($localStorage.access_token_TRP == null) {

        localStorage.removeItem('ngStorage-access_token_TRP');
        localStorage.removeItem('ngStorage-expires_in_TRP');
        localStorage.removeItem('ngStorage-serverCode_TRP');
        localStorage.removeItem('ngStorage-defaultCoordinates_TRP');
        localStorage.removeItem('ngStorage-imagesURL_TRP');
        localStorage.removeItem('ngStorage-roles_TRP');
        localStorage.removeItem('ngStorage-moduleRoles_TRP');
        localStorage.removeItem('ngStorage-userEmail_TRP');

        window.location = "../login";
    }
 

});
