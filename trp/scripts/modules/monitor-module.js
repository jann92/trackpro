//var app = angular.module("Monitor", ['ngRoute', 'ngStorage', 'ui.bootstrap', 'angularjs-datetime-picker']);
var app = angular.module("Monitor", ['ngRoute', 'ngStorage', 'ui.bootstrap', 'infinite-scroll']);

//To check local storage | intercept route and location
app.run(function ($rootScope, $location, $localStorage, LoginFactory, $interval) {
    var sessionToken = function () {
        var date = new Date();
        var sessionDate = new Date($localStorage.sessionExpiredDate_TRP);
        //if (date > sessionDate) {
        //    LoginFactory.logout(function () {
        //        location.href = "../login/"
        //    });
        //}
    }
    sessionToken();
    $rootScope.$on("$locationChangeStart", function (event, next, current) {
        if ($localStorage.access_token_TRP == null) {
            //$localStorage.$reset();
            localStorage.removeItem('ngStorage-access_token_TRP');
            localStorage.removeItem('ngStorage-expires_in_TRP');
            localStorage.removeItem('ngStorage-serverCode_TRP');
            localStorage.removeItem('ngStorage-defaultCoordinates_TRP');
            localStorage.removeItem('ngStorage-imagesURL_TRP');
            localStorage.removeItem('ngStorage-roles_TRP');
            localStorage.removeItem('ngStorage-moduleRoles_TRP');
            localStorage.removeItem('ngStorage-userEmail_TRP');

            window.location = "../login"
        } else {
            $interval(sessionToken, 10000);
        }
    });
});


