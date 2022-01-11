var app = angular.module("TrackMyTruck", ['ngStorage', 'angular-loading-bar', 'ngAnimate', 'ui.bootstrap']);

app.run(function ($rootScope, $location, $localStorage, AssetFactory) {

});


app.filter('on_off', function () {
    return function (input) {
        if (input) {
            return 'On';
        }
        return 'Off';
    }
});