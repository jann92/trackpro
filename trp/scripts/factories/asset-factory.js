'use strict';
app.factory('AssetFactory', ['$http', '$localStorage', '$filter', function ($http, $localStorage, $filter) {
    //var baseUrl = "../";
    var baseUrl = $localStorage.serverUrl_TRP;
    var customerList = baseUrl + "Track/Asset/List/";
    var AssetListByIDs = baseUrl + "Track/Asset/List/IDs";
    var AssetListMap = baseUrl + "Track/Asset/Map";
    var AssetListCount = baseUrl + "Track/Asset/List/Count";
    var AssetViolation = baseUrl + "Track/Asset/Violation";

    var DashboardVehicleCounter = baseUrl + "Dashboard/Counter/Vehicles";
    var DashboardVehicleDistance = baseUrl + "Dashboard/Vehicle/Distance";
    var DashboardVehicleUtilize = baseUrl + "Dashboard/Vehicle/Utilize";

    var TrackMyTruckByID = "../Track/MyTruck/GpsInfoByID/";
    var TrackMyTruckByName = "../Track/MyTruck/GpsInfoByName/";


    var headers = function (contentType) {
        return {
            'content-type': contentType,
            'accept': 'application/json'
        };
    }
    var asset = {};
    return {
        getCustomerList: function (success, error) {

            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.get(customerList, { headers: headerToken }).success(success).error(error);
        },
        getAssetListByIDs: function (ids,success, error) {

            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.post(AssetListByIDs, ids, { headers: headerToken }).success(success).error(error);
        },
        getAssetListMap: function (success, error) {
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.get(AssetListMap, { headers: headerToken }).success(success).error(error);
        },
        getAssetListCount: function(success, error){
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.get(AssetListCount, { headers: headerToken }).success(success).error(error);
        },
        getAssetViolation: function(success,error){
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.get(AssetViolation, { headers: headerToken }).success(success).error(error);
        },
        setAsset: function (data) {
            asset = data
        },
        getAsset: function () {
            return asset;
        },
        getCurrentDelivery: function (AssetID, success, error) {
            var _getCurrentDelivery = $localStorage.serverUrl_TRP + "Track/Asset/DeliveryInfo/";
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.get(_getCurrentDelivery + AssetID, { headers: headerToken }).success(success).error(error);
        },
        getDashboardVehicleCounter: function (success,error){
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.get(DashboardVehicleCounter, {headers: headerToken}).success(success).error(error);
        },
        getDashboardVehicleUtilize: function(params,success,error){
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.post(DashboardVehicleUtilize, params, {headers: headerToken}).success(success).error(error);
        },
        getDashboardVehicleDistance: function(params, success,error){
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.post(DashboardVehicleDistance, params, { headers: headerToken }).success(success).error(error);
        },
        getTrackMyTruckGPSInfoByID: function (assetid, username, success, error) {
            $http.get(TrackMyTruckByID + assetid + '/' + username, {}).success(success).error(error);
        },
        getTrackMyTruckGPSInfoByName: function (assetname, username, success, error) {
            $http.get(TrackMyTruckByName + assetname + '/' + username, {}).success(success).error(error);
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