app.directive('headerMenu', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/nav/nav.html',
        controller: function ($scope, $localStorage, LoginFactory, CommonFactory, MapFactory, $interval, $rootScope, $uibModal) {
            $scope.helperUrl = "http://login.philgps.com";


            if ($localStorage.moduleRoles_TRP == undefined) {
                LoginFactory.getRolesList(function (res) {

                    if (res != null) {
                        $localStorage.moduleRoles_TRP = res;
                    }

                    setRoles();

                }, function (error,status) {
                    if (status === 401) {
                        CommonFactory.createAlert(error.message, error.exceptionMessage);

                        $scope.logout();
                    }
                });
            } else {

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
                    } if (data.Module === 'Administration') {
                        $scope.FleetAdmin_Role = data;
                    } if (data.Module === 'BKB') {
                        $scope.ServiceRequest_Role = data;
                    } if (data.Module === 'Metro Retail') {
                        $scope.MetroRetail_Role = data;
                    } if (data.Module === 'DHL') {
                        $scope.DHL_Role = data;
                    }

                });
            }

            

            //$localStorage.roles_TRP.forEach(function (data) {
            //    if (data.Name === 'GIS Operator') {
            //        $scope.GIS_OP = data.On;
            //    } if (data.Name === 'GIS Administrator') {
            //        $scope.GIS_AD = data.On;
            //    } if (data.Name === 'Data Operator') {
            //        $scope.DATA_OP = data.On;
            //    } if (data.Name === 'Data Administrator') {
            //        $scope.DATA_AD = data.On;
            //    } if (data.Name === 'Fleet Expense') {
            //        $scope.FE = data.On;
            //    } if (data.Name === 'Weather') {
            //        $scope.WEATHER = data.On;
            //    } if (data.Name === 'Group Code View') {
            //        $scope.GCVIEW = data.On;
            //    } if (data.Name === 'Delivery') {
            //        $scope.DELIVERY = data.On;
            //    } if (data.Name === 'Threshold') {
            //        $scope.THRESHOLD = data.On;
            //    } if (data.Name === 'Delete') {
            //        $scope.DELETE = data.On;
            //    } if (data.Name === 'Route') {
            //        $scope.Route = data.On;
            //    } if (data.Name === 'Driver') {
            //        $scope.Driver = data.On;
            //    } if (data.Name === 'Alerts') {
            //        $scope.Alerts = data.On;
            //    }
            //});

            $scope.logout = function () {

                LoginFactory.getClientIP(function (ip) {
                    console.log(ip.ip);

                var param = { IPAdd: ip.ip };

                    LoginFactory.logout(param, function (data) {

                        localStorage.removeItem('ngStorage-access_token_TRP');
                        localStorage.removeItem('ngStorage-expires_in_TRP');
                        localStorage.removeItem('ngStorage-serverCode_TRP');
                        localStorage.removeItem('ngStorage-defaultCoordinates_TRP');
                        localStorage.removeItem('ngStorage-imagesURL_TRP');
                        localStorage.removeItem('ngStorage-roles_TRP');
                        localStorage.removeItem('ngStorage-moduleRoles_TRP');
                        localStorage.removeItem('ngStorage-userEmail_TRP');

                        location.href = "../login/";
                    }, function (error) {

                        localStorage.removeItem('ngStorage-access_token_TRP');
                        localStorage.removeItem('ngStorage-expires_in_TRP');
                        localStorage.removeItem('ngStorage-serverCode_TRP');
                        localStorage.removeItem('ngStorage-defaultCoordinates_TRP');
                        localStorage.removeItem('ngStorage-imagesURL_TRP');
                        localStorage.removeItem('ngStorage-roles_TRP');
                        localStorage.removeItem('ngStorage-moduleRoles_TRP');
                        localStorage.removeItem('ngStorage-userEmail_TRP');

                        location.href = "../login/";
                    });
                }, function (error) {

                });
            };


            //if (!$scope.GIS_OP) {
            //    CommonFactory.createAlert("Error.", "You are not allowed to access this page.");
            //    $scope.logout();
            //}


            $scope.notifbadge = true;


            $scope.TrackReportURL = 'http://' + window.location.host + '/reportpro/';

            $scope.InsightProURL = 'http://' + window.location.host + '/insightpro/';

            $scope.MaintenanceProURL = 'http://' + window.location.host + '/maintenancepro/';


            //watch selected asset.
            $scope.$watch(function () {
                return CommonFactory.getAsset();
            }, function (data) {
                $scope.selectedAsset = data;
                if (data == null) {
                    $scope.selectedAsset = [];
                }
            });

            $scope.removeAsset = function (data) {
                data.focusOnMap = false;
                CommonFactory.setAsset(data);
                $scope.selectedAsset = [];
                CommonFactory.setAsset($scope.selectedAsset);
            };

            //asset focus
            $scope.focusAsset = false;
            $scope.focusAssetMap = function (data) {
                if (data.focusOnMap != true) {
                    $scope.focusAsset = false;
                    var cus = CommonFactory.getCustomerList();
                    cus.forEach(function (customer) {
                        customer.AssetList.forEach(function (gps) {
                            gps.focusOnMap = false;
                        });
                    });
                    data.focusOnMap = true;
                    data.showOnMap = true;
                    MapFactory.showMarker("asset" + data.AssetID, true);
                    CommonFactory.setFocusAsset(data);
                    MapFactory.panMarker('asset' + data.AssetID);
                    $scope.focusAsset = true;
                } else {
                    data.focusOnMap = false;
                    CommonFactory.setFocusAsset(data);
                    $scope.focusAsset = false;
                    console.log('test');
                    MapFactory.setZoom(8);
                }
            };

            $scope.getMessageFocus = function (msg) {
                return (msg) ? "Remove Focus" : "Focus Asset";
            };


            $rootScope.$on("removeFocusAsset", function (data) {
                var cus = CommonFactory.getCustomerList();
                cus.forEach(function (customer) {
                    customer.AssetList.forEach(function (gps) {
                        gps.focusOnMap = false;
                    });
                });
                CommonFactory.setFocusAsset(false);
                $scope.focusAsset = false;
            });



            $rootScope.$on("setFocusAsset", function (res) {
                var data = CommonFactory.getAsset();
                $scope.focusAssetMap(data);
            });



            //clearmap
            $scope.clearMap = function () {

                MapFactory.toggleAllMarkers(false);

                CommonFactory.setShowAllMarkers(false);
                CommonFactory.setShowAllZones(false);
                CommonFactory.setShowAllLandmarks(false);
                CommonFactory.setClusterAllMarkers(false);


                MapFactory.toggleVisibilityPolygon(false);
                MapFactory.toggleVisibilityLandmark(false);
                MapFactory.toggleVisibilityRoute(false);
                MapFactory.toggleAllMarkers(false);
                MapFactory.markerCluster(false);

                var asset = CommonFactory.getAsset();
                if (asset != null) {
                    if (asset.AssetID) {
                        asset.focusOnMap = false;
                        $scope.focusAsset = false;
                    }
                }

                CommonFactory.setFocusAsset(null);
                CommonFactory.setAsset(null);


                CommonFactory.setClearMap(true);

                $rootScope.$emit("clearMap", {});

                $rootScope.$emit("clearAssetTracer", {});

            }


            //logout
            $scope.username = $localStorage.username;
            LoginFactory.setUsername($scope.username);




            //show modal for feedback found a bug
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



            $scope.summaryToggle = function () {

                if ($('.summary-icon').hasClass('active')) {
                    $('.summary-container').slideToggle({ direction: "up" }, 300);
                    $('.summary-icon').removeClass('fa-caret-down');
                    $('.summary-icon').removeClass('active');
                    $('.summary-icon').addClass('fa-caret-up');
                    if ($("#lspmi-asset-filter").hasClass('side-panel-menu-item-active')) {
                        $("#lspmi-asset-filter").removeClass('side-panel-menu-item-active');
                        $('.left-side-content-container').hide("slide");
                    }
                } else {
                    $('.summary-container').slideToggle({ direction: "down" }, 300);
                    $('.summary-icon').removeClass('fa-caret-up');
                    $('.summary-icon').addClass('active');
                    $('.summary-icon').addClass('fa-caret-down');
                    if ($("#lspmi-asset-filter").hasClass('side-panel-menu-item-active')) {
                        $("#lspmi-asset-filter").removeClass('side-panel-menu-item-active');
                        $('.left-side-content-container').hide();
                    }
                }
            };
            $scope.hasClass = function () {
                if ($('#rspmi-asset-history').hasClass('active-icon')) {
                    $scope.playbackToggle = true;
                } else {
                    $scope.playbackToggle = false;
                    $('#historyMap').slideUp();
                }
            }
        }
    }
});

