app.controller('ZoneModalController', function ($scope, $uibModalInstance, ZoneID, $localStorage, CommonFactory, ZonesFactory, $rootScope) {

    $scope.isZoneList = true;
    $scope.UserZoneList = [];
    $scope.searchZoneKeyword = "";

    $scope.isLoading = false;
    $scope.isZoneListLoading = false;


    $scope.TotalAssignedAssets = 0;
    $scope.TotalAssets = CommonFactory.getTotalAsset();

    $scope.TotalAssignedZones = 0;

    $scope.$watch(function () {
        return CommonFactory.getAsset();
    }, function (data) {
        if (JSON.stringify(data) !== '[]') {
            $scope.SelectedAssetID = data.AssetID;
        }
    }, true);


    $scope.toggleList = function () {
        if ($scope.isZoneList) {
            $scope.isZoneList = false;
        } else {
            $scope.isZoneList = true;
        }
    }


    $scope.getSelected = function (data, selectAll) {
        data.forEach(function (v) {
            v.IsAssigned = selectAll;
        });
    }


    $scope.toggleSelectAll = function (IsAssigned, cus) {
        if (!IsAssigned) {
            cus.CustomerID = false;
        }
    }


    $scope.getSelectedZone = function (data, selectAllZone) {
        data.forEach(function (v) {
            v.IsAssigned = selectAllZone;
        });
    };


    $scope.toggleSelectAllZone = function (IsAssigned) {
        if (!IsAssigned) {
            $scope.allSelected.Zone = false;
        }
    }


    //get asset assigned list when user click specific zone
    $scope.GetZoneAssignedList = function (ZoneID) {

        $scope.TotalAssignedAssets = 0;
        $scope.SelectedZoneID = ZoneID;
        $scope.ZoneAssignedAssetList = {};
        $scope.isLoading = true;

        ZonesFactory.getZoneAssignedAssetList(
        ZoneID,
            function (res) {

                $scope.ZoneAssignedAssetList = res;
                $scope.isLoading = false;
                $scope.isZoneListLoading = false;

                if (res.length > 0) {

                    res.forEach(function (z) {
                        $scope.TotalAssignedAssets += z.Total;   //count of total assigned assets of zones

                    });

                }

            },
            function (error) {
            }
        );
    };


    //update zone assignment to asset.
    $scope.UpdateZoneAssignment = function () {

        $scope.AssetList = [];
        $scope.ZoneAssignedAssetList.forEach(function (za) {
            za.AccountUserChildAssetList.forEach(function (a) {
                $scope.AssetList.push(a);
            });
        });

        ZonesFactory.UpdateZoneAssignedAssetList(
             $scope.SelectedZoneID,
            $scope.AssetList,
              function (res) {

                  $rootScope.$emit("getAssetZoneList", {});
                  CommonFactory.createAlert("Success", "Zone Assignment Updated");
                  $rootScope.$emit("getAssetZoneList", {});

              },
            function (error) {
                console.log(error.message);
            });
    };


    //get zone assigned list when user click specific asset
    $scope.getAssetAssignedZoneList = function (AssetID) {
        $scope.filterZone = "";
        $scope.AssetAssignedZoneList = [];
        $scope.isLoading = true;
        $scope.SelectedAssetID = AssetID;

        ZonesFactory.getAssetAssignedZoneList(AssetID, function (success) {

            $scope.isLoading = false;
            $scope.AssetAssignedZoneList = success;

            $scope.TotalAssignedZones = 0;

            $scope.TotalZones = success.length;

            //count total zones assigned on asset
            success.forEach(function (data) {

                if (data.IsAssigned) {

                    $scope.TotalAssignedZones += 1;

                }
            });


        }, function (error) {
        });
    };


    //update asset assignment to zones
    $scope.UpdateAssetAssignment = function (data) {

        $scope.ZoneList = [];

        data.forEach(function (za) {

            $scope.ZoneList.push(za);
            $scope.isLoading = false;

        });

        ZonesFactory.UpdateAssetAssignedZoneList(
             $scope.SelectedAssetID,
            $scope.ZoneList,
              function (res) {

                  $rootScope.$emit("getAssetZoneList", {});
                  CommonFactory.createAlert("Success", "Asset Assignment Updated");

              },
            function (error) {

                console.log(error.message);

            });
    };


    //watch if user switch to zone/asset assignment list.
    $scope.$watch(function () {
        return $scope.isZoneList;

    }, function (data) {
        if (data) {

            $scope.isLoading = true;
            $scope.isZoneListLoading = true;
            $scope.ZoneAssignedAssetList = [];
            $scope.SelectedZoneID = ZoneID;
           

            //get zone list 
            ZonesFactory.getZoneList(
              function (res) {
                  $scope.UserZoneList = res;
                  $scope.isLoading = false;
                  $scope.isZoneListLoading = false;

                 
              },
              function (error) {
                  console.log('error');
                  $scope.isLoading = false;
                  $scope.isZoneListLoading = false;
              });

            $scope.GetZoneAssignedList($scope.SelectedZoneID);

        } else {

            $scope.AssetAssignedZoneList = [];
            $scope.CustomerList = CommonFactory.getCustomerList();

            $scope.SelectedAssetID = null;

        }


    }, true);


    //trigger function when zone list ng-repeat rendered.
    $scope.$on('ngRepeatZoneListFinished', function (event) {
        //auto-scroll on selected zone.
        var active = document.getElementById("user"+$scope.SelectedZoneID);
        active.scrollIntoView(true);
    });



    $scope.viewAsset = function (id) {
        if ($("#zone-asset-modal-" + id).hasClass('active')) {
            $("#zone-asset-modal-" + id).removeClass('active fa-plus-circle');
            $("#zone-asset-modal-" + id).addClass('fa-minus-circle');
            $('#zone-asset-' + id).slideToggle({ direction: "up" }, 300);
        }
        else {
            $("#zone-asset-modal-" + id).removeClass('active fa-minus-circle');
            $("#zone-asset-modal-" + id).addClass('fa-plus-circle active');
            $('#zone-asset-' + id).slideToggle({ direction: "down" }, 300);
        }


    }

    $scope.viewCustomer = function (id) {
        if ($("#zone-cus-modal-" + id).hasClass('active')) {
            $("#zone-cus-modal-" + id).removeClass('active fa-plus-circle');
            $("#zone-cus-modal-" + id).addClass('fa-minus-circle');
            $('#zone-cus-' + id).slideToggle({ direction: "up" }, 300);
        }
        else {
            $("#zone-cus-modal-" + id).removeClass('active fa-minus-circle');
            $("#zone-cus-modal-" + id).addClass('fa-plus-circle active');
            $('#zone-cus-' + id).slideToggle({ direction: "down" }, 300);
        }

    }


    $scope.getAssetZoneList = function () {

        ZonesFactory.getAssetZoneList(
            $scope.SelectedAssetID,
            function (res) {
                CommonFactory.setAssetZoneList(res);
            },
            function (error) {
            });

    }


    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});