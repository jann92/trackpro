app.controller('HomeController', ['$scope', '$localStorage', '$interval','$window','LoginFactory', function ($scope, $localStorage, $interval,$window, LoginFactory) {
    $scope.username = $localStorage.username;


    if ($localStorage.moduleRoles_TRP == undefined) {

        LoginFactory.getRoleList(function (res) {

            $localStorage.moduleRoles_TRP = res;
          
            setRoles();
          

        }, function (err) {

        });

    } else
    {
        setRoles();
    }


    function setRoles() {
        $localStorage.moduleRoles_TRP.forEach(function (data) {
            if (data.Module === 'Asset') {
                $scope.Asset_Role = data;
            } if (data.Module === 'Landmarks') {
                $scope.Landmarks_Role = data;
            } if (data.Module === 'Zones') {
                $scope.Zone_Role = data;
            } if (data.Module === 'Delivery') {
                $scope.Delivery_Role = data;
            } if (data.Module === 'Driver') {
                $scope.Driver_Role = data;
            } if (data.Module === 'Reports') {
                $scope.Reports_Role = data;
            } if (data.Module === 'User Settings') {
                $scope.UserSettings_Role = data;
            } if (data.Module === 'Sensors') {
                $scope.Sensors_Role = data;
            } if (data.Module === 'Camera') {
                $scope.Camera_Role = data;
            } if (data.Module === 'Weather') {
                $scope.Weather_Role = data;
            } if (data.Module === 'Asset Assignment') {
                $scope.AssetAssignment_Role = data;
            } if (data.Module === 'Zone Assignment') {
                $scope.ZoneAssignment_Role = data;
            } if (data.Module === 'Asset Filter') {
                $scope.AssetFilter_Role = data;
            } if (data.Module === 'Asset Tracer') {
                $scope.AssetTracer_Role = data;
            } if (data.Module === 'Nearest Asset') {
                $scope.NearestAsset_Role = data;
            } if (data.Module === 'Measure Route') {
                $scope.MeasureRoute_Role = data;
            } if (data.Module === 'Driver Assignment') {
                $scope.DriverAssignment_Role = data;
            } if (data.Module === 'Route') {
                $scope.Route_Role.Read = true;
            } if (data.Module === 'InsightPro') {
                $scope.InsightPro_Role = data;
            } if (data.Module === 'MaintenancePro') {
                $scope.MaintenancePro_Role = data;
            } if (data.Module === 'FleetAdmin') {
                $scope.FleetAdmin_Role = data;
            } if (data.Module === 'BKB') {
                $scope.ServiceRequest_Role = data;
            }

        });

        console.log($localStorage.moduleRoles_TRP);
    }

    $scope.selectItem = function (item)
    {
        switch (item) {
            case 'fleetpro':
                $window.location.href = 'http://' + window.location.host + '/fleetpro/track/monitor/';
                break;
            case 'reports':
                $window.location.href = 'http://' + window.location.host + '/reportpro/';
                break;
            case 'maintenance':
                $window.location.href = 'http://' + window.location.host + '/maintenancepro/';
                break;
            case 'insights':
                $window.location.href = 'http://' + window.location.host + '/insightpro/';
                break;
            case 'administration':
                $window.location.href = 'http://' + window.location.host + '/fleetadmin/';
                break;
            case 'bkb':
                $window.location.href = 'http://' + window.location.host + '/bkb/';
                break;
            default:
        }
    }


    $scope.logout = function ()
    {
        localStorage.removeItem('ngStorage-access_token_TRP');
        localStorage.removeItem('ngStorage-expires_in_TRP');
        localStorage.removeItem('ngStorage-serverCode_TRP');
        localStorage.removeItem('ngStorage-defaultCoordinates_TRP');
        localStorage.removeItem('ngStorage-imagesURL_TRP');
        localStorage.removeItem('ngStorage-roles_TRP');
        localStorage.removeItem('ngStorage-moduleRoles_TRP');
        localStorage.removeItem('ngStorage-userEmail_TRP');

        location.href = "../login/";
    }

    

}]);