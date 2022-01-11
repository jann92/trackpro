app.controller('AssetInformationController', ['$scope', '$localStorage', 'AssetInformationFactory', 'CommonFactory', 'MapFactory', '$location', '$filter', '$rootScope', function ($scope, $localStorage, AssetInformationFactory, CommonFactory, MapFactory, $location, $filter, $rootScope) {
    $scope.AssetInformation = {};
    $scope.AssetGPSInformation = {};
    $scope.WeatherInformation = {};
    $scope.AssetSettings = {};
    $scope.AssetTypeList = {};
    $scope.FuelTypeList = [{ FuelTypeID: 0, Name: 'Diesel' }, { FuelTypeID: 1, Name: 'Petrol' }]
    $scope.isLoading = false;
    $scope.loadWeather = false;
    $scope.hasImage = false;
    $scope.thumbnailSize = 4;
    $scope.thumbnailPage = 1;
    $scope.slidesthumb = $scope.slides = [];
    $scope.assetInfoTabClickActive = "Details";
    $scope.isDelivery = false;
    $scope.Schedule = "Select Day";
    $scope.ScheduleValue = 0;
    $scope.DeliveryInformation = [];


    var currIndex = 0;

    //$localStorage.roles_TRP.forEach(function (data) {
    //    if (data.Name === 'Delivery') {
    //        $scope.isDelivery = data.On;
    //    }
    //});

    if ($scope.Delivery_Role.Read) {
        $scope.isDelivery = true;
    }

    //get weather information of selected asset
    $scope.getWeatherInformation = function (Asset) {
        $scope.WeatherInformation = [];
        $scope.loadWeather = true;
        AssetInformationFactory.getWeatherInformation(
            { Longitude: Asset.Longitude, Latitude: Asset.Latitude },
           function (res) {

               $scope.AssetGPSInformation['AssetID'] = Asset.AssetID;

               $scope.WeatherInformation = res;
               $scope.loadWeather = false;
               $scope.loadWeatherError = false;
           },
            function (error) {
                $scope.loadWeatherError = true;
                $scope.loadWeather = false;
                console.log(error);
            });
    };

    //get camera of selected asset
    $scope.getCameraInformation = function (Asset) {

        AssetInformationFactory.getCameraInformation(Asset.AssetID, function (res) {

            $scope.AssetGPSInformation['AssetID'] = Asset.AssetID;

            if (res.ImageList) {

                res.ImageList.forEach(function (e) {
                    e.id = currIndex++;
                });

                $scope.slides = res.ImageList;
                $scope.showThumbnails = $scope.slides.slice(($scope.thumbnailPage - 1) * $scope.thumbnailSize, $scope.thumbnailPage * $scope.thumbnailSize);

            }

            $scope.CameraInformation = res;
        },
        function (error) {

        });
    }

    //get driver of selected asset
    $scope.getDriverInformation = function (Asset) {
        AssetInformationFactory.getAssetGPSDriverInformation(Asset.AssetID, function (res) {

            $scope.AssetGPSInformation['AssetID'] = Asset.AssetID;

            res.BoardTime = CommonFactory.convertTimeZone(res.BoardTime);
            $scope.DriverInformation = res;
        }, function (error) {

        });
    }

    //get settings of selected asset
    $scope.getSettingsInformation = function (Asset) {
        AssetInformationFactory.getAssetGPSSettingsInformation(Asset.AssetID, function (res) {

            $scope.AssetGPSInformation['AssetID'] = Asset.AssetID;

            $scope.AssetSettings = res;

            $scope.AssetSettings.Registration = $filter('date')(res.Registration, 'yyyy-MM-dd');
            $scope.AssetSettings.Insurance = $filter('date')(res.Insurance, 'yyyy-MM-dd');
            $scope.AssetSettings.Service = $filter('date')(res.Service, 'yyyy-MM-dd');
            $scope.AssetSettings.Permit = $filter('date')(res.Permit, 'yyyy-MM-dd');

            var checkList = document.getElementById('list1');
            var scheditems = document.getElementById('scheditems');
            checkList.getElementsByClassName('anchor')[0].onclick = function (evt) {
                if (scheditems.classList.contains('visible')) {
                    scheditems.classList.remove('visible');
                    scheditems.style.display = "none";
                }

                else {
                    scheditems.classList.add('visible');
                    scheditems.style.display = "block";
                }

            }

            //schedule
            var checkboxes = scheditems.getElementsByTagName("input");
            $scope.ScheduleValue = 0;
            $scope.Schedule = "Select Day";

            var values = "";

            Array.prototype.forEach.call(checkboxes, function (e) {

                e.checked = false;

                if ($scope.AssetSettings.Schedule != null) {

                    var sched = $scope.AssetSettings.Schedule.split(',');

                    sched.forEach(function (d) {
                        if (e.id === d) {
                            e.checked = true;
                            values += e.id + ",";
                            $scope.ScheduleValue +=  parseInt(e.value);
                        }
                    });

                }

            });


            if (values == "") { values = "Select Day"; }

            $scope.Schedule = values;

            $scope.AssetSettings.ScheduleValue = $scope.ScheduleValue;
            //end of shedule

        }, function (error) {

        });
    }

    //get delivery of selected asset
    $scope.getDeliveryInformation = function (Asset) {
        AssetInformationFactory.getCurrentDelivery(Asset.AssetID, function (res) {

            $scope.AssetGPSInformation['AssetID'] = Asset.AssetID;

            if (res != undefined) {
                if (res.length > 0) {
                    res.forEach(function (del) {
                        del.start_datetime = del.start_datetime == null ? ' ' : CommonFactory.convertTimeZone(del.start_datetime);
                    });
                }
            }

            $scope.DeliveryInformation = res;
        }, function (error) {

        });
    }


    $scope.assetInfoTabClick = function (data) {

        $scope.assetInfoTabClickActive = data;

        if (CommonFactory.getAsset() != null) {

            if (CommonFactory.getAsset().AssetID) {
                var assetID = CommonFactory.getAsset().AssetID;

                if (data === 'Details') {
                    $scope.setAssetInformation(CommonFactory.getAsset());
                }
                if (data === 'Weather') {
                    $scope.getWeatherInformation(CommonFactory.getAsset());
                }
                if (data === 'Camera') {
                    $scope.getCameraInformation(CommonFactory.getAsset());
                }
                if (data === 'Driver') {
                    $scope.getDriverInformation(CommonFactory.getAsset());
                }
                if (data === 'Delivery') {
                    $scope.getDeliveryInformation(CommonFactory.getAsset());
                }
                if (data === 'Settings') {
                    $scope.getSettingsInformation(CommonFactory.getAsset());
                }
            }
        }
    }


    //prev page of image
    $scope.prevPage = function () {
        var currIndex = 0

        if ($scope.thumbnailPage > 1) {

            $scope.thumbnailPage--;

        } else {

            var jsonObj = {
                ObjectID: $scope.AssetGPSInformation.AssetID,
                PhotoID: $scope.slides[0].PhotoID,
                Method: "Prev"
            };

            AssetInformationFactory.getNextPrevPhoto(jsonObj, function (photo) {

                $scope.CameraInformation.ImageList.unshift(photo[0]);

                $scope.CameraInformation.ImageList.forEach(function (e) {
                    e.id = currIndex++;
                });

                CommonFactory.setAsset($scope.AssetGPSInformation);
            },
            function (error) {
            });

        }

        $scope.showThumbnails = $scope.slides.slice(($scope.thumbnailPage - 1) * $scope.thumbnailSize, $scope.thumbnailPage * $scope.thumbnailSize);
    }


    //next page of image
    $scope.nextPage = function () {

        var currIndex = 0;

        if ($scope.thumbnailPage <= Math.floor($scope.slides.length / $scope.thumbnailSize)) {

            $scope.thumbnailPage++;
        } else {

            var jsonObj = {
                ObjectID: $scope.AssetGPSInformation.AssetID,
                PhotoID: $scope.slides[$scope.slides.length - 1].PhotoID,
                Method: "Next"
            };

            AssetInformationFactory.getNextPrevPhoto(jsonObj, function (photo) {
                $scope.CameraInformation.ImageList.push(photo[0]);
                $scope.CameraInformation.ImageList.forEach(function (e) {
                    e.id = currIndex++;
                });

                CommonFactory.setAsset($scope.AssetGPSInformation);
            },
            function (error) {

            });
        }

        $scope.showThumbnails = $scope.slides.slice(($scope.thumbnailPage - 1) * $scope.thumbnailSize, $scope.thumbnailPage * $scope.thumbnailSize);
    }


    //set active
    $scope.setActive = function (idx) {
        $scope.active = idx;
    }


    //set asset
    $rootScope.$on("setAsset", function (event, result) {
        var assetList = [];

        CommonFactory.getCustomerList().forEach(function (cus) {
            cus.AssetList.forEach(function (asset) {
                assetList.push(asset);
            });
        });

        var asset = $.grep(assetList, function (e) {
            return e.AssetID === result;
        })[0];

        CommonFactory.setAsset(asset);

        $rootScope.$emit("setAssetInformation", {});


    });


    //set information of selected asset
    $rootScope.$on("setAssetInformation", function () {
        if (CommonFactory.getAsset() != null) {

            if ($scope.assetInfoTabClickActive === 'Details') {
                $scope.setAssetInformation(CommonFactory.getAsset());
            }
            if ($scope.assetInfoTabClickActive === 'Weather') {
                $scope.getWeatherInformation(CommonFactory.getAsset());
            }
            if ($scope.assetInfoTabClickActive === 'Camera') {
                $scope.getCameraInformation(CommonFactory.getAsset());
            }
            if ($scope.assetInfoTabClickActive === 'Driver') {
                $scope.getDriverInformation(CommonFactory.getAsset());
            }
            if ($scope.assetInfoTabClickActive === 'Delivery') {
                $scope.getDeliveryInformation(CommonFactory.getAsset());
            }
            if ($scope.assetInfoTabClickActive === 'Settings') {
                $scope.getSettingsInformation(CommonFactory.getAsset());
            }

        }
    });




    //clear information of selected asset
    $rootScope.$on("clearAssetInformation", function () {

        $scope.AssetGPSInformation = [];
        $scope.AssetSettings = [];

    });


    //function to set information of asset
    $scope.setAssetInformation = function (data) {

        $scope.AssetGPSInformation = data;

        if (data.ImageList != null) {

            $scope.hasImage = true;

        } else {

            $scope.hasImage = false;
        }

        $scope.getAssetGPSInformation(data);

    };


    $scope.openAssetList = function () {
        $('.left-side-panel-menu-item').removeClass('side-panel-menu-item-active active-icon');
        $('.left-side-content-container').hide("slide");
        $('#lspmi-asset').addClass('side-panel-menu-item-active active-icon');
        $('#asset').show("slide");
    };


    //get asset information
    $scope.getAssetGPSInformation = function (Asset) {

        if (Asset.AssetID != undefined) {

            $scope.isLoading = true;

            AssetInformationFactory.getAssetGPSInformation(Asset.AssetID,
            function (res) {
                $scope.updateGPSInformation(res, Asset);

            },
            function (error) {
                console.log(error.message);
            });
        }
    };



    //update asset information when click
    $scope.updateGPSInformation = function (res, Asset) {

        $scope.isLoading = false;
        var insidezone = [];
        var address = '';

        //sensor labels
        $scope.Sensor1Label = $localStorage.AccountSensor1Label;
        $scope.Sensor2Label = $localStorage.AccountSensor2Label;

        if (res) {

            if (res.Location == null || res.Location == '') {

                address = '--';
            }
            else if (res.ZoneInsideList) {

                address = res.Location + ', (' + res.ZoneInsideList.join(", ") + ')';
            }
            else {

                address = res.Location;
            }

            currIndex = 0;

            $scope.AssetGPSInformation = res;

            $scope.AssetGPSInformation.CustomerName = Asset.CustomerName;
            $scope.AssetGPSInformation.AssetID = Asset.AssetID;
            $scope.AssetGPSInformation.Name = Asset.Name;
            $scope.AssetGPSInformation.SIMNumber = res.SIMNumber;
            $scope.AssetGPSInformation.TypeID = res.TypeID;
            $scope.AssetGPSInformation.Fuel = res.Fuel;
            $scope.AssetGPSInformation.FuelRatio = res.FuelRatio;
            $scope.AssetGPSInformation.FuelTypeID = res.FuelTypeID;
            $scope.AssetGPSInformation.LastReport = Asset.LastReport;
            $scope.AssetGPSInformation.ZoneInsideList = insidezone;

            //remove/add ban icon of asset in list 
            var AssetList = [];
            var customerList = CommonFactory.getCustomerList();
            customerList.forEach(function (customer) {
                customer.AssetList.forEach(function (gps) {
                    AssetList.push(gps);
                })
            });

            var checkasset = $.grep(AssetList, function (e) {
                return e.AssetID == Asset.AssetID;
            });

            if (checkasset[0]) {
                checkasset[0].IsBan = res.IsBan;
            }
            //end



            $scope.AssetGPSInformation.ImageUrl = res.ImageUrl;
            $scope.AssetGPSInformation.Status = res.Status;
            $scope.AssetGPSInformation.Invalid = false;
            res.GPSTime = CommonFactory.convertTimeZone(res.GPSTime);

            var content = {
                AssetID: Asset.AssetID
                    , Name: Asset.Name
                    , Latitude: res.Latitude
                    , Longitude: res.Longitude
                    , TypeName: Asset.TypeName == undefined || null ? res.TypeName : Asset.TypeName
                    , Location: res.Location
                    , Speed: res.Speed
                    , GPSTime: res.GPSTime
                    , DirectionCardinal: res.DirectionCardinal
                    , DirectionDegrees: res.DirectionDegrees
                    , Status: res.Status
                    , FuelRatio: Asset.FuelRatio
                    , FuelTypeID: Asset.FuelTypeID
                    , ImageUrl: res.ImageUrl
                    , SIMNumber: Asset.SIMNumber
                    , TypeID: Asset.TypeID == undefined || null ? res.TypeID : Asset.TypeID
                    , CurrentDriver: res.CurrentDriver
                    , BoardTime: res.BoardTime
                    , LicenseNo: res.LicenseNo
                    , LicenseType: res.LicenseType
                    , MobilePhoneNo: res.MobilePhoneNo
                    , Odometer: res.Odometer
                    , DeliveryList: []
                    , DeliveryCount: null
                    , Delivery: res.DeliveryNumber
            };


            //asset delivery count
            AssetInformationFactory.getDeliveryCount(Asset.AssetID, function (data) {
                content.DeliveryCount = data;

                var marker = CommonFactory.createMarker(
                  'asset' + Asset.AssetID
                  , Asset.Name
                  , content
                  , 'asset'
                  , false
                  , true
                  , 'label-map');

                CommonFactory.updatePopupInfowindowMarker(Asset.AssetID);

                MapFactory.addMarker(marker, 'asset');
                MapFactory.showMarker('asset' + Asset.AssetID, true);

                $rootScope.$emit("clusterMarker", {});

            }, function (error) {

            });




            $("#iw-asset").text(Asset.Name + " | " + Asset.AssetID);
            $("#iw-location").text(res.Location);
            $("#iw-speed").text(res.Speed + " kph " + res.DirectionDegrees + "° " + res.DirectionCardinal);

        }
        else {

            $scope.AssetGPSInformation.Invalid = true;
        }

    };


    //get asset type list
    $scope.getAssetTypeList = function () {
        AssetInformationFactory.getAssetTypeList(
            function (res) {
                $scope.AssetTypeList = res;
            }, function (error) {
                console.log(error.message);
            });
    };


    //call function get asset type list
    $scope.getAssetTypeList();


    $scope.assetSettingsChange = function () {
        $scope.resetbutton = true;
    };


    $scope.resetButtonClick = function () {
        $scope.getSettingsInformation(CommonFactory.getAsset());
    }


    //sched checkbox change event
    schedCheckBoxChange = function () {
        var scheditems = document.getElementById('scheditems');
        var checkboxes = scheditems.getElementsByTagName("input");
        $scope.Schedule = "";
        Array.prototype.forEach.call(checkboxes, function (e) {

            if (e.checked) {
                $scope.Schedule += e.id + ",";
            }

        });

        $scope.Schedule = $scope.Schedule == "" ? "Select Day" : $scope.Schedule;

    }



    //update asset settings
    $scope.updateAssetSettings = function (AssetSettings) {

        var AssetSettings = $scope.AssetSettings;

        $("#asset-update-settings-form").parsley().validate();
        $("#asset-update-settings-form").parsley().validate();

        if ($("#asset-update-settings-form").parsley().isValid()) {

            var customerList = CommonFactory.getCustomerList();

            var getCustomer = $.grep(customerList, function (e) {
                return e.CustomerID == AssetSettings.CustomerID;
            });

            var getCustomerAssetList = [];
            var arrAsset = [];

            if (getCustomer.length > 0) {
                getCustomerAssetList = getCustomer[0].AssetList.forEach(function (asset) {
                    arrAsset.push(asset);
                });
            }

            var filterGetCustomerAssetList = $.grep(arrAsset, function (e) {

                return e.AssetID != AssetSettings.AssetID;

            });

            var checkifexist = $.grep(filterGetCustomerAssetList, function (e) {
                return e.Name == AssetSettings.Name;
            });

            var result = confirm("Are you sure you want to update " + CommonFactory.getAsset().Name + " asset?");

            if (result) {
                if (checkifexist.length > 0) {

                    CommonFactory.createAlert("Error", "Asset Name is already exist.");
                }
                else {




                    //asset schedule
                    var scheditems = document.getElementById('scheditems');
                    var checkboxes = scheditems.getElementsByTagName("input");
                    var values = "";

                    $scope.ScheduleValue = 0;

                    Array.prototype.forEach.call(checkboxes, function (e) {
                        
                        if(e.checked)
                        {
                            $scope.ScheduleValue += parseInt(e.value);
                        }


                    });
                    AssetSettings.Schedule = $scope.ScheduleValue;
                    //end of schedule


                    AssetInformationFactory.updateAssetSettings(
                    AssetSettings.AssetID,
                    AssetSettings,
                     function (data) {


                         AssetInformationFactory.getAssetGPSSettingsInformation(AssetSettings.AssetID, function (res) {

                             CommonFactory.createAlert("Success", "Asset updated successfully.");
                             CommonFactory.updateAsset(AssetSettings);
                            
                             var asset = CommonFactory.getAsset();

                             var assettypeName = $.grep($scope.AssetTypeList, function (e) {
                                 return e.AssetTypeID === AssetSettings.TypeID;
                             });

                             asset.Name = res.Name;
                             asset.TypeName = assettypeName[0].Name;
                             asset.TypeID = AssetSettings.TypeID;
                             
                             asset.Registration = res.Registration != null ? $filter('date')(res.Registration, 'yyyy-MM-dd') : null;
                             asset.Insurance = res.Insurance != null ? $filter('date')(res.Insurance, 'yyyy-MM-dd') : null;
                             asset.Service = res.Service != null ? $filter('date')(res.Service, 'yyyy-MM-dd') : null;
                             asset.Permit = res.Permit != null ? $filter('date')(res.Permit, 'yyyy-MM-dd') : null;

                             $scope.AssetSettings.Registration = res.Registration != null ? $filter('date')(res.Registration, 'yyyy-MM-dd') : null;
                             $scope.AssetSettings.Insurance = res.Insurance != null ? $filter('date')(res.Insurance, 'yyyy-MM-dd') : null;
                             $scope.AssetSettings.Service = res.Service != null ? $filter('date')(res.Service, 'yyyy-MM-dd') : null;
                             $scope.AssetSettings.Permit = res.Permit != null ? $filter('date')(res.Permit, 'yyyy-MM-dd') : null;

                             $scope.setAssetInformation(asset);

                             $rootScope.$emit("setAssetInformation", {});


                         }, function (err) {
                             CommonFactory.createAlert("Error", "Asset update failed.");
                         });

                         

                     },
                     function (error) {
                         console.log(error.message);
                     });

                }
            }
        }


    };


}]);