app.factory('DeliveryFactory', ['$http', '$localStorage', '$filter', function ($http, $localStorage, $filter) {
    //var baseUrl = "../";
    var baseUrl = $localStorage.serverUrl_TRP;
    var _getObjectDelivery = baseUrl + "Delivery/List/Current";
    var _getUnassignedDelivery = baseUrl + "Delivery/List/Unassigned";
    var _assignDelivery = baseUrl + "Delivery/Assign";
    var _createDelivery = baseUrl + "Delivery/Create";
    var _getObjectDeliveryCompleted = baseUrl + "Delivery/List/Completed";
    var _startDelivery = baseUrl + "Delivery/Start";
    var _cancelDelivery = baseUrl + "Delivery/Cancel";
    var _completeDelivery = baseUrl + "Delivery/Complete";
    var _updateDelivery = baseUrl + "Delivery/Modify";
    var _removeDelivery = baseUrl + "Delivery/Delete";


    var defaultHeaders = function (contentType) {
        return {
            'content-type': contentType,
            'accept': 'application/json',
            'authorization': "Bearer " + $localStorage.access_token_TRP
        };
    }

    return {
        getObjectDelivery: function (assetID, success, error) {
            $http.get(_getObjectDelivery + '/' + assetID, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        getUnassignedDelivery: function (success, error) {
            $http.get(_getUnassignedDelivery, { headers: defaultHeaders("application/x-www-form-urlencoded") }).success(success).error(error);
        },
        getObjectDeliveryCompleted: function (AssetID, success, error) {
            $http.get(_getObjectDeliveryCompleted + '/' + AssetID, { headers: defaultHeaders("application/x-www-form-urlencoded") }).success(success).error(error);
        },
        assignDelivery: function (param, success, error) {
            $http.post(_assignDelivery, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        createDelivery: function (param, success, error) {
            $http.post(_createDelivery, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        updateDelivery: function (param, success, error) {
            $http.post(_updateDelivery, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        startDelivery: function (param, success, error) {
            $http.post(_startDelivery, param, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        cancelDelivery: function (deliveryNum, success, error) {
            $http.post(_cancelDelivery + '/' + deliveryNum, {}, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        deleteDelivery: function (deliveryNum, success, error) {
            $http.post(_removeDelivery + '/' + deliveryNum, {}, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
        completeDelivery: function (params, success, error) {
            $http.post(_completeDelivery, params, { headers: defaultHeaders("application/json") }).success(success).error(error);
        },
    }
}]);