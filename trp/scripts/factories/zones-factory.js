'use strict';
app.factory('ZonesFactory', ['$http', '$localStorage', '$filter', function ($http, $localStorage, $filter) {
    //var baseUrl = "../";
    var baseUrl = $localStorage.serverUrl_TRP;
    var _getZoneTypeList = baseUrl + "Geofence/Zone/Type/List/";
    var _getUserZoneList = baseUrl + "Geofence/User/Zone/List";
    var _getAllUserZoneList = baseUrl + "Geofence/All/Zone/List";
    var _getAssetZoneList = baseUrl + "Geofence/Asset/Zone/List";
    var _getZoneList = baseUrl + "Geofence/Zone/List";
    var _getCountUserZoneList = baseUrl + "Geofence/Zone/User/Count";
    var _getCountAssetZoneList = baseUrl + "Geofence/Zone/Asset/Count";
    var _addZone = baseUrl + "Geofence/Zone/Add";
    var _deleteZone = baseUrl + "Geofence/Zone/Delete";
    var _updateZone = baseUrl + "Geofence/Zone/Update";
    var _getZoneAssignedAssetList = baseUrl + "Geofence/Zone/Assigned/Asset/List";
    var _getAssetAssignedZoneList = baseUrl + "Geofence/Asset/Assigned/Zone/List";
    var _UpdateZoneAssignedAssetList = baseUrl + "Geofence/Zone/Assigned/Asset/Update";
    var _UpdateAssetAssignedZoneList = baseUrl + "Geofence/Asset/Assigned/Zone/Update";
    var _isInsideZone = baseUrl + "Geofence/Asset/Inside/Zone";
    var _searchAllZone = baseUrl + "Geofence/Zone/Search";
    var _searchAssetZone = baseUrl + "Geofence/Zone/Search";
    var _getZoneFilterInsideAssets = baseUrl + "Geofence/Zone/Filter/Assets";
    var _getZoneFilterInsideAssetsAll = baseUrl + "Geofence/Zone/Filter/Assets/All";
    var _getAssetOutOfZoneList = baseUrl + "Geofence/Asset/Outside/Zone";

    
    var defaultHeaders = function (contentType) {
        return {
            'content-type': contentType,
            'accept': 'application/json',
            'authorization': "Bearer " + $localStorage.access_token_TRP
        };
    }

    var asset = {};
    return {
        getZoneTypeList: function (success, error) {
            $http.get(_getZoneTypeList, { headers: defaultHeaders("application/x-www-form-urlencoded") }).success(success).error(error);
        },
        getUserZoneList: function (param, success, error) {
            $http.post(_getUserZoneList, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        getAllUserZoneList: function (success, error) {
            $http.get(_getAllUserZoneList, { headers: defaultHeaders("application/x-www-form-urlencoded") }).success(success).error(error);
        },
        getZoneList: function(success,error){
            $http.post(_getZoneList, {}, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        getCountZoneList: function(success,error){
            $http.post(_getCountUserZoneList, {}, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        getCountAssetZoneList: function (AssetID, success, error) {
            $http.post(_getCountAssetZoneList + '/' + AssetID, {}, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        getZoneAssignedAssetList: function (ZoneID, success, error) {
            $http.get(_getZoneAssignedAssetList + '/' + ZoneID, { headers: defaultHeaders("application/x-www-form-urlencoded") }).success(success).error(error);
        },
        getAssetAssignedZoneList: function (AssetID, success, error) {
            $http.get(_getAssetAssignedZoneList + '/' + AssetID, { headers: defaultHeaders("application/x-www-form-urlencoded") }).success(success).error(error);
        },
        getAssetZoneList: function (AssetID, param, success, error) {
            $http.post(_getAssetZoneList + '/' + AssetID, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        addZone: function (param, success, error) {
            $http.post(_addZone, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        deleteZone: function (ZoneID, success, error) {
            $http.post(_deleteZone + '/' + ZoneID, {}, { headers: defaultHeaders("application/x-www-form-urlencoded") }).success(success).error(error);
        },
        updateZone: function (ZoneID, param, success, error) {
            $http.post(_updateZone + '/' + ZoneID, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        UpdateZoneAssignedAssetList: function (ZoneID, param, success, error) {
            $http.post(_UpdateZoneAssignedAssetList + '/' + ZoneID, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        UpdateAssetAssignedZoneList: function (AssetID, param, success, error) {
            $http.post(_UpdateAssetAssignedZoneList + '/' + AssetID, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        isInsideZone: function (param, success, error) {
            $http.post(_isInsideZone, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        getAssetOutOfZoneList: function (success, error){
            $http.post(_getAssetOutOfZoneList,{}, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        getZoneFilterInsideAssets: function(allowed, success, error){
            $http.post(_getZoneFilterInsideAssets + '/' + allowed,{}, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        getZoneFilterInsideAssetsAll: function (success, error) {
            $http.post(_getZoneFilterInsideAssetsAll, {}, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        searchAssetZone: function (AssetID,param, success, error) {
            $http.post(_searchAssetZone + '/' + AssetID, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        searchZone: function (param, success, error) {
            $http.post(_searchAllZone, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
       createAlert: function (title, message, type) {
            var icon = '<i class="fa fa-info-circle"></i>&nbsp;';
            if (type === "danger") {
                icon = '<i class="fa fa-exclamation-triangle"></i>&nbsp;';
            }
            else if (type === "success") {
                icon = '<i class="fa fa-check-circle alert-icon"></i>&nbsp;';
            }
            else if (type === "info") {
                icon = '<i class="fa fa-refresh fa-spin alert-icon"></i>&nbsp;';
            }
            $('#alert_placeholder').show('slide');
            message = (message == null ? "Please contact your administrator for more information." : message);
            $('#alert_placeholder').html('<div class="alert alert-' + type + ' alert-dismissable alert-custom"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><span class="alert-title">' + icon + title + '</span><hr/><span class="alert-message">' + message + '</span></div>')
            setTimeout(function () {
                $('#alert_placeholder').hide('slide');
            }, 10000);
        }
    };
}
]);