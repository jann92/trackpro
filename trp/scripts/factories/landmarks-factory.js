'use strict';
app.factory('LandmarksFactory', ['$http', '$localStorage', '$filter', function ($http, $localStorage, $filter) {
    //var baseUrl = "../";
    var baseUrl = $localStorage.serverUrl_TRP;
    var _getLandmarkTypeList = baseUrl + "Geofence/Landmark/Type/List/";
    var _getUserLandmarkList = baseUrl + "Geofence/User/Landmark/List/";
    var _addLandmark = baseUrl + "Geofence/Landmark/Add/";
    var _deleteLandmark = baseUrl + "Geofence/Landmark/Delete";
    var _updateLandmark = baseUrl + "Geofence/Landmark/Update";

    
    var defaultHeaders = function (contentType) {
        return {
            'content-type': contentType,
            'accept': 'application/json',
            'authorization': "Bearer " + $localStorage.access_token_TRP
        };
    }
    var asset = {};
    return {
        getLandmarkTypeList: function (success, error) {
            $http.get(_getLandmarkTypeList, { headers: defaultHeaders("application/x-www-form-urlencoded") }).success(success).error(error);
        },
        getUserLandmarkList: function (success, error) {
            $http.get(_getUserLandmarkList, { headers: defaultHeaders("application/x-www-form-urlencoded") }).success(success).error(error);
        },
        addLandmark: function (param, success, error) {
            $http.post(_addLandmark, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        deleteLandmark: function (LandmarkID, success, error) {
            $http.post(_deleteLandmark + '/' + LandmarkID, {}, { headers: defaultHeaders("application/x-www-form-urlencoded") }).success(success).error(error);
        },
        updateLandmark: function (LandmarkID, param, success, error) {
            $http.post(_updateLandmark + '/' + LandmarkID, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        }
    };
}
]);