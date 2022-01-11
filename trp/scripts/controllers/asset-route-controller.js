app.controller('AssetRouteController', ['$scope', '$localStorage', 'CommonFactory', 'MapFactory', '$location', '$filter', '$interval', '$uibModal', 'RoutesFactory','$rootScope', function ($scope, $localStorage, CommonFactory, MapFactory, $location, $filter, $interval, $uibModal, RoutesFactory, $rootScope) {
    $scope.SelectedAsset = {};
    $scope.RouteNewMode = false;
    $scope.RouteInfoMode = false;
    $scope.NewRoute = [];
    $scope.UserRouteList = [];
    $scope.EditRoute = {};
    $scope.RouteEditMode = false;
    $scope.Distance = '';
    $scope.isLoading = true;
    $scope.Disabled = 'start';
    $scope.routeText = 'Start Plotting';
    $scope.routeList = [];
    $scope.setSelectedRouteTab = false;
    $scope.setAllRouteTab = true;
    $scope.isRoute = false;
    $scope.routeInterval;

    $localStorage.roles_TRP.forEach(function (data) {
        if (data.Name === 'ROUTE') {
            $scope.isRoute = data.On;
        }
    });


    $scope.isClicked = null;

    $scope.firstLoadofRoute = true;

    $scope.period = {
        start: getDateTimeToday(),
        end: getDateTimeToday(),
    };

    //$rootScope.$on("getAssetRouteList", function () {
    //    if (CommonFactory.getAsset().AssetID != undefined) {
    //        $scope.getAssetRouteList(CommonFactory.getAsset().AssetID);
    //        $scope.SelectedAsset = CommonFactory.getAsset();
    //    } else {
    //        $scope.getRouteList();
    //    }
    //});

    $scope.getAssetRouteList = function (AssetID) {
        $scope.AssetRouteList = [];
        RoutesFactory.getAssetRouteList(
            AssetID,
            function (res) {
                //MapFactory.toggleVisibilityRoute(false);
                if (res !== 'No Data') {
                    if (CommonFactory.getClearMap() == false) {
                        res.forEach(function (r) {
                            r.showOnMap = true;
                            MapFactory.showRoute(r.RouteID, true);
                        });
                    }
                    CommonFactory.setAssetRouteList(res);
                }
            },
            function (error) {
            });
    };

    $scope.LocationFrom = function () {
        if ($scope.routeText == 'Start Plotting') {
            CommonFactory.createAlert('Draw Route', 'You may now draw a route.');
            $scope.Disabled = 'off';
            MapFactory.routeOn();
            MapFactory.getRouteObjects();
            $scope.routeText = 'Clear';
        } else {
            $scope.routeText = 'Start Plotting';
            MapFactory.routeOff();
        }
    };

    $scope.$watch(function () {
        return MapFactory.getRouteObjects();
    }, function (data) {
        if (data != undefined && data.length != 0) {
            $scope.coordinates = data;
            $scope.Distance = data[0].distance;
        }
    }, true);


    $scope.getRouteList = function () {
        $scope.routeList = [];
        RoutesFactory.getUserRouteList(function (data) {
            if (data !== null) {
                data.forEach(function (res) {

                    $scope.routeList.push(res);
                    MapFactory.createRoute(res);
                });
               
                CommonFactory.setUserRouteList($scope.routeList);
                if ($scope.firstLoadofRoute == true) {
                    MapFactory.toggleVisibilityRoute(false);
                }
                if ($scope.firstLoadofRoute == false && CommonFactory.getAsset().length === 0) {
                    MapFactory.toggleVisibilityRoute(false);
                }
                $scope.firstLoadofRoute = false;
            } else {
                $scope.routeList = [];
                CommonFactory.setUserRouteList($scope.routeList);
            }
        }, function (error) {
            $scope.isLoading = false;
            $scope.error = error.Message;
        });
    }

    $scope.$watch(function () {
        return CommonFactory.getUserRouteList();
    }, function (data) {
        $scope.isLoading = false;
        if (data.length > 0) {
            $scope.routeList = data;
            $scope.activeList = $scope.routeList;
        }
        $scope.filterRoute(data);
    }, true);

    $scope.newRoute = function () {
        $scope.RouteNewMode = true;
    }

    $scope.editRoute = function (Route) {
        
        CommonFactory.createAlert('Edit Route', 'You may now edit ' + Route.Name + ".");
        $scope.panRoute(Route.RouteID);
        MapFactory.editRoute(Route.RouteID);
        $scope.EditRoute['RouteID'] = Route.RouteID;
        $scope.EditRoute['RouteTypeID'] = Route.RouteTypeID;
        $scope.EditRoute['Name'] = Route.Name;
        $scope.EditRoute['Color'] = Route.Color;

        $scope.EditRoute['Allowed'] = Route.Allowed;
        $scope.EditRoute['Enabled'] = Route.Enabled;
        $scope.EditRoute['GeoCoordinateList'] = Route.GeoCoordinateList;
        $scope.EditRoute['SpeedLimitRoute'] = 0;
        $scope.RouteEditMode = true;
   
        CommonFactory.createAlert("Edit Route", "You may now edit " + Route.Name + " Route.");
        $("#route-update-form").parsley().validate();
        $("#route-update-form-all").parsley().validate();
    };

    $scope.routeInfo = function (route) {
        $scope.RouteNewMode = false;
        $scope.RouteInfoMode = true;
        //route.StartLocation = "Getting Location...";
        //route.EndLocation = "Getting Location...";
        //reverse end location
        //var jsonObjStart = {
        //    Latitude: route.StartLatitude,
        //    Longitude: route.StartLongitude
        //};

        //RoutesFactory.reverseGeocode(jsonObjStart, function (result) {
        //    route.StartLocation = result;
        //}, function (error) {
        //    route.StartLocation = "Can't find location";
        //});

        //reverse start location
        //var jsonObjEnd = {
        //    Latitude: route.EndLatitude,
        //    Longitude: route.EndLongitude
        //};

        //RoutesFactory.reverseGeocode(jsonObjEnd, function (result) {
        //    route.EndLocation = result;
        //}, function (error) {
        //    route.EndLocation = "Can't find Location";
        //});
        $scope.info = route;
    };

    $scope.cancelNewRoute = function () {
        $scope.RouteNewMode = false;
        $scope.coordinates = null;
        $scope.Disabled = 'start';
        $scope.RouteName = '';
        $scope.Distance = '';
        $scope.routeText = "Start Plotting";
        MapFactory.routeOff();
    };

    $scope.cancelEditRoute = function (data) {
        $scope.RouteEditMode = false;
        $scope.coordinates = null;
        $scope.RouteName = '';
        $scope.Distance = '';
        MapFactory.cancelEditRoute(data);
    }

    $scope.cancelInfoRoute = function () {
        $scope.RouteInfoMode = false;
    }

    $scope.$watch(function () {
        return CommonFactory.getAssetRouteList();
    }, function (res) {
        $scope.isLoading = false;
        $scope.AssetRouteList = res;
        $scope.activeList = $scope.AssetRouteList;
    });

    $scope.saveRoute = function (coordinates) {
        $("#error-container").text("");
        $("#route-new-form").parsley().validate();
        $("#route-new-form-all").parsley().validate();
        if ($("#route-new-form").parsley().isValid() && $("#route-new-form-all").parsley().isValid()) {

            var _confirm = confirm("Are you sure you want to save this route?");
            if (_confirm) {
                $scope.AssetList = CommonFactory.getAsset();
                if (coordinates != undefined) {
                    var jsonObj = {
                        StartLatitude: "" + coordinates[0].startLatitude + "",
                        EndLatitude: "" + coordinates[0].endLatitude + "",
                        StartLongitude: "" + coordinates[0].startLongitude + "",
                        EndLongitude: "" + coordinates[0].endLongitude + "",
                        StartDatetime: "" + $scope.period.start + "",
                        EndDatetime: "" + $scope.period.end + "",
                        GeoCoordinateList: MapFactory.getGeoCoordinateList(),
                        DistanceInMeters: "" + $scope.Distance + "",
                        BufferSizeInMeters: ""+ 10 +"",
                        SpeedLimitRoute: "" + 0 + "",
                        Name: "" + $scope.RouteName.replace(/\s\s+/g, ' ') + "",
                    };
                    if (CommonFactory.getAsset() !== null) {
                        jsonObj["AssignedAssetList"] = [CommonFactory.getAsset().AssetID];
                    }
                    $scope.route_loading = true;
                    RoutesFactory.addRoute(
                            jsonObj,
                            function (data) {

                                $scope.isLoading = true;
                                if (CommonFactory.getAsset().length != 0) {
                                    $scope.getAssetRouteList(CommonFactory.getAsset().AssetID);
                                }
                                MapFactory.routeOff();
                                $scope.coordinates = null;
                                $scope.RouteName = '';
                                $scope.Distance = '';
                                $scope.RouteNewMode = false;
                                $scope.UserRouteList.push(data);
                                $scope.routeText = "Start Plotting";
                                $scope.filterRoute(data);
                                $scope.routeList.push(data);
                                MapFactory.createRoute(data);
                                $scope.panRoute(data.RouteID);
                                $scope.route_loading = false;
                                CommonFactory.createAlert("Success", "Route Added Successfully");
                            },
                            function (error) {
                                $scope.route_loading = false;
                                CommonFactory.createAlert("Error", "Unable to Save Route,Please try again.");
                                $scope.cancelNewRoute();
                            });
                } else {
                    CommonFactory.createAlert("Error","Plot route on map first.");
                }
            } else {
                $scope.cancelNewRoute();
            }

        }

    };

    $scope.updateRoute = function () {
        var updateRoute = [];
        $("#error-container").text("");
        $("#route-update-form").parsley().validate();
        $("#route-update-form-all").parsley().validate();

        if ($("#route-update-form").parsley().isValid() && $("#route-update-form-all").parsley().isValid()) {
            var _confirm = confirm("Are you sure you want to update this Route?");

            if (_confirm) {
                $scope.route_loading_edit = true;
                var data = MapFactory.getRouteObjects();
                var jsonObj = {
                    RouteID: "" + $scope.EditRoute.RouteID + "",
                    Name: "" + $scope.EditRoute.Name.replace(/\s\s+/g, ' ') + "",
                    GeoCoordinateList: MapFactory.getGeoCoordinateList(),
                    StartLatitude: "" + data[0].startLatitude + "",
                    EndLatitude: "" + data[0].endLatitude + "",
                    StartLongitude: "" + data[0].startLongitude + "",
                    EndLongitude: "" + data[0].endLongitude + "",
                    DistanceInMeters: "" + data[0].distance + "",
                    SpeedLimitRoute: "" + 0 + "",
                }
                if (CommonFactory.getAsset() !== null) {
                    jsonObj["AssignedAssetList"] = [CommonFactory.getAsset().AssetID];
                }

                RoutesFactory.updateRoute($scope.EditRoute.RouteID,
                    jsonObj,
                    function (success) {

                        $scope.route_loading_edit = false;
                        $scope.RouteEditMode = false;
                        var route = $.grep($scope.routeList, function (e) { return e.RouteID == success.RouteID });
                        $scope.routeList.splice($scope.routeList.indexOf(route[0]), 1);
                        $scope.routeList.push(success);
                        $scope.filterRoute($scope.routeList);
                        $scope.info = success;
                        MapFactory.createRoute(success);
                        if (CommonFactory.getAsset().length != 0) {
                            $scope.getAssetRouteList(CommonFactory.getAsset().AssetID);
                        }
                        CommonFactory.createAlert("Success", "Route Updated Successfully");

                        $scope.panRoute($scope.EditRoute.RouteID);
                    }, function (error) {
                        console.log(error);
                        $scope.route_loading_edit = false;
                        CommonFactory.createAlert("Error", "Unable to update Route,Please try again");
                        $scope.cancelEditRoute();
                    });

            } else {
                $scope.cancelEditRoute();
            }
        }
    };

    $scope.panRoute = function (_id) {
        $scope.isClicked = _id;
        if (CommonFactory.getAsset().length == 0) {
            MapFactory.toggleVisibilityRoute(false);
        }
        MapFactory.panRoutePolyline(_id);
        MapFactory.showRoute(_id, true);
    };

    $scope.removeRoute = function (route) {
        var deleteRoute = [];
        var _confirm = confirm("Are you sure you want to delete this route?");

        if (_confirm) {
            $scope.route_loading_delete = true;
            MapFactory.removeRoute(route.RouteID);
            RoutesFactory.deleteRoute(route.RouteID, function (success) {
                if ($scope.AssetRouteList != undefined) {
                    var index = $scope.AssetRouteList.indexOf(route);
                    $scope.AssetRouteList.splice(index, 1);
                }
                $scope.route_loading_delete = false;
                var routeList = CommonFactory.getUserRouteList();
                routeList.forEach(function (r) {
                    if (r.RouteID != success) {
                        deleteRoute.push(r);
                    }
                });
                $scope.routeList = deleteRoute;
                $scope.getRouteList();
                if ($scope.RouteInfoMode) {
                    $scope.RouteInfoMode = false;
                }
                CommonFactory.createAlert("Success", "Route delete successfully.");
            }, function (error) {
                CommonFactory.createAlert("Error", "Unable to delete route.");
                $scope.route_loading_delete = false;
            });
        }

    }

    $scope.filterRoute = function (route) {
        var cus = CommonFactory.getCustomerList();
        var customerList = [];
        var userRouteList = CommonFactory.getUserRouteList();
        cus.forEach(function (customer) {
            customer.AssetList.forEach(function (data) {
                if (data.Status != undefined) {
                    if (userRouteList.length > 0) {
                       
                        userRouteList.forEach(function (r) {
                            if (r.AssignedAssetList.indexOf(data.AssetID) !== -1) {
                                var isDeviating = MapFactory.isDeviating(r.RouteID, data);
                                if (isDeviating === true) {
                                    data.Status.Deviation = false;
                                    data.Status.On_Route = true;
                                }
                                else {
                                    data.Status.On_Route = false;
                                    data.Status.Deviation = true;
                                }
                            }
                        });
                    } else {
                        data.Status.Deviation = false;
                    }
                }
            });
            customerList.push(customer);
        });
        CommonFactory.setCustomerList(customerList);
    }


    $scope.openRouteAssignment = function (RouteID) {
        if (RouteID == null) {
            $scope.accessModal(0, {});
        }

        $scope.accessModal(RouteID);
    };

    $scope.accessModal = function (RouteID) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'routeAssignmentModal',
            controller: 'RouteModalController',
            size: 6,
            resolve: {
                RouteID: function () {
                    return RouteID;
                }
            }
        });
    }

    $scope.openAssetList = function () {
        $('.left-side-panel-menu-item').removeClass('side-panel-menu-item-active active-icon');
        $('.left-side-content-container').hide("slide");
        $('#lspmi-asset').addClass('side-panel-menu-item-active active-icon');
        $('#asset').show("slide");
    };


    $scope.AllRouteTab = function () {
        $scope.setAllRouteTab = true;
        $scope.setSelectedRouteTab = false;
        $scope.activeList = $scope.routeList;
    }

    $scope.SelectedRouteTab = function () {
        $scope.setSelectedRouteTab = true;
        $scope.setAllRouteTab = false;
        $scope.activeList = $scope.AssetRouteList;
    }

    $scope.exportArray = [];
    $scope.exportFile = function (fileType) {
        $scope.exportArray = [];

        if ($scope.setAllRouteTab == true) {
            $scope.activeList = $scope.routeList;
        } else if ($scope.setSelectedRouteTab == true) {
            $scope.activeList = $scope.AssetRouteList;
        }

        if ($scope.activeList.length > 0) {
            $scope.activeList.forEach(function (csv) {
                $scope.CsvFileName = $localStorage.username + '-' + getDateTimeToday() + '(Route List).' + fileType;
                $scope.exportArray.push({
                    'Name': csv.Name,
                    'StartLocation ': csv.StartLocation == null ? 'No Location' : csv.StartLocation,
                    'EndLocation ': csv.EndLocation == null ? 'No Location': csv.EndLocation,
                    'Distance(m) ': csv.DistanceInMeters,
                });
                $scope.exportArray['Total'] = csv.total;
            });

            alasql('SELECT * INTO XLSX("' + $scope.CsvFileName + '",{headers:true}) FROM ?', [$scope.exportArray]);
        }
   
    };
    $scope.exportFileType = false;
    $scope.exportPanel = function () {
        if ($scope.exportFileType == false) {
            $scope.exportFileType = true;
            $('#export-file-asset-route').show("slide");
        } else {
            $scope.exportFileType = false;
            $('#export-file-asset-route').hide("slide");
        }

    }

}]);