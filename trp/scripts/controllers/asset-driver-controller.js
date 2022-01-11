app.controller('AssetDriverController', ['$scope', '$localStorage', 'CommonFactory', 'MapFactory', 'DriverFactory', '$location', '$filter', '$interval', '$uibModal', '$rootScope', function ($scope, $localStorage, CommonFactory, MapFactory, DriverFactory, $location, $filter, $interval, $uibModal, $rootScope) {
    $scope.DriverNewMode = false;
    $scope.TagNewMode = false;
    $scope.DriverInfoMode = false;
    $scope.DriverHistoryInfoMode = false;
    $scope.DriverList = [];
    $scope.customerList = [];
    $scope.assetList = [];
    $scope.DateTimeNow = new Date();
    $scope.activeDriverList = [];
    $scope.activeLoading = false;
    $scope.DriverAssignedPaneEdit = false;
    $scope.DriverAssignedInfoMode = false;
    $scope.isDriver = false;


    $localStorage.roles_TRP.forEach(function (data) {
        if (data.Name === 'Driver') {
            $scope.isDriver = data.On;
        }
    });

    $scope.period = {
        birthdate: getDateNoTimeToday(),
        licenseexpirydate: getDateNoTimeToday(),
        hiredate: getDateNoTimeToday()
    };
    $scope.GenderList = ['Male', 'Female'];
    $scope.Gender = 'Male';

    $scope.statusTypeList = [
     {
         value: 'Single',
         text: 'Single'
     },
     {
         value: 'Married',
         text: 'Married'
     },
    ];


    $scope.licenseTypeList = [
      //{
      //    value: 'Select',
      //    text: 'Select'
      //},
      {
          value: 'Non-Professional',
          text: 'Non-Professional'
      },
      {
          value: 'Professional',
          text: 'Professional'
      },
    ];

    $scope.staffTypeList = [
        //{
        //    value: 'Select',
        //    text: 'Select'
        //},
        {
            value: 'Driver',
            text: 'Driver'
        },
        {
            value: 'Asst. Driver',
            text: 'Asst. Driver'
        },
        {
            value: 'Helper',
            text: 'Helper'
        },
        {
            value: 'Sales',
            text: 'Mechanic'
        }
    ];


    $scope.tagTypeList = [
      {
          value: 'Select',
          text: 'Select'
      },
      {
          value: 'Active',
          text: 'Active'
      },
      {
          value: 'Passive',
          text: 'Passive'
      }
    ];
    $scope.TagType = $scope.tagTypeList[0];



    $rootScope.$on("clearAssetDriver", function () {
        $scope.SelectedAsset = null;
    });



    $rootScope.$on("getDriverData", function () {
        if ($localStorage.module == 'AssetDriver') {
            if (CommonFactory.getAsset() != null) {
                if (CommonFactory.getAsset().AssetID) {
                    $scope.getDriverData(CommonFactory.getAsset().AssetID);
                }
            } else {
                $scope.DriverAssignedInfoMode = false;
            }
        }
    });



    $scope.getDriverData = function (AssetID) {

        $scope.SelectedAsset = CommonFactory.getAsset();

        $scope.getAssignedDriverList(AssetID);
        $scope.getActiveDriverList(AssetID);
        $scope.getHistoryDriverList(AssetID);
    }


    $scope.openAssetList = function () {
        $('.left-side-panel-menu-item').removeClass('side-panel-menu-item-active active-icon');
        $('.left-side-content-container').hide("slide");
        $('#lspmi-asset').addClass('side-panel-menu-item-active active-icon');
        $('#asset').show("slide");
    }



    $scope.newDriver = function () {
        $scope.DriverNewMode = true;
        $scope.period.birthdate = $filter('date')($scope.period.birthdate, 'yyyy-MM-dd');
        $scope.period.hiredate = $filter('date')($scope.period.hiredate, 'yyyy-MM-dd');
        $scope.period.licenseexpirydate = $filter('date')($scope.period.licenseexpirydate, 'yyyy-MM-dd');
        $scope.customerList = CommonFactory.getCustomerList();
        $scope.SelectedCustomer = $scope.customerList[0];
    };



    $scope.cancelNewDriver = function () {
        $scope.DriverNewMode = false;
        $scope.Name = null;
        $scope.Nickname = null;
        $scope.LicenseNo = null;
        $scope.LicenseType = $scope.licenseTypeList[0];
        $scope.period.licenseexpirydate = getDateNoTimeToday();
        $scope.period.birthdate = getDateNoTimeToday;
        $scope.MobilePhoneNo = null;
        $scope.Address = null;
        $scope.StaffNo = null;
        $scope.StaffType = $scope.staffTypeList[0];
        $scope.Hiredate = getDateNoTimeToday();
        $scope.HomePhoneNo = null;
        $scope.OfficePhoneNo = null;
        $scope.Gender = "Male";
        $scope.Remarks = null;
        $scope.EmergencyContactName = null;
        $scope.EmergencyContactPhoneNo = null;
        $scope.Status = $scope.statusTypeList[0];
    };


    $scope.openDriverAssetAssignment = function (driver) {
        if ($scope.activeDriverList != null)
        {
            var driver = $scope.activeDriverList[0];
            if (driver == undefined) {
                if ($scope.activeDriverList.length > 0) {
                    driver = $.grep($scope.DriverList, function (e) { return e.DriverID == $scope.activeDriverList[0].DriverId })[0];
                } else {
                    driver = $scope.DriverList[0];
                }
            }
            $scope.DriverList['selected'] = driver;

        }

        $scope.DriverList['selected'] = $scope.DriverList[0];
     
        console.log($scope.DriverList);

        $scope.accessModal($scope.DriverList);
    }



    $scope.openDriverInfo = function (driver) {
        $scope.DriverInfoMode = true;
        $scope.infoDriver = driver;
    }



    $scope.cancelInfoDriver = function () {
        $scope.DriverInfoMode = false;
    }



    $scope.openDriverEdit = function () {
        $scope.customerList = CommonFactory.getCustomerList();
        $scope.DriverEditMode = true;
        $scope.DriverInfoMode = false;
        var driver = $scope.infoDriver;
        $scope.edit_DriverID = driver.DriverID;
        $scope.edit_Name = driver.Name;
        $scope.edit_Nickname = driver.Nickname;
        $scope.edit_LicenseNo = driver.LicenseNo;
        $scope.edit_LicenseType = driver.LicenseType == null ? $scope.licenseTypeList[0] : $.grep($scope.licenseTypeList, function (e) { return e.value == driver.LicenseType })[0];
        $scope.edit_LicenseExpiryDate = $filter('date')(driver.LicenseExpiryDate, "yyyy-MM-dd");
        $scope.edit_Birthdate = $filter('date')(driver.Birthdate, "yyyy-MM-dd");
        $scope.edit_MobilePhoneNo = driver.MobilePhoneNo;
        $scope.edit_Address = driver.Address;
        $scope.edit_StaffNo = driver.StaffNo;
        $scope.edit_StaffType = driver.StaffType == null ? null : $.grep($scope.staffTypeList, function (e) { return e.value == driver.StaffType })[0];;
        $scope.edit_Hiredate = $filter('date')(driver.Hiredate, "yyyy-MM-dd");
        $scope.edit_HomePhoneNo = driver.HomePhoneNo;
        $scope.edit_OfficePhoneNo = driver.OfficePhoneNo;
        $scope.edit_Gender = driver.Gender;
        $scope.edit_Remarks = driver.Remarks;
        $scope.edit_EmergencyContactName = driver.EmergencyContactName;
        $scope.edit_EmergencyContactPhoneNo = driver.EmergencyContactPhoneNo;
        $scope.edit_Status = driver.Status == null ? $scope.statusTypeList[0] : $.grep($scope.statusTypeList, function (e) { return e.value == driver.Status })[0];
        $scope.edit_SelectedCustomer = $.grep($scope.customerList, function (e) { return e.CustomerID == driver.CustomerID })[0];
        $scope.edit_Tag = driver.Tag;
        $scope.old_tag = driver.Tag;
        $scope.edit_TagType = driver.TagType;
    }


    //edit assigned driver
    $scope.openDriverAssignedEdit = function () {
        $scope.DriverAssignedPaneEdit = true;
        $scope.customerList = CommonFactory.getCustomerList();
        var driver = $scope.infoDriver;
        $scope.edit_DriverID = driver.DriverID;
        $scope.edit_Name = driver.Name;
        $scope.edit_Nickname = driver.Nickname;
        $scope.edit_LicenseNo = driver.LicenseNo;
        $scope.edit_LicenseType = driver.LicenseType == null ? $scope.licenseTypeList[0] : $.grep($scope.licenseTypeList, function (e) { return e.value == driver.LicenseType })[0];
        $scope.edit_LicenseExpiryDate = $filter('date')(driver.LicenseExpiryDate, "yyyy-MM-dd");
        $scope.edit_Birthdate = $filter('date')(driver.Birthdate, "yyyy-MM-dd");
        $scope.edit_MobilePhoneNo = driver.MobilePhoneNo;
        $scope.edit_Address = driver.Address;
        $scope.edit_StaffNo = driver.StaffNo;
        $scope.edit_StaffType = driver.StaffType == null ? null : $.grep($scope.staffTypeList, function (e) { return e.value == driver.StaffType })[0];;
        $scope.edit_Hiredate = $filter('date')(driver.Hiredate, "yyyy-MM-dd");
        $scope.edit_HomePhoneNo = driver.HomePhoneNo;
        $scope.edit_OfficePhoneNo = driver.OfficePhoneNo;
        $scope.edit_Gender = driver.Gender;
        $scope.edit_Remarks = driver.Remarks;
        $scope.edit_EmergencyContactName = driver.EmergencyContactName;
        $scope.edit_EmergencyContactPhoneNo = driver.EmergencyContactPhoneNo;
        $scope.edit_Status = driver.Status == null ? $scope.statusTypeList[0] : $.grep($scope.statusTypeList, function (e) { return e.value == driver.Status })[0];
        $scope.edit_SelectedCustomer = $.grep($scope.customerList, function (e) { return e.CustomerID == driver.CustomerID })[0];
        $scope.edit_Tag = driver.Tag;
        $scope.old_tag = driver.Tag;
        $scope.edit_TagType = driver.TagType;
    }


    //cancel edit driver
    $scope.cancelEditDriver = function () {
        $scope.DriverEditMode = false;
        $scope.DriverInfoMode = true;
    }


    //cancel edit of assigned driver
    $scope.cancelEditDriverAssigned = function () {
        $("#edit-driver-form").parsley().reset();
        $scope.DriverAssignedPaneEdit = false;
        $scope.DriverAssignedInfoMode = false;
    }


    //view information of active driver
    $scope.openActiveDriverInfo = function () {
        $scope.DriverActiveInfoMode = true;
    }


    $scope.cancelInfoActiveDriver = function () {
        $scope.DriverActiveInfoMode = false;
    }


    //view/open selected assigned driver information
    $scope.openAssignedDriverInfo = function (driver) {
        $scope.DriverAssignedInfoMode = true;
        var driverID = driver.DriverId;
        var driver = $.grep($scope.DriverList, function (e) { return e.DriverID == driverID });
        if (driver[0]) {
            $scope.infoDriver = driver[0];
        }
    }


    //view/open driver history information
    $scope.openHistoryDriverInfo = function (driver) {
        $scope.DriverHistoryInfoMode = true;

        DriverFactory.getDriverInfo(driver.DriverID, function (res) {
            $scope.infoDriver = res[0];
        }, function () {

        });

    };



    $scope.canceInfoHistoryDriver = function () {
        $scope.DriverHistoryInfoMode = false;
    }


    //hide information panel of selected assigned driver
    $scope.cancelInfoAssignedDriver = function () {
        $scope.DriverAssignedInfoMode = false;
    }


    //get driver list
    $scope.getDriverList = function () {
        DriverFactory.getDriverList(function (data) {
            $scope.DriverList = data;
        }, function (error) {

        });
    }
    $scope.getDriverList();


    //save driver
    $scope.saveDriver = function () {

        $("#new-driver-form").parsley().validate();
        if ($("#new-driver-form").parsley().isValid()) {
            $scope.driver_loading_add = true;
            var _confirm = confirm("Are you sure you want to add this driver?");
            if (_confirm) {
                var jsonObj = {
                    Name: $scope.Name,
                    LicenseNo: $scope.LicenseNo,
                    LicenseType: $scope.LicenseType.text == "Select" ? null : $scope.LicenseType.text,
                    LicenseExpiryDate: $scope.period.licenseexpirydate + " 00:00",
                    Birthdate: $scope.period.birthdate + " 00:00",
                    MobilePhoneNo: $scope.MobilePhoneNo,
                    Address: $scope.Address,
                    Nickname: $scope.Nickname,
                    StaffNo: $scope.StaffNo,
                    StaffType: $scope.StaffType == null ? null : $scope.StaffType.text,
                    Hiredate: $scope.period.hiredate + " 00:00",
                    HomePhoneNo: $scope.HomePhoneNo,
                    OfficePhoneNo: $scope.OfficePhoneNo,
                    Gender: $scope.Gender,
                    Remarks: $scope.Remarks,
                    EmergencyContactName: $scope.EmergencyContactName,
                    EmergencyContactPhoneNo: $scope.EmergencyContactPhoneNo,
                    Status: $scope.StatusType == null ? null : $scope.StatusType.text,
                    CustomerID: $scope.SelectedCustomer.CustomerID,
                    Tag: $scope.TagCode,
                    TagType: $scope.TagType.text == "Select" ? null : $scope.TagType.text,
                };
                DriverFactory.addDriver(jsonObj, function (data) {
                    $scope.DriverList.push(data);
                    $scope.getDriverList();
                    CommonFactory.createAlert("Successfully", "Driver Added");
                    $scope.cancelNewDriver();
                    $scope.driver_loading_add = false;
                }, function (error) {

                });
            } else {
                $scope.cancelNewDriver();
            }
        }

    }


    //update driver information
    $scope.updateDriver = function () {
        $("#edit-driver-form").parsley().validate();

        if ($("#edit-driver-form").parsley().isValid()) {
            var _confirm = confirm("Are you sure you want to update this driver?");
            if (_confirm) {
                var jsonObj = {
                    DriverID: $scope.edit_DriverID,
                    Name: $scope.edit_Name,
                    LicenseNo: $scope.edit_LicenseNo,
                    LicenseType: $scope.edit_LicenseType.text == "Select" ? null : $scope.edit_LicenseType.text,
                    LicenseExpiryDate: $scope.edit_LicenseExpiryDate + " 00:00",
                    Birthdate: $scope.edit_Birthdate + " 00:00",
                    MobilePhoneNo: $scope.edit_MobilePhoneNo,
                    Address: $scope.edit_Address,
                    Nickname: $scope.edit_Nickname,
                    StaffNo: $scope.edit_StaffNo,
                    StaffType: $scope.edit_StaffType == null ? null : $scope.edit_StaffType.text,
                    Hiredate: $scope.edit_Hiredate + " 00:00",
                    HomePhoneNo: $scope.edit_HomePhoneNo,
                    OfficePhoneNo: $scope.edit_OfficePhoneNo,
                    Gender: $scope.edit_Gender,
                    Remarks: $scope.edit_Remarks,
                    EmergencyContactName: $scope.edit_EmergencyContactName,
                    EmergencyContactPhoneNo: $scope.edit_EmergencyContactPhoneNo,
                    Status: $scope.edit_Status == null ? null : $scope.edit_Status.text,
                    Tag: $scope.edit_Tag,
                    OldTag: $scope.old_tag,
                    TagType: $scope.edit_TagType,
                    CustomerID: $scope.edit_SelectedCustomer.CustomerID
                };
                DriverFactory.updateDriver(jsonObj, function (data) {
                    $scope.getDriverList();
                    CommonFactory.createAlert("Successfully", "Driver updated.");
                    $scope.cancelEditDriver();
                    $scope.cancelEditDriverAssigned();
                    $scope.cancelInfoDriver();
                }, function (error) {
                    CommonFactory.createAlert("Error", "Failed to update driver.");
                });
            } else {
                $scope.cancelNewDriver();
            }
        }

    }


    //simulation of driver
    $scope.simulateDriver = function () {
        var _confirm = confirm("Are you sure you want to simulate this asset?");
        if (_confirm) {
            var jsonObj = {
                ObjectID: $scope.selectedAsset.AssetID,
                BoardTime: $scope.DateTimeNow,
                Longitude: $scope.selectedAsset.Longitude,
                Latitude: $scope.selectedAsset.Latitude,
                Speed: $scope.selectedAsset.Speed,
                Direction: $scope.selectedAsset.DirectionDegrees,
                GPSTime: $scope.selectedAsset.GPSTime,
                Fuel: $scope.simulateFuel,
                TagID: $scope.simulateTag == undefined ? null : $scope.simulateTag,
                Type: 1
            };

            DriverFactory.simulateDriverTag(jsonObj, function (data) {
                $scope.getActiveDriverList($scope.selectedAsset.AssetID);
                CommonFactory.createAlert("Success", "Simulate");
            }, function (error) {
                CommonFactory.createAlert("Error", "Failed to simulate, please try again.");
            });
        }
    }


    //set active driver
    $scope.setActiveDriver = function (driver) {

        var _confirm;

        if (!driver.ActivePair) {

            _confirm = confirm("Are you sure you want to set this driver active?");
        } else {

            _confirm = confirm("Are you sure you want to remove this driver active?");
        }

        if (_confirm) {

            var jsonObj = {
                ObjectID: $scope.selectedAsset.AssetID,
                DriverID: driver.DriverId
            };

            var jsonObj = {
                ObjectID: $scope.selectedAsset.AssetID,
                BoardTime: $scope.DateTimeNow,
                Longitude: $scope.selectedAsset.Longitude,
                Latitude: $scope.selectedAsset.Latitude,
                Speed: $scope.selectedAsset.Speed,
                Direction: $scope.selectedAsset.DirectionDegrees,
                GPSTime: $scope.selectedAsset.GPSTime,
                Fuel: $scope.selectedAsset.FuelRatio,
                //TagID: $scope.simulateTag == undefined ? null : $scope.simulateTag,
                TagID: driver.TagID,
                DriverID: driver.DriverId,
                Type: 1
            };

            if (!driver.ActivePair) {

                DriverFactory.setActiveDriver(jsonObj, function () {
                    $scope.getActiveDriverList($scope.selectedAsset.AssetID);
                    $scope.getAssignedDriverList($scope.selectedAsset.AssetID);
                    CommonFactory.createAlert("Success", "Set driver active successfully.");
                }, function (error) {
                    CommonFactory.createAlert("Error", "Failed to set active driver.");
                });

            } else {

                DriverFactory.removeActiveDriver(jsonObj, function () {
                    $scope.getActiveDriverList($scope.selectedAsset.AssetID);
                    $scope.getAssignedDriverList($scope.selectedAsset.AssetID);
                    CommonFactory.createAlert("Success", "Remove driver active successfully.");
                }, function (error) {
                    CommonFactory.createAlert("Error", "Failed to remove active driver.");
                });
            }

            var assetid = $scope.selectedAsset.AssetID;
            DriverFactory.getAssetGPSInformation(assetid,
                function (res) {
                    var asset = CommonFactory.getAsset();
                    asset.CurrentDriver = res.CurrentDriver;
                    var marker = CommonFactory.createMarker(
                         'asset' + asset.AssetID
                         , asset.Name
                         , asset
                         , 'asset'
                         , false
                         , false
                         , 'label-map', $scope);
                    MapFactory.addMarker(marker, 'asset');
                },
            function (error) {
                console.log(error.message);
            });
        }

        $rootScope.$emit("setAssetInformation", {});
    }


    //remove current active driver
    $scope.removeCurrentActiveDriver = function (driver) {

        var _confirm = confirm("Are you sure you want to remove this driver?");

        if (_confirm) {
            var jsonObj = {
                ObjectID: CommonFactory.getAsset().AssetID,
                DriverID: driver.DriverId
            };

            DriverFactory.removeCurrentActiveDriver(jsonObj, function () {
                $scope.getActiveDriverList(CommonFactory.getAsset().AssetID);
                $scope.getAssignedDriverList(CommonFactory.getAsset().AssetID);
                CommonFactory.createAlert("Success", "Remove driver active successfully.");
            }, function (error) {
                CommonFactory.createAlert("Error", "Failed to remove active driver.");
            });

            var assetid = $scope.selectedAsset.AssetID;
            DriverFactory.getAssetGPSInformation(assetid,
                function (res) {
                    var asset = CommonFactory.getAsset();
                    asset.CurrentDriver = res.CurrentDriver;
                    var marker = CommonFactory.createMarker(
                         'asset' + asset.AssetID
                         , asset.Name
                         , asset
                         , 'asset'
                         , false
                         , false
                         , 'label-map', $scope);
                    MapFactory.addMarker(marker, 'asset');
                },
            function (error) {
                console.log(error.message);
            });
        }
        $rootScope.$emit("setAssetInformation", {});
    }


    $scope.TotalAssignedDrivers = 0;
    //get assigned driver list of selected asset
    $scope.getAssignedDriverList = function (AssetID) {
        DriverFactory.getAssignedDriverList(AssetID, function (data) {

            $scope.assignedDriverList = data;
            $scope.getActiveDriverList($scope.selectedAsset.AssetID);

            $scope.TotalAssignedDrivers = data.length;

        }, function (error) {

        });
    }


    //get active driver list of selected asset
    $scope.getActiveDriverList = function (AssetID) {
        $scope.activeLoading = true;
        DriverFactory.getActiveDriverList(AssetID, function (data) {
            if (data != null)
            {
                if (data.length > 0) {
                    data[0].EventDateTime = CommonFactory.convertTimeZone(data[0].EventDateTime);
                }
            }
        
            $scope.activeDriverList = data;
            $scope.activeLoading = false;
        }, function (error) {

        });
    };


    $scope.getHistoryDriverList = function (AssetID) {
        DriverFactory.getHistoryDriverList(AssetID, function (data) {
            $scope.historyDriverList = data;
        }, function (error) {

        });
    }


    $scope.removeDriverAssign = function (data) {
        var _confirm = confirm("Are you sure you want to remove this driver?");
        if (_confirm) {
            DriverFactory.removeDriverAssign(data, function (res) {
                $scope.getAssignedDriverList($scope.SelectedAsset.AssetID);
                CommonFactory.createAlert('Success', 'Driver Assignment remove successfully');
            }, function (error) {

            });
        }

    }


    //pan driver on map
    $scope.panDriver = function (driver) {
        MapFactory.panMap(driver.Latitude, driver.Longitude);
        MapFactory.createPointMarker(driver.Latitude, driver.Longitude);
    };



    $scope.accessModal = function (_data) {
        console.log(_data);
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'driverAssetAssignmentModal',
            controller: 'DriverAssetModalController',
            size: 6,
            resolve: {
                data: function () {
                    return _data;
                }
            }
        });
    }



    //$scope.setActiveTab = function (_data) {

    //    $scope.activeTab = _data;
    //}



    //export history
    $scope.exportArray = [];
    $scope.exportFile = function (fileType) {
        $scope.exportArray = [];

        if ($scope.historyDriverList.length > 0) {
            $scope.historyDriverList.forEach(function (csv) {
                $scope.CsvFileName = $localStorage.username + '-' + CommonFactory.getAsset().Name + '-' + getDateTimeToday() + '(History List).' + fileType;
                $scope.exportArray.push({
                    'Driver': csv.DriverName,
                    'Board Time ': $filter('date')(csv.BoardTime, "yyyy-MM-dd HH:mm:ss"),
                    'Location ': csv.Location,
                    'Latitude': csv.Latitude,
                    'Longitude': csv.Longitude
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
            $('#export-file-asset-driver').show("slide");
        } else {
            $scope.exportFileType = false;
            $('#export-file-asset-driver').hide("slide");
        }

    }

}]);