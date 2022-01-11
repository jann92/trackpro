app.controller('ReminderFilterController', ['$scope', '$localStorage', 'ZonesFactory', 'CommonFactory', 'MapFactory', 'AssetFactory', '$location', '$filter', '$rootScope', '$uibModal', '$interval', function ($scope, $localStorage, ZonesFactory, CommonFactory, MapFactory, AssetFactory, $location, $filter, $rootScope, $uibModal, $interval) {
    $scope.FilteredAssets = [];

    $scope.ReminderCount = 0;
    $scope.ViolationCount = 0;
    $scope.isMute = false;
    $scope.soundText = "Alert sound is on.";
    $scope.AllViolations = [];
    $scope.searchViolation = 'All';
    $scope.assetPopupList = [];
    $scope.notificationInterval = null;
    $scope.VioCheckList = [];
    $scope.isPopupShow = true;
    $scope.isPopupText = "Hide Pop-up";

    var audioReminder = new Audio("../../contents/sound/alert-alarm3.mp3");
    //audioReminder = document.getElementById("alertAudio");

    $scope.ViolationTypeList = [
        {
            status: 'All',
            id: 'All',
        },
        {
            status: 'OverSpeed',
            id: 'OverSpeed'
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
            status: 'No Zone',
            id: 'NoZone'
        },
        {
            status: 'Out Of Zone',
            id: 'OutOfZone'
        },
        {
            status: 'SOS',
            id: 'SOS'
        },
        {
            status: $localStorage.AccountSensor1Label, //'Sensor 1',
            id: 'Sensor1'
        },
        {
            status: $localStorage.AccountSensor2Label, //'Sensor 2',
            id: 'Sensor2'
        },
        {
            status: 'Power Cut',
            id: 'PowerCut'
        },
        {
            status: 'Harsh Braking',
            id: 'HarshBraking'
        },
        {
            status: 'Harsh Acceleration',
            id: 'HarshAcceleration'
        },
        {
            status: 'Temperature Up',
            id: 'TemperatureUp'
        },
        {
            status: 'Temperature Down',
            id: 'TemperatureDown'
        }
    ];


    $scope.selectedViolation = $scope.ViolationTypeList[0];

    $scope.getStatusViolation = function (status) {
        $scope.loadDataViolationChange(status);
    }

    $rootScope.$on("setReminderAlertStop", function () {
        audioReminder.pause();
        audioReminder.currentTime = 0;
    });

    var datenow = moment(new Date()).format('YYYY-MM-DD');

    $scope.loadDataViolation = function () {
        var status = $scope.selectedViolation;
        console.log('load vio');
        var cus = CommonFactory.getCustomerList();
        var ViolationList = [];

        //get overidle and overspeed
        AssetFactory.getAssetViolation(function (res) {
            if (res.length > 0) {
                var AssetList = [];
                var cus = CommonFactory.getCustomerList();
                cus.forEach(function (customer) {
                    customer.AssetList.forEach(function (gps) {
                        AssetList.push(gps);
                    });
                });


                res.forEach(function (vio) {
                    vio.ViolationType = "";

                    var oi = vio.OverIdle ? 'OverIdling' : "";
                    var op = vio.OverPark ? 'OverParking' : "";
                    var os = vio.OverSpeed ? 'OverSpeed' : "";
                    var sos = vio.SOS ? 'SOS ' : "";
                    var s1 = vio.Sensor1 ? '' + $localStorage.AccountSensor1Label + ' ' : "";
                    var s2 = vio.Sensor2 ? ' Sensor 2' : "";
                    var nz = "";
                    var oz = "";
                    var pc = vio.PowerCut ? ' Power Cut' : "";
                    var hb = vio.HarshBraking ? ' Harsh Braking' : "";
                    var ha = vio.HarshAcceleration ? ' Harsh Acceleration' : "";
                    var tu= vio.TemperatureUp ? ' Temperature Up' : "";
                    var td = vio.TemperatureDown ? ' Temperature Down' : "";

                    if (oi == "" && op == "" && os == "" && sos == "" && s1 == "" && s2 == "" && pc == "" && hb == "" && ha == "" && tu == "" && td == "") {
                        nz = vio.NoZone ? 'No Zone' : "";
                    }
                    else {
                        nz = vio.NoZone ? ', No Zone' : "";
                    }


                    if (oi == "" && op == "" && os == "" && nz == "" && sos == "" && s1 == "" && s2 == "" && pc == "" && hb == "" && ha == "" && tu == "" && td == "") {
                        oz = vio.OutOfZone ? 'Out Of Zone' : "";
                    }
                    else {
                        oz = vio.OutOfZone ? ', Out Of Zone' : "";
                    }

                    vio.ViolationType = oi + op + os + sos + s1 + s2 + nz + oz + pc + hb + ha + tu + td;
                    vio.ViolationStatus = oi + op + os + sos + s1 + s2 + nz + oz + pc + hb + ha + tu + td;

                    var res = $.grep(AssetList, function (data) {
                        return data.AssetID == vio.AssetID;
                    });

                    if (res[0]) {
                        res[0]['ViolationType'] = vio.ViolationType;
                        res[0]['ViolationStatus'] = vio.ViolationStatus;
                        res[0]['NoZone'] = vio.NoZone;
                        res[0]['OutOfZone'] = vio.OutOfZone;
                        res[0]['OverIdle'] = vio.OverIdle;
                        res[0]['OverPark'] = vio.OverPark;
                        res[0]['OverSpeed'] = vio.OverSpeed;
                        res[0]['SOS'] = vio.SOS;
                        res[0]['Sensor1'] = vio.Sensor1;
                        res[0]['Sensor2'] = vio.Sensor2;
                        res[0]['PowerCut'] = vio.PowerCut;
                        res[0]['HarshBraking'] = vio.HarshBraking;
                        res[0]['HarshAcceleration'] = vio.HarshAcceleration;
                        res[0]['TemperatureUp'] = vio.TemperatureUp;
                        res[0]['TemperatureDown'] = vio.TemperatureDown;
                        ViolationList.push(res[0]);
                    }

                    $scope.ViolationList = ViolationList;

                    //if ($localStorage.username == "jti") {

                        if (sos != "") {

                            var check = $scope.assetPopupList.filter(function (f) {
                                return f.AssetID == res[0].AssetID && f.alert == "SOS";
                            });

                            if (check.length == 0) {
                                $scope.assetPopupList.push({ AssetID: res[0].AssetID, alert: "SOS" });

                                $('<li id="li-vio-' + vio.AssetID + '-sos"><div class="panel panel-default alert-panel"> ' +
                                   '<div class="panel-heading alert-header"><i class="fa fa-exclamation-circle"></i>  "' + sos.trim() + '" Alert <button type="button" class="close" id="vio-' + vio.AssetID + '-sos"> <span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button></div>' +
                                  '<div class="panel-body alert-body">' +
                                   '<table class="table table-hover table-condensed" style="font-weight:600;color:#d31f1f;"><tr id="tr-' + vio.AssetID + '-sos"><td><u class="pointer">' + vio.Name + '</u></td></tr><tr><td id="vio-' + vio.AssetID + '-gpssos">' + CommonFactory.convertTimeZone(vio.GPSTime) + '</td></tr></table>' +
                                 '</div></div></li>').appendTo('#ul-alert-notif').hide().fadeIn(1000);

                                $("#li-vio-" + vio.AssetID + "-sos").effect("shake", { times: 2 });

                                $("#tr-" + vio.AssetID + "-sos").click(function () {
                                    $scope.panMarker(vio);
                                });

                            } else {

                                if ($("#vio-" + vio.AssetID + "-gpssos").text() != CommonFactory.convertTimeZone(vio.GPSTime)) {
                                    $("#li-vio-" + vio.AssetID + "-sos").effect("shake", { times: 2 });
                                }

                                $("#vio-" + vio.AssetID + "-gpssos").text(CommonFactory.convertTimeZone(vio.GPSTime));

                            }

                        }


                        if (s1 != "") {

                            var check = $scope.assetPopupList.filter(function (f) {
                                return f.AssetID == res[0].AssetID && f.alert == "Sensor1";
                            });

                            if (check.length == 0) {
                                $scope.assetPopupList.push({ AssetID: res[0].AssetID, alert: "Sensor1" });

                                vio.checkList = [
                                    {
                                        id: 1,
                                        name: "Call Security",
                                        check: false
                                    },
                                    {
                                        id: 2,
                                        name: "Call Police",
                                        check: false
                                    },
                                    {
                                        id: 3,
                                        name: "Call Supervisor",
                                        check: false
                                    },
                                    {
                                        id: 4,
                                        name: "Call Driver",
                                        check: false
                                    }
                                ];

                                $scope.VioCheckList.push({ assetid: vio.AssetID, type: "Sensor1", checklist: vio.checkList });

                                $('<li id="li-vio-' + vio.AssetID + '-sensor1"><div class="panel panel-default alert-panel"> ' +
                                    '<div class="panel-heading alert-header"><i class="fa fa-exclamation-circle"></i>  "' + s1.trim() + '" Alert <button type="button" class="close" id="vio-' + vio.AssetID + '-sensor1"> <span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button></div>' +
                                   '<div class="panel-body alert-body">' +
                                    '<table class="table table-hover table-condensed" style="font-weight:600;color:#d31f1f;"><tr id="tr-' + vio.AssetID + '-sensor1"><td><u class="pointer">' + vio.Name + '</u></td></tr><tr><td id="vio-' + vio.AssetID + '-gpss1">' + CommonFactory.convertTimeZone(vio.GPSTime) + '</td></tr></table>' +
                                  '</div></div></li>').appendTo('#ul-alert-notif').hide().fadeIn(1000);

                                $("#li-vio-" + vio.AssetID + "-sensor1").effect("shake", { times: 2 });

                                $("#tr-" + vio.AssetID + "-sensor1").click(function () {
                                    $scope.panMarker(vio);
                                });

                            } else {
                                if ($("#vio-" + vio.AssetID + "-gpss1").text() != CommonFactory.convertTimeZone(vio.GPSTime)) {


                                    $("#li-vio-" + vio.AssetID + "-sensor1").remove();


                                    $('<li id="li-vio-' + vio.AssetID + '-sensor1"><div class="panel panel-default alert-panel"> ' +
                                    '<div class="panel-heading alert-header"><i class="fa fa-exclamation-circle"></i>  "' + s1.trim() + '" Alert <button type="button" class="close" id="vio-' + vio.AssetID + '-sensor1"> <span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button></div>' +
                                   '<div class="panel-body alert-body">' +
                                    '<table class="table table-hover table-condensed" style="font-weight:600;color:#d31f1f;"><tr id="tr-' + vio.AssetID + '-sensor1"><td><u class="pointer">' + vio.Name + '</u></td></tr><tr><td id="vio-' + vio.AssetID + '-gpss1">' + CommonFactory.convertTimeZone(vio.GPSTime) + '</td></tr></table>' +
                                  '</div></div></li>').appendTo('#ul-alert-notif').hide().fadeIn(1000);


                                    $("#li-vio-" + vio.AssetID + "-sensor1").effect("shake", { times: 2 });

                                    $("#tr-" + vio.AssetID + "-sensor1").click(function () {
                                        $scope.panMarker(vio);
                                    });
                                }

                                $("#vio-" + vio.AssetID + "-gpss1").text(CommonFactory.convertTimeZone(vio.GPSTime));

                            }

                        }



                        if (tu != "") {

                            var check = $scope.assetPopupList.filter(function (f) {
                                return f.AssetID == res[0].AssetID && f.alert == "TemperatureUp";
                            });

                            if (check.length == 0) {
                                $scope.assetPopupList.push({ AssetID: res[0].AssetID, alert: "TemperatureUp" });

                                $('<li id="li-vio-' + vio.AssetID + '-tu"><div class="panel panel-default alert-panel"> ' +
                                   '<div class="panel-heading alert-header"><i class="fa fa-exclamation-circle"></i>  "' + tu.trim() + '" Alert <button type="button" class="close" id="vio-' + vio.AssetID + '-tu"> <span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button></div>' +
                                  '<div class="panel-body alert-body">' +
                                   '<table class="table table-hover table-condensed" style="font-weight:600;color:#d31f1f;"><tr id="tr-' + vio.AssetID + '-tu"><td><u class="pointer">' + vio.Name + '</u></td></tr><tr><td id="vio-' + vio.AssetID + '-gpstu">' + CommonFactory.convertTimeZone(vio.GPSTime) + '</td></tr></table>' +
                                 '</div></div></li>').appendTo('#ul-alert-notif').hide().fadeIn(1000);

                                $("#li-vio-" + vio.AssetID + "-tu").effect("shake", { times: 2 });

                                $("#tr-" + vio.AssetID + "-tu").click(function () {
                                    $scope.panMarker(vio);
                                });

                            } else {

                                if ($("#vio-" + vio.AssetID + "-gpstu").text() != CommonFactory.convertTimeZone(vio.GPSTime)) {
                                    $("#li-vio-" + vio.AssetID + "-tu").effect("shake", { times: 2 });
                                }

                                $("#vio-" + vio.AssetID + "-gpstu").text(CommonFactory.convertTimeZone(vio.GPSTime));

                            }

                        }
                    //}


                    $("#vio-" + vio.AssetID + "-sensor1").click(function (e) {
                        $scope.accessModal(vio);
                        e.stopImmediatePropagation();
                        e.preventDefault();

                    });

                    $("#vio-" + vio.AssetID + "-sos").click(function (e) {
                        $("#li-vio-" + vio.AssetID + '-sos').fadeOut("normal", function () {
                            $(this).remove();
                        });

                        $scope.assetPopupList = $scope.assetPopupList.filter(function (c) {
                            return (c.AssetID != vio.AssetID || c.alert != "SOS");
                        });

                        e.stopImmediatePropagation();
                        e.preventDefault();
                    });

                    $("#vio-" + vio.AssetID + "-tu").click(function (e) {
                        $("#li-vio-" + vio.AssetID + '-tu').fadeOut("normal", function () {
                            $(this).remove();
                        });

                        $scope.assetPopupList = $scope.assetPopupList.filter(function (c) {
                            return (c.AssetID != vio.AssetID || c.alert != "TemperatureUp");
                        });

                        e.stopImmediatePropagation();
                        e.preventDefault();
                    });

                });


                if (status.id === "OverSpeed") {
                    $scope.ViolationList = $.grep(ViolationList, function (data) {
                        return data.ViolationType.indexOf("OverSpeed") != -1;
                    });
                }

                if (status.id === "OverIdle") {
                    $scope.ViolationList = $.grep(ViolationList, function (data) {
                        return data.ViolationType.indexOf("OverIdling") != -1;
                    });
                }

                if (status.id === "OverPark") {
                    $scope.ViolationList = $.grep(ViolationList, function (data) {
                        return data.ViolationType.indexOf("OverParking") != -1;
                    });
                }


            }

            $scope.ViolationCount = res.length;//ViolationList.length;

            if ($scope.ViolationCount > 0) {
                window.focus();
                // audioReminder.play();
                const stopAttempt = setInterval(() => {
                    const playPromise = audioReminder.play();
                    if (playPromise) {
                        playPromise.then(() => {
                            clearInterval(stopAttempt)
                        }).catch(e=> {
                            console.log('' + e);
                        })
                    }
                }, 100)
            }

            var notifcount = $scope.ReminderCount + $scope.ViolationCount;

            $rootScope.$emit("setReminderAlert", notifcount);

            $scope.AllViolations = ViolationList;

            if (status.id === "All") {
                $scope.ViolationList = ViolationList;
            }

            if (status.id === "NoZone") {
                $scope.ViolationList = $.grep(ViolationList, function (data) {
                    return data.NoZone === true;
                });
            }

            if (status.id === "OutOfZone") {
                $scope.ViolationList = $.grep(ViolationList, function (data) {
                    return data.OutOfZone == true;
                });
            }

            console.log($scope.ViolationList);

        }, function (error) {

        });



    }

    $rootScope.$on("removeAssetPopup", function (event, data) {
        //remove asset popup in array
        $scope.assetPopupList = $scope.assetPopupList.filter(function (c) {
            return (c.AssetID != data.AssetID || c.alert != data.alert);
        });

        //remove asset violation checklist in array
        $scope.VioCheckList = $scope.VioCheckList.filter(function (d) {
            return (d.assetid != data.AssetID || d.alert != data.alert);
        });

    });

    $scope.loadDataViolationChange = function (status) {

        $scope.searchViolation = status.id;

        if (status.id === "All") {
            $scope.ViolationList = $scope.AllViolations;
        }

    }


    // $rootScope.$on("violationList", function () {

    $scope.loadDataViolation($scope.ViolationTypeList[0]);
    // });

    $scope.stopInterval = function () {
        $interval.cancel($scope.notificationInterval);
    }

    $scope.startInterval = function () {
        $scope.stopInterval();
        $scope.assetInterval = $interval($scope.loadDataViolation, 30000);
    }

    $scope.startInterval();

    $scope.setAlertMute = function () {
        if (!$scope.isMute) {
            audioReminder.muted = true;
            $scope.isMute = true;
            $scope.soundText = "Alert sound is off.";
        }
        else {
            audioReminder.muted = false;
            $scope.isMute = false;
            $scope.soundText = "Alert sound is on.";
        }

    };

    $rootScope.$on("setAlertMute", function () {
        $scope.setAlertMute();
    });


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

        if ($scope.isClicked != data.AssetID) {
            $scope.isClicked = data.AssetID;
            data['queryType'] = 'pan';
            data['showOnMap'] = true;
            MapFactory.panMarker('asset' + data.AssetID);
            MapFactory.showMarker('asset' + data.AssetID, true);

            CommonFactory.getCustomerList().forEach(function (cus) {
                cus.AssetList.forEach(function (asset) {
                    if (asset.AssetID == data.AssetID) {
                        CommonFactory.setAsset(asset);
                    }
                });
            });


            $rootScope.$emit("setAssetInformation", {});
            $rootScope.$emit("getDeliveriesData", {});
            $rootScope.$emit("getDriverData", {});
            $rootScope.$emit("getAssetZoneList", {});
            $rootScope.$emit("assetTracer", {});

            var isFocus = CommonFactory.getFocusAsset();
            if (isFocus == false) {
                CommonFactory.setFocusAsset(false);
            }
            CommonFactory.setClearMap(false);
        }


    };

    $scope.popupShowClick = function () {
        if ($scope.isPopupShow) {
            $scope.isPopupShow = false;
            $scope.isPopupText = "Show Pop-up";
            $("#ul-alert-notif").hide();
        } else {
            $scope.isPopupShow = true;
            $scope.isPopupShow = "Hide Pop-up";
            $("#ul-alert-notif").show();
        }
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
        CommonFactory.getCustomerList().forEach(function (cus) {
            cus.AssetList.forEach(function (asset) {
                if (asset.AssetID == data.AssetID) {
                    CommonFactory.setAsset(asset);
                }
            });
        });

        $(".right-side-panel-menu-item").removeClass('side-panel-menu-item-active active-icon');
        $('.right-side-content-container').hide("slide");
        $("#rspmi-zones").addClass('side-panel-menu-item-active active-icon');
        var target = $('#rspmi-zones').attr('data-slidetoggle');
        $('#' + target).show("slide");
        $localStorage.module = 'AssetZones';

    };

    $rootScope.$on("clearMap", function (data) {
        $scope.isClicked = null;
    });

    $scope.exportArray = [];
    $scope.exportFile = function (fileType) {
        $scope.exportArray = [];
        $scope.FilteredAssets.forEach(function (csv) {
            $scope.CsvFileName = $localStorage.username + '-' + getDateTimeToday() + '(' + $scope.selectedReminder.status + ').' + fileType;
            $scope.exportArray.push({
                'Name': csv.Name,
                'Reminder': csv.Reminder
            });
        });
        alasql('SELECT * INTO XLSX("' + $scope.CsvFileName + '",{headers:true}) FROM ?', [$scope.exportArray]);
    };
    $scope.exportFileType = false;
    $scope.exportPanel = function () {
        if ($scope.exportFileType == false) {
            $scope.exportFileType = true;
            $('#export-file-reminder-asset').show("slide");
        } else {
            $scope.exportFileType = false;
            $('#export-file-reminder-asset').hide("slide");
        }

    }


    $scope.accessModal = function (vio) {

        var checklist = $.grep($scope.VioCheckList, function (data) {
            return data.assetid == vio.AssetID && data.type == "Sensor1"
        });

        if (checklist.length > 0) {
            vio.checkList = checklist[0].checklist;
        }

        console.log(vio.checkList);

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'alertCheckModal',
            controller: 'AlertCheckListModalController',
            size: "sm",
            resolve: {
                vio: function () {
                    return vio;
                }
            }
        });
    }

}]);