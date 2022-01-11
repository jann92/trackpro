app.controller('AssetFilterController', ['$scope', '$localStorage', 'AssetFilterFactory', '$location', '$filter', 'CommonFactory', 'AssetFactory', 'MapFactory', '$rootScope', function ($scope, $localStorage, AssetFilterFactory, $location, $filter, CommonFactory, AssetFactory, MapFactory, $rootScope) {
    //CommonFactory.getRoles($scope);
    $scope.filteredStatus = [];
    $scope.viewData = {};
    $scope.loading = false;
    $scope.count = 0;
    $scope.customerList = [];

    $scope.isDelivery = $scope.Delivery_Role.Read;
    $scope.isDriver = $scope.Driver_Role.Read;

    $scope.assetStatus = [
        {
            status: 'Select Status...',
            id: 'Select'
        },
        {
            status: 'Total',
            id: 'Total'
        },
        {
            status: 'Active',
            id: 'Active'
        },
        {
            status: 'Inactive',
            id: 'InActive'
        },
        //{
        //    status: 'Inside Zone',
        //    id: 'Zone'
        //},
        //{
        //    status: 'Go Zone',
        //    id: 'GoZone'
        //},
        //{
        //    status: 'No Zone',
        //    id: 'NoZone'
        //},
        {
            status: 'Driving',
            id: 'Driving'
        },
        {
            status: 'Idling',
            id: 'Idling'
        },
        {
            status: 'Parking',
            id: 'Parking'
        },
        {
            status: 'OverSpeed',
            id: 'OverSpeeding'
        },
        {
            status: 'OverIdle',
            id: 'OverIdle'
        },
        {
            status: 'OverPark',
            id: 'OverPark'
        },
        {
            status: 'SOS',
            id: 'SOS'
        },
        {
            status: 'GPS Cut',
            id: 'GPSCut'
        },
        {
            status: 'Power Cut',
            id: 'PowerCut'
        },
        //{
        //    status: 'Engine Stop',
        //    id: 'EngineStop'
        //},
        //{
        //    status: 'Off Route',
        //    id: 'Deviation'
        //},
        //{
        //    status: 'On Route',
        //    id: 'On_Route'
        //},
        {
            status: 'Sensor 1',
            id: 'Sensor1'
        },
        {
            status: 'Sensor 2',
            id: 'Sensor2'
        },
        //{
        //    status: 'Alerts',
        //    id: 'Alerts'
        //},
        //{
        //    status: 'Delivery',
        //    id: 'Delivery'
        //}
    ];

    $scope.selected = $scope.assetStatus[0];


    $scope.assetStatusMobile = [
     {
         status: 'Select Status...',
         id: 'Select'
     },
     {
         status: 'Total',
         id: 'Total'
     },
     {
         status: 'Active',
         id: 'Active'
     },
     {
         status: 'Inactive',
         id: 'InActive'
     },
     //{
     //    status: 'Zone',
     //    id: 'Zone'
     //},
     {
         status: 'Driving',
         id: 'Driving'
     },
     {
         status: 'Idling',
         id: 'Idling'
     },
     {
         status: 'Parking',
         id: 'Parking'
     },
     {
         status: 'Violations',
         id: 'Violations'
     },
     {
         status: 'Alerts',
         id: 'Alerts'
     },
     //{
     //    status: 'Routes',
     //    id: 'All_Routes'
     //},
     {
         status: 'Sensors',
         id: 'Sensors'
     }
    ];


    //add option delivery in list of filters.
    if ($scope.isDelivery) {
        $scope.assetStatus.splice(18, 0, { status: 'Delivery', id: 'Delivery' });
        $scope.assetStatusMobile.splice(11, 0, { status: 'Delivery', id: 'Delivery' });

    }
  

    $scope.selectedMobile = $scope.assetStatusMobile[0];

    $scope.RemindersList = [
        {
            status: 'Select Status...',
            id: 'Select'
        },
        {
            status: 'Vehicle Registration Exp.',
            id: 1
        },
        {
            status: 'Vehicle Insurance Exp.',
            id: 2
        }
    ];


    $scope.selectedReminder = $scope.RemindersList[0];


    $scope.selected.id = "Select";


    $scope.getStatus = function () {
        CommonFactory.setStatus($scope.selected.id);
    };


    $scope.getStatus();


    $scope.getStatusMobile = function () {
        CommonFactory.setStatus($scope.selectedMobile.id);
    };


    $scope.$watch(function () {
        return CommonFactory.getStatus();
    }, function (data) {
        if (data.length > 0) {
            if (data === "GoZone" || data === "NoZone" || data === "Zone") {
                $scope.loadDataFilterZones(data);
            }

        }
    }, true);


    $scope.$watch(function () {
        return CommonFactory.getAsset();
    }, function (data) {
        if (data != undefined)
            if (data.length > 0 || data != null) {
                $scope.isClicked = data.AssetID;
            }
    }, true);

    $rootScope.$on("loadDataFilter", function () {
        if (CommonFactory.getAsset() != null) {
            var status = CommonFactory.getStatus();
        }
    });



    $rootScope.$on("queryFilter", function () {

        var status = CommonFactory.getStatus();

        var stat = $.grep($scope.assetStatus, function (e) {
            return e.id === status;
        });


        if(stat[0])
        {
            $scope.selected = stat[0];

            $scope.queryFilter();
        }

    });

    //filter assets
    $scope.queryFilter = function () {
        $scope.count = 0;
        var geocoder = new google.maps.Geocoder;
        var status = $scope.selected.id;
        $scope.loading = true;
        AssetFilterFactory.getAssetFilterList(status, function (res) {

            var assetList = [];
            var customerList = [];

            CommonFactory.getCustomerList().forEach(function (cus) {
                cus['assetFilterList'] = [];
                customerList.push(cus);
                cus.AssetList.forEach(function (asset) {
                    assetList.push(asset);
                });
            });

            res.forEach(function (data) {
                data.GPSTime = CommonFactory.convertTimeZone(data.GPSTime);
                var customerID = $.grep(assetList, function (asset) {
                    return asset.AssetID === data.AssetID;
                })[0].CustomerID;
                customerList.forEach(function (cus) {
                    if (cus.CustomerID == customerID) {
                        cus.assetFilterList.push(data);
                    }
                });
            });
            $scope.customerList = customerList;
            $scope.filteredStatus = res;

            $scope.loading = false;
        }, function (error) {
            $scope.loading = false;
        });
    }



    $rootScope.$on("loadDataFilterZones", function () {

        $scope.loadDataFilterZones(CommonFactory.getStatus());
    });

    $scope.filteredStatus = [];
    $scope.loadDataFilterZones = function (status) {

        var cus = CommonFactory.getCustomerList();

        if (cus.length > 0) {

            var AssetList = [];

            cus.forEach(function (customer) {

                customer.AssetList.forEach(function (gps) {
                    gps.GPSTime = CommonFactory.convertTimeZone(gps.GPSTime);
                    AssetList.push(gps);
                })
            });


            if (status === 'Zone') {
                $scope.filteredStatus = $.grep(AssetList, function (e) {
                    if (e.Status != undefined) {
                        return e.Status.zone === true;
                    }
                });
            }

            if (status === 'GoZone') {
                $scope.filteredStatus = $.grep(AssetList, function (e) {
                    if (e.Status != undefined) {
                        return e.Status.GoZone === true;
                    }
                });
            }

            if (status === 'NoZone') {
                $scope.filteredStatus = $.grep(AssetList, function (e) {
                    if (e.Status != undefined) {
                        return e.Status.NoZone === true;
                    }
                });
            }


            $scope.selected = $.grep($scope.assetStatus, function (e) {
                return e.id === status;
            })[0];

            $scope.selectedMobile = $.grep($scope.assetStatusMobile, function (e) {
                return e.id === status;
            })[0];
        }
    };

    $scope.toggleVehicle = function (data) {

        $scope.isClicked = data.AssetID;

        if (data.showOnMap) {

            data.showOnMap = false;
            MapFactory.mapZoom();
            MapFactory.panMarker('asset' + data.AssetID);

        } else {

            MapFactory.mapZoom();
            MapFactory.panMarker('asset' + data.AssetID);
            data.showOnMap = true;

        }

        CommonFactory.setAsset(data);
        MapFactory.toggleMarkerVisibility(data.AssetID);

    };

    $scope.panMarker = function (data) {

        var lastAsset = CommonFactory.getAsset();
        CommonFactory.setAsset(lastAsset);
        $scope.isClicked = data.AssetID;

        data['queryType'] = 'pan';
        data['showOnMap'] = true;

        MapFactory.panMarker('asset' + data.AssetID);
        MapFactory.showMarker('asset' + data.AssetID, true);

        $rootScope.$emit("setAsset", data.AssetID);

        //$rootScope.$emit("setAssetInformation", {});
        $rootScope.$emit("getDeliveriesData", {});
        $rootScope.$emit("getDriverData", {});
        $rootScope.$emit("getAssetZoneList", {});
        $rootScope.$emit("assetTracer", {});

        CommonFactory.setClearMap(false);
    };


    $scope.setAsset = function (data) {

        CommonFactory.setAsset(data);
        $(".right-side-panel-menu-item").removeClass('side-panel-menu-item-active active-icon');
        $('.right-side-content-container').hide("slide");
        $("#rspmi-asset-information").addClass('side-panel-menu-item-active active-icon');
        var target = $('#rspmi-asset-information').attr('data-slidetoggle');
        $('#' + target).show("slide");
    };


    $scope.viewZones = function (data) {

        CommonFactory.setAsset(data);
        $localStorage.module = 'AssetZones';
        $(".right-side-panel-menu-item").removeClass('side-panel-menu-item-active active-icon');
        $('.right-side-content-container').hide("slide");
        $("#rspmi-zones").addClass('side-panel-menu-item-active active-icon');
        var target = $('#rspmi-zones').attr('data-slidetoggle');
        $('#' + target).show("slide");
    };


    $scope.viewhistory = function (data) {

        CommonFactory.setAsset(data);
        $(".right-side-panel-menu-item").removeClass('side-panel-menu-item-active active-icon');
        $('.right-side-content-container').hide("slide");
        $("#rspmi-asset-history").addClass('side-panel-menu-item-active active-icon');
        var target = $('#rspmi-asset-history').attr('data-slidetoggle');
        $('#' + target).show("slide");
    };


    $scope.focusAssetMap = function (data) {

        if (data.focusOnMap != true) {

            var cus = CommonFactory.getCustomerList();

            cus.forEach(function (customer) {

                customer.AssetList.forEach(function (gps) {
                    gps.focusOnMap = false;
                });

            });

            data['focusOnMap'] = true;
            data.showOnMap = true;

            CommonFactory.setFocusAsset(data);

            MapFactory.panMarker('asset' + data.AssetID);

        } else {

            data['focusOnMap'] = false;
            data.showOnMap = false;
            CommonFactory.setFocusAsset(data);
            setTimeout(function () {
                MapFactory.setZoom(8);
            }, 1000);
        }

        CommonFactory.setAsset(data);


    };


    $scope.getMessageFocus = function (msg) {
        return (msg) ? "Remove Focus" : "Focus Asset";
    }



    $scope.exportXLSX = false;
    $scope.exportCSV = false;

    $scope.exportArray = [];
    $scope.exportFile = function (fileType) {

        if (fileType === 'xlsx') {
            $scope.exportXLSX = true;
        } else if (fileType === 'csv') {
            $scope.exportCSV = true;
        }

        $scope.exportArray = [];
        var status = $scope.selected.id;

            if ($scope.selected) {

                $scope.CsvFileName = $localStorage.username + '-' + getDateTimeToday() + '(' + $scope.selected.id + ').' + fileType;
            } else {

                $scope.CsvFileName = $localStorage.username + '-' + getDateTimeToday() + '(' + $scope.selectedMobile.id + ').' + fileType;
            }

            AssetFilterFactory.getAssetFilterListExport(status, function (success) {

                if (fileType === 'xlsx') {
                    $scope.exportXLSX = false;
                } else if (fileType === 'csv') {
                    $scope.exportCSV = false;
                }

                var assetList = [];
                var customerList = [];

                CommonFactory.getCustomerList().forEach(function (cus) {
                    cus['assetFilterListExport'] = [];
                    customerList.push(cus);
                    cus.AssetList.forEach(function (asset) {
                        assetList.push(asset);
                    });
                });

                success.forEach(function (data) {
                    data.GPSTime = CommonFactory.convertTimeZone(data.GPSTime);
                    var customerID = $.grep(assetList, function (asset) {
                        return asset.AssetID === data.AssetID;
                    })[0].CustomerID;
                    customerList.forEach(function (cus) {
                        if (cus.CustomerID == customerID) {
                            cus.assetFilterListExport.push(data);
                        }
                    });
                });

                $scope.customerList = customerList;

                setTimeout(function () {
                    TableToExcel.convert(document.getElementById("asset-filter-table-export"), {
                        name: $localStorage.username + '-' + getDateTimeToday() + '(' + $scope.selected.id + ').' + fileType
                    });

                }, 1500);
              

            }, function (err) {
                if (fileType === 'xlsx') {
                    $scope.exportXLSX = false;
                } else if (fileType === 'csv') {
                    $scope.exportCSV = false;
                }
            });
    


    };


    $scope.exportFileType = false;
    $scope.exportPanel = function () {

        if ($scope.exportFileType == false) {

            $scope.exportFileType = true;
            $('#export-file-filter-asset').show("slide");

        } else {

            $scope.exportFileType = false;
            $('#export-file-filter-asset').hide("slide");
        }

    }


    $scope.getMessage = function (msg) {
        return (msg) ? "Hide in Map" : "Show in Map";
    }

}]);

