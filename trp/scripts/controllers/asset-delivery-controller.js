app.controller('AssetDeliveryController', ['$scope', '$localStorage', 'CommonFactory', 'MapFactory', '$location', '$filter', '$interval', '$uibModal', 'DeliveryFactory', '$rootScope', function ($scope, $localStorage, CommonFactory, MapFactory, $location, $filter, $interval, $uibModal, DeliveryFactory, $rootScope) {
    $scope.SelectedAsset = {};
    $scope.EditDeliveryMode = false;
    $scope.delivered = false;
    $scope.editDeliveryDetails = [];
    $scope.isDelivery = false;
    $scope.currentLoading = false;

    $scope.openAssetList = function () {

        $('.left-side-panel-menu-item').removeClass('side-panel-menu-item-active active-icon');
        $('.left-side-content-container').hide("slide");
        $('#lspmi-asset').addClass('side-panel-menu-item-active active-icon');
        $('#asset').show("slide");

    };


    $localStorage.roles_TRP.forEach(function (data) {

        if (data.Name === 'DELIVERY') {
            $scope.isDelivery = data.On;
        }

    });

    $rootScope.$on("clearAssetDeliveries", function (data) {

        $scope.SelectedAsset = null;
        $scope.objectDeliveryList = [];
        $scope.completedDeliveryList = [];

    });


    $rootScope.$on("getDeliveriesData", function () {

        if (CommonFactory.getAsset() != null) {
            $scope.getDeliveriesData();
        }

    });


    $scope.getDeliveriesData = function () {

        var data = CommonFactory.getAsset();

        if ($scope.SelectedAsset.AssetID != data.AssetID) {
            $scope.currentLoading = true;
        }

        $scope.SelectedAsset = data;
        if ($localStorage.module == 'AssetDelivery') {

            if (data != null) {

                if (data.AssetID) {

                    $scope.getObjectDeliveryList(data.AssetID);
                    $scope.getCompletedDelivery(data.AssetID);
                    //$scope.isShowCompleteDeliveryExport = false;

                }
            }

        }

    }


    //add delivery
    $scope.addDelivery = function () {

        CommonFactory.setAddDeliveryMode(true);

    }


    //cancel new delivery
    $scope.cancelNewDelivery = function () {

        CommonFactory.setAddDeliveryMode(false);

    };


    //cancel edit delivery
    $scope.cancelEditDelivery = function () {

        $scope.EditDeliveryMode = false;

    }


    //ge delivery list of selected asset
    $scope.getObjectDeliveryList = function (AssetID) {

        //$scope.objectDeliveryList = [];
   

        DeliveryFactory.getObjectDelivery(
            AssetID,
            function (res) {

                $scope.objectDeliveryList = res;
                CommonFactory.setObjectDeliveryList(res);

                //total of deliveries of selected asset
                $scope.TotalDeliveries = res.length;
                $scope.currentLoading = false;
            },
            function (error) {
                $scope.currentLoading = false;
            });
    };


    //save delivery
    $scope.saveDelivery = function () {

        $("#error-container").text("");
        $("#deliver-new-form").parsley().validate();

        if ($("#deliver-new-form").parsley().isValid()) {

            var result = confirm("Are you sure you want to save " + $scope.DeliveryNumber + " delivery number?");

            if (result) {

                var params = {
                    deliveryNumber: $scope.DeliveryNumber.replace(/\s\s+/g, ' '),
                    oldDeliveryNumber: $scope.DeliveryNumber.replace(/\s\s+/g, ' '),
                    orderNumber: $scope.OrderNumber.replace(/\s\s+/g, ' '),
                    description: 'DHL',
                    assetID: CommonFactory.getAsset().AssetID
                }

                DeliveryFactory.createDelivery(
                        params,
                        function (data) {

                            $scope.DeliveryNumber = '';
                            CommonFactory.setAddDeliveryMode(false);
                            $scope.getObjectDeliveryList(CommonFactory.getAsset().AssetID);
                            $scope.getCompletedDelivery(CommonFactory.getAsset().AssetID);

                        },
                        function (error) {

                            CommonFactory.createAlert('Error Message Found', error.Message);

                        });

            }
        }
    }


    //get complete deliveries
    $scope.getCompletedDelivery = function (assetID) {

        DeliveryFactory.getObjectDeliveryCompleted(assetID, function (data) {

            $scope.completedDeliveryList = data;
            CommonFactory.setCompletedDelivery(data);

            //count total complete deliveries
            $scope.TotalCompleteDeliveries = data.length;
            $scope.currentLoading = false;

        }, function (error) {
            $scope.currentLoading = false;
        })
    }


    //start delivery
    $scope.startDelivery = function (delivery) {

        var jsonObj = {
            deliveryNumber: delivery.oldDeliveryNumber,
            longitude: $scope.SelectedAsset.Longitude,
            latitude: $scope.SelectedAsset.Latitude,
            location: $scope.SelectedAsset.Location,
            objectDeliveryID: delivery.objectDeliveryID
        }

        if (delivery.started) {

            var result = confirm("Are you sure you want to complete " + delivery.oldDeliveryNumber + " delivery number?");

            if (result) {

                delivery.started = false;
                DeliveryFactory.completeDelivery(jsonObj, function (data) {

                    $scope.getObjectDeliveryList(CommonFactory.getAsset().AssetID);
                    $scope.getCompletedDelivery(CommonFactory.getAsset().AssetID);

                    $rootScope.$emit("setAssetInformation", {});

                    //add delivery in news feed
                    jsonObj.Asset = $scope.SelectedAsset;
                    jsonObj.NewsFeedStatus = "Completed Delivery"
                    $rootScope.$emit("loadNewsFeedDelivery", jsonObj, jsonObj);


                }, function (error) { });
            }
        } else {

            var result = confirm("Are you sure you want to start " + delivery.oldDeliveryNumber + " delivery number?");

            if (result) {

                delivery.started = true;

                DeliveryFactory.startDelivery(jsonObj, function (data) {

                    $scope.getObjectDeliveryList(CommonFactory.getAsset().AssetID);
                    $scope.getCompletedDelivery(CommonFactory.getAsset().AssetID);

                    $rootScope.$emit("setAssetInformation", {});

                    //add delivery in news feed
                    jsonObj.Asset = $scope.SelectedAsset;
                    jsonObj.NewsFeedStatus = "Started Delivery"
                    $rootScope.$emit("loadNewsFeedDelivery", jsonObj, jsonObj);


                }, function (error) { });
            }
        }
    }

    //edit delivery
    $scope.editDelivery = function (delivery) {

        $scope.EditDeliveryMode = true;
        $scope.editDeliveryDetails['newDeliveryNumber'] = delivery.oldDeliveryNumber;
        $scope.editDeliveryDetails['oldDeliveryNumber'] = delivery.oldDeliveryNumber;
        $scope.editDeliveryDetails['newOrderNumber'] = delivery.orderNumber;
        $scope.editDeliveryDetails['objectDeliveryID'] = delivery.objectDeliveryID;

    }


    //update delivery
    $scope.updateDelivery = function () {

        $("#error-container").text("");
        $("#deliver-edit-form").parsley().validate();

        if ($("#deliver-edit-form").parsley().isValid()) {

            var modify = confirm("Are you sure you want to update " + $scope.editDeliveryDetails.oldDeliveryNumber + " delivery number?");

            if (modify) {

                var jsonObj = {
                    oldDeliveryNumber: $scope.editDeliveryDetails.oldDeliveryNumber.replace(/\s\s+/g, ' '),
                    deliveryNumber: $scope.editDeliveryDetails.newDeliveryNumber.replace(/\s\s+/g, ' '),
                    orderNumber: $scope.editDeliveryDetails.newOrderNumber.replace(/\s\s+/g, ' '),
                    assetID: $scope.SelectedAsset.AssetID,
                    objectDeliveryID: $scope.editDeliveryDetails.objectDeliveryID
                }

                DeliveryFactory.updateDelivery(
                        jsonObj,
                        function (data) {

                            $scope.EditDeliveryMode = false;
                            $scope.getObjectDeliveryList(CommonFactory.getAsset().AssetID);
                            $scope.getCompletedDelivery(CommonFactory.getAsset().AssetID);

                        },
                        function (error) {

                            CommonFactory.createAlert('Error Message Found', error.Message);

                        });

            }

        }

    }


    //cancel delivery
    $scope.cancelDelivery = function (delivery) {

        var result = confirm("Are you sure you want to cancel " + delivery.objectDeliveryID + " delivery number?");

        if (result) {

            DeliveryFactory.cancelDelivery(delivery.objectDeliveryID, function (data) {
                $scope.getObjectDeliveryList(CommonFactory.getAsset().AssetID);
                $scope.getCompletedDelivery(CommonFactory.getAsset().AssetID);

                CommonFactory.createAlert('Success', 'Delivery has been cancelled.');

            }, function (error) {

            });
        }
    }

    //remove delivery
    $scope.removeDelivery = function (delivery) {

        var result = confirm("Are you sure you want to remove " + delivery.oldDeliveryNumber + " delivery number?");

        if (result) {

            DeliveryFactory.deleteDelivery(delivery.objectDeliveryID, function (data) {
                $scope.getObjectDeliveryList(CommonFactory.getAsset().AssetID);
                $scope.getCompletedDelivery(CommonFactory.getAsset().AssetID);

                CommonFactory.createAlert('Success', 'Delivery has been removed.');
            }, function (error) { });

        }
    }


    $scope.$watch(function () {
        return CommonFactory.getObjectDeliveryList();
    }, function (data) {

        if (data.length > 0) {
            $scope.objectDeliveryList = data;
        }

    }, true);


    $scope.$watch(function () {
        return CommonFactory.getCompletedDelivery();
    }, function (data) {
        if (data.length > 0) {
            $scope.completedDeliveryList = data;
        }
    }, true);


    $scope.$watch(function () {
        return CommonFactory.getAddDeliveryMode();
    }, function (data) {

        $scope.AddDeliveryMode = data;

    }, true);


    //show modal
    $scope.accessModal = function () {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'deliveryModal',
            controller: 'DeliveryModalController',
            size: 'sm',
            resolve: {
                AssetID: function () {
                    return $scope.SelectedAsset.AssetID;
                }
            }
        });

    }


    $scope.completeDeliveryTabClick = function () {

        $scope.isShowCompleteDeliveryExport = true;
    };


    $scope.deliveryTabClick = function () {

        $scope.isShowCompleteDeliveryExport = false;
    }


    //export
    $scope.exportArray = [];
    $scope.exportFile = function (fileType) {

        $scope.exportArray = [];

        if ($scope.completedDeliveryList.length > 0) {

            $scope.completedDeliveryList.forEach(function (csv) {

                $scope.CsvFileName = $localStorage.username + '-' + CommonFactory.getAsset().Name + '-' + getDateTimeToday() + '(Completed Delivery List).' + fileType;

                var travelTime = CommonFactory.getDateHourMinutesDifference(new Date(csv.start_datetime), new Date(csv.end_datetime));
                travelTime.minutes = (travelTime.minutes == undefined ? "0" : travelTime.minutes);
                $scope.exportArray.push({
                    'Order No': csv.orderNumber,
                    'Delivery No': csv.oldDeliveryNumber,
                    'From_Address': csv.startLocation,
                    'To_Address': csv.endLocation,
                    'Departure Time': csv.start_datetime != null ? $filter('date')(csv.start_datetime, "yyyy-MM-dd HH:mm") : "",
                    'Arrival Time ': csv.end_datetime != null ? $filter('date')(csv.end_datetime, "yyyy-MM-dd HH:mm") : "",
                    'Travel Time': (csv.start_datetime && csv.end_datetime) != null ? travelTime.hours + "h " + travelTime.minutes + "m" : ""
                });

            });

            alasql('SELECT * INTO XLSX("' + $scope.CsvFileName + '",{headers:true}) FROM ?', [$scope.exportArray]);
        }

    };


    $scope.exportFileType = false;
    $scope.exportPanel = function () {

        if ($scope.exportFileType == false) {

            $scope.exportFileType = true;
            $('#export-file-asset-delivery').show("slide");
        } else {

            $scope.exportFileType = false;
            $('#export-file-asset-delivery').hide("slide");
        }

    }
}]);