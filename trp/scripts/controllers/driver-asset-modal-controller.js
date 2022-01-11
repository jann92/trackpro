app.controller('DriverAssetModalController', function ($scope, $uibModalInstance, data, $localStorage, CommonFactory, DriverFactory, $rootScope) {
    $scope.ok = function () {
        $uibModalInstance.close();
    };
    $scope.driverList = data == null ? [] : data;
    $scope.TotalDriver = data.length;
    $scope.selectedCustomer = data.selected.CustomerID;
    $scope.selectDriver = data;
    data.selected.DriverID = data.selected.DriverId == undefined ? data.selected.DriverID : data.selected.DriverId;
    console.log(data.selected.DriverID);
    $scope.selectedDriver = data.selected.DriverID;
    $scope.customerList = CommonFactory.getCustomerList();
    $scope.isDriver = true;
    $scope.isAsset = false;
    $scope.isLoadingAssets = true;
    $scope.isLoadingDrivers = false;
    $scope.selectedAssetID = null;


    //get driver assigned asset list
    $scope.getDriverAssignedAssetList = function (driver) {
        console.log(driver);
        $scope.isLoadingAssets = true;
        $scope.selectDriver = driver;
        $scope.selectedDriver = driver.DriverID;
        $scope.selectedCustomer = driver.CustomerID;

        var assetList = [];
        $scope.customerList = CommonFactory.getCustomerList();
   

        $scope.customerList.forEach(function (cus) {
            cus.isCheck = false;
            cus.AssetList.forEach(function (c) {
                c['IsAssigned'] = false;
                assetList.push(c);
            });
        });

        $scope.TotalAsset = assetList.length;

        DriverFactory.getDriverAssignedAssetList(driver.DriverID, function (success) {

            $scope.assignAssetCount = success.length;

            $scope.customerList.forEach(function (cus) {

                cus.AssetList.forEach(function (c) {

                    success.forEach(function (asuccess) {

                        if (c.AssetID == asuccess.AssetID) {

                            c['IsAssigned'] = asuccess.IsAssigned;
                        }
                    });

                });

            });

            $scope.isLoadingAssets = false;
            $scope.toggleSelectAll(assetList, $scope.customerList);

        }, function (error) {

        });
    };


    //call function
    $scope.getDriverAssignedAssetList(data.selected);


    //get asset assigned driver list
    $scope.getAssetAssignedDriverList = function (asset) {

        var selectedCustomerID = $scope.selectDriver.CustomerID;

        $scope.customerList = CommonFactory.getCustomerList();

        if (asset != undefined) {

            $scope.isLoadingDrivers = true;
            $scope.selectedAssetID = asset.AssetID;
            $scope.selectedAsset = asset;

            DriverFactory.getAssetAssignedDriverList(asset.AssetID, function (success) {

                $scope.assignDriversCount = success.length;

                $scope.driverList.forEach(function (d) {

                    d['IsAssigned'] = false;
                    d.isCheck = false;

                });

                $scope.driverList.forEach(function (d) {

                    success.forEach(function (asuccess) {

                        if (d.DriverID == asuccess.DriverID) {

                            d['IsAssigned'] = asuccess.IsAssigned;

                        }
                    });
                });

                $scope.isLoadingDrivers = false;
                $scope.toggleSelectAllDriver($scope.driverList, $scope.allDriverIsCheck);

            }, function (error) {

            });
        }
    }


    //get selected asset
    $scope.getSelected = function (data, selectAll) {
        data.forEach(function (v) {
            v.IsAssigned = selectAll;
        });
    }


    //get selected driver
    $scope.getSelectedDriver = function (data, selectAll) {
        data.forEach(function (d) {
            d.IsAssigned = selectAll;
        });
    }


    //toggle select all
    $scope.toggleSelectAll = function (assetList, cus) {
        var filterasset = assetList.filter(function (item, pos) {
            return item.IsAssigned == true;
        });
        if (assetList.length == filterasset.length) {
            cus.isCheck = true;
        } else {
            cus.isCheck = false;
        }
    }


    //toggle select all driver
    $scope.toggleSelectAllDriver = function (driverList, allDriverIsCheck) {
        var filterasset = driverList.filter(function (item, pos) {
            return item.IsAssigned == true;
        });
        if (driverList.length == filterasset.length) {
            allDriverIsCheck = true;
        } else {
            allDriverIsCheck = false;
        }
    }


    //toggle list
    $scope.toggleList = function () {
        $scope.customerList = CommonFactory.getCustomerList();
        if ($scope.isDriver) {
            $scope.isDriver = false;
            $scope.isAsset = true;
            $scope.getAssetAssignedDriverList();
        } else {
            $scope.isAsset = false;
            $scope.isDriver = true;
            var driver = $.grep($scope.driverList, function (e) { return e.DriverID == $scope.selectedDriver });
            $scope.getDriverAssignedAssetList(driver[0]);
        }
    }


    //update driver asset assignment
    $scope.UpdateDriverAssetAssignment = function (customerList) {

        var assetList = [];
        var _confirm = confirm("Are you sure you want to update assignment?");

        if (_confirm)
        {

            customerList.forEach(function (cus) {
                cus.AssetList.forEach(function (asset) {
                    assetList.push(asset);
                });

            });

            var assetParams = [];
            var filterasset = assetList.filter(function (item, pos) {
                return item.IsAssigned == true;
            });

            filterasset.forEach(function (f) {
                assetParams.push({ AssetName: f.Name, AssetID: f.AssetID, IsAssigned: true });
            });

            DriverFactory.updateDriverAssignedAssetList(
                $scope.selectedDriver,
                assetParams,
                function (res) {

                    $scope.getDriverAssignedAssetList($scope.selectDriver);
                    CommonFactory.createAlert("Success", "Driver Assignment Updated");
                    $rootScope.$emit("getDriverData", {});

                },
                function (error) {
                    CommonFactory.createAlert("Error", "Failed to Assign.");
                });
    
        }
    };


    //update asset driver assignment
    $scope.UpdateAssetDriverAssignment = function (driverList) {
        var driverParams = [];
        
        var _confirm = confirm("Are you sure you want to update assignment?");

        if (_confirm) {

            var filterDriver = driverList.filter(function (item, pos) {
                return item.IsAssigned == true;
            });

            filterDriver.forEach(function (dr) {
                driverParams.push({ DriverID: dr.DriverID, Name: dr.Name, IsAssigned: true });
            });

            DriverFactory.updateAssetAssignedDriverList(
                $scope.selectedAssetID,
                driverParams,
                function (res) {

                    $scope.getAssetAssignedDriverList($scope.selectedAsset);
                    CommonFactory.createAlert("Success", "Asset Assignment Updated");
                    $rootScope.$emit("getDriverData", {});

                },
                function (error) {
                    CommonFactory.createAlert("Error", "Failed to Assign.");
                });

        }
    }



    $scope.viewAsset = function (id) {
        if ($("#driver-asset-modal-" + id).hasClass('active')) {
            $("#driver-asset-modal-" + id).removeClass('active fa-plus-circle');
            $("#driver-asset-modal-" + id).addClass('fa-minus-circle');
            $('#driver-asset-' + id).slideToggle({ direction: "up" }, 300);
        }
        else {
            $("#driver-asset-modal-" + id).removeClass('active fa-minus-circle');
            $("#driver-asset-modal-" + id).addClass('fa-plus-circle active');
            $('#driver-asset-' + id).slideToggle({ direction: "down" }, 300);
        }

    }



    $scope.viewAssetDriver = function (id) {
        if ($("#asset-driver-modal-" + id).hasClass('active')) {
            $("#asset-driver-modal-" + id).removeClass('active fa-plus-circle');
            $("#asset-driver-modal-" + id).addClass('fa-minus-circle');
            $('#asset-driver-' + id).slideToggle({ direction: "up" }, 300);
        }
        else {
            $("#asset-driver-modal-" + id).removeClass('active fa-minus-circle');
            $("#asset-driver-modal-" + id).addClass('fa-plus-circle active');
            $('#asset-driver-' + id).slideToggle({ direction: "down" }, 300);
        }
    }



    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});