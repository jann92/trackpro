'use strict';
app.factory('UserSettingsFactory', ['$http', '$localStorage', '$filter', function ($http, $localStorage, $filter) {
    //var baseUrl = "../";
    var baseUrl = $localStorage.serverUrl_TRP;
    var _password = baseUrl + "Account/Update/Password";
    var _getAssignmentList = baseUrl + "Account/Assignment/User/Child/List";
    var _getAssignmentAssetList = baseUrl + "Account/Assignment/User/Child/Asset/List/";
    var _getCustomerReportTypeList = baseUrl + "Track/Reports/Type/List/";
    var _getReportTypeList = baseUrl + "Track/Reports/Type/List";
    var _updateAssignmentAssetList = baseUrl + "Account/Assignment/User/Child/Asset/Update/";
    var _updateCustomerEmailList = baseUrl + "Track/Customer/Assigned/Asset/Email/Update/";
    var _updateCustomerReportList = baseUrl + "Track/Reports/Type/Assign/";
    var _updateUserEmailUrl = baseUrl + "Track/User/Email/Update";
    var _getNotificationTypesUrl = baseUrl + "Track/Notification/Type/List";
    var _updateNotification = baseUrl + "Track/Notification/Update";
    var _updateSensorLabels = baseUrl + "Account/Update/User/SensorLabels";
    var _getUserAssignEmailReports = baseUrl + "Track/Get/User/Assign/Email/Reports";
    var _userAssignEmailReports = baseUrl + "Track/User/Assign/Email/Reports";

    var _getAssignmentCustomerList = [];
    var headers = function (contentType) {
        return {
            'content-type': contentType,
            'accept': 'application/json'
        };
    }
    return {
        changePassword: function (params, success, error) {
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.post(_password, params, { headers: headerToken }).success(success).error(error);
        },
        changeUserEmail: function (params, success, error) {
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.post(_updateUserEmailUrl, params, { headers: headerToken }).success(success).error(error);
        },
        getAssignmentList: function(success, error){
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.post(_getAssignmentList, '', { headers: headerToken }).success(success).error(error);
        },
        getAssignmentAssetList: function (_assignmentID, success, error) {
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.get(_getAssignmentAssetList + _assignmentID, { headers: headerToken }).success(success).error(error);
        },
        getCustomerReportTypeList: function (_customerID, success, error) {
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.get(_getCustomerReportTypeList + _customerID, { headers: headerToken }).success(success).error(error);
        },
        getReportTypeList: function(success,error){
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.get(_getReportTypeList, { headers: headerToken }).success(success).error(error);
        },
        updateCustomerReportList: function (_customerID, _reportList, success, error) {
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.post(_updateCustomerReportList + _customerID, _reportList, { headers: headerToken }).success(success).error(error);
        },
        updateAssignmentAssetList: function (_assignmentID, _assetList, success, error) {
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.post(_updateAssignmentAssetList + _assignmentID, _assetList, { headers: headerToken }).success(success).error(error);
        },
        updateCustomerEmailList: function (_cusID, _assetList, success, error) {
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.post(_updateCustomerEmailList + _cusID, _assetList, { headers: headerToken }).success(success).error(error);
        },
        setAssignmentCustomerList: function(data) {
            _getAssignmentCustomerList = data;
        },
        getAssignmentCustomerList: function () {
            return _getAssignmentCustomerList;
        },
        getNotificationTypes: function(success,error){
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.get(_getNotificationTypesUrl, { headers: headerToken }).success(success).error(error);
        },
        updateNotification: function(_param,success,error){
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.post(_updateNotification, _param, { headers: headerToken }).success(success).error(error);
        },
        updateSensorLabels: function(_param, success, error){
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.post(_updateSensorLabels, _param, { headers: headerToken }).success(success).error(error);
        },
        getUserAssignEmailReports: function (success, error) {
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.get(_getUserAssignEmailReports, { headers: headerToken }).success(success).error(error);
        },
        userAssignEmailReports: function (_param, success, error) {
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.post(_userAssignEmailReports, _param, { headers: headerToken }).success(success).error(error);
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