//Left Side

app.directive('asset', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/nav/asset.html',
    }
});


app.directive('assetFilter', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/nav/asset-filter.html',
    }
});


app.directive('assetCounter', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/nav/asset-counter.html',
    }
});

app.directive('assetHistory', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/nav/asset-history.html',
    }
});

//app.directive('zoneFilter', function () {
//    return {
//        restrict: "EAC",
//        templateUrl: '../views/nav/zone-filter.html',
//    }
//});

app.directive('userSettings', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/nav/user-settings.html',
    }
});


//Right Side
app.directive('assetInformation', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/nav/asset-information.html',
    }
});


app.directive('zones', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/nav/zones.html',
    }
});


app.directive('nearestAsset', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/nav/nearest-asset.html',
    }
});


app.directive('landmarks', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/nav/landmarks.html',
    }
});


app.directive('measureRoute', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/nav/measure-route.html',
    }
});


app.directive('assetTracer', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/nav/asset-tracer.html',
    }
});


app.directive('assetRoute', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/nav/asset-route.html',
    }
});

app.directive('assetNewRoute', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/nav/asset-new-route.html',
    }
});

app.directive('assetDelivery', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/nav/asset-delivery.html',
    }
});


app.directive('assetDriver', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/nav/asset-driver.html',
    }
});

app.directive('alertNotification', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/nav/notifications.html',
    }
});


app.directive('newsFeed', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/nav/news-feed.html',
    }
});


//Top
app.directive('mapTools', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/nav/map-tools.html',
    }
});


//Bottom
app.directive('assetFilterCounter', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/nav/asset-filter-counter.html',
    }
});


//Summary
app.directive('customerSummary', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/summary/customer-summary.html',
    }
});


app.directive('summaryAssetFilter', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/summary/summary-asset-filter.html',
    }
});


app.directive('summaryAsset', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/summary/summary-asset.html',
    }
});

//Modal
app.directive('userSettingsModal', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/modal/modal-user-settings.html',
    }
});


//Zones Modal
app.directive('zonesAssignmentModal', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/modal/modal-zones-assignment.html',
    }
});


//Route Modal
app.directive('routeAssignmentModal', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/modal/modal-route-assignment.html',
    }
});

//Alert CheckList Modal
app.directive('alertCheckModal', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/modal/modal-alert-checklist.html',
    }
});

//Feedback Modal
app.directive('feedbackModal', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/modal/modal-feedback.html',
    }
});


//Delivery Modal
app.directive('deliveryModal', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/modal/modal-delivery.html',
    }
});


//Driver Modal
app.directive('driverAssetAssignmentModal', function () {
    return {
        restrict: "EAC",
        templateUrl: '../views/modal/modal-driver-asset.html',
    }
});


//ng-repeat finish render checking
app.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    }
});


//Filters
app.filter('on_off', function () {
    return function (input) {
        if (input) {
            return 'On';
        }
        return 'Off';
    }
});

