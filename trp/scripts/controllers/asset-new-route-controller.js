app.controller('AssetNewRouteController', ['$scope', '$localStorage', 'CommonFactory', 'MapFactory', '$location', '$filter', '$uibModal', '$rootScope', 'RoutesFactory', function ($scope, $localStorage, CommonFactory, MapFactory, $location, $filter, $uibModal, $rootScope, RoutesFactory) {
    $scope.assetNewRouteList = [];
    $scope.SelectedAsset = {};
    $scope.routeText = 'Start Plotting';
    $scope.routeMode = null;
    $scope.SpeedLimitRoute = 0;
    $scope.Distance = '';
    $scope.routeData = [];
    $scope.routeList = [];
    $scope.EditRoute = {};

    $scope.firstLoadofRoute = true;

    $scope.period = {
        start: getDateTimeToday(),
        end: getDateTimeToday(),
    };


    $scope.$watch(function () {
        return MapFactory.getNewRouteObjects();
    }, function (data) {
        if (data != undefined && data.length != 0) {
            $scope.routeData = data;
            $scope.DistanceRaw = data[0].distance;
            if (data[0].distance >= 1000)
            {

                $scope.Distance = (data[0].distance / 1000).toFixed(0) + ' km';
            }
            else
            {
                $scope.Distance = (data[0].distance).toFixed(0)  + ' m';
            }

           

            //limit the distance by 100km
            if($scope.DistanceRaw > 100000)
            {
               CommonFactory.createAlert("Error", "You can only create up to 100 km.");
            }



        }
    }, true);


    $rootScope.$on("getAssetRouteList", function () {
        if (CommonFactory.getAsset().AssetID != undefined) {
            $scope.getAssetRouteList(CommonFactory.getAsset().AssetID);
            $scope.SelectedAsset = CommonFactory.getAsset();
        } else {
            $scope.getRouteList();
        }
    });


    //clear measure route once clear map is clicked.
    $scope.$watch(function () {
        return CommonFactory.getClearMap();
    }, function (data) {

        if (data === true) {

            if ($scope.snapToRoadText === 'Clear') {
                $scope.snapToRoad();

            }

            if ($scope.straightRulerText === 'Clear') {

                $scope.straightRuler();
            }
        }
    }, true);

    $rootScope.$on("getAssetNewRouteList", function () {
        if (CommonFactory.getAsset().AssetID != undefined) {
            $scope.getAssetRouteList(CommonFactory.getAsset().AssetID);
            $scope.SelectedAsset = CommonFactory.getAsset();
        } else {
            $scope.getRouteList();
        }
    });


    //get asset route list
    $scope.getAssetRouteList = function (AssetID) {
        $scope.AssetRouteList = [];
        RoutesFactory.getAssetRouteList(
            AssetID,
            function (res) {
                if (res !== 'No Data') {
                    if (CommonFactory.getClearMap() == false) {
                        res.forEach(function (r) {
                            r.showOnMap = true;
                            MapFactory.showRoute(r.RouteID, true);
                        });
                    }
                    CommonFactory.setAssetRouteList(res);
                    $scope.AssetRouteList = res;
                }
            },
            function (error) {
            });
    };




    //get user route list
    $scope.getRouteList = function () {
        $scope.routeList = [];
        RoutesFactory.getUserRouteList(function (data) {
            if (data !== null) {
                data.forEach(function (res) {
                    var geocoords = [];

                    var geom = JSON.parse(res.Geom).Polyline;

                    console.log(geom);

                    if (geom.type == "LineString") {
                        geom.coordinates.forEach(function (c) {
                            geocoords.push({ Latitude: c[1], Longitude: c[0] });
                        });

                        res.GeoCoordinateList = geocoords;

                        $scope.routeList.push(res);
                        MapFactory.createRoute(res);
                    } else {
                        //$scope.routeList.push(res);
                    }

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

    //$scope.getRouteList();

    $scope.panRoute = function (_id) {
        $scope.isClicked = _id;
        if (CommonFactory.getAsset().length == 0) {
            MapFactory.toggleVisibilityRoute(false);
        }
        MapFactory.panRoutePolyline(_id);
        MapFactory.showRoute(_id, true);
    };



    $scope.newRoute = function (_type) {
        $scope.RouteNewMode = true;
        $scope.RouteMode = _type;
    }


    $scope.editRoute = function (Route) {

        $scope.panRoute(Route.RouteID);
        MapFactory.editRoute(Route.RouteID, Route.Type);

        $scope.EditRoute['RouteID'] = Route.RouteID;
        $scope.EditRoute['RouteTypeID'] = Route.RouteTypeID;
        $scope.EditRoute['Name'] = Route.Name;
        $scope.EditRoute['Color'] = Route.Color;

        $scope.EditRoute['Allowed'] = Route.Allowed;
        $scope.EditRoute['Enabled'] = Route.Enabled;
        $scope.EditRoute['GeoCoordinateList'] = Route.GeoCoordinateList;
        $scope.EditRoute['SpeedLimitRoute'] = Route.SpeedLimitRoute;
        $scope.RouteEditMode = true;

        CommonFactory.createAlert("Edit Route", "You may now edit " + Route.Name + " Route.");
        //$("#new-route-form-all-update").parsley().validate();
        //$("#new-route-form-all-update").parsley().validate();
    }


    $scope.startNewRoute = function () {
        var _type = $scope.RouteMode;
        if ($scope.routeText == 'Start Plotting') {
            CommonFactory.createAlert('Draw Route', 'You may now draw a route.');
      
            if (_type == 'line')
            {
                MapFactory.startNewRoute('on','line');
            }
            else
            {
                MapFactory.startNewRoute('on', 'snap');
            }

            MapFactory.getNewRouteObjects();
            $scope.routeText = 'Clear';
        } else {
            $scope.routeText = 'Start Plotting';
            MapFactory.startNewRoute('off', _type);
        }
    }

    $scope.cancelNewRoute = function () {
        MapFactory.startNewRoute('off', $scope.RouteMode);
        $scope.RouteMode = null;
        $scope.RouteNewMode = false;
        $scope.coordinates = null;
        $scope.Disabled = 'start';
        $scope.RouteName = '';
        $scope.Distance = '';
        $scope.SpeedLimitRoute = 0;
        $scope.routeText = "Start Plotting";
    };


    $scope.cancelEditRoute = function (data) {
        $scope.RouteEditMode = false;
        $scope.coordinates = null;
        $scope.RouteName = '';
        $scope.Distance = '';
        $scope.SpeedLimitRoute = 0;
        MapFactory.cancelEditRoute(data);
    }


    $scope.saveRoute = function()
    {
        $("#error-container").text("");
        $("#new-route-form-create").parsley().validate();
        $("#new-route-form-all-create").parsley().validate();
        
        if ($("#new-route-form-create").parsley().isValid() && $("#new-route-form-all-create").parsley().isValid()) {

            console.log($scope.routeData);
            console.log($scope.DistanceRaw);
            var _confirm = confirm("Are you sure you want to save this route?");
            if (_confirm) {

                if ($scope.DistanceRaw > 100000)
                {
                    CommonFactory.createAlert("Error", "You can create only up to 100 km");
                    return false;
                }


                var jsonObj = {
                    StartLatitude: "" + $scope.routeData[0].startLatitude + "",
                    EndLatitude: "" + $scope.routeData[0].endLatitude + "",
                    StartLongitude: "" + $scope.routeData[0].startLongitude + "",
                    EndLongitude: "" + $scope.routeData[0].endLongitude + "",
                    StartDatetime: "" + $scope.period.start + "",
                    EndDatetime: "" + $scope.period.end + "",
                    GeoCoordinateList: $scope.routeData[0].geocoordinates,
                    DistanceInMeters: "" + $scope.DistanceRaw + "",
                    BufferSizeInMeters: "" + 10 + "",
                    SpeedLimitRoute: "" + $scope.SpeedLimitRoute + "",
                    Name: "" + $scope.RouteName.replace(/\s\s+/g, ' ') + "",
                    Type: $scope.RouteMode
                };

                if (CommonFactory.getAsset() !== null) {
                    jsonObj["AssignedAssetList"] = [CommonFactory.getAsset().AssetID];
                }

                $scope.route_loading = true;

                RoutesFactory.addRoute(jsonObj, function (data) {

                    $scope.isLoading = true;
                    if (CommonFactory.getAsset().length != 0) {
                        $scope.getAssetRouteList(CommonFactory.getAsset().AssetID);
                    }

                    $scope.routeList.push(data);
                    $scope.RouteName = '';
                    $scope.Distance = '';
                    $scope.RouteNewMode = false;
                    $scope.routeText = "Start Plotting";

                    MapFactory.createRoute(data);
                    $scope.panRoute(data.RouteID);
                    $scope.route_loading = false;
                    MapFactory.startNewRoute('off', $scope.RouteMode);
                }, function (err) {

                });
            }
            {
                $scope.cancelNewRoute();
            }
        }
    }



    $scope.updateRoute = function ()
    {
        var updateRoute = [];
        $("#error-container").text("");
        //$("#new-route-form-update").parsley().validate();
        $("#new-route-form-all-update").parsley().validate();

        if ($("#new-route-form-update").parsley().isValid() && $("#new-route-form-all-update").parsley().isValid()) {
        //if ($("#new-route-form-all-update").parsley().isValid()) {

            var _confirm = confirm("Are you sure you want to update this Route?");

            if(_confirm)
            {
                if ($scope.DistanceRaw > 100000) {
                    CommonFactory.createAlert("Error", "You can create only up to 100 km");
                    return false;
                }


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
                    SpeedLimitRoute: "" + $scope.EditRoute.SpeedLimitRoute + "",
                }
                if (CommonFactory.getAsset() !== null) {
                    jsonObj["AssignedAssetList"] = [CommonFactory.getAsset().AssetID];
                }

                RoutesFactory.updateRoute($scope.EditRoute.RouteID,
                    jsonObj,
                    function (data) {

                    $scope.route_loading_edit = false;
                    $scope.RouteEditMode = false;
                    var route = $.grep($scope.routeList, function (e) { return e.RouteID == data.RouteID });
                    $scope.routeList.splice($scope.routeList.indexOf(route[0]), 1);
                    $scope.routeList.push(data);

                    MapFactory.createRoute(data);
                    if (CommonFactory.getAsset().length != 0) {
                        $scope.getAssetRouteList(CommonFactory.getAsset().AssetID);
                    }
                    CommonFactory.createAlert("Success", "Route Updated Successfully");

                    $scope.panRoute($scope.EditRoute.RouteID);
                    }, function (err) {
                        $scope.cancelEditRoute();
                    });

            } else
            {
                $scope.cancelEditRoute();
            }
        }

    }


    $scope.removeRoute = function (route) {
        var deleteRoute = [];
        var _confirm = confirm("Are you sure you want to delete this route?");

        if (_confirm)
        {
            $scope.route_loading_delete = true;
            RoutesFactory.deleteRoute(route.RouteID, function (success) {
                MapFactory.removeRoute(route.RouteID);
                $scope.route_loading_delete = false;
                if ($scope.AssetRouteList != undefined) {
                    var index = $scope.AssetRouteList.indexOf(route);
                    $scope.AssetRouteList.splice(index, 1);
                }

                var index = $scope.routeList.indexOf(route);
                $scope.routeList.splice(index, 1);

            }, function (err) {

            });


        }

    }



    $scope.openAssetList = function () {
        $('.left-side-panel-menu-item').removeClass('side-panel-menu-item-active active-icon');
        $('.left-side-content-container').hide("slide");
        $('#lspmi-asset').addClass('side-panel-menu-item-active active-icon');
        $('#asset').show("slide");
    };


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

}]);