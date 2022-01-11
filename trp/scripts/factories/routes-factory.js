app.factory('RoutesFactory', ['$http', '$localStorage', '$filter', function ($http, $localStorage, $filter) {
    //var baseUrl = "../";
    var baseUrl = $localStorage.serverUrl_TRP;
    var _getUserRouteList = baseUrl + "Geofence/User/Route/List/";
    var _getAssetRouteList = baseUrl + "Geofence/Asset/Route/List";
    var _addRoute = baseUrl + "Geofence/Route/Add";
    var _updateRoute = baseUrl + "Geofence/Route/Update";
    var _getRouteAssignedAssetList = baseUrl + "Geofence/Route/Assigned/Asset/List";
    var _getAssetAssignedRouteList = baseUrl + "Geofence/Asset/Assigned/Route/List";
    var _UpdateRouteAssignedAssetList = baseUrl + "Geofence/Route/Assigned/Asset/Update";
    var _UpdateAssetAssignedRouteList = baseUrl + "Geofence/Asset/Assigned/Route/Update";
    var _deleteRoute = baseUrl + "Geofence/Route/Delete";
    var _reverseGeocode = baseUrl + "Map/Geocode/Reverse";

    var defaultHeaders = function (contentType) {
        return {
            'content-type': contentType,
            'accept': 'application/json',
            'authorization': "Bearer " + $localStorage.access_token_TRP
        };
    }
    

    var asset = {};
    return {
        getUserRouteList: function (success,error) {
            $http.get(_getUserRouteList, { headers: defaultHeaders("application/x-www-form-urlencoded") }).success(success).error(error);
        },
        getRouteAssignedAssetList: function (RouteID, success, error) {
            $http.get(_getRouteAssignedAssetList + '/' + RouteID, { headers: defaultHeaders("application/x-www-form-urlencoded") }).success(success).error(error);
        },
        getAssetAssignedRouteList: function (AssetID, success, error) {
            $http.get(_getAssetAssignedRouteList + '/' + AssetID, { headers: defaultHeaders("application/x-www-form-urlencoded") }).success(success).error(error);
        },
        getAssetRouteList: function (AssetID,success,error) {
            $http.get(_getAssetRouteList + '/' + AssetID, { headers: defaultHeaders("application/x-www-form-urlencoded") }).success(success).error(error);
        },
        addRoute: function (param, success, error) {
            $http.post(_addRoute , param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        updateRoute: function(RouteID,param,success,error){
            $http.post(_updateRoute + '/' + RouteID, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        UpdateRouteAssignedAssetList: function (RouteID, param, success, error) {
            $http.post(_UpdateRouteAssignedAssetList + '/' + RouteID, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        UpdateAssetAssignedRouteList: function (AssetID, param, success, error) {
            $http.post(_UpdateAssetAssignedRouteList + '/' + AssetID, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        deleteRoute: function (RouteID, success, error) {
            $http.post(_deleteRoute + '/' + RouteID, {}, { headers: defaultHeaders("application/x-www-form-urlencoded") }).success(success).error(error);
        },
        reverseGeocode: function (param, success, error) {
            $http.post(_reverseGeocode, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        }

    }
}]);