app.filter('byNameAssetID', function () {
    return function (asset, search) {
        if (angular.isDefined(search)) {
            var results = [];
            var i;
            var searchVal = search.toLowerCase();
            for (i = 0; i < asset.length; i++) {
                var name = asset[i].Name.toLowerCase();
                var assetID = asset[i].AssetID.toLowerCase();
                if (name.indexOf(searchVal) >= 0 || assetID.indexOf(searchVal) >= 0) {
                    results.push(asset[i]);
                }
            }
            return results;
        } else {
            return asset;
        }
    };
});



app.filter('byNameAssetIDSIMNo', function () {
    return function (asset, search) {
        if (angular.isDefined(search)) {
            var results = [];
            var i;
            var searchVal = search.toLowerCase();
            for (i = 0; i < asset.length; i++) {
                var name = asset[i].Name.toLowerCase();
                var assetID = asset[i].AssetID.toLowerCase();
                var SIMNumber = asset[i].SIMNumber.toLowerCase();
                var CustomerName = asset[i].CustomerName.toLowerCase();
                if (name.indexOf(searchVal) >= 0 || assetID.indexOf(searchVal) >= 0 || SIMNumber.indexOf(searchVal) >= 0 || CustomerName.indexOf(searchVal) >= 0) {
                    results.push(asset[i]);
                }
            }
            return results;
        } else {
            return asset;
        }
    };
});

app.filter('byNameAssetIDCusName', function () {
    return function (asset, search) {
        if (angular.isDefined(search)) {
            var results = [];
            var i;
            var searchVal = search.toLowerCase();
            for (i = 0; i < asset.length; i++) {
                var name = asset[i].Name.toLowerCase();
                var assetID = asset[i].AssetID.toLowerCase();
                var CustomerName =  asset[i].CustomerName == null ? '' : asset[i].CustomerName.toLowerCase();
                if (name.indexOf(searchVal) >= 0 || assetID.indexOf(searchVal) >= 0 || CustomerName.indexOf(searchVal) >= 0) {
                    results.push(asset[i]);
                }
            }
            return results;
        } else {
            return asset;
        }
    };
});



app.filter('MultipleFilter', function () {
    return function (asset, search) {
        if (angular.isDefined(search)) {
            var results = [];
            var i;
            var searchVal = search.toLowerCase();
            for (i = 0; i < asset.length; i++) {
                var name = asset[i].Name.toLowerCase();
                var status;
                var gpstime;
                if (asset[i].Status != undefined) {
                    status = asset[i].Status.toLowerCase();
                    gpstime = asset[i].GPSTime.toLowerCase();
                }
                if (name.indexOf(searchVal) >= 0 || status.indexOf(searchVal) >= 0 || gpstime.indexOf(searchVal) >= 0) {
                    results.push(asset[i]);
                }
            }
            return results;
        } else {
            return asset;
        }
    };
});


app.filter('NearestAssetFilterArray', function () {
    return function (asset, search) {
        if (angular.isDefined(search)) {
            var results = [];
            var i;
            var searchVal = search.toLowerCase();
            for (i = 0; i < asset.length; i++) {
                var name = asset[i].Name.toLowerCase();
                var status = asset[i].Status.toLowerCase();
                if (name.indexOf(searchVal) >= 0 || status.indexOf(searchVal) >= 0) {
                    results.push(asset[i]);
                }
            }
            return results;
        } else {
            return asset;
        }
    };
});



app.filter('DriverFilter', function () {
    return function (driver, search) {
        if (angular.isDefined(search)) {
            var results = [];
            var i;
            var searchVal = search.toLowerCase();
            for (i = 0; i < driver.length; i++) {
                var name = driver[i].Name.toLowerCase();
                if (driver[i].tag == null) {
                    var tag = driver[i].Tag;
                    if (name.indexOf(searchVal) >= 0) {
                        results.push(driver[i]);
                    }
                } else {
                    var tag = driver[i].Tag.toLowerCase();
                    if (name.indexOf(searchVal) >= 0 && tag.indexOf(searchVal) >= 0) {
                        results.push(driver[i]);
                    }
                }

            }
            return results;
        } else {
            return driver;
        }
    };
});



app.filter('ZoneFilter', function () {
    return function (zone, search) {
        if (angular.isDefined(search)) {
            var results = [];
            var i;
            var searchVal = search.toLowerCase();
            for (i = 0; i < zone.length; i++) {
                var name = zone[i].Name.toLowerCase();
                var limit = zone[i].SpeedLimitInMPH.toString().toLowerCase();
                if (name.indexOf(searchVal) >= 0 || limit.indexOf(searchVal) >= 0) {
                    results.push(zone[i]);
                }
            }
            return results;
        } else {
            return zone;
        }
    }
});


