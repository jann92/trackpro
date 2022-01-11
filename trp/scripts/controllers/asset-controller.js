app.controller('AssetController', ['$scope', '$localStorage', 'LoginFactory', 'AssetFactory', 'CommonFactory', 'MapFactory', 'ZonesFactory', 'AssetFilterFactory', '$location', '$filter', '$interval', '$rootScope', function ($scope, $localStorage, LoginFactory, AssetFactory, CommonFactory, MapFactory, ZonesFactory, AssetFilterFactory, $location, $filter, $interval, $rootScope) {
    $scope.customerList = {};
    $scope.ZoneNewMode = null;
    $scope.autoTrace = null;
    $scope.assetFocus = null;
    $scope.infoSetAsset = null;
    $scope.assetLoading = false;
    $scope.isDriver = false;
    $scope.isDelivery = false;
    $scope.assetInterval;

    var assetList = [];

    $localStorage.roles_TRP.forEach(function (data) {
        if (data.Name === 'Driver') {
            $scope.isDriver = data.On;
        }
        if (data.Name === 'Delivery') {
            //$scope.isDelivery = data.On;
        }
    });

    if ($scope.Delivery_Role.Read) {
        $scope.isDelivery = true;
    }

    if ($scope.Driver_Role.Read) {
        $scope.isDriver = true;
    }


    $scope.loadAssetList = function () {
        assetList = [];
        $scope.assetLoading = true;
        if (typeof google === 'object' && typeof google.maps === 'object') {
            var newData = [];
            AssetFactory.getCustomerList(function (gps) {
                newData = gps;

                var customerData = {};

                customerData = $scope.customerList;

                if ($scope.customerList[0] === undefined) {
                    $scope.customerList = gps;
                    customerData = $scope.customerList;
                }
                else {
                    customerData = $scope.customerList;
                }
                customerData.forEach(function (customer, idx, array) {
                    //use to check if customer is collapse or not.
                    var nselected = $.grep(newData, function (e) {
                        return e.CustomerID === customer.CustomerID;
                    })[0];

                    customer.isChecked = false;

                    customer.AssetList.forEach(function (asset, idx2, array2) {
                        assetList.push(asset);
                        if (nselected != undefined) {
                            var gps = $.grep(nselected.AssetList, function (e) {
                                return e.AssetID === asset.AssetID;
                            })[0];

                            if (gps != undefined) {
                                gps.GPSTime = CommonFactory.convertTimeZone(gps.GPSTime);
                                asset.Status = gps.Status;
                                asset.Location = gps.Location;
                                asset.Longitude = gps.Longitude;
                                asset.Latitude = gps.Latitude;
                                asset.GPSTime = gps.GPSTime;
                                asset.Fuel = gps.Fuel;
                                asset.Temperature1 = gps.Temperature1;
                                asset.Temperature2 = gps.Temperature2;
                                asset.Odometer = gps.Odometer;
                                asset.Speed = gps.Speed;
                                asset.DirectionCardinal = gps.DirectionCardinal;
                                asset.DirectionDegrees = gps.DirectionDegrees;
                                asset.color = CommonFactory.getStatusLeftBorderColor(gps.Status);
                                asset.Name = gps.Name;
                                asset.CurrentDriver = gps.CurrentDriver;
                                asset.assetName = gps.Name;
                                asset.customerName = nselected.CustomerName;
                                asset.CustomerEmail = nselected.CustomerEmail;

                                asset.ImageUrl = gps.ImageUrl;
                                asset.Status.Deviation = false;
                                asset.Registration = gps.Registration;
                                asset.Insurance = gps.Insurance;
                                asset.Service = gps.Service;

                                //property for inside zones
                                asset.ZoneInsideList = "";

                                //use on user settings notification check if user can send an email notification
                                asset.SendEmail = gps.SendEmail;
                                asset.isSendEmail = gps.SendEmail;

                                if ($scope.isDelivery) {
                                    asset.DeliveryCount = gps.DeliveryCount = null ? 0 : gps.DeliveryCount;
                                } else {
                                    asset.DeliveryCount = 0;
                                }

                                asset.DeliveryList = [];

                            }


                        }

                    });

                });

                $localStorage.AssetCount = assetList.length;

                CommonFactory.setCustomerList(customerData);

                $scope.customerList = customerData;

                $scope.loadAssetListMapInterval();

                $rootScope.$emit("getInsideZoneList", {});

                $('.loading-asset-list').hide();

                $scope.assetLoading = false;

            }, function (error, status) {
                console.log(status);
                if (status === 401) {
                    CommonFactory.createAlert(error.message, error.exceptionMessage);

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

            });;


        }
    }

    $scope.loadAssetList();

    $scope.loadAssetListMapInterval = function () {
        var gpsList = [];
        CommonFactory.getCustomerList().forEach(function (cus) {
            cus.AssetList.forEach(function (asset) {
                gpsList.push(asset);
            });
        });
        AssetFactory.getAssetListMap(function (assetList) {
            if (assetList != null) {
                assetList.forEach(function (gps, idx, array) {

                    gpsList.forEach(function (asset) {
                        if (asset.AssetID == gps.AssetID) {

                            asset.GPSTime = CommonFactory.convertTimeZone(gps.GPSTime);
                            asset.Status = gps.Status;
                            asset.Longitude = gps.Longitude;
                            asset.Latitude = gps.Latitude;
                            asset.GPSTime = gps.GPSTime;
                            asset.Speed = gps.Speed;
                            asset.DirectionCardinal = gps.DirectionCardinal;
                            asset.DirectionDegrees = gps.DirectionDegrees;
                            asset.color = CommonFactory.getStatusLeftBorderColor(gps.Status);
                            asset.Name = gps.Name;
                            asset.assetName = gps.Name;
                            asset.customerName = gps.CustomerName;
                            asset.CustomerEmail = gps.CustomerEmail;
                            asset.Delivery = gps.DeliveryNumber;

                            //property for inside zones
                            asset.ZoneInsideList = "";


                            asset.DeliveryList = [];
                            var marker = CommonFactory.createMarker(
                              'asset' + gps.AssetID
                              , gps.Name
                              , asset
                              , 'asset'
                              , false
                              , false
                              , 'label-map', $scope);

                            var getFocusAsset = CommonFactory.getFocusAsset();
                            if (getFocusAsset != null) {
                                if (getFocusAsset.focusOnMap != false) {
                                    if (asset.AssetID === getFocusAsset.AssetID) {
                                        MapFactory.panMarker('asset' + getFocusAsset.AssetID);
                                        asset.focusOnMap = true;
                                    }
                                }
                            }
                        }
                    });

                });


                $rootScope.$emit("setAssetInformation", {});
                $rootScope.$emit("assetTracerInterval", {});
                $rootScope.$emit("getInsideZoneList", {});
                $rootScope.$emit("getDeliveriesData", {});
                $rootScope.$emit("getDriverData", {});
                $rootScope.$emit("reminderList", {});

                $('.loading-asset-list').hide();

            }

        }, function (error, status) {

            if (status === 401) {

                CommonFactory.createAlert(error.message, error.exceptionMessage);

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

        });


    }


    $scope.$watch(function () {
        return CommonFactory.getAsset();
    }, function (data) {
        if (data != null) {
            if (data.AssetID) {

                $scope.isClicked = data.AssetID;

            }
        } else {

            $scope.isClicked = null;

        }

        $scope.infoSetAsset = null;

    }, true);

    $scope.$watch(function () {
        return $scope.ZoneNewMode;
    }, function (data) {
        CommonFactory.setZoneNewMode(data);
    });


    $scope.$watch(function () {
        return $scope.autoTrace;
    }, function (data) {
        CommonFactory.setTracer(data);
    });


    $scope.getUserZone = function () {
        ZonesFactory.getUserZoneList(
          function (res) {
              CommonFactory.setUserZoneList(res);
          },
          function (error) {
              console.log(error.message);
          });
    }


    $scope.panMarker = function (data) {
        var lastAsset = CommonFactory.getAsset();

        CommonFactory.setAsset(lastAsset);

        $scope.isClicked = data.AssetID;

        data['queryType'] = 'pan';
        data['showOnMap'] = true;
        data.isChecked = true;
        CommonFactory.setAsset(data);
        MapFactory.panMarker('asset' + data.AssetID);
        MapFactory.mapZoom();
        MapFactory.showMarker('asset' + data.AssetID, true);

        CommonFactory.setClearMap(false);

        $rootScope.$emit("setAssetInformation", {});
        $rootScope.$emit("getDeliveriesData", {});
        $rootScope.$emit("getDriverData", {});
        $rootScope.$emit("getAssetZoneList", {});
        $rootScope.$emit("assetTracer", {});
        $rootScope.$emit("getAssetRouteList", {});

        var isFocus = CommonFactory.getFocusAsset();

        if (isFocus != null) {
            if (isFocus == false) {
                CommonFactory.setFocusAsset(null);
            }
        }


    };


    //get asset delivery
    $scope.getAssetDelivery = function () {

        $rootScope.$emit("setAssetDelivery", {});
    }

    $scope.setAsset = function (data) {
        CommonFactory.setAsset(data);
        $(".right-side-panel-menu-item").removeClass('side-panel-menu-item-active active-icon');
        $('.right-side-content-container').hide("slide");
        $("#rspmi-asset-information").addClass('side-panel-menu-item-active active-icon');
        var target = $('#rspmi-asset-information').attr('data-slidetoggle');
        $('#' + target).show("slide");
        $scope.panMarker(data);
    };

    $scope.viewZones = function (data) {
        CommonFactory.setAsset(data);
        $localStorage.module = 'AssetZones';
        $(".right-side-panel-menu-item").removeClass('side-panel-menu-item-active active-icon');
        $('.right-side-content-container').hide("slide");
        $("#rspmi-zones").addClass('side-panel-menu-item-active active-icon');
        var target = $('#rspmi-zones').attr('data-slidetoggle');
        $('#' + target).show("slide");
        $scope.panMarker(data);
    };

    $scope.viewhistory = function (data) {
        CommonFactory.setAsset(data);
        $(".right-side-panel-menu-item").removeClass('side-panel-menu-item-active active-icon');
        $('.right-side-content-container').hide("slide");
        $("#rspmi-asset-history").addClass('side-panel-menu-item-active active-icon');
        var target = $('#rspmi-asset-history').attr('data-slidetoggle');
        $('#' + target).show("slide");
        $scope.panMarker(data);
    };

    $scope.viewAsset = function (id) {
        if ($("#asset-list-icon-" + id).hasClass('active')) {
            $("#asset-list-icon-" + id).removeClass('active');
            $("#asset-list-icon-" + id).removeClass('fa-minus-circle');
            $("#asset-list-icon-" + id).addClass('fa-plus-circle');
            $('#asset-list-' + id).slideToggle({ direction: "up" }, 300);
        }
        else {
            $("#asset-list-icon").removeClass('active');
            $("#asset-list-icon-" + id).removeClass('fa-plus-circle');
            $("#asset-list-icon-" + id).addClass('fa-minus-circle');
            $("#asset-list-icon-" + id).addClass('active');
            $('#asset-list-' + id).slideToggle({ direction: "down" }, 300);
        }
    }

    $scope.showHideCustomerAsset = function (id) {
        var customer = $.grep($scope.customerList, function (e) {
            return e.CustomerID === id;
        });

        if (customer[0] !== undefined) {
            if (customer[0].isChecked === false) {
                customer[0].isChecked = false;
                customer[0].AssetList.forEach(function (a) {
                    a.isChecked = false;
                    MapFactory.showMarker('asset' + a.AssetID, false);
                });
            }
            else {
                customer[0].isChecked = true;
                $rootScope.$emit("clusterMarker", {});
                customer[0].AssetList.forEach(function (a) {
                    a.isChecked = true;
                    MapFactory.showMarker('asset' + a.AssetID, true);
                });

            }

        }
        $rootScope.$emit("clusterMarker", {});

    };

    $scope.showHideAsset = function (id) {
        var selected = $.grep(assetList, function (a) {
            return a.AssetID === id;
        });

        if (selected[0] != undefined) {
            if (selected[0].isChecked === true) {
                MapFactory.showMarker('asset' + selected[0].AssetID, true);

                if (CommonFactory.getAsset() == null || undefined) {
                    CommonFactory.setAsset(selected[0]);
                    $rootScope.$emit("setAssetInformation", {});
                    $rootScope.$emit("getDeliveriesData", {});
                    $rootScope.$emit("getDriverData", {});
                    $rootScope.$emit("getAssetZoneList", {});
                    $rootScope.$emit("assetTracer", {});

                    $scope.isClicked = selected[0].AssetID;
                }
            }
            else {
                MapFactory.showMarker('asset' + selected[0].AssetID, false);

                if (CommonFactory.getAsset().AssetID == selected[0].AssetID) {
                    $rootScope.$emit("clearAssetTracer", {});
                    $rootScope.$emit("clearAssetZoneList", {});
                    $rootScope.$emit("clearAssetInformation", {});
                    $rootScope.$emit("clearAssetDeliveries", {});
                    $rootScope.$emit("clearAssetDriver", {});
                    $rootScope.$emit("clearAssetHistory", {});

                    $scope.isClicked = null;
                    CommonFactory.setAsset(null);
                }

            }
        }
        $rootScope.$emit("clusterMarker", {});
    }

    $scope.getMessage = function (msg) {
        return (msg) ? "Hide in Map" : "Show in Map";
    }

    $scope.stopInterval = function () {
        $interval.cancel($scope.assetInterval);
    }

    $scope.startInterval = function () {
        $scope.stopInterval();
        $scope.assetInterval = $interval($scope.loadAssetListMapInterval, 30000);
    }

    $scope.startInterval();

    $scope.$on('$destroy', function () {
        $scope.stopInterval();
    });

    $scope.$watch(function () {
        return CommonFactory.getIntervalAssets();
    }, function (data) {
        if (data) {
            $scope.startInterval();
        } else {
            $scope.stopInterval();
        }
    }, true);


}]);