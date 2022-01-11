'use strict';
app.factory('CommonFactory', ['$http', '$localStorage', '$filter', 'MapFactory', 'MapHistoryFactory', function ($http, $localStorage, $filter, MapFactory, MapHistoryFactory) {
    var selectedAsset = "";
    var asset = [];
    var totalAsset = 0;
    var _getAssetList = {};
    var customerList = [];
    var GPSDataList = [];
    var _getStatus = '';
    var _getStatusColor = '';
    var userZoneList = [];
    var insideZoneList = [];
    var userRouteList = [];
    var _getAssetRouteList = [];
    var showAllMarkers = false;
    var showAllZones = false;
    var showAllLandmarks = false;
    var focusAsset = null;
    var clusterAllMarkers = false;
    var _getZoneAssignedAssetList = [];
    var notificationList = [];
    var isClickNotification = true;
    var notificationTypes = [];
    var alertmute = false;
    var notificationCount = 0;
    var clearMap = null;

    var isHistoryRun = false;

    var ZoneNewMode = false;
    var startTracer = false;

    var _getObjectDeliveryList = [];
    var _getCompletedDelivery = [];

    var _getUnassignedDelivery = [];
    var _getAddDeliveryMode = false;
    var _getAssetZoneList = [];

    var _setIntervalAssets = true;

    var map = document.getElementById('map-canvas');

    return {
        getObjectIconUrl: function (typeName, status) {
            return '../../contents/map/asset-marker/' + typeName + '/' + typeName + '.svg';
        },
        getAssetIconSpecifications: function (typeName, status, directionDegrees) {

            var color;

            var arrowDisplay = 'none';
            var smoke = 'none';
            var park = 'none';
            var idle = 'none';


            var iconURL = '../../contents/map/asset-marker/' + typeName + '/' + typeName + '.svg';

            var scale = (directionDegrees >= 0 && directionDegrees < 180) ? -1 : 1;
            var translate = (directionDegrees >= 0 && directionDegrees < 180) ? 100 : 0;


            var specifications = {
                translateX: translate
                , scaleX: scale
                , url: iconURL
                , arrowDisplay: arrowDisplay
                , statusColor: color
                , smoke: smoke
                , park: park
                , idle: idle
            };

            return specifications;
        },
        getHistoryMarkerIconSpecifications: function (typeName, status, directionDegrees) {

            var color;

            if (status.InActive == true) {
                color = 'rgb(136, 136, 136);';
            } if (status.Active == true) {
            } if (status.Driving == true) {
                color = '#ffcc00';//'rgb(47, 160, 90)';
            } if (status.Parking == true) {
                color = 'rgb(0, 51, 153)';
            } if (status.Idling == true) {
                color = '#F4D600';//'rgb(239, 207, 2)';
            } if (status.Overspeed == true) {
                color = 'rgb(102, 255, 102)';
            } if (status.OverIdling == true) {
                color = 'rgb(229, 157, 31)';
            } if (status.SOS == true) {
                color = 'rgb(255, 0, 0)';
            } if (status.GPSCut == true) {
                color = 'rgb(255, 0, 0)';
            } if (status.PowerCut == true) {
                color = 'rgb(255, 0, 0)';
            } if (status.EngineStop == true) {
                color = '#CC3333';//'rgb(255, 0, 0)';
            }

            var arrowDisplay = 'none';
            var smoke = 'none';
            var park = 'none';
            var idle = 'none';

            if (status.Driving === true && status.InActive === false) {
                arrowDisplay = 'block';
                smoke = 'block';
            }


            if (status.Idling === true && status.InActive === false) {
                smoke = 'block';
                idle = 'block';
            }

            if (status.Parking === true && status.InActive === false) {
                park = 'block';
            }

            var iconURL = 'http://' + window.location.host + '/trp3res/assets/' + typeName + '/' + typeName + '.gif';


            var scale = (directionDegrees >= 0 && directionDegrees < 180) ? -1 : 1;
            var translate = (directionDegrees >= 0 && directionDegrees < 180) ? 100 : 0;

            var specifications = {
                translateX: translate
                , scaleX: scale
                , url: iconURL
                , arrowDisplay: arrowDisplay
                , statusColor: color
                , smoke: smoke
                , park: park
                , idle: idle
            };

            return specifications;

        },
        getMarkerIconSpecifications: function (typeName, status, directionDegrees, speed, deliveryID) {
            var color;
            //asset truck delivery
            if (deliveryID != "" && typeName == 'Truck') {
                typeName = "Truck delivery";
            }

            if (status != undefined) {
                if (status.indexOf("Inactive") == true) {
                    color = 'rgb(136, 136, 136);';
                }
                else {
                    if (status.indexOf("Active") != -1) {
                    } if (status.indexOf("Driving") != -1) {
                        color = '#22b573';//'rgb(47, 160, 90)';
                    } if (status.indexOf("Parking") != -1 || status.indexOf("Over Park") != -1 || status.indexOf("OverPark") != -1) {
                        color = 'rgb(0, 51, 153)';
                    } if (status.indexOf("Idling") != -1) {
                        color = '#F4D600';//'rgb(239, 207, 2)';
                    } if (status.indexOf("Over Speed") == true) {
                        color = 'rgb(102, 255, 102)';
                    } if (status.indexOf("Over Idle") == true) {
                        color = 'rgb(229, 157, 31)';
                    } if (status.indexOf("SOS") == true) {
                        color = 'rgb(255, 0, 0)';
                    } if (status.indexOf("Battery Cut") == true) {
                        color = 'rgb(255, 0, 0)';
                    } if (status.indexOf("Power Cut") == true) {
                        color = 'rgb(255, 0, 0)';
                    } if (status.indexOf("Engine Stop") == true) {
                        color = '#CC3333';//'rgb(255, 0, 0)';
                    }
                }
            }


            var direction = "";
            var smoke = "";
            var assetStatus = "";

            if (status != undefined) {

                if (status.indexOf("Inactive") != -1) {
                    direction = '';
                    assetStatus = 'inactive';
                } else {
                    //if asset has alert
                    //if (status.EngineStop || status.GPSCut || status.OverIdling || status.OverSpeeding || status.SOS) {
                    //    if (status.Driving) {
                    //        assetStatus = "alert_";
                    //    } else if (status.Parking) {
                    //        assetStatus = "parking_alert";
                    //    } else if (status.Idling) {
                    //        assetStatus = "idling_alert";
                    //    }
                    //} else {
                    //    if (status.Driving) {
                    //        assetStatus = "driving_";
                    //    } else if (status.Parking) {
                    //        assetStatus = "parking";
                    //    } else if (status.Idling) {
                    //        assetStatus = "idling";
                    //    }
                    //    else {

                    //    }
                    //}

                    if ((status.indexOf("Engine Stop") != -1) || (status.indexOf("Battery Cut") != -1) || (status.indexOf("OverIdle") != -1) || (status.indexOf("OverSpeed") != -1) || (status.indexOf("OverPark") != -1) || (status.indexOf("SOS") != -1)) {
                        if (status.indexOf("Driving") != -1) {
                            assetStatus = "alert_";
                        } else if (status.indexOf("Parking") != -1 || status.indexOf("OverPark") != -1) {
                            assetStatus = "parking_alert";
                        } else if (status.indexOf("Idling") != -1 || status.indexOf("OverIdle") != -1) {
                            assetStatus = "idling_alert";
                        }
                    } else {
                        if (status.indexOf("Driving") != -1) {
                            assetStatus = "driving_";
                        } else if (status.indexOf("Parking") != -1) {
                            assetStatus = "parking";
                        } else if (status.indexOf("Idling") != -1) {
                            assetStatus = "idling";
                        } 
                   
                    }


                    if (directionDegrees <= 22.5) {
                        direction = 'N';
                    } else if (directionDegrees <= 67.5) {
                        direction = 'NE';
                    } else if (directionDegrees <= 112.5) {
                        direction = 'E';
                    } else if (directionDegrees <= 157.5) {
                        direction = 'SE';
                    } else if (directionDegrees <= 202.5) {
                        direction = 'S';
                    } else if (directionDegrees <= 247.5) {
                        direction = 'SW';
                    } else if (directionDegrees <= 292.5) {
                        direction = 'W';
                    } else if (directionDegrees <= 337.5) {
                        direction = 'NW';
                    } else {
                        direction = 'N';
                    }

                    if (!(status.indexOf("Driving") != -1))
                    {
                        if (status.indexOf("Parking") != -1 || status.indexOf("Idling") != -1 || status.indexOf("OverIdle") != -1 || status.indexOf("Overpark") != -1) {
                            direction = "";
                        }
                    }
                   
                }

            }

            var iconURL = '';
            if (assetStatus == '') {
                iconURL = $localStorage.imagesUrl_TRP + 'assets/' + typeName + '/' + typeName + '.gif';
            } else {
                iconURL = $localStorage.imagesUrl_TRP + 'assets/' + typeName + '/' + typeName + "_" + assetStatus +  direction + '.gif';
            }

            var scale = (directionDegrees >= 0 && directionDegrees < 180) ? -1 : 1;
            var translate = (directionDegrees >= 0 && directionDegrees < 180) ? 100 : 0;

            var specifications = {
                translateX: 0
                , scaleX: scale
                , url: iconURL
                , statusColor: color
            };

            return specifications;

        },
        setClearMap: function (data) {
            clearMap = data;
        },
        getClearMap: function (data) {
            return clearMap;
        },
        setNotificationCount: function (data) {
            notificationCount = data;
        },
        getNotificationCount: function () {
            return notificationCount;
        },
        setAlertMute: function (data) {
            alertmute = data;
        },
        getAlertMute: function () {
            return alertmute;
        },
        setNotificationTypes: function (data) {
            notificationTypes = data;
        },
        getNotificationTypes: function () {
            return notificationTypes;
        },
        getIsClickNotification: function () {
            return isClickNotification;
        },
        setIsClickNotification: function (data) {
            isClickNotification = data;
        },
        getIntervalAssets: function () {
            return _setIntervalAssets;
        },
        setIntervalAssets: function (data) {
            _setIntervalAssets = data;
        },
        getHistoryRun: function () {
            return isHistoryRun;
        },
        setHistoryRun: function (data) {
            isHistoryRun = data;
        },
        getZoneNewMode: function () {
            return ZoneNewMode;
        },
        setZoneNewMode: function (data) {
            ZoneNewMode = data;
        },
        setTracer: function (data) {
            startTracer = data;
        },
        getTracer: function () {
            return startTracer;
        },
        getShowAllZones: function () {
            return showAllZones;
        },
        setShowAllZones: function (data) {
            showAllZones = data;
        },
        getShowAllLandmarks: function () {
            return showAllLandmarks;
        },
        setShowAllLandmarks: function (data) {
            showAllLandmarks = data;
        },
        getFocusAsset: function () {
            return focusAsset;
        },
        setFocusAsset: function (data) {
            if (data == true) {
                MapFactory.panMarker('asset' + this.getAsset().AssetID);
            }            
            focusAsset = data;
        },
        setAsset: function (data) {
            asset = data;
        },
        getAsset: function () {            
            return asset;
        },
        setTotalAsset: function(data){
            totalAsset = data;
        },
        getTotalAsset: function(){
            return totalAsset;
        },
        setUserZoneList: function (data) {
            userZoneList = data;
        },
        getUserZoneList: function () {
            return userZoneList;
        },
        setInsideZoneList: function (data) {
            insideZoneList = data;
        },
        getInsideZoneList: function () {
            return insideZoneList;
        },
        setShowAllMarkers: function (data) {
            showAllMarkers = data
        },
        getShowAllMarkers: function () {
            return showAllMarkers;
        },
        setClusterAllMarkers: function (data) {
            clusterAllMarkers = data
        },
        getClusterAllMarkers: function () {
            return clusterAllMarkers;
        },
        setCustomerList: function (data) {
            customerList = data;
        },
        getCustomerList: function () {
            return customerList;
        },
        setGPSDataList: function (data) {
            GPSDataList = data;
        },
        getGPSDataList: function () {
            return GPSDataList;
        },
        setNotificationList: function (data) {
            notificationList = data;
        },
        getNotificationList: function () {
            return notificationList;
        },
        setAssetList: function (data) {
            _getAssetList = data
        },
        getAssetList: function () {
            return _getAssetList;
        },
        setStatus: function (data) {
            _getStatus = data;
        },
        getStatus: function () {
            return _getStatus;
        },
        setUserRouteList: function (data) {
            userRouteList = data;
        },
        getUserRouteList: function () {
            return userRouteList;
        },
        setAssetRouteList: function (data) {
            _getAssetRouteList = data;
        },
        getAssetRouteList: function () {
            return _getAssetRouteList;
        },
        setZoneAssignedAssetList: function (data) {
            _getZoneAssignedAssetList = data;
        },
        getZoneAssignedAssetList: function () {
            return _getZoneAssignedAssetList;
        },
        getStatusColor: function (status) {

            var color;

            if (status.indexOf("InActive") != -1) {
                color = 'rgb(136, 136, 136)';
            } if (status.indexOf("Driving") != -1) {
                color = '#22b573';//'rgb(47, 160, 90)';
            } if (status.indexOf("Parking") != -1) {
                color = 'rgb(0, 51, 153)';
            } if (status.indexOf("Idling") != -1) {
                color = '#ffcc00';//'rgb(239, 207, 2)';
            } if (status.indexOf("Overspeeding") != -1) {
                color = 'rgb(102, 255, 102)';
            } if (status.indexOf("Overidling") != -1) {
                color = 'rgb(229, 157, 31)';
            } if (status.indexOf("sos") != -1) {
                color = 'rgb(255, 0, 0)';
            } if (status.indexOf("Power Cut") != -1) {
                color = 'rgb(255, 0, 0)';
            } if (status.indexOf("Engine Stop") != -1) {
                color = '#CC3333';//'rgb(255, 0, 0)';
            }

            return color;
        },
        getStatusColorKML: function (status) {

            var color;


            if (status.indexOf("InActive") != -1) {
                color = 'ff828284';
            } if (status.indexOf("Active") != -1) {
            } if (status.indexOf("Driving") != -1) {
                color = 'ff73b522';
            } if (status.indexOf("Parking") != -1) {
                color = 'ff7f0000';
            } if (status.indexOf("Idling") != -1) {
                color = 'ff00d6f4';
            } if (status.indexOf("Overspeeding") != -1) {
                color = 'ff66ff66';
            } if (status.indexOf("overidling") != -1) {
                color = 'ff1f9de5';
            } if (status.indexOf("sos") != -1) {
                color = 'ff0000ff';
            } if (status.indexOf("gps cut") != -1) {
                color = 'ff0000ff';
            } if (status.indexOf("power cut") != -1) {
                color = 'ff0000ff';
            } if (status.indexOf("engine stop") != -1) {
                color = 'ff3333cc';
            }

            return color;

        },
        getMarkerStatus: function (stat, type) {

            var status = "";
            if (stat == undefined) {
                return status;
            }

            if (stat.indexOf("Driving") != -1)
            { status = "drive" };
            if (stat.indexOf("Idling") != -1)
            { status = "idle" };
            if (stat.indexOf("Parking") != -1)
            { status = "park" };
            if (stat.indexOf("overspeeding") != -1)
            { status = "alert" };
            if (stat.indexOf("overidling") != -1)
            { status = "alert" };
            if (stat.indexOf("sos") != -1)
            { status = "alert" };
            if (stat.indexOf("gps cut") != -1)
            { status = "alert" };
            if (stat.indexOf("power cut") != -1)
            { status = "alert" };
            if (stat.indexOf("Engine stop") != -1)
            { status = "alert" };
            if (stat.indexOf("InActive") != -1 && type === 'asset')
            { status = "inactive" };

            return status;
        },
        getStatusLeftBorderColor: function (status) {

            if (status != undefined) {
                if (status.indexOf("Active") != -1) {
                } if (status.indexOf("Driving") != -1) {
                    _getStatusColor = 'green-border-left';
                } if (status.indexOf("Parking") != -1) {
                    _getStatusColor = 'blue-border-left';
                } if (status.indexOf("Idling") != -1) {
                    _getStatusColor = 'yellow-border-left';
                } if (status.indexOf("Over Speed") != -1) {
                    _getStatusColor = 'red-border-left';
                } if (status.indexOf("Over Idle") != -1) {
                    _getStatusColor = 'red-border-left';
                } if (status.indexOf("SOS") != -1 ) {
                    _getStatusColor = 'red-border-left';
                } if (status.indexOf("Battery Cut") != -1) {
                    _getStatusColor = 'red-border-left';
                } if (status.indexOf("Power Cut") != -1 ) {
                    _getStatusColor = 'red-border-left';
                } if (status.indexOf("Engine Stop") != -1) {
                    _getStatusColor = 'red-border-left';
                }

                if (status.indexOf("OverIdling") != -1) {
                    _getStatusColor = 'red-border-left';
                }
                if (status.indexOf("OverSpeeding") != -1) {
                    _getStatusColor = 'red-border-left';
                }
                if (status.indexOf("Harsh Braking") != -1) {
                    _getStatusColor = 'red-border-left';
                }
                if (status.indexOf("Harsh Acceleration") != -1) {
                    _getStatusColor = 'red-border-left';
                }
              


                if (status.indexOf("Inactive") != -1) {
                    _getStatusColor = 'grey-border-left';
                }
            } else {
                _getStatusColor = 'grey-border-left';
            }

            return _getStatusColor;
        },
        setObjectDeliveryList: function (data) {
            _getObjectDeliveryList = data;
        },
        getObjectDeliveryList: function () {
            return _getObjectDeliveryList;
        },
        setCompletedDelivery: function (data) {
            _getCompletedDelivery = data;
        },
        getCompletedDelivery: function () {
            return _getCompletedDelivery;
        },
        setUnassignedDelivery: function (data) {
            _getUnassignedDelivery = data;
        },
        getUnassignedDelivery: function () {
            return _getUnassignedDelivery;
        },
        setAddDeliveryMode: function (data) {
            _getAddDeliveryMode = data;
        },
        getAddDeliveryMode: function () {
            return _getAddDeliveryMode;
        },
        setAssetZoneList: function (data) {
            _getAssetZoneList = data;
        },
        getAssetZoneList: function () {
            return _getAssetZoneList;
        },
        updateAsset: function (data) {
            var found = $filter('getAssetFromCustomerList')(customerList, data.AssetID)
            found.Name = data.Name;
            found.SIMNumber = data.SIMNumber;
            found.FuelRatio = data.FuelRatio;
            found.FuelTypeID = data.FuelTypeID;
            found.TypeID = data.TypeID;
            found.VehicleModel = data.VehicleModel;
            found.VehicleBrand = data.VehicleBrand;
        },

        createAssetIcon: function (content) {

        },

        //id: id of the marker in marker[id]
        //label: label of marker seen in map
        //content: the inner content
        //type:is it a  history or asset? used for pushing to specific gmap arrays as well
        //draggable: is it going to be draggable?
        //visible: is it going to be visible?
        //labelClass: the css class for the label design
        createMarker: function (id, label, content, type, draggable, visible, labelClass, scope) {
            var directionDegrees = parseInt(content.DirectionDegrees);
            var markerStatusType = this.getMarkerStatus(content.Status, type);
            if (content.AssetID != undefined) {

                var icon = this.getMarkerIconSpecifications(content.TypeName, content.Status, directionDegrees, content.Speed, content.Delivery)
                var markerOptions = {
                    draggable: draggable
                    , visible: visible
                    , labelClass: labelClass
                };


                markerOptions['labelAnchor'] = { x: 20, y: -20 };
                markerOptions['iconAnchor'] = { x: 50, y: 50 };
                markerOptions['iconSize'] = { x: 100, y: 100 };
                markerOptions['iconScaleSize'] = { x: 100, y: 100 };

                if (content.DeliveryCount != null) {
                    if (content.DeliveryCount > 0) {
                        content['labelContent'] = "<span class='marker-label'><div'><span><i title='Delivery' class='icon-pgps-delivery' style='font-size:13px;vertical-align:0px;position:relative;top:3px;'></i> " + label + "</span></div></span>";
                    }
                    else {
                        content['labelContent'] = "<span class='marker-label'><div'><span>" + label + "</span></div></span>";
                    }
                } else {
                    content['labelContent'] = "<span class='marker-label'><div'><span>" + label + "</span></div></span>";
                }

                var ic = {
                    url: icon.url
                            , iconScaleSize: { x: 100, y: 100 }
                            , iconSize: { x: 100, y: 100 }
                        , iconAnchor: { x: 50, y: 50 }
                };

                var markerExists = MapFactory.isMarkerExist(id);

                var filterTime = (!content.GPSTime) ? '' : content.GPSTime;
                if (markerExists === null) {

                    var marker = MapFactory.createMarker(markerOptions, content, ic, id, type, scope);
                    MapFactory.addMarker(marker, 'asset');
                    return marker;

                }
                else {
                    MapFactory.updateMarker(id, content, ic);
                    
                    return
                    
                }
            }

        },
        createHistoryMarker: function (id, label, content, type, draggable, visible, labelClass, scope) {
            var directionDegrees = parseInt(content.DirectionDegrees);
            var markerStatusType = this.getMarkerStatus(content.Status, type);
            var icon = this.getMarkerIconSpecifications(content.TypeName, content.Status, directionDegrees, content.Speed)
            var markerOptions = {
                draggable: draggable
                , visible: visible
                , labelClass: labelClass
            };

            markerOptions['labelAnchor'] = { x: 0, y: -10 };
            markerOptions['iconAnchor'] = { x: 20, y: 20 };
            markerOptions['iconSize'] = { x: 90, y: 90 };
            markerOptions['iconScaleSize'] = { x: 40, y: 30 };

            content['labelContent'] = "<span class='marker-label'><div'><i class='fa fa-circle' style='color: " + icon.statusColor + ";border: 1px solid #ffffff;border-radius: 6px;font-size:8px;margin-bottom:2px;'></i>&nbsp;<span>" + label + "</span></div></span>";


            var ic = {
                url: icon.url
                        , iconScaleSize: { x: 40, y: 30 }
                        , iconSize: { x: 90, y: 90 }
                    , iconAnchor: { x: 20, y: 20 }
            };

            var markerExists = MapHistoryFactory.isHistoryMarkerExist(id);

            var filterTime = (!content.GPSTime) ? '' : content.GPSTime;

            if (markerExists === null) {
                return MapHistoryFactory.createMarker(markerOptions, content, ic, id, type, scope);
            }
            else {
                return MapHistoryFactory.updateMarker(id, content, ic);
            }
        },

        updatePopupInfowindowMarker : function(id){
            MapFactory.updatePopupWindowMarker(id);
        },

        panMap: function (latitude, longitude) {
            MapFactory.panMap(latitude, longitude);
        },
        convertTimeZone: function (gpsTime) {
            var offset = (new Date().getTimezoneOffset() / 60) * -1;
            var gpsTime = Date.parse(gpsTime);
            var date = moment(gpsTime).utcOffset(offset).format('YYYY-MM-DD HH:mm:ss');
            return date;
        },
        getDateDifference: function (_date1, _date2) {
            var date1 = moment(_date1, 'YYYY-MM-DD');
            var date2 = moment(_date2, 'YYYY-MM-DD');
            var diffMonths = date1.diff(date2, 'months');

            var diffDays = moment.preciseDiff(_date1, _date2, 'days');

            return { months: diffMonths, days: diffDays.days };
        },
        getDateTimeDifference: function (_date1, _date2) {
            var date1 = moment(_date1, 'YYYY-MM-DD');
            var date2 = moment(_date2, 'YYYY-MM-DD');
            var diffMonths = date1.diff(date2, 'months');

            var diff = moment.preciseDiff(_date1, _date2, true);

            return diff;
        },
        getDateHourMinutesDifference: function (_date1, _date2) {
            var date1 = moment(_date1, 'YYYY-MM-DD');
            var date2 = moment(_date2, 'YYYY-MM-DD');

            var diffHours = Math.abs(new Date(_date2) - new Date(_date1)) / 36e5
            var diff = moment.preciseDiff(_date1, _date2, true);
            if (diffHours < 1) { diffHours = 0; }

            return { hours: diffHours, minutes: diff.minutes };

        },
        createAlert: function (title, message) {
            $('#alert_placeholder').show('slide');
            message = (message == null ? "Please contact your administrator for more information." : message);
            $('#alert_placeholder').html('<div class="alert alert-custom"><div class="dismiss alert-custom-header"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><span class="font-15px">' + title + '</span></div><div class="alert-custom-body"><span class="font-11px">' + message + '</span></div></div>')
            setTimeout(function () {
                $('#alert_placeholder').hide('slide');
            }, 8000);
        }
    };

}
]);

function convertimezones() {
    var offset = new Date().getTimezoneOffset();

    var date = moment(gpsTime).utcOffset(offset).format('YYYY-MM-DD HH:mm:ss');

};

