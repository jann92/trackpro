'use strict';
app.factory('AssetFilterFactory', ['$http', '$localStorage', '$filter', function ($http, $localStorage, $filter) {
    var baseUrl = $localStorage.serverUrl_TRP;
    var _getGPSList = baseUrl + "Track/Asset/GPSInfo/";
    var _reverseGeocode = baseUrl + "Map/Geocode/Reverse";
    var _export = baseUrl + "Track/Asset/GPS/Export/";
    var _getAssetTotalCount = baseUrl + "Track/Asset/Total";
    var _getAssetGPSAll = baseUrl + "Track/Asset/GPS/All";
    var _summaryExportByAssetIDs = baseUrl + "Track/AssetID/Export/All";
    var _getAssetFilterList = baseUrl + "Track/Asset/Filter/";
    var _getAssetFilterListExport = baseUrl + "Track/Asset/Filter/Export/";
    var _getAssetTypeFilterList = baseUrl + "Track/Asset/Type/List/";

    var headers = function (contentType) {
        return {
            'content-type': contentType,
            'accept': 'application/json'
        };
    }

    return {
        getAssetGPSAll: function (success, error) {
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.get(_getAssetGPSAll, { headers: headerToken }).success(success).error(error);
        },
        getAssetFilterList: function(status,success,error){
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.get(_getAssetFilterList + status, { headers: headerToken }).success(success).error(error);
        },
        getAssetFilterListExport: function (status, success, error) {
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.get(_getAssetFilterListExport + status, { headers: headerToken }).success(success).error(error);
        },
        getAssetTypeFilterList: function(type,success,error){
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.get(_getAssetTypeFilterList + type, { headers: headerToken }).success(success).error(error);
        },
        getGPSList: function (assetId, success, error) {
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.get(_getGPSList + assetId, { headers: headerToken }).success(success).error(error);
        },
        getExportList: function (statusfilter, success, error) {
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.get(_export + statusfilter, { headers: headerToken }).success(success).error(error);
        },
        getAssetTotalCount: function (success, error) {
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.get(_getAssetTotalCount, { headers: headerToken }).success(success).error(error);
        },
        reverseGeocode: function (param, success, error) {
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.post(_reverseGeocode, param, { headers: headerToken, timeout: 5000}).success(success).error(error);
        },
        summaryExportByAssetIDs: function (assetIDs, success, error) {
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.post(_summaryExportByAssetIDs, assetIDs, { headers: headerToken }).success(success).error(error);

        }
    };
}
]);

