app.controller('ZonesController', ['$scope', '$localStorage', 'ZonesFactory', 'CommonFactory', 'MapFactory', 'MapHistoryFactory', '$location', '$filter', '$uibModal', '$interval', '$rootScope', function ($scope, $localStorage, ZonesFactory, CommonFactory, MapFactory, MapHistoryFactory, $location, $filter, $uibModal, $interval, $rootScope) {
    $scope.isLoading = false;
    $scope.ZoneTypeList = {};
    $scope.UserZoneList = [];
    $scope.AssetZoneList = [];
    $scope.SelectedZone = {};
    $scope.SelectedAsset = null;
    $scope.NewZone = {};
    $scope.ZoneEditMode = false;
    $scope.EditZone = {};
    $scope.ZoneAssignedAssetList = {};
    $scope.startDrawingTextSelected = "Start Drawing";
    $scope.zoneInterval;
    $scope.geometryJSON = { type: "FeatureCollection", features: [] };
    $scope.searchZoneKeyword = "";
    $scope.searchAssetZoneKeyword = "";
    $scope.zoneColor = "Green";

    $scope.ZoneNewModeSelect = false;
    $scope.ZoneNewModeAll = false;

    $scope.isClicked = null;

    $scope.TotalZones = [];

    //get total of zones list
    $scope.getTotalZones = function () {
        ZonesFactory.getCountZoneList(
        function (res) {
            $scope.TotalZones = res;
        },
        function (error) {

        });
    }

    $scope.getTotalZones();


    //watch when user click new zone
    $scope.$watch(function () {
        return CommonFactory.getZoneNewMode();
    }, function (data) { //used for create zone in maps ..because google-maps.js doesn't read rootscope
        if (data === null) {
            $scope.ZoneNewMode = false;
            $scope.zoneSelected = $scope.zoneType[0];
        } else {
            $scope.ZoneNewMode = true;
            $scope.ZoneNewModeSelect = true;
            $scope.ZoneNewModeAll = false;
            $scope.ZoneEditModeAll = false;
            $scope.ZoneEditModeSelect = false;

            $scope.zoneSelected = $scope.zoneType[2];
            $scope.startDrawingTextSelected = "Clear";
            $scope.NewZone['Name'] = CommonFactory.getAsset().Name + " Zone";
            $scope.NewZone['SpeedLimitInMph'] = 0;
            $scope.NewZone['Enabled'] = true;
            $scope.NewZone['Allowed'] = true;


            $('#zoneSelectedTab').addClass("active");
            $('#zoneAllTab').removeClass("active");

            $('#zoneList').addClass("active");
            $('#zoneAll').removeClass("active");
        }

    }, true);


    $scope.zoneOptions = function (name, color, area) {
        return {
            name: name,
            color: color,
            radius: MapFactory.getCircleRadiusFromArea(area)
        }
    };


    $scope.zoneType = [
        {
            id: '0',
            text: 'Select'
        },
        {
            id: '1',
            text: 'Polygon'
        },
        {
            id: '2',
            text: 'Circle'
        },
    ];
    $scope.zoneSelected = $scope.zoneType[0];
    $scope.openAssetList = function () {
        $('.left-side-panel-menu-item').removeClass('side-panel-menu-item-active active-icon');
        $('.left-side-content-container').hide("slide");
        $('#lspmi-asset').addClass('side-panel-menu-item-active active-icon');
        $('#asset').show("slide");
    };


    //rootscope clear asset zone list in map
    $rootScope.$on("clearAssetZoneList", function (data) {
        $('#zoneSelectedTab').removeClass("active");
        $('#zoneAllTab').addClass("active");

        $('#zoneList').removeClass("active");
        $('#zoneAll').addClass("active");

        $scope.SelectedAsset = null;
        $scope.AssetZoneList = [];
    });


    //rootscope to get asset zone list
    $rootScope.$on("getAssetZoneList", function (data) {

        //$('#zoneAll').addClass("active");

        var data = CommonFactory.getAsset();
        $scope.SelectedAsset = data;

        if ($localStorage.module == 'AssetZones') {
            if (data != null) {
                if (data.AssetID) {
                    $('#zoneSelectedTab').addClass("active");
                    $('#zoneAllTab').removeClass("active");

                    $('#zoneList').addClass("active");
                    $('#zoneAll').removeClass("active");

                    $scope.isLoading = true;
                    $scope.SelectedAsset = data;
                    $scope.getAssetZoneList(data.AssetID);
                }
                if (data.length != 0) {
                    if (CommonFactory.getClearMap() === false) {
                        if (CommonFactory.getShowAllZones() == true) {
                            MapFactory.toggleVisibilityPolygon(true);
                        }
                    }
                } else {
                    $('#zoneSelectedTab').removeClass("active");
                    $('#zoneAllTab').addClass("active");

                    $('#zoneList').removeClass("active");
                    $('#zoneAll').addClass("active");
                }
            } else {
                $('#zoneSelectedTab').removeClass("active");
                $('#zoneAllTab').addClass("active");

                $('#zoneList').removeClass("active");
                $('#zoneAll').addClass("active");
            }
        } else {
            if (data == null) {
                $('#zoneSelectedTab').removeClass("active");
                $('#zoneAllTab').addClass("active");

                $('#zoneList').removeClass("active");
                $('#zoneAll').addClass("active");
            }
        }

    });


    //call function to create zones on history map
    $rootScope.$on("historyCreateZones", function (data) {
        if ($scope.AssetZoneList != undefined) {
            if ($scope.AssetZoneList.length > 0) {
                console.log($scope.AssetZoneList)
                $scope.AssetZoneList.forEach(function (az) {
                    MapHistoryFactory.addPolygonGeoJSON(az);
                    MapHistoryFactory.showGeoJSON(az.ZoneID, true);
                });
            }
        }
    });


    // rootscope get inside zone list
    $rootScope.$on("getInsideZoneList", function () {
        $scope.getInsideZonesList();
    });


    //get insideZoneList
    $scope.getInsideZonesList = function () {
        var AssetList = [];
        var customerList = CommonFactory.getCustomerList();
        customerList.forEach(function (customer) {
            customer.AssetList.forEach(function (gps) {
                AssetList.push(gps.AssetID);
            })
        });
        var params = {
            Objectlist: AssetList,
            meters: 1000
        }

        ZonesFactory.isInsideZone(params, function (res) {
            CommonFactory.setInsideZoneList(res);
            var assetList = [];
            var cus = CommonFactory.getCustomerList();
            cus.forEach(function (customer) {
                customer.AssetList.forEach(function (asset) {
                    //asset.Status.NoZone = false;
                    //asset.Status.GoZone = false;
                    asset.NoZone = false;
                    asset.GoZone = false;

                    assetList.push(asset);

                });
            });
            if (res != null) {
                res.forEach(function (data) {

                    var result = $.grep(assetList, function (e) { return e.AssetID == data.AssetID });
                    if (result[0]) {
                        result[0].InsideZone = true;
                        if (data.AllowedZone == true) {

                            //result[0].Status.GoZone = true;
                            result[0].GoZone = true;
                        } else if (data.AllowedZone == false) {

                            //result[0].Status.NoZone = true;
                            result[0].NoZone = true;
                        }

                        data.Name = data.GeofenceName;
                        data.Radius = 0;
                        data.ZoneID = data.GeofenceID;


                        var bool = MapFactory.isPolygonGeoJSONExist(data.ZoneID);
                        if (!bool) {
                            MapFactory.addPolygonGeoJSON(data);
                            //MapFactory.showGeoJSON(data.ZoneID, true);

                        } else {

                            //MapFactory.showGeoJSON(data.ZoneID, true);

                        }

                    }
                });
            }
            //$scope.getAssetOutsideZoneList();
            $rootScope.$emit("setInsideZoneList", {});
            $rootScope.$emit("loadDataFilterZones", {});
            $rootScope.$emit("loadDataSummaryZones", {});
            //$rootScope.$emit("violationList", {});
         

        }, function (error) {
            console.log(error);
        });

    }


    // rootscope to get asset out of zone list
    //$rootScope.$on("getAssetOutsideZoneList", function () {
    //    $scope.getAssetOutsideZoneList();
    //});

    //get asset list that outside of zone alert
    $scope.getAssetOutsideZoneList = function () {
        var AssetList = [];
        var customerList = CommonFactory.getCustomerList();
        customerList.forEach(function (customer) {
            customer.AssetList.forEach(function (gps) {
                AssetList.push(gps);
            })
        });

        ZonesFactory.getAssetOutOfZoneList(function (res) {
            if(res != null)
            {
                res.forEach(function (data) {
                  

                    var result = $.grep(AssetList, function (e) {
                        return e.AssetID == data.AssetID
                    });

                    if (result[0]) {
                        result[0]['OutOfZone'] = true;
                    }
                });
            }

    

        }, function (error){
        
        });
    }



    //get zone type list
    $scope.getZoneTypeList = function () {
        ZonesFactory.getZoneTypeList(
            function (res) {
                $scope.ZoneTypeList = res;
            },
            function (error) {
                console.log(error.message);
            });
    };



    //get zone assigned asset list
    $scope.getZoneAssignedAssetList = function (ZoneID) {
        ZonesFactory.getZoneAssignedAssetList(
            ZoneID,
            function (res) {
                $scope.ZoneAssignedAssetList = res;
            },
            function (error) {
                console.log(error.message);
            }
            );
    };


    //get user zone list
    $scope.getUserZoneList = function () {

        $scope.all_zone_loading = true;

        $scope.disableScroll = false;

        var jsonObj = {
            NextPage: $scope.UserZoneList.length,
            Keyword: $scope.searchZoneKeyword,
            Take: 3000
        }


        ZonesFactory.searchZone(
            jsonObj,
            function (res) {

                $scope.all_zone_loading = false;
                $scope.UserZoneList = res;

                if ($scope.UserZoneList.length == $scope.TotalZones.length) {
                    $scope.disableScroll = true;
                }

                res.forEach(function (g) {


                    $scope.geometryJSON.features.push(
                    {
                        "type": "Feature",
                        "id": g.ZoneID,
                        "properties": {
                            "name": g.Name,
                            "id": g.ZoneID,
                            "color": g.Color,
                            "type": g.ZoneTypeID,
                            "marker": false,
                            "visible": false,
                        },
                        "geometry": JSON.parse(g.Geometry)
                    });

                    var bool = MapFactory.isPolygonGeoJSONExist(g.ZoneID);

                    if (!bool) {
                        MapFactory.addPolygonGeoJSON(g);
                    }

                });


                //MapFactory.loadGeoJSONZone($scope.geometryJSON);
            },
            function (error) {
                $scope.Message = error.Message;
            });
    };


    // get user zone list function
    $scope.getUserZoneList();


    //get asset zone list
    $scope.getAssetZoneList = function (AssetID) {
        $scope.asset_zone_loading = true;
        $scope.disableAssetScroll = false;
        $scope.AssetZoneList = [];

        var jsonObj = {
            NextPage: $scope.AssetZoneList.length,
            Keyword: $scope.searchAssetZoneKeyword,
            Take: 1000
        }

        ZonesFactory.getAssetZoneList(
            AssetID, jsonObj,
            function (res) {

                $scope.asset_zone_loading = false;
                $scope.AssetZoneList = res;

                if (res != null) {

                    if (CommonFactory.getClearMap() == false) {

                        res.forEach(function (z) {

                            var bool = MapFactory.isPolygonGeoJSONExist(z.ZoneID);

                            if (!bool) {

                                MapFactory.addPolygonGeoJSON(z);
                                MapFactory.showGeoJSON(z.ZoneID, false);
                            } else {

                                MapFactory.showGeoJSON(z.ZoneID, true);
                            }
                        });

                    }
                } else {
                    $scope.AssetZoneList = [];
                }
            },
            function (error) {
            });


        //count zones assigned
        ZonesFactory.getCountAssetZoneList(AssetID,
            function (res) {
                $scope.TotalAssignedZones = res;
            },
            function (error) {

            });


    };



    //load zones when scroll
    $scope.loadingZonesMore = false;
    $scope.loadZonesMore = function () {
        if ($scope.UserZoneList.length > 0 && $scope.loadingZonesMore === false) {

            $scope.loadingZonesMore = true;
            var jsonObj = {
                NextPage: $scope.UserZoneList.length,
                Keyword: $scope.searchZoneKeyword,
                Take: 100
            }

            ZonesFactory.searchZone(jsonObj,
            function (res) {
                if (res != null) {
                    res.forEach(function (g) {
                        var checkIfExist = $.grep($scope.UserZoneList, function (e) { return e.ZoneID === g.ZoneID });


                        if (checkIfExist[0] == undefined) {

                            $scope.UserZoneList.push(g);

                            var bool = MapFactory.isPolygonGeoJSONExist(g.ZoneID);

                            if (!bool) {
                                MapFactory.addPolygonGeoJSON(g);
                            }

                            if (CommonFactory.getShowAllZones()) {

                                MapFactory.showGeoJSON(g.ZoneID, true);

                            }

                        } else {

                            //disable scroll when zone is exist
                            //$scope.disableScroll = true;
                            $scope.loadingZonesMore = false;

                        }

                    });
                }

                $scope.loadingZonesMore = false;
            },
            function (error) {
                $scope.loadingZonesMore = false;
                $scope.disableScroll = true;
            });

        }

    }


    //loading zones for asset assigned list when scroll
    $scope.loadingAssetZonesMore = false;
    $scope.loadAssetZonesMore = function () {
        if ($scope.AssetZoneList.length > 0 && $scope.loadingAssetZonesMore === false) {
            $scope.loadingAssetZonesMore = true;

            var jsonObj = {
                NextPage: $scope.AssetZoneList.length,
                Keyword: $scope.searchAssetZoneKeyword,
                Take: 100
            }

            ZonesFactory.getAssetZoneList(
                CommonFactory.getAsset().AssetID, jsonObj,
                function (res) {

                    if (res != null) {

                        if (CommonFactory.getClearMap() == false) {

                            res.forEach(function (z) {

                                var checkIfExist = $.grep($scope.AssetZoneList, function (e) { return e.ZoneID == z.ZoneID });

                                if (checkIfExist[0] == undefined) {

                                    $scope.AssetZoneList.push(z);


                                    var bool = MapFactory.isPolygonGeoJSONExist(z.ZoneID);

                                    if (!bool) {
                                        MapFactory.addPolygonGeoJSON(z)
                                        MapFactory.showGeoJSON(z.ZoneID, true);

                                    } else {
                                        MapFactory.showGeoJSON(z.ZoneID, true);
                                    }


                                } else {
                                    $scope.disableAssetScroll = true;
                                    $scope.loadingAssetZonesMore = false;
                                }
                            });
                        }
                    }
                    $scope.loadingAssetZonesMore = false;
                },
           function (error) {
               $scope.loadingAssetZonesMore = false;
               $scope.disableAssetScroll = true;
           });
        }

    }


    //search zones in all zones list.
    var timeoutUser = null;
    $scope.searchUsersZone = function () {
        clearTimeout(timeoutUser);
        timeoutUser = setTimeout(function () {

            $scope.UserZoneList = [];

            $scope.searchAllZoneLoading = true;
            var jsonObj = {
                NextPage: 0,
                Keyword: $scope.searchZoneKeyword,
                Take: 100
            }
            ZonesFactory.searchZone(jsonObj,
            function (res) {
                $scope.searchAllZoneLoading = false;
                $scope.disableScroll = false;
                $scope.UserZoneList = res;
                if (res != null) {
                    res.forEach(function (g) {
                        var bool = MapFactory.isPolygonGeoJSONExist(g.ZoneID);
                        if (!bool) {
                            MapFactory.addPolygonGeoJSON(g);
                            if (CommonFactory.getShowAllZones()) {
                                MapFactory.showGeoJSON(g.ZoneID, true);
                            }
                        }
                    });
                }
            }, function (error) {
                console.log(error);
            });
        }, 500);
    };


    //search zones in asset zones list.
    var timeoutAsset = null;
    $scope.searchAssetsZone = function () {
        clearTimeout(timeoutAsset);
        timeoutAsset = setTimeout(function () {
            $scope.searchAssetZoneLoading = true;
            var jsonObj = {
                NextPage: 0,
                Keyword: $scope.searchAssetZoneKeyword,
                Take: 100
            }
            ZonesFactory.searchAssetZone(CommonFactory.getAsset().AssetID, jsonObj,
                function (res) {
                    $scope.searchAssetZoneLoading = false;
                    $scope.disableAssetScroll = false;
                    $scope.AssetZoneList = res;
                    if (res != null) {
                        res.forEach(function (g) {
                            var bool = MapFactory.isPolygonGeoJSONExist(g.ZoneID);
                            if (!bool) {
                                MapFactory.addPolygonGeoJSON(g);
                                MapFactory.showGeoJSON(g.ZoneID, true);
                            }
                        });
                    }
                }, function (error) {
                    console.log(error);
                });
        }, 500);
    }


    $scope.startDrawing = function () {

        $scope.NewZone.Allowed = true;

        var color = ($scope.NewZone.Allowed == true) ? '#00cc66' : '#cc0000';
        $scope.NewZone.ZoneTypeID = $scope.zoneSelected.id;
        var MainMapFactory;
        if (CommonFactory.getHistoryRun() != false) {
            MainMapFactory = MapHistoryFactory;
        } else {
            MainMapFactory = MapFactory;
        }
        var zoneTypeID = $scope.NewZone.ZoneTypeID;
        if ($scope.startDrawingTextSelected == "Start Drawing") {
            CommonFactory.createAlert('Draw Zone', 'You may now draw a zone.');
            $scope.startDrawingTextSelected = "Clear";
            MainMapFactory.stopDrawing();
            switch (zoneTypeID) {
                case '1':
                    MainMapFactory.startDrawing('polygon', $scope.zoneOptions(color));
                    break;
                case '2':
                    MainMapFactory.startDrawing('circle', $scope.zoneOptions(color));
                    break;
                default:

            }
        } else {
            MainMapFactory.stopDrawing();
            $scope.startDrawingTextSelected = "Start Drawing";
        }

    };

    createPolygonObject = function (az) {
        var polygongclist = [];
        az.GeoCoordinatesList.forEach(function (gc) {
            var gc = gc.split(',');
            var point = MapFactory.createPoint(gc[0], gc[1]);
            polygongclist.push(point);
        });
        var zone = null;
        switch (az.ZoneTypeID) {
            case 1:
                zone = MapFactory.createPolygon('polygon', polygongclist, $scope.zoneOptions(az.Name, az.Color), az.ZoneID, az.AassignedAssetList);
                break;
            case 2:
                zone = MapFactory.createPolygon('circle', polygongclist, $scope.zoneOptions(az.Name, az.Color, az.AreaInMeters), az.ZoneID, az.AssignedAssetList);
                break;
            default:
        }
        return zone;
    }

    createPolygonObjectHistory = function (az) {
        var polygongclist = [];
        az.GeoCoordinateList.forEach(function (gc) {
            var point = MapHistoryFactory.createPoint(gc.Latitude, gc.Longitude);
            polygongclist.push(point);
        });
        var zone = null;
        switch (az.ZoneTypeID) {
            case 1:
                zone = MapHistoryFactory.createPolygon('polygon', polygongclist, $scope.zoneOptions(az.Name, az.Color), az.ZoneID, az.AassignedAssetList);
                break;
            case 2:
                zone = MapHistoryFactory.createPolygon('circle', polygongclist, $scope.zoneOptions(az.Name, az.Color, az.AreaInMeters), az.ZoneID, az.AssignedAssetList);
                break;
            default:
        }

        return zone;
    }


    // create/draw zone in map
    $scope.createZone = function (userZone) {
        if (userZone.length > 0) {
            userZone.forEach(function (uz) {
                var zone = createPolygonObject(uz);
                if (zone !== null) {
                    MapFactory.addPolygon(zone);
                }
            });
            //MapFactory.checkIfAllPolygonIsInsideMap();
        }
    };


    //remove zone in map.
    $scope.removeZone = function (ZoneID) {
        MapFactory.removePolygon(ZoneID);
    };


    //edit zone
    $scope.editZone = function (Zone) {
        $scope.isClicked = Zone.ZoneID;
        CommonFactory.createAlert('Edit Zone', 'You may now edit ' + Zone.Name + ".");
        $scope.EditZone['ZoneID'] = Zone.ZoneID;
        $scope.EditZone['ZoneTypeID'] = Zone.ZoneTypeID;
        $scope.EditZone['Name'] = Zone.Name.replace("{D}", "").replace("{O}", "");
        $scope.EditZone['SpeedLimitInMph'] = Zone.SpeedLimitInMph;
        $scope.EditZone['Color'] = Zone.Color;
        $scope.EditZone['AreaInMeters'] = Zone.AreaInMeters;

        $scope.zoneColor = (Zone.Allowed ? 'Green' : 'Red');

        $scope.EditZone['Allowed'] = Zone.Allowed;
        $scope.EditZone['OutOfZone'] = Zone.OutOfZone;
        $scope.EditZone['Enabled'] = Zone.Enabled;
        $scope.EditZone['GeoCoordinateList'] = Zone.GeoCoordinateList;
        $scope.EditZone['ZoneTypeName'] = Zone.ZoneTypeName;

        MapFactory.editGeoJSONZone(Zone.ZoneID);

        $scope.ZoneEditModeSelect = true;
    };

    $scope.editZoneAll = function (Zone) {
        $scope.isClicked = Zone.ZoneID;
        CommonFactory.createAlert('Edit Zone', 'You may now edit ' + Zone.Name + ".");
        $scope.EditZone['ZoneID'] = Zone.ZoneID;
        $scope.EditZone['ZoneTypeID'] = Zone.ZoneTypeID;
        $scope.EditZone['Name'] = Zone.Name.replace("{D}", "").replace("{O}", "");
        $scope.EditZone['SpeedLimitInMph'] = Zone.SpeedLimitInMph;
        $scope.EditZone['Color'] = Zone.Color;
        $scope.EditZone['AreaInMeters'] = Zone.AreaInMeters;

        $scope.zoneColor = (Zone.Allowed ? 'Green' : 'Red');

        $scope.EditZone['Allowed'] = Zone.Allowed;
        $scope.EditZone['OutOfZone'] = Zone.OutOfZone;
        $scope.EditZone['Enabled'] = Zone.Enabled;
        $scope.EditZone['GeoCoordinateList'] = Zone.GeoCoordinateList;
        $scope.EditZone['ZoneTypeName'] = Zone.ZoneTypeName;

        MapFactory.editGeoJSONZone(Zone.ZoneID);

        $scope.ZoneEditModeAll = true;

    };

    //zone color change radio button
    $scope.zoneColorChange = function (color) {
        MapFactory.editColorPolygonGeoJson($scope.EditZone['ZoneID'], color);
    }


    //new zone to draw map
    $scope.newZone = function () {

        $scope.NewZone['Name'] = "Zone 1";
        $scope.NewZone['SpeedLimitInMph'] = 0;
        $scope.NewZone['AreaInMeters'] = 0;
        $scope.NewZone['Allowed'] = ($scope.zoneColor == 'Green' ? true : false);//true;
        $scope.NewZone['OutOfZone'] = false;
        $scope.NewZone['Enabled'] = true;

        $scope.ZoneNewMode = true;

        $scope.ZoneNewModeAll = false;
        $scope.ZoneNewModeSelect = true;
    };

    $scope.newZoneAll = function () {
        $scope.NewZone['Name'] = "Zone 1";
        $scope.NewZone['SpeedLimitInMph'] = 0;
        $scope.NewZone['AreaInMeters'] = 0;
        $scope.NewZone['Allowed'] = ($scope.zoneColor == 'Green' ? true : false);//true;
        $scope.NewZone['OutOfZone'] = false;
        $scope.NewZone['Enabled'] = true;

        $scope.ZoneNewMode = true;

        $scope.ZoneNewModeAll = true;
        $scope.ZoneNewModeSelect = false;
    }


    //cancel edit zone 
    $scope.cancelEditZone = function (ZoneID) {
        MapFactory.cancelEditGeoJSONZone();
        MapFactory.panGeoJSONZone(ZoneID);
        MapFactory.showGeoJSON(ZoneID, true);
        $scope.ZoneEditModeSelect = false;
        $scope.ZoneEditModeAll = false;
        $scope.zone_loading = false;

        var color = $scope.EditZone.Allowed ? '#00cc66' : '#cc0000';


        MapFactory.editColorPolygonGeoJson($scope.EditZone['ZoneID'], color);

    };


    //cancel for creating new zone
    $scope.cancelNewZone = function () {
        $scope.zone_loading = false;
        $scope.zoneSelected = $scope.zoneType[0];
        if (CommonFactory.getHistoryRun() == false) {
            //MapFactory.stopDrawing();
            //MapFactory.removePolygon(0);
        } else {
            MapHistoryFactory.stopDrawing();
            MapHistoryFactory.removePolygon(0);
        }
        MapFactory.stopDrawing();
        CommonFactory.setZoneNewMode(null);
        $scope.startDrawingTextSelected = "Start Drawing";
        $scope.ZoneNewMode = false;
        $scope.ZoneNewModeSelect = false;
        $scope.ZoneNewModeAll = false;
    };


    //pan zone in map
    $scope.panZone = function (Zone) {
        $scope.isClicked = Zone.ZoneID;
        MapFactory.panGeoJSONZone(Zone.ZoneID);
        MapFactory.showGeoJSON(Zone.ZoneID, true);
    };


    //save new zone
    $scope.saveZone = function () {


        $("#error-container").text("");
        $("#zone-new-form-all").parsley().validate();
        $("#zone-new-form-selected").parsley().validate();

        if ($("#zone-new-form-all").parsley().isValid() && $("#zone-new-form-selected").parsley().isValid()) {

            if ($scope.startDrawingTextSelected === 'Clear') {
                var zoneList = $.grep($scope.UserZoneList, function (e) {
                    return e.Name.toLowerCase().replace(/\s\s+/g, ' ') === $scope.NewZone.Name.toLowerCase().replace(/\s\s+/g, ' ');
                });
                if (zoneList[0] === undefined) {
                var _confirm = confirm("Are you sure you want to save this zone?");
                if (_confirm) {
                    $scope.zone_loading = true;
                    $scope.zone_loading_text = "Saving...";

                    var MainMapFactory;
                    if (CommonFactory.getHistoryRun() != false) {
                        MainMapFactory = MapHistoryFactory;
                    } else {
                        MainMapFactory = MapFactory;
                    }
                    MapFactory.stopDrawing();
                    $scope.NewZone['Allowed'] = ($scope.zoneColor == 'Green' ? true : false);
                    $scope.NewZone['Color'] = $scope.NewZone.Allowed ? '#00cc66' : '#cc0000';
                    $scope.NewZone['AreaInMeters'] = MainMapFactory.getZoneArea();
                    $scope.NewZone['GeoCoordinateList'] = MainMapFactory.getGeoCoordinateList();
                    $scope.NewZone['TimeBasedStart'] = new Date();
                    $scope.NewZone['TimeBasedEnd'] = new Date();
                    $scope.NewZone['ZoneTypeId'] = $scope.zoneSelected.id;
                    $scope.NewZone['ZoneTypeName'] = $scope.zoneSelected.text;
                    $scope.NewZone['Enabled'] = $scope.NewZone.Enabled;
                    $scope.NewZone['Name'] = $scope.NewZone['Name'].replace(/\s\s+/g, ' ');

                    if (CommonFactory.getAsset() !== null) {
                        $scope.NewZone['AssignedAssetList'] = [CommonFactory.getAsset().AssetID];
                    }


                    ZonesFactory.addZone(
                        $scope.NewZone,
                        function (az) {
                            $scope.isClicked = az.ZoneID;
                            $scope.NewZone = {};
                            MapFactory.stopDrawing();

                            MainMapFactory.addPolygonGeoJSON(az);
                            MainMapFactory.panGeoJSONZone(az.ZoneID);
                            MapFactory.showGeoJSON(az.ZoneID, true);
                            if (CommonFactory.getAsset() !== null) {
                                if ($scope.AssetZoneList != null) {
                                    $scope.AssetZoneList.push(az);
                                    CommonFactory.setAssetZoneList($scope.AssetZoneList);
                                }
                            }

                            $scope.UserZoneList.push(az);

                            CommonFactory.setZoneNewMode(null);
                            $scope.ZoneNewMode = false;

                            if (CommonFactory.getAsset().length > 0) {
                                $scope.panZone(zone.ZoneID);
                            }
                            $scope.cancelNewZone();
                            CommonFactory.createAlert('Success', 'Zone added.');
                            $scope.zone_loading = false;

                            //count total zones
                            $scope.TotalZones += 1;
                        },
                        function (error) {
                            $scope.zone_loading = false;
                            CommonFactory.createAlert('Error', 'Unable to create zone, please try again');
                        });

                } else {
                    $scope.cancelNewZone();
                }

                } else {
                    CommonFactory.createAlert("Error", "'" + $scope.NewZone['Name'] + "' Zone is already exist under this account. Please input unique name.");
                    $scope.zone_loading = false;
                    //$scope.cancelNewZone();
                }
            } else {
                $scope.zone_loading = false;
                CommonFactory.createAlert("Error", "Draw polygon first on map.");
            }

        }
    };


    //delete new zone in list
    $scope.deleteZone = function (Zone) {
        var deletedZone = [];

        var confirmDelZone = confirm('Are you sure you want to delete this zone?');

        if (confirmDelZone) {
            $scope.zone_loading = true;
            $scope.zone_loading_text = "Deleting...";
            ZonesFactory.deleteZone(
            Zone.ZoneID,
            function (res) {
                $scope.zone_loading = false;
                MapFactory.removePolygon(Zone.ZoneID);
                if ($scope.AssetZoneList !== null) {
                    var index = $scope.AssetZoneList.indexOf(Zone);
                    $scope.AssetZoneList.splice(index, 1);
                }

                //DELETE IN USER ZONE LIST
                $scope.UserZoneList.splice($scope.UserZoneList.indexOf(Zone), 1);

                var zoneList = CommonFactory.getUserZoneList();
                zoneList.forEach(function (z) {
                    if (z.ZoneID != res) {
                        deletedZone.push(z);
                    }
                });
                MapFactory.removeGeoJSON(Zone.ZoneID);
                CommonFactory.setUserZoneList(deletedZone);
                CommonFactory.createAlert('Success', 'Zone removed.');
            },
            function (error) {
                CommonFactory.createAlert('Error', 'Unable to delete zone.');
                $scope.zone_loading = false;
            });
        } else {
            $scope.zone_loading = false;
        }

    };


    //update zone in list
    $scope.updateZone = function () {

        $("#error-container").text("");
        $("#zone-update-form").parsley().validate();
        $("#zone-update-form-all").parsley().validate();

        if ($("#zone-update-form").parsley().isValid() && $("#zone-update-form-all").parsley().isValid()) {
            $scope.zone_loading = true;
            $scope.zone_loading_text = "Updating...";
            var zoneList = $scope.UserZoneList.filter(function (l) {
                return l.ZoneID != $scope.isClicked;
            });
            //var checkzoneList = $.grep(zoneList, function (e) {
            //    return e.Name.toLowerCase().replace(/\s\s+/g, ' ') === $scope.EditZone.Name.toLowerCase().replace(/\s\s+/g, ' ');
            //});

            //if (checkzoneList.length == 0) {
            var confirmUpdateZone = confirm('Are you sure you want to update this zone?');

            if (confirmUpdateZone) {
                $scope.zone_loading = true;
                $scope.zone_loading_text = "Updating...";

                $scope.EditZone['Allowed'] = ($scope.zoneColor == 'Green' ? true : false);
                $scope.EditZone['Color'] = $scope.EditZone.Allowed ? '#00cc66' : '#cc0000';
                $scope.EditZone['AreaInMeters'] = MapFactory.getZoneArea();
                $scope.EditZone['GeoCoordinateList'] = MapFactory.getGeoCoordinateList();
                $scope.EditZone['TimeBasedStart'] = new Date();
                $scope.EditZone['TimeBasedEnd'] = new Date();
                $scope.EditZone['Enabled'] = $scope.EditZone.Enabled;
                $scope.EditZone['Name'] = $scope.EditZone['Name'].replace(/\s\s+/g, ' ');

                ZonesFactory.updateZone(
                $scope.EditZone.ZoneID,
                $scope.EditZone,
                function (res) {
                    if ($scope.AssetZoneList != null) {
                        var result = $.grep($scope.AssetZoneList, function (e) { return e.ZoneID == $scope.EditZone.ZoneID; });
                        if (result[0]) {
                            $scope.EditZone['Name'] = result[0].Name;
                            angular.copy($scope.EditZone, result[0]);
                        }
                    }

                    var result2 = $.grep($scope.UserZoneList, function (e) { return e.ZoneID == $scope.EditZone.ZoneID; });
                    if (result2[0]) {
                        $scope.EditZone['Name'] = result2[0].Name;
                        angular.copy($scope.EditZone, result2[0]);
                        CommonFactory.setUserZoneList($scope.UserZoneList);
                    }

                    MapFactory.updateGeoJSONColor($scope.EditZone);

                    MapFactory.updateGeoJSONZone();
                  
                    MapFactory.panGeoJSONZone($scope.EditZone.ZoneID);
                    MapFactory.showGeoJSON($scope.EditZone.ZoneID, true);

                    $scope.EditZone = {};
                    $scope.ZoneEditModeAll = false;
                    $scope.ZoneEditMode = false;
                    $scope.zone_loading = false;
                    $scope.ZoneEditModeSelect = false;
                    CommonFactory.createAlert("Success", "Zone updated.");

                    //$scope.cancelEditZone();
                },
                function (error) {
                    $scope.cancelEditZone();
                });
            } else {
                $scope.cancelEditZone();
            }
            //} else {
            //    CommonFactory.createAlert("Error", "Zone Name is already exist. Please input unique name.");
            //    $scope.zone_loading = false;
            //}


        }
    };



    // open modal for zone assignment
    $scope.openZoneAssignment = function (ZoneID) {
        $scope.zoneAssignmentList = [];
        if (ZoneID === null) {
            $scope.accessModal(0, {});
        }
        $scope.accessModal(ZoneID);
    };


    $scope.accessModal = function (ZoneID) {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'zonesAssignmentModal',
            controller: 'ZoneModalController',
            size: 6,
            resolve: {
                ZoneID: function () {
                    return ZoneID;
                },
            }
        });
    }




    $scope.stopInterval = function () {
        $interval.cancel($scope.zoneInterval);
    }



    $scope.startInterval = function () {
        $scope.stopInterval();
        //$scope.zoneInterval = $interval($scope.getInsideZonesList, 60000);
    }

    //start interval
    //$scope.startInterval();

    $scope.getZoneIconUrl = function (zone) {
        var _type;
        if (zone.Allowed) {
            _type = "go_zone";
        } else {
            _type = "no_zone";
        }

        return "../../contents/images/common/" + _type + ".svg";

    };


}]);

