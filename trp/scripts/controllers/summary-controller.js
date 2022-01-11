app.controller('SummaryController', ['$scope', '$localStorage', 'AssetFactory', 'CommonFactory', 'AssetFilterFactory', 'MapFactory', '$filter', '$rootScope', function ($scope, $localStorage, AssetFactory, CommonFactory, AssetFilterFactory, MapFactory, $filter, $rootScope) {
    $scope.selectedFilter = {};
    $scope.viewData = {};
    $scope.isDelivery = false;

    $localStorage.roles_TRP.forEach(function (data) {
        if (data.Name === 'Delivery') {
            $scope.isDelivery = data.On;
        }
    });

    $scope.GPSDataList = [];
    $scope.filteredStatus = [];
    $scope.loadDataSummary = function (status) {
        $scope.selectedFilter = status;
        var cus = CommonFactory.getCustomerList();
        var cusList = [];
        if (cus.length > 0) {
            var as;
            cus.forEach(function (c) {
                c.AssetList.forEach(function (b) {
                    $scope.GPSDataList.push(b);

                });

                if (status !== "InActive") {
                    as = $.grep(c.AssetList, function (e) {
                        if (e.Status != undefined) {
                            return toLower(stripSpaces(e.Status.Description)).indexOf(toLower(status)) !== -1 && e.Status.InActive === false;
                        }
                    });


                    if (status === 'PowerCut') {
                        as = $.grep(c.AssetList, function (e) {
                            if (e.Status != undefined) {
                                return (e.Status.PowerCut === true && e.Status.InActive === false);
                            }
                        });
                    }

                    if (status === 'OverSpeeding') {
                        as = $.grep(c.AssetList, function (e) {
                            if (e.Status != undefined) {
                                return (e.Status.OverSpeeding === true && e.Status.InActive === false);
                            }
                        });
                    }

                    if (status === 'OverIdling') {
                        as = $.grep(c.AssetList, function (e) {
                            if (e.Status != undefined) {
                                return (e.Status.OverIdling === true && e.Status.InActive === false);
                            }
                        });
                    }

                    if (status === 'SOS') {
                        as = $.grep(c.AssetList, function (e) {
                            if (e.Status != undefined) {
                                return (e.Status.SOS === true && e.Status.InActive === false);
                            }
                        });
                    }

                    if (status === 'Alerts') {
                        as = $.grep(c.AssetList, function (e) {
                            if (e.Status != undefined) {
                                return (e.Status.PowerCut === true && e.Status.InActive === false) || (e.Status.GPSCut === true && e.Status.InActive === false)
                                  || (e.Status.EngineStop === true && e.Status.InActive === false) || (e.Status.SOS === true && e.Status.InActive === false);
                            }
                        });
                    }

                    else if (status === 'Violations') {
                        as = $.grep(c.AssetList, function (e) {
                            if (e.Status != undefined) {
                                return (e.Status.Overidle === true && e.Status.InActive === false) || (e.Status.Overspeed === true && e.Status.InActive === false);
                            }

                        });
                    }
                    else if (status === 'Sensor1') {
                        as = $.grep(c.AssetList, function (e) {
                            if (e.Status != undefined) {
                                return e.Status.Sensor1 === true;
                            }
                        });
                    }
                    else if (status === 'Sensor2') {
                        as = $.grep(c.AssetList, function (e) {
                            if (e.Status != undefined) {
                                return e.Status.Sensor2 === true;
                            }
                        });
                    }
                }
                else if (status === "InActive") {
                    as = $.grep(c.AssetList, function (e) {
                        if (e.Status != undefined) {
                            return e.Status.InActive === true;
                        }
                    });
                }

                if (status === "Mobile") {
                    as = $.grep(c.AssetList, function (e) {
                        if (e.Status != undefined) {
                            return e.Status.Mobile === true;
                        }
                    });
                }

                if (status === "Delivery") {
                    as = $.grep(c.AssetList, function (e) {
                        if (e.DeliveryCount != undefined) {
                            return e.DeliveryCount > 0;
                        }
                    });
                }
                if (status === "Total") {
                    as = c.AssetList;
                }

                cusList.push({
                    'CustomerID': c.CustomerID,
                    'CustomerName': c.CustomerName,
                    'AssetList': as
                });


            });

            $scope.customerList = cusList;

            //console.log($scope.customerList);

            var assetList = [];
            $scope.customerList.forEach(function (cus) {
                cus.AssetList.forEach(function (asset) {
                    assetList.push(asset);
                });
            });

            $scope.assetLists = assetList

            $scope.assetListCount = assetList.length;

            CommonFactory.setGPSDataList($scope.GPSDataList);
        }
    }


    $scope.loadDataSummaryZones = function (status) {
        $scope.GPSDataList = [];
        $scope.selectedFilter = status;
        var cus = CommonFactory.getCustomerList();
        var cusList = [];
        if (cus.length > 0) {
            var as;
            cus.forEach(function (c) {
                c.AssetList.forEach(function (b) {
                    $scope.GPSDataList.push(b);

                });

                if (status !== "InActive") {
                    as = $.grep(c.AssetList, function (e) {
                        if (e.Status != undefined) {
                            return toLower(stripSpaces(e.Status.Description)).indexOf(toLower(status)) !== -1 && e.Status.InActive === false;
                        }
                    });


                    if (status === "GoZone") {
                        as = $.grep(c.AssetList, function (e) {
                            if (e.Status != undefined) {
                                return e.Status.GoZone === true;
                            }
                        });
                    }

                    else if (status === "NoZone") {
                        as = $.grep(c.AssetList, function (e) {
                            if (e.Status != undefined) {
                                return e.Status.NoZone === true;
                            }
                        });
                    }

                    else if (status === 'Zone') {
                        as = $.grep(c.AssetList, function (e) {
                            if (e.Status != undefined) {
                                return e.Status.GoZone === true || e.Status.NoZone === true;
                            }
                        });
                    }

                }

                cusList.push({
                    'CustomerID': c.CustomerID,
                    'CustomerName': c.CustomerName,
                    'AssetList': as
                });


            });


            $scope.customerList = cusList;

            var assetList = [];
            $scope.customerList.forEach(function (cus) {
                cus.AssetList.forEach(function (asset) {
                    assetList.push(asset);
                });
            });

            $scope.assetListCount = assetList.length;

            CommonFactory.setGPSDataList($scope.GPSDataList);
        }
    }


    $rootScope.$on("loadDataSummary", function (event) {

        var status = CommonFactory.getStatus();

        if (status != "GoZone" && status != "NoZone" && status != "Zone") {
            $scope.loadDataSummary($scope.selectedFilter);
        }

    });


    $rootScope.$on("loadDataSummaryZones", function (event) {
        var status = CommonFactory.getStatus();
        if (status === "GoZone" || status === "NoZone" || status === "Zone") {
            $scope.loadDataSummaryZones($scope.selectedFilter);
        }

    });



    $scope.$watch(function () {
        return CommonFactory.getStatus();
    }, function (data) {
        if (data === "GoZone" || data === "NoZone" || data === "Zone") {
            $scope.loadDataSummaryZones(data);
        } else {
            $scope.loadDataSummary(data);
        }
    }, true);


    $scope.viewAsset = function (id) {
        if ($("#summary-font-icon-" + id).hasClass('active')) {

            $("#summary-font-icon-" + id).removeClass('active');
            $("#summary-font-icon-" + id).removeClass('fa-plus-circle');
            $("#summary-font-icon-" + id).addClass('fa-minus-circle');
            $('#' + id).slideToggle({ direction: "up" }, 300);
        }
        else {

            $("#summary-font-icon").removeClass('active');
            $("#summary-font-icon-" + id).removeClass('fa-minus-circle');
            $("#summary-font-icon-" + id).addClass('fa-plus-circle');
            $("#summary-font-icon-" + id).addClass('active');
            $('#' + id).slideToggle({ direction: "down" }, 300);
        }
    }


    $scope.highlight = function (data) {
        $scope.isClicked = data.AssetID;
    }


    $scope.showMap = function (data) {
        data['queryType'] = 'pan';

        if (data.showOnMap) {

            data.showOnMap = true;

        } else {

            MapFactory.mapZoom();
            MapFactory.panMarker('asset' + data.AssetID);
            data.showOnMap = true;
            MapFactory.toggleMarkerVisibility(data.AssetID);

        }

        CommonFactory.setAsset(data);

        if ($('.summary-icon').hasClass('active')) {

            $('.summary-container').slideToggle({ direction: "down" }, 300);
            $('.summary-icon').removeClass('fa-caret-down active');
            $('.summary-icon').addClass('fa-caret-up');

        }

        $rootScope.$emit("setAssetInformation", {});
        $rootScope.$emit("getDeliveriesData", {});
        $rootScope.$emit("getDriverData", {});
        $rootScope.$emit("getAssetZoneList", {});
        $rootScope.$emit("assetTracer", {});

    }


    $scope.exportXLSX = false;
    $scope.exportCSV = false;


    $scope.exportArray = [];
    $scope.exportFile = function (fileType) {

        if (fileType === 'xls') {
            $scope.exportXLSX = true;
        } else if (fileType === 'csv') {
            $scope.exportCSV = true;
        }

        $scope.loc = [];
        $scope.json = [];

        $scope.CsvFileName = $localStorage.username + '-' + getDateTimeToday() + '(Summary)';//+ fileType;


        var cusList = $scope.customerList;
        var assetList = [];

        cusList.forEach(function (cus) {
            cus.AssetList.forEach(function (asset) {
                assetList.push(asset);
            });
        });

        $scope.summaryExport = assetList;

        if ($scope.filterTable != undefined) {
            $scope.summaryExport = $.grep(assetList, function (e) {

                return (e.Name.toString().toLowerCase().indexOf($scope.filterTable) > -1
                    || e.Speed.toString().toLowerCase().indexOf($scope.filterTable) > -1
                    //|| e.DirectionDegrees.toString().toLowerCase().indexOf($scope.filterTable) > -1
                    //|| e.DirectionCardinal.toString().toLowerCase().indexOf($scope.filterTable) > -1
                    || e.GPSTime.toString().toLowerCase().indexOf($scope.filterTable) > -1
                    || e.Status.Description.toString().toLowerCase().indexOf($scope.filterTable) > -1
                    || e.FuelRatio.toString().toLowerCase().indexOf($scope.filterTable) > -1
                    //|| e.customerName.toString().toLowerCase().indexOf($scope.filterTable) > -1
                    || e.CurrentDriver.toString().toLowerCase().indexOf($scope.filterTable) > -1
                    || e.DeliveryCount.toString().toLowerCase().indexOf($scope.filterTable + ' item(s)') > -1
                    );
            });

        }


        ////Order by Name
        $scope.summaryExport.sort(function (a, b) {
            if (a.Name < b.Name) return -1;
            if (a.Name > b.Name) return 1;
            return 0;
        })

        ////Google Reverse Geocode
        //var geocoder = new google.maps.Geocoder;

        var ctr = 0;
        function ProcessExportList() {
            var b = $scope.summaryExport.length;
            if (ctr < b) {
                var csv = $scope.summaryExport[ctr];

                setTimeout(function () {
                    //Local Reverse Geocode
                    AssetFilterFactory.reverseGeocode({ Latitude: csv.Latitude, Longitude: csv.Longitude }, function (result) {
                        csv.Location = result;
                        pushdata(csv);
                        ProcessExportList();
                    }, function (error, status) {
                        if (status === "timeout") {
                            ProcessExportList();
                        } else {
                            csv.Location = "location not found.";
                            pushdata(csv);
                            ProcessExportList();
                        }
                    });

                    ctr += 1;

                }, 10);
            }
            else {
                if (ctr == b) {
                    alasql('SELECT * INTO XLSX("' + $scope.CsvFileName + '",{headers:true}) FROM ?', [$scope.json]);

                    if (fileType === 'xlsx') {
                        $scope.exportXLSX = false;
                    } else if (fileType === 'csv') {
                        $scope.exportCSV = false;
                    }

                }
            }
        };


        function pushdata(csv) {

            var jsonObj = {
                'Name': csv.Name,
                'Speed-Course': csv.Speed + ' kph, ' + csv.DirectionDegrees + ' ' + csv.DirectionCardinal,
                'GPS Time': $filter('date')(csv.GPSTime, 'yyyy-MM-dd HH:mm:ss'),
                'Status': csv.Status.Description,
                'Fuel': csv.Fuel,
                'Temperature 1': csv.Temperature1,
                'Temperature 2': csv.Temperature2,
                'Sensor 1': csv.Status.Sensor1 == true ? 'On' : 'Off',
                'Sensor 2': csv.Status.Sensor2 == true ? 'On' : 'Off',
                'Customer': csv.CustomerName,
                //'SIM Number': csv.SIMNumber
                'SIM Number': csv.MobilePhoneNo,
            };

            if ($scope.isDelivery) {
                jsonObj['Delivery Count'] = csv.DeliveryCount;
                jsonObj['Coordinates'] = csv.Latitude + ', ' + csv.Longitude,
                jsonObj['Location'] = csv.Location;
            } else {
                jsonObj['Coordinates'] = csv.Latitude + ', ' + csv.Longitude,
                jsonObj['Location'] = csv.Location;

            }

            jsonObj['Zone'] = csv.ZoneInsideList;

            $scope.json.push(jsonObj);
        }

        //export by assetids
        if ($scope.summaryExport.length > 0) {
            var assetIDs = "";
            var count = 0;
            $scope.summaryExport.forEach(function (data) {
                count++;

                if (count === $scope.summaryExport.length) {
                    assetIDs += "'" + data.AssetID + "'";

                } else {
                    assetIDs += "'" + data.AssetID + "'" + ",";

                }
            });

            //jquery export
            $table = $('#summary-export-table');
            $table.tableExport({ type: fileType, escape: 'true', fileName: $scope.CsvFileName });
            if (fileType === 'xls') {

                $scope.exportXLSX = false;

            } else if (fileType === 'csv') {

                $scope.exportCSV = false;
            }

            //process export
            //var param = { AssetIDs: ""+assetIDs+"" };
            //AssetFilterFactory.summaryExportByAssetIDs(param, function (success) {

            //    success.forEach(function (data) {

            //        //get zoneinsidelist in asset list array
            //        var zoneInsideList = $.grep(assetList, function (e) { return e.AssetID == data.AssetID; });

            //        data.ZoneInsideList = zoneInsideList[0].ZoneInsideList;

            //        pushdata(data);

            //    });



            //    alasql('SELECT * INTO XLSX("' + $scope.CsvFileName + '",{headers:true}) FROM ? ORDER BY Customer', [$scope.json]);

            //    if (fileType === 'xlsx') {
            //        $scope.exportXLSX = false;
            //    } else if (fileType === 'csv') {
            //        $scope.exportCSV = false;
            //    }

            //}, function (error) {

            //    if (fileType === 'xlsx') {

            //        $scope.exportXLSX = false;

            //    } else if (fileType === 'csv') {

            //        $scope.exportCSV = false;
            //    }

            //});


        }




    };

    $scope.exportToKML = function (_list, _type) {

        var cusList = $scope.customerList;
        var assetList = [];

        cusList.forEach(function (cus) {
            cus.AssetList.forEach(function (asset) {

                var icon = CommonFactory.getMarkerIconSpecifications(asset.TypeName, asset.Status, asset.DirectionDegrees, asset.Speed);

                if (icon.url) {
                    asset.IconURL = icon.url;
                }

                assetList.push(asset);
            });
        });

        $scope.summaryExport = assetList;
        if ($scope.filterTable != undefined) {
            $scope.summaryExport = $.grep(assetList, function (e) {

                return (e.Name.toString().toLowerCase().indexOf($scope.filterTable) > -1
                    || e.Speed.toString().toLowerCase().indexOf($scope.filterTable) > -1
                    || e.GPSTime.toString().toLowerCase().indexOf($scope.filterTable) > -1
                    || e.Status.Description.toString().toLowerCase().indexOf($scope.filterTable) > -1
                    || e.FuelRatio.toString().toLowerCase().indexOf($scope.filterTable) > -1
                    || e.CurrentDriver.toString().toLowerCase().indexOf($scope.filterTable) > -1
                    || e.DeliveryCount.toString().toLowerCase().indexOf($scope.filterTable + ' item(s)') > -1
                    );
            });
        }


        var result = MapFactory.exportToKML($scope.summaryExport, 'marker');

        downloadFileString($localStorage.username + '-' + getDateTimeToday() + '(Asset-Summary)' + '.kml', result);

    }


}]);