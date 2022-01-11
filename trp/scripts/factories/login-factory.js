'use strict';
app.factory('LoginFactory', ['$http', '$localStorage', '$filter', function ($http, $localStorage, $filter) {

    var baseUrl = $localStorage.serverUrl_TRP;
    //var serverList = baseUrl + "../Server/List/trp";
    var _serverList = "../../" + "Server/List/trp";
    var _updateUserPasswordUrl = "../../" + "Track/User/Update/Password/";
    //var getUserEmailUrl = "../../" + "Account/User/Email";
    //var sendPasswordEmailUrl = "../../" + "Track/User/Email/Get";
    var utilitiesAPIMailSendUrl = "http://login.philgps.com/UtilitiesAPI/Mail/Send";
    //var utilitiesAPIMailSendUrl = "http://localhost:53320/Mail/Send";
    var accountSensorLabelsUrl = "../../" + "Account/User/SensorLabels";
    var accountLogoutURL = "Account/Logout";


    var headers = function (contentType) {
        return {
            'content-type': contentType,
            'accept': 'application/json'
        };
    }

    var username = "";        
    return {
        login: function (loginUrl, formData, success, error) {

            $.ajax({
                method: 'POST',
                url: loginUrl,
                data: formData,
                header: headers('application/x-www-form-url-encoded')
            }).success(success).error(error)

            //var headerToken = headers('application/json');
            //$http.post(loginUrl, formData, { headers: headerToken }).success(success).error(error);
        },
        //logout: function (success) {
        //    //$localStorage.$reset();
        //    localStorage.removeItem('ngStorage-access_toke_TRP');
        //    localStorage.removeItem('ngStorage-expires_in_TRP');
        //    localStorage.removeItem('ngStorage-serverCode_TRP');
        //    localStorage.removeItem('ngStorage-defaultCoordinates_TRP');
        //    localStorage.removeItem('ngStorage-imagesURL_TRP');
        //    localStorage.removeItem('ngStorage-roles_TRP');
        //    localStorage.removeItem('ngStorage-moduleRoles_TRP');
        //    localStorage.removeItem('ngStorage-userEmail_TRP');
        //    $localStorage.serverUrl_TRP = baseUrl;
        //    success();
        //},
        setUsername: function (user) {
            username = user;
        },
        getUsername: function () {
            return username;
        },
        getServerList: function () {
            return $http.get(_serverList);
        },
        getRoles: function (success, error) {
            var _getroles = $localStorage.serverUrl_TRP + "Account/User/Roles";
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.get(_getroles, { headers: headerToken }).success(success).error(error);
        },
        getRolesList: function(success,error){
            var _getroles = $localStorage.serverUrl_TRP + "Account/User/Roles/List";
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.get(_getroles, { headers: headerToken }).success(success).error(error);
        },
        getSessionExpiryDate: function (success, error) {

            var getSessionExpiryDateUrl = $localStorage.serverUrl_TRP + "Account/Session/Expired";

            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.get(getSessionExpiryDateUrl, { headers: headerToken }).success(success).error(error);
        },
        getUserEmail: function (success, error) {

            var getUserEmailUrl = $localStorage.serverUrl_TRP + "Account/User/Email";

            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.get(getUserEmailUrl, { headers: headerToken }).success(success).error(error);
        },
        getAccountUserSensorLabels: function (success, error) {
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.get(accountSensorLabelsUrl, { headers: headerToken }).success(success).error(error);
        },
        //sendPasswordEmail: function (param, success, error) {
        //    var headerToken = headers('application/json');
        //    headerToken.authorization = 'Bearer' + $localStorage.access_token_TRP;
        //    $http.post(sendPasswordEmailUrl, param, { headers: headerToken }).success(success).error(error);
        //},
        createAlert: function (title, message) {
            $('#alert_placeholder').show('slide');
            message = (message == null ? "Please contact your administrator for more information." : message);
            $('#alert_placeholder').html('<div class="alert alert-custom"><div class="dismiss alert-custom-header"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><span class="font-15px">' + title + '</span></div><div class="alert-custom-body"><span class="font-11px">' + message + '</span></div></div>')
            setTimeout(function () {
                $('#alert_placeholder').hide('slide');
            }, 8000);
        },
        utilitiesAPIMailSend: function (param, success, error) {
            var headerToken = headers('application/json');            
            $http.post(utilitiesAPIMailSendUrl, param, { headers: headerToken }).success(success).error(error);
        },
        logout: function (param,success, error) {
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.post(accountLogoutURL, param, { headers: headerToken }).success(success).error(error);
        },
        getClientIP: function (success, error) {
            var headerToken = headers('application/json');
            //headerToken.authorization = 'Bearer ' + $localStorage.access_token;
            $http.get("https://api.ipify.org/?format=json", headerToken).success(success).error(error);
        },
        updateUserPassword: function (param, success, error) {
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer' + $localStorage.access_token_TRP;
            $http.post(_updateUserPasswordUrl, param, { headers: headerToken }).success(success).error(error);
        },
    };
}]);

