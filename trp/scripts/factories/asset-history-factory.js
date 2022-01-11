'use strict';
app.factory('AssetHistoryFactory', ['$http', '$localStorage', '$filter', function ($http, $localStorage, $filter) {
    //var baseUrl = "../";
    var baseUrl = $localStorage.serverUrl_TRP;
    var _getHistory = baseUrl + "Track/Asset/History/";
    var _getHistoryRow = baseUrl + "Track/Asset/History/Export/";

    var getDownloadHistoryList = baseUrl + "History/CSV/Single"; //Downloads API URL
    var getDownloadUrl = $localStorage.serverUrlTRR + "Report/Downloads/Get/Url/";

    var headers = function (contentType) {
        return {
            'content-type': contentType,
            'accept': 'application/json'
        };
    }
    return {
        getHistory: function (params, assetId, success, error) {
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.post(_getHistory + assetId, params, { headers: headerToken }).success(success).error(error);
        },
        getHistoryRow: function (params, assetId, success, error) {
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.post(_getHistoryRow + assetId, params, { headers: headerToken }).success(success).error(error);
        },
        getDownloadsList: function (params, success, error) {
            var headerToken = headers('application/json');
            headerToken.authorization = 'Bearer ' + $localStorage.access_token_TRP;
            $http.post(getDownloadHistoryList, params, { headers: headerToken }).success(success).error(error);
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

        },
    };
}
]);

