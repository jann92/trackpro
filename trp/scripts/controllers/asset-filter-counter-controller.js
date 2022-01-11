app.controller('AssetFilterCounterController', ['$scope', '$localStorage', 'AssetFilterFactory', '$location', '$filter', 'CommonFactory', 'AssetFactory', 'MapFactory', '$interval', '$uibModal', '$rootScope', function ($scope, $localStorage, AssetFilterFactory, $location, $filter, CommonFactory, AssetFactory, MapFactory, $interval, $uibModal, $rootScope) {
    $scope.inactive = 0; $scope.active = 0; $scope.driving = 0; $scope.parking = 0;
    $scope.idling = 0; $scope.overspeed = 0; $scope.overidling = 0; $scope.sos = 0;
    $scope.gpscut = 0; $scope.powercut = 0; $scope.enginestop = 0; $scope.gozone = 0;
    $scope.total = 0; $scope.nozone = 0; $scope.alerts = 0; $scope.zone = 0; $scope.violations = 0;
    $scope.deviation = 0; $scope.onroute = 0; $scope.allroutes = 0; $scope.sensor1 = 0; $scope.sensor2 = 0;
    $scope.allsensors = 0; $scope.deliveries = 0;
    $scope.alerts = 0; $scope.zone = 0; $scope.mobile = 0;
    var audio = new Audio();
    var audioTimeout;


    $localStorage.roles_TRP.forEach(function (data) {
        if (data.Name === 'Route') {
            $scope.RouteOn = data.On;
        }
        if (data.Name === 'Delivery') {
            $scope.Delivery = data.On;
        }
    });


    //Get Total Asset Count
    $scope.getTotalAssetCount = function () {
        AssetFilterFactory.getAssetTotalCount(function (res) {
            $scope.total = res.Total;
            $scope.active = res.ActiveCount;
            $scope.inactive = res.InactiveCount;
            $scope.idling = res.IdlingCount;
            $scope.driving = res.DrivingCount;
            $scope.parking = res.ParkingCount;
            $scope.sos = res.SOSCount;
            $scope.gpscut = res.GPSCutCount;
            $scope.powercut = res.PowerCutCount;
            $scope.enginestop = res.EngineStopCount;
            $scope.alerts = res.GPSCutCount + res.PowerCutCount + res.EngineStopCount;
        }, function (error) {

        });
    }


    //$rootScope.$on("loadDataCounter", function () {
    //    $scope.loadDataCounter(CommonFactory.getCustomerList());
    //});


    $rootScope.$on("setInsideZoneList", function () {
        $scope.customer = CommonFactory.getCustomerList();
        var cus = $scope.customer;

        if (cus.length > 0) {
            cus.forEach(function (customer, cidx, cArray) {
                customer.AssetList.forEach(function (data) {

                    if(data.GoZone)
                    {
                        $scope.gozone += 1;
                        $scope.zone += 1;
                    }

                    if (data.NoZone) {
                        $scope.nozone += 1;
                        $scope.zone += 1;
                    }
                 
                });
            });
            CommonFactory.setTotalAsset($scope.total);
        }

    });


    //load data counter
    $scope.loadDataCounter = function () {
        //$scope.customer = cus;
        $scope.inactive = 0; $scope.active = 0; $scope.driving = 0; $scope.parking = 0;
        $scope.idling = 0; $scope.overspeed = 0; $scope.overidling = 0; $scope.overparking = 0; $scope.sos = 0;
        $scope.gpscut = 0; $scope.powercut = 0; $scope.enginestop = 0;
        $scope.total = 0; $scope.alerts = 0; $scope.violations = 0;
        $scope.deviation = 0; $scope.onroute = 0; $scope.allroutes = 0;
        $scope.sensor1 = 0; $scope.sensor2 = 0;
        $scope.allsensors = 0; $scope.zone = 0; $scope.gozone = 0; $scope.nozone = 0;
        $scope.alerts = 0; $scope.deliveries = 0; $scope.mobile = 0;


        var userZoneList = CommonFactory.getInsideZoneList() == null ? [] : CommonFactory.getInsideZoneList();
        var userRouteList = CommonFactory.getUserRouteList();


   
            AssetFactory.getAssetListCount(function (res) {

                var data = res[0];

                $scope.total = data.Total;
                $scope.driving = data.Driving;
                $scope.idling = data.Idling;
                $scope.parking = data.Parking;
                $scope.inactive = data.InActive;
                $scope.active = data.Active;
                $scope.powercut = data.PowerCut;
                $scope.sos = data.SOS;
                $scope.overidling = data.OverIdle;
                $scope.overparking = data.OverPark;
                $scope.overspeed = data.OverSpeed;
            }, function (err) {

            });


       


    };


    //filter status
    $scope.getFilteredStatus = function (data) {
        if (data.Status != undefined) {
            if (data.Status) {
                
                if (data.Status.zone == true) {
                    $scope.zone += 1;
                }
                if (data.Status.GoZone == true) {
                    $scope.gozone += 1;
                }
                if (data.Status.NoZone == true) {
                    $scope.nozone += 1;
                } if (data.DeliveryCount > 0) {
                    $scope.deliveries += 1;
                } if (data.Status.Mobile == true) {
                    $scope.mobile += 1;
                }
            }
        }
    }


    $scope.loadDataCounter();


    //get counter for assets that inside zones
    $scope.getCounterInsideZones = function () {
        $scope.gozone = 0; $scope.nozone = 0; $scope.zone = 0;

        var cus = CommonFactory.getCustomerList();

        cus.forEach(function (customer) {
            customer.AssetList.forEach(function (asset) {
                if (asset.Status.NoZone != undefined && asset.Status.GoZone != undefined) {
                    if (asset.Status.InsideZone) {
                        $scope.zone += 1;

                        if (asset.Status.GoZone) {
                            $scope.gozone += 1;
                        }

                        if (asset.Status.NoZone) {
                            $scope.nozone += 1;
                        }

                    }
                }
            });
        });
    }



    $scope.stopInterval = function () {
        $interval.cancel($scope.counterInterval);
    }

    $scope.startInterval = function () {
        $scope.stopInterval();
        $scope.counterInterval = $interval($scope.loadDataCounter, 300000);
    }

    $scope.startInterval();


    $scope.setStatus = function (status) {
        $(".left-side-panel-menu-item").removeClass('side-panel-menu-item-active active-icon');
        $("#lspmi-asset-filter").addClass('side-panel-menu-item-active active-icon');
        var target = $('#lspmi-asset-filter').attr('data-slidetoggle');
        $('#' + target).show("slide");
        $('#asset, #asset-tracer, #zone-filter, #user-settings, #nearest-asset, #measure-route').hide("slide");

        $(".asset-filter-nav li.active").removeClass('active');
        $(".asset-filter-nav li:first-child").addClass('active');
        $(".reminder-filter-tab").removeClass('active');
        $(".zone-filter-tab").removeClass('active');
        $(".asset-filter-tab").addClass('active');
        $scope.statusName = status;
        CommonFactory.setStatus(status);
        
        $rootScope.$emit("queryFilter", {});

    }

    $scope.showFeedback = function () {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'feedBackModal',
            controller: 'FeedbackModalController',
            windowClass: 'feedback',
            resolve: {
            }
        });
    }
}]);
