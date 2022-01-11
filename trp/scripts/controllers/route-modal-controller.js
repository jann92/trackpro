app.controller('RouteModalController', function ($scope, $uibModalInstance, RouteID, $localStorage, CommonFactory, RoutesFactory, MapFactory) {
    $scope.isLoading = false;
    $scope.isRouteList = true;
    $scope.toggleList = function () {
        if ($scope.isRouteList) {
            $scope.isRouteList = false;
        } else {
            $scope.isRouteList = true;
        }
    }

    $scope.$watch(function () {
        return CommonFactory.getAsset();
    }, function (data) {
        if (JSON.stringify(data) !== '[]') {
            $scope.SelectedAssetID = data.AssetID;
        }
    });

    $scope.$watch(function () {
        return $scope.isRouteList;
    }, function (data) {
        if (data) {
            $scope.RouteAssignedAssetList = [];
            $scope.SelectedRouteID = RouteID;
            RoutesFactory.getUserRouteList(
              function (res) {
                  $scope.UserRouteList = res;
              },
              function (error) {
              });

            RoutesFactory.getRouteAssignedAssetList(RouteID,
            function (res) {
                $scope.RouteAssignedAssetList = res;
            },
            function (error) {
                //error.message;
            });

            $scope.GetRouteAssignedList = function (RouteID) {
                $scope.isLoading = true;
                $scope.SelectedRouteID = RouteID;
                $scope.RouteAssignedAssetList = {};
                RoutesFactory.getRouteAssignedAssetList(
                RouteID,
                    function (res) {
                        $scope.RouteAssignedAssetList = res;
                        $scope.isLoading = false;
                    },
                    function (error) {
                    }
                );
            };

            $scope.UpdateRouteAssignment = function () {
                $scope.AssetList = [];
                $scope.RouteAssignedAssetList.forEach(function (za) {
                    za.AccountUserChildAssetList.forEach(function (a) {
                        $scope.AssetList.push(a);
                    });
                });

                RoutesFactory.UpdateRouteAssignedAssetList(
                     $scope.SelectedRouteID,
                    $scope.AssetList,
                      function (res) {
                          RoutesFactory.getUserRouteList(function (data) {
                              if (data !== null) {
                                  CommonFactory.setUserRouteList(data);
                                  $scope.getAssetRouteList();
                              }
                          }, function (error) {
                              $scope.error = error.Message;
                          });


                          CommonFactory.createAlert("Success", "Route Assignment Updated");
                      },
                    function (error) {
                        console.log(error.message);
                    });
            };

        } else {
            $scope.AssetAssignedRouteList = [];
            $scope.CustomerList = CommonFactory.getCustomerList();
            RoutesFactory.getAssetAssignedRouteList($scope.SelectedAssetID, function (success) {
                $scope.AssetAssignedRouteList = success;
            }, function (error) {
            });
            $scope.getAssetAssignedRouteList = function (AssetID) {
                $scope.AssetAssignedRouteList = [];
                $scope.isLoading = true;
                $scope.SelectedAssetID = AssetID;
                RoutesFactory.getAssetAssignedRouteList(AssetID, function (success) {
                    $scope.isLoading = false;
                    $scope.AssetAssignedRouteList = success;
                }, function (error) {
                });
            };

            $scope.UpdateAssetAssignment = function (data) {
                $scope.RouteList = [];
                data.forEach(function (za) {
                    $scope.RouteList.push(za);
                });
                RoutesFactory.UpdateAssetAssignedRouteList(
                     $scope.SelectedAssetID,
                    $scope.RouteList,
                      function (res) {
                          RoutesFactory.getUserRouteList(function (data) {
                              if (data !== null) {
                                  CommonFactory.setUserRouteList(data);
                                  $scope.getAssetRouteList();
                              }
                          }, function (error) {
                              $scope.error = error.Message;
                          });
                          CommonFactory.createAlert("Success", "Asset Assignment Updated");
                      },
                    function (error) {
                        console.log(error.message);
                    });
            };

        }


    }, true);


    $scope.viewAsset = function (id) {
        if ($("#Route-font-icon-" + id).hasClass('active')) {
            $("#Route-font-icon-" + id).removeClass('active');
            $("#Route-font-icon-" + id).removeClass('fa-plus-circle');
            $("#Route-font-icon-" + id).addClass('fa-minus-circle');
            $('#Route-' + id).slideToggle({ direction: "up" }, 300);


        }
        else {
            $("#Route-font-icon").removeClass('active');
            $("#Route-font-icon-" + id).removeClass('fa-minus-circle');
            $("#Route-font-icon-" + id).addClass('fa-plus-circle');
            $("#Route-font-icon-" + id).addClass('active');
            $('#Route-' + id).slideToggle({ direction: "down" }, 300);
        }
    }

    $scope.getSelectedAssetRoute = function (data, selectAll) {
        data.forEach(function (v) {
            v.IsAssigned = selectAll;
        });
    }
    $scope.toggleSelectAllAssetRoute = function (IsAssigned, cus) {
        if (!IsAssigned) {
            cus.CustomerID = false;
        }
    }
    $scope.getAssetRouteList = function () {
        RoutesFactory.getAssetRouteList(
        $scope.SelectedAssetID,
        function (e) {
            if (e !== 'No Data') {
                CommonFactory.setAssetRouteList(e);
            } else {
                CommonFactory.setAssetRouteList([]);
            }
        },
        function (error) {
        });
    }

    $scope.getSelectedRoute = function (data, selectAllRoute) {
        data.forEach(function (v) {
            v.IsAssigned = selectAllRoute;
        });
    };

    $scope.toggleSelectAllAssetRouteList = function (IsAssigned) {
        if (!IsAssigned) {
            $scope.allSelected.Route = false;
        }
    }

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});