app.filter('RouteFilter', function () {
    return function (route, search) {
        if (route != undefined)
        {
            if (angular.isDefined(search)) {
                var results = [];
                var searchVal = search.toLowerCase();
                for (var i = 0; i < route.length; i++) {
                    console.log(route[i]);
                    var name = route[i].Name.toLowerCase();
                    //var startloc = (route[i].StartLocation == "" ? "" :  route[i].StartLocation.toLowerCase());
                    //var endloc = (route[i].EndLocation == "" ? "" :  route[i].EndLocation.toLowerCase());
                    var distance = route[i].DistanceInMeters.toString().toLowerCase();

                    //if (name.indexOf(searchVal) >= 0 || startloc.indexOf(searchVal) >= 0 || endloc.indexOf(searchVal) >= 0 || distance.indexOf(searchVal) >= 0) {
                    if (name.indexOf(searchVal) >= 0 || distance.indexOf(searchVal) >= 0) {

                        results.push(route[i]);
                    }
                }
                return results;
            } else {
                return route;
            }
        }
      
    }
});


app.filter('NotifFilter', function () {
    return function (notif, vio) {
        if (angular.isDefined(vio)) {
            var i;
            if (vio == 'All')
            {
                return notif;
            }
            var result = $.grep(notif, function (e) {
                return e['' + vio + ''] === true;
            });
          
            return result;
        } else {
            return notif;
        }
    }
});


app.filter('getAssetFromCustomerList', function () {
    return function (input, id) {
        var i = 0, len = input.length;
        for (; i < len; i++) {
            var assetList = input[i].AssetList;
            for (var a = 0; a < assetList.length; a++) {
                if (assetList[a].AssetID == id) {
                    return assetList[a];
                }
            }
        }
        return null;
    }
});


// Register the 'myCurrentTime' directive factory method.
// We inject $interval and dateFilter service since the factory method is DI.
app.directive('myCurrentTime', ['$interval', 'dateFilter',
    function ($interval, dateFilter) {
        // return the directive link function. (compile function not needed)
        return function (scope, element, attrs) {
            scope.format = 'h:mm:ss a'; // date format
            // used to update the UI
            function updateTime() {
                element.text(dateFilter(new Date(), format));
            }
            // watch the expression, and update the UI on change.
            scope.$watch(attrs.myCurrentTime, function (value) {
                format = value;
                updateTime();
            });
            $interval(updateTime, 1000);
        }
    }]);


app.filter('toArray', function () {
    return function (obj, addKey) {
        if (!angular.isObject(obj)) return obj;
        if (addKey === false) {
            return Object.keys(obj).map(function (key) {
                return obj[key];
            });
        } else {
            return Object.keys(obj).map(function (key) {
                var value = obj[key];
                return angular.isObject(value) ?
                  Object.defineProperty(value, '$key', { enumerable: false, value: key }) :
          { $key: key, $value: value };
            });
        }
    };
});


app.directive("dateleft", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: 'yy-mm-dd',
                onSelect: function (dateText) {
                    updateModel(dateText);
                },
                beforeShow: function (input, inst) {
                    inst.dpDiv.css({ marginLeft: 0 + 'px' });
                }
            };
            elem.datetimepicker(options);
        }
    }
});


app.directive("dateright", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: 'yy-mm-dd',
                onSelect: function (dateText) {
                    updateModel(dateText);
                },
                beforeShow: function (input, inst) {
                    inst.dpDiv.css({ marginLeft: -(input.offsetWidth - 6) + 'px' });
                }
            };
            elem.datetimepicker(options);
        }
    }
});


app.directive("datenotime", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: 'yy-mm-dd',
                //showTime: false,
                //showButtonPanel: true,
                onSelect: function (dateText) {
                    updateModel(dateText);
                },
                beforeShow: function (input, inst) {
                    //inst.dpDiv.css({ marginLeft: 0 + 'px' });
                    inst.dpDiv.css({ marginTop: -(input.offsetWidth + 80) + 'px' });
                }
            };
            elem.datepicker(options);
        }
    }
});


app.directive("nofuturedatepicker", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: 'yy-mm-dd',
                showButtonPanel: true,
                showTime: false,
                maxDate: new Date(),
                onSelect: function (dateText) {
                    updateModel(dateText);
                },
                beforeShow: function (input, inst) {
                    inst.dpDiv.css({ marginLeft: -(input.offsetWidth - 6) + 'px' });
                }
            };
            elem.datepicker(options);
        }
    }
});


app.filter('newline', function () {
    return function (text) {
        return (!text) ? '' : text.replace(/ /g, '\n');

    }
});