app.factory('DriverFactory', ['$http', '$localStorage', '$filter', function ($http, $localStorage, $filter) {
    var baseUrl = $localStorage.serverUrl_TRP;
    var _getDriverList = baseUrl + "Track/Driver/List";
    var _getDriverInfo = baseUrl + "Track/Driver/Info";
    var _addDriver = baseUrl + "Track/Driver/Add";
    var _updateDriver = baseUrl + "Track/Driver/Update";
    var _updateDriverAssignedAssetList = baseUrl + "Track/Driver/Asset/Assign/Update";
    var _updateAssetAssignedDriverList = baseUrl + "Track/Asset/Driver/Assign/Update";
    var _getDriverAssignedAssetList = baseUrl + "Track/Driver/Asset/Assign/List";
    var _getAssetAssignedDriverList = baseUrl + "Track/Asset/Driver/Assign/List";
    var _getAssignedDriverList = baseUrl + "Track/Driver/Assign/List";
    var _getActiveDriverList = baseUrl + "Track/Driver/Active/List";
    var _simulateDriverTag = baseUrl + "Track/Driver/Simulate";
    var _getHistoyDriverList = baseUrl + "Track/Driver/History/List";
    var _removeDriverAssign = baseUrl + "Track/Driver/Assign/Remove";
    var _setActiveDriver = baseUrl + "Track/Driver/SetActive/";
    var _removeActiveDriver = baseUrl + "Track/Driver/RemoveActive/";
    var _removeCurrentActiveDriver = baseUrl + "Track/Driver/RemoveCurrentActive/";

    var defaultHeaders = function (contentType) {
        return {
            'content-type': contentType,
            'accept': 'application/json',
            'authorization': "Bearer " + $localStorage.access_token_TRP
        };
    }

    return {
        getDriverList: function (success, error) {
            $http.get(_getDriverList, { headers: defaultHeaders("application/x-www-form-urlencoded") }).success(success).error(error);
        },
        getDriverInfo: function (DriverID, success, error) {
            $http.get(_getDriverInfo + "/" + DriverID, { headers: defaultHeaders("application/x-www-form-urlencoded") }).success(success).error(error);
        },
        addDriver: function (param, success, error) {
            $http.post(_addDriver, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        updateDriver: function (param, sucess, error) {
            $http.post(_updateDriver, param, { headers: defaultHeaders("application/json") }).success(sucess).error(error);
        },
        updateDriverAssignedAssetList: function (DriverID, param, success, error) {
            $http.post(_updateDriverAssignedAssetList + "/" + DriverID, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        updateAssetAssignedDriverList: function (AssetID, param, success, error) {
            $http.post(_updateAssetAssignedDriverList + "/" + AssetID, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        getDriverAssignedAssetList: function (DriverID, success, error) {
            $http.get(_getDriverAssignedAssetList + "/" + DriverID, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        getAssetAssignedDriverList: function (AssetID, success, error) {
            $http.get(_getAssetAssignedDriverList + "/" + AssetID, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        getAssignedDriverList: function (AssetID, success, error) {
            $http.get(_getAssignedDriverList + "/" + AssetID, { headers: defaultHeaders("application/x-www-form-urlencoded") }).success(success).error(error);
        },
        getActiveDriverList: function (AssetID, success, error) {
            $http.get(_getActiveDriverList + "/" + AssetID, { headers: defaultHeaders("application/x-www-form-urlencoded") }).success(success).error(error);
        },
        simulateDriverTag: function (param, success, error) {
            $http.post(_simulateDriverTag, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        getHistoryDriverList: function (AssetID, success, error) {
            $http.get(_getHistoyDriverList + "/" + AssetID, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        removeDriverAssign: function (param, success, error) {
            $http.post(_removeDriverAssign, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        setActiveDriver: function (param, success, error) {
            $http.post(_setActiveDriver, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        removeActiveDriver: function (param, success, error) {
            $http.post(_removeActiveDriver, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        removeCurrentActiveDriver: function (param, success, error) {
            $http.post(_removeCurrentActiveDriver, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        getAssetGPSInformation: function (AssetID, success, error) {
            var _getAssetGPSInformation = $localStorage.serverUrl_TRP + "Track/Asset/GPSInfo";
            $http.get(_getAssetGPSInformation + "/" + AssetID, { headers: defaultHeaders("application/x-www-form-urlencoded") }).success(success).error(error);
        },
    }
}]);