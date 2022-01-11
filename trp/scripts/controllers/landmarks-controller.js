app.controller('LandmarksController', ['$scope', '$localStorage', 'LandmarksFactory', 'CommonFactory', 'MapFactory', '$location', '$filter', '$uibModal', '$interval', function ($scope, $localStorage, LandmarksFactory, CommonFactory, MapFactory, $location, $filter, $uibModal, $interval) {
    $scope.isLoading = false;
    $scope.LandmarkTypeList = [];
    $scope.UserLandmarkList = [];
    $scope.AssetLandmarkList = [];
    $scope.SelectedLandmark = {};
    $scope.SelectedAsset = {};
    $scope.NewLandmark = {};
    $scope.LandmarkEditMode = false;
    $scope.LandmarkNewMode = false;
    $scope.EditLandmark = {};
    $scope.LandmarkAssignedAssetList = {};
    $scope.landmarkText = "Start Drawing";
    $scope.landmarknewloading = false;
    $scope.landmarkeditloading = false;

    $scope.TotalLandmark = 0;

    $scope.isClicked = null;

    $scope.landmarkOptions = function (color, icon) {
        return {
            color: color,
            icon: icon
        }
    };


    //get user landmarks list
    $scope.getUserLandmarkList = function () {

        LandmarksFactory.getUserLandmarkList(
            function (res) {
                $scope.UserLandmarkList = res;
                $scope.createLandmark(res);
                $scope.TotalLandmark = res.length;
            },
            function (error) {
                console.log(error.message);
            });
    };


    //get landmark type list
    $scope.getLandmarkTypeList = function () {

        LandmarksFactory.getLandmarkTypeList(
            function (res) {
                $scope.LandmarkTypeList = res;

                $scope.getUserLandmarkList();

                $scope.LandmarkTypeList.unshift({
                    'Name': 'Select Landmark',
                    'LandmarkTypeID': 0
                });

                $scope.NewLandmark.LandmarkTypeID = $scope.LandmarkTypeList[0].LandmarkTypeID;
            },
            function (error) {
                console.log(error.message);
            });
    };


    //get landmark types
    $scope.getLandmarkTypeList();




    //start drawing of landmark
    $scope.startDrawing = function () {

        CommonFactory.createAlert('Draw Landmark', 'You may now create a landmark by pointing on map to your desired location.');

        var landmarkTypeID = $scope.NewLandmark.LandmarkTypeID;
        var landmarktype = $.grep($scope.LandmarkTypeList, function (e) {
            return e.LandmarkTypeID === landmarkTypeID;
        });

        if (landmarktype.length > 0) {
            var selectedLandmark = landmarktype[0];
            var iconURL = '../../contents/images/track/map/landmarks/' + selectedLandmark.Name + '.png';

            if ($scope.landmarkText != 'Clear') {
                $scope.landmarkText = 'Clear';
                MapFactory.startDrawing('marker', $scope.landmarkOptions("#fff", iconURL));
            } else {
                $scope.landmarkText = 'Start Drawing';
                MapFactory.stopDrawing();
                MapFactory.cancelLandmark();
            }
        }

    };


    createPolygonObject = function (az) {

        var polygongclist = [];
        az.GeoCoordinateList.forEach(function (gc) {
            var point = MapFactory.createPoint(gc.Latitude, gc.Longitude);
            polygongclist.push(point);
        });

        var landmark = MapFactory.createPolygon('circle', polygongclist, $scope.landmarkOptions('#fff', 100), az.LandmarkID, az.AssignedAssetList);
        return landmark;
    }


    //draw landmark
    $scope.drawLandmark = function () {

        if ($scope.AssetLandmarkList.length !== 0) {

            $scope.AssetLandmarkList.forEach(function (az) {

                var landmark = createPolygonObject(az);

                if (landmark !== null) {

                    MapFactory.addPolygon(landmark);
                    MapFactory.showPolygon(landmark);
                }

            });
        }
    };


    //create landmark on map
    $scope.createLandmark = function (userLandmark) {

        if (userLandmark.length > 0) {

            userLandmark.forEach(function (lm) {

                var pos = { Longitude: lm.GeoCoordinateList[0].Longitude, Latitude: lm.GeoCoordinateList[0].Latitude };

                var landmarktype = $.grep($scope.LandmarkTypeList, function (e) {
                    return e.LandmarkTypeID === lm.LandmarkTypeID;
                });

                if (landmarktype.length > 0) {

                    var selectedLandmark = landmarktype[0];
                    var iconURL = '../../contents/images/track/map/landmarks/' + selectedLandmark.Name + '.png';
                    console.log('tes');
                    MapFactory.drawLandmarkMarkers(pos, iconURL, lm.LandmarkID, lm.Name);
                }

            });

            if (CommonFactory.getShowAllLandmarks() == false) {

                MapFactory.toggleVisibilityLandmark(false);
            }
        }
    };


    //remove landmark
    $scope.removeLandmark = function (LandmarkID) {

        MapFactory.removeLandmark(LandmarkID);

    };


    //edit landmark
    $scope.editLandmark = function (Landmark) {

        CommonFactory.createAlert('Update Landmark', 'You may now edit ' + Landmark.Name + " by dragging the icon on map to your desired location.");
        MapFactory.stopDrawing();

        $scope.EditLandmark['LandmarkID'] = Landmark.LandmarkID;
        $scope.EditLandmark['LandmarkTypeID'] = Landmark.LandmarkTypeID;
        $scope.EditLandmark['Name'] = Landmark.Name;
        $scope.EditLandmark['RadiusInMeters'] = Landmark.RadiusInMeters;
        $scope.EditLandmark['Enabled'] = Landmark.Enabled;
        $scope.EditLandmark['GeoCoordinateList'] = Landmark.GeoCoordinateList;
        MapFactory.editLandmark(Landmark.LandmarkID);
        $scope.panLandmark(Landmark);
        $scope.LandmarkEditMode = true;
    };


    //new landmark
    $scope.newLandmark = function () {

        $scope.NewLandmark['Name'] = "Landmark 1";
        $scope.NewLandmark['RadiusInMeters'] = 0;
        $scope.NewLandmark['Enabled'] = true;

        $scope.LandmarkNewMode = true;
    };



    //cancel edit landmark
    $scope.cancelEditLandmark = function (LandmarkID) {

        MapFactory.cancelEditLandmark(LandmarkID);
        $scope.LandmarkEditMode = false;

    };



    //cancel new landmark
    $scope.cancelNewLandmark = function () {

        MapFactory.stopDrawing();
        MapFactory.cancelLandmark();

        $scope.LandmarkNewMode = false;

        $scope.NewLandmark.LandmarkTypeID = $scope.LandmarkTypeList[0].LandmarkTypeID;
        $scope.landmarkText = "Start Drawing";

    };


    //pan landmark
    $scope.panLandmark = function (Landmark) {

        $scope.isClicked = Landmark.LandmarkID;
        MapFactory.panMap(Landmark.GeoCoordinateList[0].Latitude, Landmark.GeoCoordinateList[0].Longitude);
        
        MapFactory.toggleLandMark(Landmark.LandmarkID, true);
    };



    //save landmark
    $scope.saveLandmark = function (landmark) {

        $("#new-landmark-form").parsley().validate();
        if ($("#new-landmark-form").parsley().isValid()) {

            if ($scope.landmarkText == 'Clear') {

                var _confirm = confirm("Are you sure you want to save this Landmark?");

                if (_confirm) {

                    $scope.landmarknewloading = true;
                    MapFactory.stopDrawing();
                    $scope.NewLandmark['LandmarkID'] = $scope.isClicked;
                    $scope.NewLandmark['RadiusInMeters'] = 50;
                    $scope.NewLandmark['GeoCoordinateList'] = MapFactory.getGeoCoordinateList();
                    $scope.NewLandmark['Name'] = $scope.NewLandmark['Name'].replace(/\s\s+/g, ' ');

                    LandmarksFactory.addLandmark(
                        $scope.NewLandmark,
                        function (az) {

                            $scope.NewLandmark = {};
                            MapFactory.stopDrawing();

                            MapFactory.removeOverlay();

                            var landmarktype = $.grep($scope.LandmarkTypeList, function (e) {
                                return e.LandmarkTypeID === az.LandmarkTypeID;
                            });


                            var selectedLandmark = landmarktype[0];

                            var pos = { Longitude: az.GeoCoordinateList[0].Longitude, Latitude: az.GeoCoordinateList[0].Latitude };

                            var iconURL = '../../contents/images/track/map/landmarks/' + selectedLandmark.Name + '.png';

                            az.LandmarkTypeName = selectedLandmark.Name;
                            $scope.UserLandmarkList.push(az);

                            //add on total landmarks
                            $scope.TotalLandmark += 1;

                            MapFactory.removeLandmark(az.LandmarkID);
                            MapFactory.drawLandmarkMarkers(pos, iconURL, az.LandmarkID, az.Name);
                            MapFactory.toggleLandMark(az.LandmarkID, true);

                            $scope.LandmarkNewMode = false;
                            $scope.LandmarkTypeList.unshift({
                                'Name': 'Select Landmark',
                                'LandmarkTypeID': 0
                            });

                            $scope.NewLandmark.LandmarkTypeID = $scope.LandmarkTypeList[0].LandmarkTypeID;
                            
                            $scope.isClicked = az.LandmarkID;

                            CommonFactory.createAlert("Success", "Landmark added");

                            $scope.landmarknewloading = false;
                            $scope.LandmarkTypeList.shift();
                            $scope.landmarkText = "Start Drawing";
                        },
                        function (error) {

                            if (error.Message == "Exist") {

                                CommonFactory.createAlert("Error", "Landmark name is already exist,input a unique name.");

                            } else {

                                CommonFactory.createAlert("Error", "Failed to create Landmark, please try again.");
                            }

                            $scope.landmarknewloading = false;
                        });
                } else {

                    $scope.cancelNewLandmark();
                }

            } else {
                CommonFactory.createAlert('Error', 'Point a landmark on map first before saving.');
            }

        }

    };


    //delete landmark
    $scope.deleteLandmark = function (Landmark) {

        var confirmDelLm = confirm('Are you sure you want to delete this landmark?');

        if (confirmDelLm) {

            LandmarksFactory.deleteLandmark(
                Landmark.LandmarkID,
                function (res) {

                    MapFactory.removeLandmark(Landmark.LandmarkID);

                    var index = $scope.UserLandmarkList.indexOf(Landmark);

                    $scope.UserLandmarkList.splice(index, 1);
                    CommonFactory.createAlert("Success", "Landmark removed.");

                    //remove one on total landmark
                    $scope.TotalLandmark -= 1;

                },
                function (error) {

                    console.log(error.message);
                    CommonFactory.createAlert("Error", "Failed to remove Landmark, please try again.");
                });
        }
    };


    //update landmark
    $scope.updateLandmark = function () {
        $("#edit-landmark-form").parsley().validate();

        if ($("#edit-landmark-form").parsley().isValid()) {

            var landmarkList = $scope.UserLandmarkList.filter(function (l) {
                return l.LandmarkID != $scope.isClicked;
            });

            var checklandmarkList = $.grep(landmarkList, function (e) {
                return e.Name.toLowerCase().replace(/\s\s+/g, ' ') === $scope.EditLandmark.Name.toLowerCase().replace(/\s\s+/g, ' ');
            });

            var _confirm = confirm("Are you sure you want to update this Landmark?");

            if (_confirm) {

                $scope.landmarkeditloading = true;
                MapFactory.stopDrawing();

                $scope.EditLandmark['RadiusInMeters'] = 50;
                $scope.EditLandmark['GeoCoordinateList'] = MapFactory.getGeoCoordinateList();
                $scope.EditLandmark['Name'] = $scope.EditLandmark.Name.replace(/\s\s+/g, ' ');

                var landmarktype = $.grep($scope.LandmarkTypeList, function (e) {
                    return e.LandmarkTypeID === $scope.EditLandmark.LandmarkTypeID;
                });

                $scope.EditLandmark['LandmarkTypeName'] = landmarktype[0].Name;

                LandmarksFactory.updateLandmark(
                    $scope.EditLandmark.LandmarkID,
                    $scope.EditLandmark,
                    function (res) {

                        MapFactory.removeLandmark($scope.EditLandmark.LandmarkID);
                        
                        var landmarktype = $.grep($scope.LandmarkTypeList, function (e) {
                            return e.LandmarkTypeID === res.LandmarkTypeID;
                        });

                        var selectedLandmark = landmarktype[0];

                        var result = $.grep($scope.UserLandmarkList, function (e) { return e.LandmarkID == $scope.EditLandmark.LandmarkID; });

                        result[0].LandmarkTypeName = selectedLandmark.Name;

                        if (result[0]) {
                            angular.copy($scope.EditLandmark, result[0]);
                        }

                        $scope.cancelEditLandmark($scope.EditLandmark.LandmarkID);

                        $scope.EditLandmark = {};
                        
                        $scope.landmarkeditloading = false;

                        var pos = { Longitude: res.GeoCoordinateList[0].Longitude, Latitude: res.GeoCoordinateList[0].Latitude };

                        var iconURL = '../../contents/images/track/map/landmarks/' + selectedLandmark.Name + '.png';

                        MapFactory.drawLandmarkMarkers(pos, iconURL, res.LandmarkID, res.Name);
                        MapFactory.toggleLandMark(res.LandmarkID, true);

                        CommonFactory.createAlert("Success", "Landmark updated.");

                    },
                    function (error) {

                        $scope.landmarkeditloading = false;
                        CommonFactory.createAlert("Error", "Failed to update Landmark, please try again.");

                    });

            } else {
                $scope.cancelEditLandmark($scope.EditLandmark.LandmarkID);
            }


        }

    };

    

}]);