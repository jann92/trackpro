'use strict';
app.factory('AssetInformationFactory', ['$http', '$localStorage', '$filter', function ($http, $localStorage, $filter) {

    var defaultHeaders = function (contentType) {
        return {
            'content-type': contentType,
            'accept': 'application/json',
            'authorization': "Bearer " + $localStorage.access_token_TRP
        };
    }
    var asset = {};
    return {
        getWeatherInformation: function (param, success, error) {
            var _getWeatherInformation = $localStorage.serverUrl_TRP + "Weather/Marine";
            $http.post(_getWeatherInformation, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        getAssetGPSInformation: function (AssetID, success, error) {
            var _getAssetGPSInformation = $localStorage.serverUrl_TRP + "Track/Asset/GPSInfo";
            $http.get(_getAssetGPSInformation + "/" + AssetID, { headers: defaultHeaders("application/x-www-form-urlencoded") }).success(success).error(error);
        },
        getAssetGPSPopupInformation: function (AssetID, success, error) {
            var _getAssetGPSPopupInformation = $localStorage.serverUrl_TRP + "Track/Asset/PopUp";
            $http.get(_getAssetGPSPopupInformation + "/" + AssetID, { headers: defaultHeaders("application/x-www-form-urlencoded") }).success(success).error(error);
        },
        getAssetGPSDriverInformation: function (AssetID, success, error) {
            var _getAssetGPSDriverInformation = $localStorage.serverUrl_TRP + "Track/Asset/Info/Driver";
            $http.get(_getAssetGPSDriverInformation + "/" + AssetID, { headers: defaultHeaders("application/x-www-form-urlencoded") }).success(success).error(error);
        },
        getAssetGPSSettingsInformation: function (AssetID, success, error) {
            var _getAssetGPSSettingsInformation = $localStorage.serverUrl_TRP + "Track/Asset/Info/Settings";
            $http.get(_getAssetGPSSettingsInformation + "/" + AssetID, { headers: defaultHeaders("application/x-www-form-urlencoded") }).success(success).error(error);
        },
        getCameraInformation: function (AssetID, success, error) {
            var _getCameraInformation = $localStorage.serverUrl_TRP + "Track/Asset/Camera";
            $http.get(_getCameraInformation + "/" + AssetID, { headers: defaultHeaders("application/x-www-form-urlencoded") }).success(success).error(error);
        },
        getAssetTypeList: function (success, error) {
            var _getAssetTypeList = $localStorage.serverUrl_TRP + "Track/Asset/Type/List";
            $http.get(_getAssetTypeList, { headers: defaultHeaders("application/x-www-form-urlencoded") }).success(success).error(error);
        },
        updateAssetSettings: function (AssetID, param, success, error) {
            var _updateAssetSettings = $localStorage.serverUrl_TRP + "Track/Asset/Settings/Update";
            $http.post(_updateAssetSettings + '/' + AssetID, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        getNextPrevPhoto: function (param, success, error) {
            var _getNextPrevPhoto = $localStorage.serverUrl_TRP + "Track/Asset/NextPrev/Photo";
            $http.post(_getNextPrevPhoto, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        getCurrentDelivery: function (AssetID, success, error) {
            var _getCurrentDelivery = $localStorage.serverUrl_TRP + "Track/Asset/DeliveryInfo/";
            $http.get(_getCurrentDelivery + AssetID, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        getDeliveryCount: function (AssetID, success, error) {
            var _getDeliveryCount = $localStorage.serverUrl_TRP + "Track/Asset/DeliveryCount/";
            $http.get(_getDeliveryCount + AssetID, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        reverseGeocode: function (param, success, error) {
            var _reverseGeocode = $localStorage.serverUrl_TRP + "Map/Geocode/Reverse";
            $http.post(_reverseGeocode, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        }


    };
}
]);