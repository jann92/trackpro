'use strict';
app.factory('MapFactory', ['$http', '$localStorage', '$filter', '$rootScope', 'AssetInformationFactory', function ($http, $localStorage, $filter, $rootScope, AssetInformationFactory) {
    var baseUrl = "../";
    //var omap = new osmMaps();
    var gmap = new googleMaps();
    var cmap = gmap;
    var pt = null;
    var nearByObjects = [];
    var measureRouteObjects = [];
    var routeObjects = [];
    var currentMap = 'cmap';
    var mainColor = '#22B573';

    if ($localStorage.defaultCoordinates_TRP != null || $localStorage.defaultCoordinates_TRP != undefined)
    {
        var defaultCoordinates = $localStorage.defaultCoordinates_TRP.split(',');
    }
    else
    {
        var defaultCoordinates = '';
    }

    return {
        getCurrentMap: function () {
            return currentMap;
        },
        setCurrentMap: function (_currentMap) {
            if (_currentMap === "gmap") {
                cmap = gmap;
            }
            //else {
            //    cmap = omap;
            //}
            currentMap = _currentMap;
        },
        getMap: function () {
            return cmap;
        },
        getNearByObjects: function () {
            return nearByObjects;
        },
        setNearByObjects: function (data) {
            nearByObjects = data;
        },
        getMeasureRouteObjects: function () {
            return measureRouteObjects;
        },
        setMeasureRouteObjects: function (data) {
            measureRouteObjects = data;
        },
        getRouteObjects: function () {
            return cmap.routeData;
        },
        setRouteObjects: function (data) {
            routeObjects = data;
        },
        getNewRouteObjects: function(){
            return cmap.newRouteData;
        },
        refreshMap: function () {
            gmap.refreshMap();
            omap.refreshMap();
        },
        createMap: function (element_id) {
            return cmap.createMap(5, { latitude: defaultCoordinates[0], longitude: defaultCoordinates[1] }, element_id);
        },
        createOSMMap: function (element_id) {
            //return omap.createMap(10, { latitude: defaultCoordinates[0], longitude: defaultCoordinates[1] }, element_id);
        },
        createTracerMarker: function (options, content, icon, id, type) {

            var marker = cmap.createTracerMarker(options, content, icon, id, type);
            return marker;

        },
        createMarker: function (options, content, icon, id, type, scope) {
            var markerChecker = cmap.isMarkerExist(id);
            if (markerChecker == null) {
                var marker = cmap.createMarker(options, content, icon, id, type, scope);

                google.maps.event.addListener(marker, 'click', function (event) {
                    var that = this;
                    AssetInformationFactory.getAssetGPSPopupInformation(this['content'].AssetID, function (res) {
                        res.GPSTime = convertTimeZone(res.GPSTime);
                       
                        $rootScope.$emit("setAsset", res.AssetID); 

                        if (cmap.selectedMarker != null) {
                            if (cmap.selectedMarker['infowindow']) {
                                that['isInfoWindowOpen'] = false;
                                cmap.selectedMarker['infowindow'].close();
                            }
                            cmap.selectMarker(null);
                        }

                        var markerContent = res;

                        var lastreportstatus = markerContent.Status.LastReport;
                        if (lastreportstatus != null) {
                            lastreportstatus = "(Last Report: " + markerContent.Status.LastReport + ")";
                        }
                        else {
                            lastreportstatus = "";
                        }

                        if (marker.ContentDelivery == "") {
                            marker.ContentDelivery = "No Delivery";
                        }
                        var detailsContent = {
                            starter: "<div><table class='table table-condensed table-tight'>",
                            asset: "<tr><td colspan='2' style='font-weight:900' id='iw-asset'>" + markerContent.Name + " | " + markerContent.AssetID + "</td></tr>",
                            speed: "<tr><td class='width-25-percent'>Speed: </td><td id='iw-speed' class='width-75-percent'>" + markerContent.Speed + " kph " + markerContent.DirectionDegrees + "°" + markerContent.DirectionCardinal + " </td></tr>",
                            status: "<tr><td class='width-25-percent'>Status: </td><td id='iw-status' class='width-75-percent'>" + markerContent.Status + "&nbsp;" + lastreportstatus + "</td></tr>",
                            time: "<tr><td class='width-25-percent'>Time:</td><td id='iw-gps-time' class='width-75-percent'><span>" + markerContent.GPSTime + "</span></td></tr>",
                            driver: "<tr id='iw-driver'><td class='width-30-percent'>Driver:</td><td>" + markerContent.Driver + " </td></tr>",
                            delivery: "<tr><td class='width-30-percent'>Delivery:</td><td><a style='cursor:pointer;' id='asset_delivery'>" + markerContent.Delivery + "</a></td></tr>",
                            button: "<tr><td colspan='5' class='right-align'>"
                                + "<div id='asset_focus' title='Asset Focus' class='btn btn-default pop-up-button'><i class='fa fa-crosshairs pop-up-icon' style='color:"+mainColor+" !important'></i><span class='pop-up-label'>Focus</span></div>&nbsp;&nbsp;"
                                + "<div id='show_info' title='View Info' class='btn btn-default pop-up-button'><i class='icon icon-pgps-asset-info pop-up-icon info' style='color:"+mainColor+" !important'></i><span class='pop-up-label'>Info</span></div>&nbsp;&nbsp;"
                                + "<div id='start_trace' title='Start Trace' class='btn btn-default pop-up-button'><i class='icon icon-pgps-asset-tracer pop-up-icon info' style='color: "+mainColor+" !important'></i><span class='pop-up-label'>Tracer</span></div>&nbsp;&nbsp;"
                                 + "<div id='asset_history' title='Asset History' class='btn btn-default pop-up-button'><i class='fa fa-history pop-up-icon' style='color:"+mainColor+" !important'></i><span class='pop-up-label'>History</span></div>&nbsp;&nbsp;"
                                + "<div id='new_zone' title='Create Zone' class='btn btn-default pop-up-button'><i class='icon icon-pgps-zone pop-up-icon info' style='color:"+mainColor+" !important'></i><span class='pop-up-label'>Zones</span></div>",
                            ender: "</table></div>"
                        }

                   
                        //if  user not have role delivery
                        if (marker.scope.isDelivery != true) {
                            detailsContent.delivery = "";
                        }

                        var infowindowContent = detailsContent.starter + detailsContent.asset + detailsContent.speed + detailsContent.time + detailsContent.status + detailsContent.driver + detailsContent.delivery + detailsContent.button + detailsContent.ender

                        var infowindow = new google.maps.InfoWindow({ content: infowindowContent });

                        marker['infowindow'] = infowindow;

                        marker.scope.newZone = function () {
                            $(".right-side-panel-menu-item").removeClass('side-panel-menu-item-active active-icon');
                            $('.right-side-content-container').hide("slide");
                            $("#rspmi-zones").addClass('side-panel-menu-item-active active-icon');
                            var target = $('#rspmi-zones').attr('data-slidetoggle');
                            $('#' + target).show("slide");
                            if (cmap.selectedOverlay != null) {
                                cmap.selectedOverlay.setMap(null);
                            }
                            var circle = new google.maps.Circle({
                                map: cmap.map,
                                radius: 500,    // 10 miles in metres
                                fillColor: '#000',
                                editable: true,
                                id: 0
                            });
                            circle['type'] = "circle";
                            circle['ZoneTypeID'] = 2;
                            circle.setOptions({ zIndex: 99999 });
                            circle.setCenter(marker.getPosition());
                            cmap.selectedOverlay = circle;
                            marker.scope.ZoneInfoWindowMode = true;
                        }

                        marker.scope.traceVehicle = function () {
                            $('.left-side-panel-menu-item').removeClass('side-panel-menu-item-active active-icon');
                            $('.left-side-content-container').hide("slide");
                            $('#lspmi-asset-tracer').addClass('side-panel-menu-item-active active-icon');
                            $('#asset-tracer').show("slide");
                        }

                        google.maps.event.addListenerOnce(infowindow, 'domready', function () {
                            $("#new_zone").click(function () {
                                marker.scope.newZone();
                                if (!marker.scope.ZoneNewMode) {
                                    marker.scope.ZoneNewMode = true;
                                } else {
                                    marker.scope.ZoneNewMode = false;
                                }
                            });

                            $("#start_trace").click(function () {
                                marker.scope.traceVehicle();
                                if (!marker.scope.autoTrace) {
                                    marker.scope.autoTrace = true;
                                } else {
                                    marker.scope.autoTrace = false;
                                }
                            });

                            $("#show_info").click(function () {
                               
                                $(".right-side-panel-menu-item").removeClass('side-panel-menu-item-active active-icon');
                                $('.right-side-content-container').hide("slide");
                                $("#rspmi-asset-information").addClass('side-panel-menu-item-active active-icon');
                                var target = $('#rspmi-asset-information').attr('data-slidetoggle');
                                $('#' + target).show("slide");
                            });

                            $("#asset_focus").click(function () {
                                marker.scope.assetFocus = markerContent.AssetID;
                                $("#focusAssetMap").click();
                            });

                            $("#asset_history").click(function () {
                                $(".right-side-panel-menu-item").removeClass('side-panel-menu-item-active active-icon');
                                $('.right-side-content-container').hide("slide");
                                $("#rspmi-asset-history").addClass('side-panel-menu-item-active active-icon');
                                var target = $('#rspmi-asset-history').attr('data-slidetoggle');
                                $('#' + target).show("slide");
                            });

                            $("#asset_delivery").click(function () {
                                $(".asset-info-nav li.active").removeClass('active');
                                $(".asset-info-nav li:last-child").addClass('active');
                                $(".asset-info-tab-content .tab-pane").removeClass('active');
                                $(".tab-content #delivery-tab").addClass('active');
                                $(".right-side-panel-menu-item").removeClass('side-panel-menu-item-active active-icon');
                                $('.right-side-content-container').hide("slide");
                                $("#rspmi-asset-information").addClass('side-panel-menu-item-active active-icon');
                                var target = $('#rspmi-asset-information').attr('data-slidetoggle');
                                $('#' + target).show("slide");
                            });
                        });


                        cmap.selectMarker(that);
                        that['infowindow'] = infowindow;
                        that.infowindow.open(cmap.map, that);
                        that['isInfoWindowOpen'] = true;


                    },
                        function (error) {
                            console.log(error.message);
                        });

                });

                return marker;
            }
            else {
                return markerChecker;
            }
          
        },
        createPointMarker: function (_latitude,_longitude) {
            cmap.createPointMarker(_latitude, _longitude);
        },
        showTraffic: function (show) {
            cmap.showTraffic(show);
        },
        isMarkerExist: function (id) {
            return cmap.isMarkerExist(id);
        },
        isHistoryMarkerExist: function (id) {
            return cmap.isHistoryMarkerExist(id);
        },
        addMarker: function (marker, type) {
            var m = cmap.addMarker(marker, type);
            return m;
        },
        updateMarker: function (id, content, icon) {
            return cmap.updateMarker(id, content, icon);
        },
        updatePopupWindowMarker: function (id) {
            if (cmap.isMarkerInfoWindowOpen("asset"+id))
            {
                AssetInformationFactory.getAssetGPSPopupInformation(id, function (res) {
                    res.GPSTime = convertTimeZone(res.GPSTime);
                    cmap.updatePopupWindowMarker(res);
                }, function (error) {

                });
            }
        },
        removeMarker: function (id, type) {
            cmap.removeMarker(id, type);
        },
        animateHistoryMarker: function (marker, points) {
            cmap.startAnimateHistoryMarker(marker, points);
        },
        stopAnimateHistoryMarker: function () {
            return cmap.stopAnimateHistoryMarker();
        },
        showMarker: function (id, mode) {
            cmap.toggleMarker(id, mode);
        },
        toggleMarker: function (id) {
            cmap.toggleMarker(id);
        },
        toggleMarkerVisibility: function (id) {
            cmap.toggleMarkerVisibility(id);
        },
        panMarker: function (id) {
            cmap.panMarker(id);
        },
        panMap: function (latitude, longitude) {
            cmap.panMap(latitude, longitude);
        },
        mapZoom: function () {
            cmap.mapZoom();
        },
        setZoom: function (_zoom) {
            console.log(_zoom);
            cmap.setZoom(_zoom);
        },
        startDrawing: function (type, options) {
            cmap.startDrawing(type, options);
        },
        toggleAllMarkers: function (visible) {
            cmap.toggleAllMarkers(visible);
        },
        toggleLandMark: function(id,visible){
            cmap.toggleLandMark(id,visible);
        },
        toggleAllMarkerLabels: function () {
            cmap.markers.forEach(function (m) {
                cmap.toggleMarkerLabel(m['id']);
            });
        },
        clearHistory: function () {
            cmap.clearHistory();
        },
        markerCluster: function (cluster) {
            cmap.markerCluster(cluster);
        },
        zoneCluster: function(cluster){
            cmap.polygonCluster(cluster);
        },
        stopDrawing: function () {
            cmap.stopDrawing();
        },
        createPolygon: function (type, points, options, id, assignedAssetList, speedLimit) {
            return cmap.createPolygon(type, points, options, id, assignedAssetList, speedLimit)
        },
        addPolygon: function (polygon) {
            cmap.addPolygon(polygon);
        },
        showPolygon: function (polygon, show) {
            cmap.showPolygon(polygon, show);
        },
        showGeoJSON: function (_id, _show) {
            cmap.showGeoJson(_id, _show);
        },
        toggleVisibilityPolygon: function (show) {
            //cmap.toggleVisibilityPolygon(show);
        },
        toggleRoute: function (show) {
            cmap.toggleRoute(show);
        },
        editPolygon: function (polygon_id) {
            cmap.editPolygon(polygon_id);
            return cmap.selectedOverlay;
        },
        checkIfAllPolygonIsInsideMap: function(){
            return cmap.checkIfPolygonsInsideMap();
        },
        isInsideZone: function (zoneID, zoneTypeID, asset) {
            var zone = cmap.isZone(zoneID, zoneTypeID, asset);
            if (zone != undefined) {
                var isInsideZone = zone.isInsideZone;
                if (isInsideZone != undefined) {
                    return isInsideZone;
                } else {
                    return false;
                }
            }
        },
        isOverSpeedInZone: function (zoneID, zoneTypeID, asset) {
            var zone = cmap.isZone(zoneID, zoneTypeID, asset);
            if (zone != undefined) {
                return (zone.isOverSpeed);
            }
        },
        emptyPolygon: function () {
            cmap.emptyPolygon();
        },
        cancelEditPolygon: function (polygon_id) {
            cmap.cancelEditPolygon(polygon_id);
        },
        removePolygon: function (polygon_id) {
            cmap.removePolygon(polygon_id);
        },
        panPolygon: function (polygon_id) {
            cmap.panPolygon(polygon_id);
        },
        loadGeoJSONZone: function(_json){
            return cmap.loadGeoJson(_json);
        },
        toggleGeoJSONZone: function(_show){
            return cmap.toggleGeoJson(_show);
        },
        panGeoJSONZone: function(_id){
            return cmap.panPolygonGeoJson(_id);
        },
        addPolygonGeoJSON: function (_data) {
            cmap.addPolygonGeoJSON(_data)
        },
        removeGeoJSON: function (_id) {
            cmap.removePolygonGeoJSON(_id);
        },
        editGeoJSONZone: function (_id) {
            return cmap.editPolygonGeoJson(_id);
        },
        updateGeoJSONZone: function(){
            return cmap.updatePolygonGeoJSON(cmap.selectedOverlay);
        },
        cancelEditGeoJSONZone: function(){
            return cmap.cancelEditPolygonGeoJSON()
        },
        isPolygonGeoJSONExist: function(_id){
           return cmap.isPolygonGeoJSONExist(_id);
        },
        getGeoCoordinateList: function () {
            //return cmap.getPolygonPath(cmap.selectedOverlay);
            return cmap.getPolygonJSONPath(cmap.selectedOverlay);
        },
        getCircleCenter: function () {
            return cmap.getCircleCenter(cmap.selectedOverlay);
        },
        createPoint: function (latitude, longitude) {
            return cmap.createPoint(latitude, longitude);
        },
        getZoneArea: function () {
            //return cmap.getZoneArea(cmap.selectedOverlay);
            return cmap.getZoneJSONArea(cmap.selectedOverlay);
        },
        editColorPolygonGeoJson: function(id, color){
            cmap.editColorPolygonGeoJson(id, color);
        },
        updateZoneColor: function (zoneID,color) {
            cmap.updateZoneColor(zoneID,color);
        },
        updateGeoJSONColor: function(_data){
            cmap.updateGeoJSONColor(_data);
        },
        getCircleRadiusFromArea: function (area) {
            return Math.sqrt(area / Math.PI);
        },
        createPolyline: function (points, options, id) {
            return cmap.createPolyline(points, options, id);
        },
        addPolyline: function (polyline, type) {
            return cmap.addPolyline(polyline, type);
        },
        removePolyline: function (id) {
            cmap.removePolyline(id);
        },
        changeMapType: function (type) {
            cmap.changeMapType(type);
        },
        placeSearch: function (element) {
            cmap.placeSearch(element);
        },
        createAlert: function (title, message, type) {
            var icon = '<i class="fa fa-info-circle"></i>&nbsp;';
            if (type === "danger") {
                icon = '<i class="fa fa-exclamation-triangle"></i>&nbsp;';
            }
            else if (type === "success") {
                icon = '<i class="fa fa-check-circle alert-icon"></i>&nbsp;';
            }
            else if (type === "info") {
                icon = '<i class="fa fa-refresh fa-spin alert-icon"></i>&nbsp;';
            }
            $('#alert_placeholder').show('slide');
            message = (message == null ? "Please contact your administrator for more information." : message);
            $('#alert_placeholder').html('<div class="alert alert-' + type + ' alert-dismissable alert-custom"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><span class="alert-title">' + icon + title + '</span><hr/><span class="alert-message">' + message + '</span></div>')
            setTimeout(function () {
                $('#alert_placeholder').hide('slide');
            }, 10000);
        },
        nearestAssetModeOn: function (_limit,_scope) {
            var nearbyasset = this;

            google.maps.event.addListener(cmap.map, 'click', function (event) {

                var nearestMarker = cmap.nearestAssetModeOn(event, _limit);

                nearbyasset.setNearByObjects(cmap.nearByObjects);
                _scope.$apply();
                google.maps.event.addListener(nearestMarker, 'dragend', function (event) {

                    var nearby = cmap.nearestMapDragEnd(event, _limit);
                    nearbyasset.setNearByObjects(cmap.nearByObjects);
                    _scope.$apply();
                });
            });

        },
        drawLandmarkMarkers: function (position, icon, id, label) {
            cmap.drawLandmarkMarkers(position, icon, id, label);
        },
        removeLandmark: function (id) {
            cmap.removeLandmark(id);
        },
        cancelLandmark: function () {
            cmap.cancelLandmark();
        },
        cancelEditLandmark: function(_id){
            cmap.cancelEditLandmark(_id);
        },
        editLandmark: function (id) {
            cmap.editLandmark(id);
        },
        toggleVisibilityLandmark: function (show) {
            cmap.toggleVisibilityLandmark(show);
        },
        nearestAssetModeOff: function () {
            var nearbyasset = this;
            cmap.nearestAssetModeOff();
            //nearbyasset.setNearByObjects(cmap.nearByObjects);
        },
        straightRulerOn: function (_scope) {
            var that = this;

            switch (currentMap) {
                case 'gmap':
                    google.maps.event.addListener(gmap.map, 'click', function (event) {
                        console.log(_scope);
                        var marker = cmap.straightRulerOn(event,_scope);
                        var evtPos = event.latLng;

                        that.setMeasureRouteObjects(gmap.rulerMarkerDistanceList);
                        _scope.$apply();

                        google.maps.event.addListener(marker, 'drag', function (event) {
                            gmap.rulerDistanceLabel.setMap(null);
                            var rulStr = true;
                            gmap.drawPath(rulStr);
                            marker.markerLabel.bindTo('position', marker, 'position');

                            that.setMeasureRouteObjects(gmap.rulerMarkerDistanceList);
                            _scope.$apply();
                        });
                        google.maps.event.addListener(marker, 'dblclick', function (event) {
                            gmap.deleteRulerMarker(marker, marker.markerLabel, evtPos, _scope);
                            gmap.rulerDistanceLabel.setMap(null);

                            that.setMeasureRouteObjects(gmap.rulerMarkerDistanceList);
                            _scope.$apply();
                        });
                    });
                    break;
                case 'omap':
                    cmap.map.on('click', function (event) {
                        var marker = cmap.straightRulerOn(event);
                        that.setMeasureRouteObjects(cmap.rulerMarkerDistanceList);
                        marker.on('drag', function (event) {
                            cmap.drawPath();
                            that.setMeasureRouteObjects(cmap.rulerMarkerDistanceList);
                        });

                        marker.on('dblclick', function (event) {
                            cmap.deleteRulerMarker(marker);
                            that.setMeasureRouteObjects(cmap.rulerMarkerDistanceList);
                        });

                    });
                    break;
                default:
            }

        },
        snapToRoadOn: function (_scope) {
            var that = this;
            switch (currentMap) {
                case 'gmap':
                    google.maps.event.addListener(cmap.map, 'click', function (event) {
                        var marker = cmap.snapToRoadOn(event, 10);
                        that.setMeasureRouteObjects(cmap.rulerMarkerDistanceList);
                        _scope.$apply();
                        cmap.rulerMarkers.forEach(function (m) {
                            google.maps.event.addListener(m, 'dragend', function () {
                                cmap.updateSegment(m);
                                that.setMeasureRouteObjects(cmap.rulerMarkerDistanceList);
                                _scope.$apply();
                            });
                            google.maps.event.addListener(m, 'dblclick', function (event) {
                                var delSnap = 1;
                                cmap.deleteRulerMarkerSnap(m, m.markerLabel, event, delSnap);
                                if (cmap.myLabel != undefined) {
                                    cmap.myLabel.setMap(null);
                                }
                                that.setMeasureRouteObjects(cmap.rulerMarkerDistanceList);
                                _scope.$apply();
                            });
                        });
                    });
                    break;
                case 'omap':
                    cmap.snapToRoadOn();
                    omap.routing.on('routing:routeWaypointEnd', function (e, f) {
                        omap.getRulerSnapData(e, f);
                        that.setMeasureRouteObjects(omap.rulerMarkersDistanceList);
                    });
                    break;
                default:
            }
        },
        rulerOff: function () {
            var that = this;
            switch (currentMap) {
                case 'gmap':
                    cmap.rulerOff();
                    that.setMeasureRouteObjects([]);
                    break;
                case 'omap':
                    cmap.rulerOff();
                    that.setMeasureRouteObjects([]);
                    break;
                default:
            }
        },
        traceAssetOn: function (obj) {
            cmap.traceAssetOn(obj);
        },
        traceAssetOff: function () {

        },
        routeOn: function () {
            var that = this;
            switch (currentMap) {
                case 'gmap':
                    google.maps.event.addListener(cmap.map, 'click', function (e) {
                        cmap.routeOn(e);
                        cmap.routeMarkers.forEach(function (m) {
                            google.maps.event.addListener(m, 'dragend', function () {
                                cmap.updateSegmentRoute(m, cmap.routeLine);
                            });
                        });
                        //google.maps.event.clearListeners(cmap.map, 'click');
                    });
                    break;
                case 'omap':
                    break;
                default:
            }
        },
        routeOff: function () {
            cmap.routeOff();
        },
        createRoute: function (data) {
            cmap.createRoute(data);
        },
        editRoute: function (_id, _type) {
            //cmap.editRoute(data);
            cmap.newEditRoute(_id, _type);
            return cmap.selectedOverlay;
        },
        cancelEditRoute: function (id) {
            cmap.cancelEditRoute(id);
        },
        removeRoute: function (_id) {
            cmap.removeRoute(_id);
        },
        isDeviating: function (RouteID, asset) {
            return cmap.isDeviating(RouteID, asset).isDeviating;
        },
        isOverSpeedInRoute: function (RouteID, asset) {
            return cmap.isDeviating(RouteID, asset).isOverspeed;
        },
        panRoutePolyline: function (_id) {
            cmap.panRoutePolyline(_id);
        },
        toggleVisibilityRoute: function (show) {
            cmap.toggleVisibilityRoute(show);
        },
        showRoute: function (_id, show) {
            cmap.showRoute(_id, show);
        },
        getMarkers: function () {
            return cmap.markers;
        },
        removeOverlay: function () {
            cmap.removeOverlay();
        },
        exportToKML: function (_list, _type) {
            var result = cmap.exportToKML(_list, _type);
           return result;
        },
        startNewRoute: function (_mode, _type) {
            cmap.NewRoute(_mode, _type);
        },
        pinMarker: function (_pos) {
            cmap.pinMarkerToMap(_pos);
        },
        removePinMarker() {
            cmap.removePinMarker();
        }
    };

    function  convertTimeZone(gpsTime) {
        var offset = (new Date().getTimezoneOffset() / 60) * -1;
        var gpsTime = Date.parse(gpsTime);
        var date = moment(gpsTime).utcOffset(offset).format('YYYY-MM-DD HH:mm:ss');
        return date;
    }
}
]);

