
function osmMaps() {
    var main = this;
    main.zoomLevel = 0;
    main.centerCoordinates = [0, 0];

    main.markers = [];
    main.polylines = [];
    main.circles = [];
    main.polygons = [];
    main.markerclusters = L.markerClusterGroup();
    main.historyMarkers = [];
    main.historyMarker = {};
    main.historyStartIndex = 0;

    main.selectedMarker = null;
    main.selectedOverlay = null;
    main.drawingOverlay = null;

    main.polygonsList = [];

    main.polylineNearestList = [];
    main.nearestAssetMarker = null;
    main.nearByObjects = [];
    main.markerDistanceList = [];
    main.polylineNearestList = [];
    main.landmarkMarkers = [];
    main.map = null;

    //RULER
    main.rulerMarkers = [];
    main.rulerMarkersSnap = [];
    main.rulerMarkersDistanceList = [];
    main.rulerDistance = 0;
    main.routing = null;
    main.rulerPolyline = null;
    main.rulerLabelCount = 1;

    main.rulerLine = [];
    main.rulerMarkerLimit = 99;

    //Drawer
    //main.featureGroup = L.FeatureGroup().addTo(this.map);
    //main.circleDrawer = L.Draw.Circle(this.map);

    //CREATE MAP
    main.createMap = function (_zoomLevel, _centerCoordinates, _element) {
        var newMap = new L.map(_element, {
            center: [_centerCoordinates.latitude, _centerCoordinates.longitude],
            zoom: _zoomLevel,
            markerZoomAnimation: false,
            zoomAnimation: false,
            attributionControl: false,
        });
        var mapLayer = L.tileLayer("http://a.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png", {
            attribution: ''
        });

        mapLayer.addTo(newMap);
        newMap['mapLayer'] = mapLayer;
        this.map = newMap;


        var pt = {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                "coordinates": [
          [
            -111.796875,
            47.754097979680026
          ],
          [
            -110.0390625,
            37.16031654673677
          ],
          [
            -102.3046875,
            37.16031654673677
          ],
          [
            -103.0078125,
            47.040182144806664
          ],
          [
            -90,
            46.07323062540838
          ],
          [
            -90.703125,
            34.30714385628804
          ]
                ]
            }
        };

        var buffered = turf.buffer(pt, 50, 'kilometers');

        return newMap;
    }

    main.changeMapType = function (_type) {
        var satLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        });
        switch (_type) {
            case 'Satellite':
                main.map.removeLayer(main.map.mapLayer);
                main.map.addLayer(satLayer);
                break;
            case 'Road':
                main.map.removeLayer(main.map);
                main.map.mapLayer.addTo(main.map);
                break;
            default:

        }
    }

    main.refreshMap = function () {
        main.map._onResize();
    }

    //======================================================
    //======================================================
    //===================START OF MARKERS===================
    //CREATE MARKERS
    main.createMarker = function (_options, _content, _icon, _id, _type) {
        var marker = null;
        switch (_type) {
            case "asset":
                var icon = new L.Icon({
                    iconUrl: _icon.url,
                    iconSize: [_icon.iconSize.x, _icon.iconSize.y],
                    iconAnchor: [_icon.iconAnchor.x, _icon.iconAnchor.y],
                    //labelAnchor: [_options.labelAnchor.x,_options.labelAnchor.y]
                    labelAnchor: [-85, 30]
                });

                marker = new osmMarker(
                   {
                       latitude: _content.Latitude,
                       longitude: _content.Longitude
                   },
                   _options.draggable,
                   _options.visible,
                   icon,
                   _content.labelContent,
                   _options.labelClass,
                   _id);

                marker['type'] = _type;
                marker['content'] = _content;
                marker['latitude'] = _content.Latitude;
                marker['longitude'] = _content.Longitude;
                var markerContent = _content;

                var detailsContent = {
                    starter: "<div><table class='table table-condensed table-tight'>",
                    asset: "<tr><td colspan='2' style='font-weight:900' id='iw-asset'>" + markerContent.Name + " | " + markerContent.AssetID + " </td></tr>",
                    speed: "<tr><td>Speed: </td><td id='iw-speed'>" + markerContent.Speed + " kph " + markerContent.DirectionDegrees + "°" + markerContent.DirectionCardinal + " </td></tr>",
                    location: "<tr><td>Location:</td><td id='iw-location'>" + markerContent.Location + "</td></tr>",
                    status: "<tr><td>Status: </td><td id='iw-status'>" + markerContent.Status.Description + "</td></tr>",
                    time: "<tr><td>GPSTime: </td><td id='iw-gps-time'>" + markerContent.GPSTime + "</td></tr>",
                    ender: "</table></div>"
                }

                var infowindowContent = detailsContent.starter + detailsContent.asset + detailsContent.speed + detailsContent.location + detailsContent.time + detailsContent.status + detailsContent.ender

                marker.bindPopup(infowindowContent);

                //add click listener
                marker.getLabel().on('click', function (e) {
                    if (main.selectedMarker != null) {
                        main.selectMarker(null);
                    }

                    marker.openPopup();
                });
                //marker.setIconAngle(90);
                break;
            case "history":
                marker = new osmHistoryMarker(
                      {
                          latitude: _content.Latitude
                       , longitude: _content.Longitude
                      },
                    _options.labelClass,
                    _options.labelContent,
                    _options.color,
                     parseInt(_content.DirectionDegrees),
                    [_options.labelAnchor.x, _options.labelAnchor.y],
                     _content.AssetID,
                    _content);

                marker['type'] = _type;
                marker['content'] = _content;

                var markerContent = _content;

                var infowindowContent = "<div><table class='table table-condensed'>" +
                    "<tr><td>Speed: </td><td>" + markerContent.Speed + "</td></tr>" +
                    "<tr><td>Location: </td><td>" + markerContent.Location + "</td></tr>" +
                    "<tr><td>Status: </td><td>" + markerContent.Status.Description
                + "</td></tr></table></div>";

                var infowindow = marker.bindPopup(infowindowContent);

                marker['infowindow'] = infowindow;

                marker.on('click', function (e) {
                    if (main.selectedMarker != null) {
                        main.selectMarker(null);
                    }
                    marker.openPopup();
                });

                break;
            default:

        }

        return marker;

    }

    main.createHistoryMarker = function (_options, _content, _id) {
        marker = new osmHistoryMarker(
         { latitude: _content.values.latitude, longitude: _content.values.longitude }
            , _options.labelClass
            , _content.values.label
           // , _options.color
            , { x: _options.labelAnchor.x, y: _options.labelAnchor.y }
            , _content.values.assetID);

        marker['type'] = _type;

    };

    //CLEAR HISTORY MARKERS
    main.clearHistory = function () {
        main.historyMarkers.forEach(function (h) {
            main.map.removeLayer(h);
        });

        var result = $.grep(main.polylines, function (e) { return e.type == 'history'; });

        if (result[0]) {
            main.map.removeLayer(result[0]);
        }

        main.historyMarkers = [];
        
    };

    //ADD MARKER
    main.addMarker = function (_marker) {
        switch (_marker['type']) {
            case 'asset':
                if (_marker != undefined) {
                    var res = $.grep(main.markers, function (e) { return e.options.id == _marker.options.id });
                    if (res.length === 0) {
                        main.map.addLayer(_marker);
                        main.markers.push(_marker);
                    } else {
                        main.markers.splice(main.markers.indexOf(_marker), 1);
                        main.markers.push(_marker);

                    }
                }
                break;
            case 'history':
                //_marker.addTo(main.map);
                this.historyMarkers.push(_marker);
                break;
            default:

        }

    }

    //UPDATE MARKER
    main.updateMarker = function (_id, _content, _icon) {
        var result = $.grep(this.markers, function (e) { return e.options.id == _id });
        if (result[0]) {

            var start = { latitude: result[0]._latlng.lat, longitude: result[0]._latlng.lng };
            var end = { latitude: _content.Latitude, longitude: _content.Longitude };

            var icon = new L.Icon({
                iconUrl: _icon.url,
                iconSize: [_icon.iconSize.x, _icon.iconSize.y],
                iconAnchor: [_icon.iconAnchor.x, _icon.iconAnchor.y],
                labelAnchor: [-85, 30]
            });

            result.content = _content;
            result[0].setIcon(icon);
            result[0].unbindLabel();
            result[0].bindLabel(_content.labelContent, { noHide: true, className: 'labelMarkerText', clickable: true }).showLabel();
            result[0].setLatLng([_content.Latitude, _content.Longitude]);
            result[0].getLabel().on('click', function (e) {
                if (main.selectedMarker != null) {
                    main.selectMarker(null);
                }
                result[0].openPopup();
            });
            //main.animateMarkerMovement(result[0], start, end);
            return result[0];
        }

    }

    //REMOVE MARKER
    main.removeMarker = function (_marker, _type) {

        switch (_type) {
            case 'asset':
                this.map.removeLayer(_marker);
                main.markers.splice(main.markers.indexOf(_marker), 1);
                break;
            case 'history':
                this.map.removeLayer(_marker);
                main.historyMarkers.splice(main.historyMarkers.indexOf(_marker), 1);
                break;
            default:
        }

    };

    //SET MARKER AS SELECTED MARKER
    main.selectMarker = function (_marker) {
        main.selectedMarker = _marker;
    }

    ////CHECK MARKER EXIST
    main.isMarkerExist = function (_id) {
        var result = $.grep(main.markers, function (e) { return e.options.id == _id; });
        if (result[0] != null) {
            return result[0];
        }
        return null;
    }

    //PAN MARKER
    main.panMarker = function (_id) {
        var result = $.grep(main.markers, function (e) { return e.options.id == _id });
        if (result[0] != undefined) {
            main.map.setView(new L.latLng(result[0].getLatLng()), 16);
        }
    }

    //PAN MAP
    main.panMap = function (_latitude, _longitude) {
        var pos = osmLatLng(_latitude, _longitude);
        main.map.setView(pos);
    }

    main.mapZoom = function () {
        main.map.setZoom(16);
    };

    //TOGGLER MARKER'S VISIBILITY
    main.toggleMarker = function (_id, _mode) {
        
        var result = $.grep(main.markers, function (e) { return e.options.id == _id });
        if (result[0]) {
           
            if (_mode === true) {
                main.map.addLayer(result[0]);
                result[0].options.visible = true;
            } else if (_mode === false) {
                main.map.removeLayer(result[0]);
                result[0].options.visible = false;
            }

        }
    }

    main.toggleMarkerVisibility = function (_id) {
        var result = $.grep(main.markers, function (e) { return e.options.id == "asset" + _id; });
        if (result[0] != undefined) {
            if (result[0].options.visible == false) {
                main.map.addLayer(result[0]);
                result[0].options.visible = true;
            } else {
                main.map.removeLayer(result[0]);
                result[0].options.visible = false;
            }
        }
    }

    //ANIMATE MARKER BETWEEN TWO POINTS
    main.animateMarkerMovement = function (_marker, _start, _end) {
        var deferred = $.Deferred();
        var y1 = _start.latitude;
        var x1 = _start.longitude;
        var y2 = _end.latitude
        var x2 = _end.longitude;
        ////slope
        var xt = x2 - x1;
        var yt = y2 - y1;
        var m = yt / xt;
        ////y intercept
        var b = y1 - m * x1;

        var points = [];
        for (var i = x1; i <= x2; i += 0.00001) {
            var latx = (m * i) + b;
            if (isNaN(latx) === false) {
                ////console.log('pasok');
                ////console.log(latx + ',' + i);
                var pos = osmLatLng(latx, i);
                points.push(pos);
            }
        }


        if (points.length < 1) {

            var t = osmLatLng(y2, x2);
            _marker.setLatLng(t);
            deferred.resolve(0);
            return deferred.promise();
        } else {

            var i = 0;
            function moveMarker() {
                _marker.setLatLng(points[i]);
                if (i < points.length - 1) {
                    i++;
                    setTimeout(moveMarker, 10);
                }
                else {
                    deferred.resolve(0);
                }
            }
            moveMarker();
            return deferred.promise();
        }

    }

    //STOP THE ANIMATION OF HISTORY MARKERS
    main.stopAnimateHistoryMarker = function () {
        animateHistoryMarker = false;
        main.historyMarker['startIndex'] = main.historyStartIndex;
        return main.historyMarker;
    }

    //ANIMATE THE HISTORY MARKERS
    var animateHistoryMarker = false;
    main.startAnimateHistoryMarker = function (_marker, _history) {
        main.historyMarker = _marker;

        animateHistoryMarker = true;
        main.map.removeLayer(_marker);
        _marker.addTo(main.map);
       //  //console.log(_history);
        if (_history.length > 1) {

            var i = 0;
           //  //console.log(i);
            var tempPoints = { latitude: _history[0].Latitude, longitude: _history[0].Longitude };


            function moveMarker() {
                _marker.labelContent = _history[i].content.labelContent;
                //_marker.label.draw();
                var points = osmLatLng(_history[i].Latitude, _history[i].Longitude);
                var animate = main.animateMarkerMovement(_marker, tempPoints, { latitude: _history[i].Latitude, longitude: _history[i].Longitude });

                animate.done(function (result) {
                    //_marker.label.draw();
                    main.historyMarkers.push(_history[i].historyContent);
                    _history[i].historyContent.addTo(main.map);
                    tempPoints = { latitude: _history[i].Latitude, longitude: _history[i].Longitude };

                    var timer = 10;
                    if (result === 0) {
                        timer = 1000;
                    }

                    if (i !== _history.length - 1) {
                        i++;
                        if (animateHistoryMarker === true) {
                            setTimeout(moveMarker, timer);
                        }
                        else {
                            main.historyStartIndex = i;
                        }
                    }



                    //if (i !== _history.length - 1) {
                    //    i++;
                    //   //  //console.log("move")

                    //    setTimeout(moveMarker, 1000);
                    //    //if (animateHistoryMarker === true) {
                    //    //    setTimeout(moveMarker, timer);
                    //    //}
                    //    //else {
                    //    //    main.historyStartIndex = i;
                    //    //}
                    //}

                });
            }

            moveMarker();


        }

    }
    //===================END OF MARKERS===================
    //======================================================
    //======================================================


    //======================================================
    //======================================================
    //===================START OF POLYLINE===================
    //CREATE A POLYLINE
    main.createPolyline = function (_points, _options, _id) {
        var polyline = new osmPolyline(
                _points,
                _options.strokeColor,
                _options.strokeOpacity,
                _options.strokeWeight,
                _id,
                _options.className
            );
        return polyline;
    }

    //DRAW POLYLINE
    main.drawPolyline = function (_bool, _options) {

        var featureGroup = new L.FeatureGroup().addTo(this.map);
        var polyLineDrawer = new L.Draw.Polyline(this.map);

        polyLineDrawer.options.shapeOptions.color = _options.color;
        polyLineDrawer.options.shapeOptions.weight = _options.weight;
        polyLineDrawer.options.shapeOptions.opacity = _options.opacity;

        this.map.addLayer(featureGroup);

        if (_bool == true) {
            polyLineDrawer.enable();
           //  //console.log(polyLineDrawer);
        } else {
            polyLineDrawer.disable();
        }

    }

    //ADD A POLYLINE
    main.addPolyline = function (_polyline, _type) {

        _polyline.addTo(this.map);
        _polyline['type'] = _type;
        this.polylines.push(_polyline);
    }

    //EDIT A POLYLINE
    main.editPolyline = function (_id) {
        var result = $.grep(main.polylines, function (e) { return e.options.id == _id });
        result[0].editing.enable();
    }

    //REMOVE A POLYLINE
    main.removePolyline = function (_id) {
        var result = $.grep(main.polylines, function (e) { return e.options.id == _id });
        this.map.removeLayer(result[0]);
        ////console.log(result.indexOf(result[0]));
        main.polylines.splice(main.polylines.indexOf(result[0]), 1);
        ////console.log(this.polylines);
    }

    //ADD A PATH TO THE POLYLINE
    main.addPolylinePath = function (_id, _position) {
        var result = $.grep(main.polylines, function (e) { return e.options.id == _id });
        result[0].addLatLng(L.latLng(_position.latitude, _position.longitude));
    }

    //REMOVE THE LAST PATH OF POLYLINE
    main.removePolylineLast = function (_id) {
        var result = $.grep(main.polylines, function (e) { return e.options.id == _id });
        result[0].spliceLatLngs(result[0].getLatLngs().length - 1, 1);
    }
    //======================================================
    //======================================================
    //===================END OF POLYLINE===================

    //======================================================
    //======================================================
    //===================START OF DRAWING===================
    main.startDrawing = function (_type, _options) {

        var polygonDrawer = new L.Draw.Polygon(this.map);

        main.featureGroup = new L.FeatureGroup().addTo(this.map);
        var circleDrawer = new L.Draw.Circle(this.map);
        var polylineDrawer = new L.Draw.Polyline(this.map);
        var markerDrawer = new L.Draw.Marker(this.map);

        polygonDrawer.options.shapeOptions.color = _options.strokeColor;
        polygonDrawer.options.shapeOptions.weight = _options.weight;
        polygonDrawer.options.shapeOptions.fillOpacity = 0.2;


        circleDrawer.options.shapeOptions.color = _options.strokeColor;
        circleDrawer.options.shapeOptions.weight = _options.weight;
        circleDrawer.options.shapeOptions.fillOpacity = 0.2;

        polylineDrawer.options.shapeOptions.color = _options.strokeColor;
        polylineDrawer.options.shapeOptions.opacity = _options.fillOpacity;

        this.map.addLayer(main.featureGroup);

        switch (_type) {
            case 'polygon':
                circleDrawer.disable();
                polylineDrawer.disable();
                polygonDrawer.enable();
                markerDrawer.disable();
                break;
            case 'circle':
                polygonDrawer.disable();
                polylineDrawer.disable();
                circleDrawer.enable();
                markerDrawer.disable();
                break;
            case 'polyline':
                polygonDrawer.disable();
                circleDrawer.disable();
                polylineDrawer.enable();
                markerDrawer.disable();
            case 'marker':
                polygonDrawer.disable();
                circleDrawer.disable();
                polylineDrawer.disable();
                markerDrawer.enable();
            default:

        }
        //drawing mode start
        this.map.on('draw:created', function (e) {

            var newOverlay = e.layer;
            main.selectedOverlay = newOverlay;
            main.drawingOverlay = newOverlay;
            switch (e.layerType) {
                case 'polyline':
                    newOverlay['type'] = 'polyline';
                    break;
                case 'polygon':
                    newOverlay['type'] = 'polygon';
                    var polygon = main.map.addLayer(newOverlay);
                    var latlngs = newOverlay.getLatLngs();
                    newOverlay.editing.enable();
                    polygonDrawer.disable();
                    break;
                case 'circle':
                    newOverlay['type'] = 'circle';
                    var circle = main.map.addLayer(newOverlay);
                    var latlng = newOverlay.getLatLng();
                    newOverlay.editing.enable();
                    circleDrawer.disable();
                    break;
                case 'marker':
                    newOverlay['type'] = 'marker';
                    var marker = main.map.addLayer(newOverlay);
                    var latlng = newOverlay.getLatLng();
                    var icon = new L.Icon({
                        iconUrl: _options.icon,
                        iconSize: [35,35]
                    });
                    newOverlay.setIcon(icon);
                    newOverlay.dragging.enable();
                    markerDrawer.disable();
                default:
            }

            newOverlay['id'] = null;

        });

        this.map.on('draw:editvertex', function (e) {

        });

    }

    main.stopDrawing = function () {
        var polygonDrawer = new L.Draw.Polygon(this.map);
        var circleDrawer = new L.Draw.Circle(this.map);
        polygonDrawer.disable();
        circleDrawer.disable();
        console.log(main.drawingOverlay);
        if (main.drawingOverlay != null) {
            main.map.removeLayer(main.drawingOverlay);
        }
    };
    //======================================================
    //======================================================
    //===================END OF DRAWING===================


    //======================================================
    //======================================================
    //===================START OF POLYGON===================
    //DRAW POYLGON
    main.drawPolygon = function (bool) {
        var featureGroup = new L.FeatureGroup().addTo(this.map);
        var polygonDrawer = new L.Draw.Polygon(this.map);
        if (bool == true) {
            polygonDrawer.enable();
            polygonDrawer.options.shapeOptions.color = 'red';
           //  //console.log(polygonDrawer);
        } else {
            polygonDrawer.disable();
        }

        this.map.on('draw:created', function (e) {
            var points = e.layer.toGeoJSON();
            var points = points.geometry.coordinates;
            points = points.reverse();
            var polygonPoints = [];
            points.forEach(function (f) {
                f.forEach(function (i) {
                    polygonPoints.push(reverseArr(i));
                });
            });
           //  //console.log(polygonPoints);
            var polygon = main.drawZone(polygonPoints, {
                color: 'red',
                weight: 5,
                opacity: 0.5,
                className: 'polygon'
            }, 0);
            polygon.editing.enable();
            main.addPolygon(polygon);
        });

    }

    main.removeOverlay = function () {
        console.log(main.selectedOverlay);
        if (main.selectedOverlay != null) {
           main.map.removeLayer(main.selectedOverlay);
        }
    }

    //CREATE A ZONE
    main.createPolygon = function (_type, _points, _options, _id, _assignedAssetList) {
        var zone = null;

        var result = {};
        result = $.grep(main.polygons, function (e) { return e.options.id == _id; });

        if (result.length === 0) {
            switch (_type) {
                case 'polygon':
                    zone = new osmPolygon(
                      _points,
                      _options.color,
                      _id);
                    //marker = new osmZoneMarker()
                    zone['type'] = 'polygon';
                    break;
                case 'circle':
                    zone = new osmCircle(
                    _points[0],
                    _options.radius,
                    _options.color,
                     _id
                    );
                    zone['type'] = 'circle';
                    break;
                default:
            }
        } else {
            return result[0];
        }
        zone['assignedAssetList'] = _assignedAssetList;
        return zone;
    }

    //ADD A POLYGON
    main.showPolygon = function (_id, _show) {
        var result = $.grep(main.polygons, function (e) { return e.options.id == _id });
        if (_show === false) {
            main.map.removeLayer(result[0]);
        }
        else {
            main.map.addLayer(result[0]);
        }
    }

    //TOGGLE ZONE
    main.toggleVisibilityPolygon = function (_show) {
        main.polygons.forEach(function (p) {
            if (_show === false) {
                main.map.removeLayer(p);
            }
            else {
                main.map.addLayer(p);
            }
        });
    }

    //ADD A POLYGON
    main.addPolygon = function (_zone) {
       if (main.isPolygonExists(_zone.options.id) === null) {
           main.polygons.push(_zone);
        }

    }
    main.isPolygonExists = function (_id) {
        var result = {};
        result = $.grep(main.polygons, function (e) { return e.options.id === _id; });
        //console.log(result);
        if (result.length !== 0) {
            return result[0];
        } else {
            return null;
        }
    }

    //CHECK POLYGON EXIST
    main.isPolygonExist = function (_id) {
 
    }

    //EDIT A POLYGON
    main.editPolygon = function (_id, _type) {
        var result = {};
        result = $.grep(main.polygons, function (e) { return e.options.id == _id; });
        if (result.length > 0) {
            result[0].editing.enable();
            main.selectedOverlay = result[0];
        }

    }

    //CANCEL EDIT A ZONE
    main.cancelEditPolygon = function (_id, _type) {
        if (main.selectedOverlay != null && _id == null) {
            main.selectedOverlay.editing.disable();
        }
        var result = $.grep(main.polygons, function (e) { return e.options.id == _id });
        if (result.length > 0) {
            result[0].editing.disable();
            main.selectedOverlay = null;
        }

    }

    //REMOVE A POLYGON
    main.removePolygon = function (_id) {

        if (main.selectedOverlay != null && _id == 0) {
            main.map.removeLayer(main.selectedOverlay);
        }
        var result = $.grep(main.polygons, function (e) { return e.options.id == _id; });
        if (result.length > 0) {
            main.polygons.splice(main.polygons.indexOf(result[0]), 1);
            main.map.removeLayer(result[0]);
        }


    }

    ////CHECK POLYGON EXIST
    main.isPolygonExist = function (_id) {
        var result = $.grep(main.polygons, function (e) { return e.options.id == _id; });
        if (result[0] != null) {
            return true;
        }
        return false;
    }

    //PAN A POLYGON
    main.panPolygon = function (_id) {
        var result = $.grep(main.polygons, function (e) { return e.options.id == _id });
        var _zone = result[0];
        switch (_zone['type']) {
            case 'polygon':
                var result = $.grep(main.polygons, function (e) { return e.options.id == _id });
                this.map.fitBounds(result[0].getBounds());
                break;
            case 'circle':
                var result = $.grep(main.polygons, function (e) { return e.options.id == _id });
                this.map.fitBounds(result[0].getBounds());
        }


    }

    main.getPolygonPath = function (_zone) {
        var latlngArray = [];
        switch (_zone['type']) {
            case 'polygon':
                _zone._latlngs.forEach(function (e) {
                    latlngArray.push({ "Latitude": e.lat, "Longitude": e.lng });
                });
                break;
            case 'circle':
                latlngArray.push({ "Latitude": _zone._latlng.lat, "Longitude": _zone._latlng.lng });
                break;
            case 'marker':
                latlngArray.push({ "Latitude": _zone.getLatLng().lat, "Longitude": _zone.getLatLng().lng });
            default:

        }
       //  //console.log(latlngArray);
        return latlngArray;
    };

    main.getZoneArea = function (_zone) {
        var area = 0;
       //  //console.log(_zone);
        switch (_zone['type']) {
            case 'polygon':
                area = L.GeometryUtil.geodesicArea(_zone.getLatLngs());
                break;
            case 'circle':
                var radius = _zone.getRadius();
                area = (radius * radius) * Math.PI;
                break;
            default:

        }
    }

    //NEAREST ASSET MARKER
    main.nearestAssetModeOff = function () {
        main.map.off('click');
        main.polylineNearestList.forEach(function (m) {
            main.map.removeLayer(m);
            main.polylineNearestList = [];
        });
        main.map.removeLayer(main.nearestAssetMarker);
        main.nearByObjects = [];
    };

    main.nearestAssetModeOn = function (_event, _limit) {
        main.map.off('click');

        main.nearestAssetMarker = new osmNearestAssetMarker(_event.latlng, main.map);
        main.getNearestAsset(_event.latlng, _limit);

        return main.nearestAssetMarker;
    };

    main.nearestMapDragEnd = function (_event, _limit) {
        if (main.nearestAssetMarker) {
            main.polylineNearestList.forEach(function (m) {
                main.map.removeLayer(m);
                main.polylineNearestList = [];
            });
        }
        main.getNearestAsset(_event, _limit);

        return main.nearByObjects;
    };

    main.getNearestAsset = function (_point, _limit) {
        main.nearByObjects = [];
        main.markerDistanceList = [];
        main.markers.forEach(function (m) {
            var distance = main.computeDistance(m.getLatLng(), _point);
            main.markerDistanceList.push({
                assetID: m.options.id, distance: distance.toFixed(2), coordinates: m.getLatLng(), latitude: m.getLatLng().lat, longitude: m.getLatLng().lng, content: m.content
            });
        });

        main.markerDistanceList.sort(function (a, b) {
            return (a.distance - b.distance);
        });

        //distance label
        var nearbyLabel = new L.marker(_point, {
            draggable: false,
            visible: true,
            id: this.id,
        });
        var count = 0;
        main.markerDistanceList.forEach(function (m) {

            count += 1;
            if (count < 11 && m.distance <= _limit) {
                var clist = [];
                clist.push(_point);
                clist.push(m.coordinates);

                var t = main.createPolylineNearBy(clist);
                t.addTo(main.map);
                main.polylineNearestList.push(t);



                //polyline mouseover
                t.on('mouseover', function (e) {
                    nearbyLabel.setLatLng(e.latlng);
                    e.target.setStyle({dashArray:'10,10',weight:5});
                    var icon = L.divIcon({ html: m.distance + "&nbsp;m", className: 'nearest-asset-label' });
                    nearbyLabel.setIcon(icon);
                    nearbyLabel.addTo(main.map);
                });

                //polyline mouseout
                t.on('mouseout', function (e) {
                    main.map.removeLayer(nearbyLabel);
                    e.target.setStyle({weight: 10,dashArray:'0,0' });
                });

                main.nearByObjects.push(m);
            }

        });

        return main.nearByObjects;
    }

    main.createPolylineNearBy = function (_points) {
        var polyline = new osmNearestPolyline(
            _points,
            '#2378A3',
            0.65,
            3);
        return polyline;
    };

    main.computeDistance = function (_p1, _p2) {
        var distance = _p1.distanceTo(_p2);

        return distance;
    };
    //END OF NEAREST ASSET MARKERS

    main.createPoint = function (_latitude, _longitude) {
        var point = { lat: _latitude, lng: _longitude };
        return point;
    }

    main.updateZoneColor = function (_color) {
       //  //console.log(main.selectedOverlay);
    }

    main.isZone = function (_zoneID, _zoneTypeID, _asset) {
        var result = [];
        var position = { Latitude: _asset.Latitude, Longitude: _asset.Longitude };
        result = $.grep(main.polygons, function (e) { return e.options.id == _zoneID; });
        var res;
        if (result.length > 0) {
            switch (_zoneTypeID) {
                case 1:
                    var isOverSpeed;
                    res = main.checkAssetInsideZone(position, result[0]);
                    if (res == true) {
                        if (_asset.Speed > result[0].SpeedLimit) {
                            isOverSpeed = true;
                        } else {
                            isOverSpeed = false;
                        }
                    }
                    return { isInsideZone: res, isOverSpeed: isOverSpeed };
                    break;
                case 2:
                    var isOverSpeed;
                    position = osmLatLng(position.Latitude, position.Longitude);
                    res = position.distanceTo(osmLatLng(result[0]._latlng.lat, result[0]._latlng.lng)) <= result[0].getRadius();
                    if (res == true) {
                        if (_asset.Speed > result[0].SpeedLimit) {
                            isOverSpeed = true;
                        } else {
                            isOverSpeed = false;
                        }
                    }
                    return { isInsideZone: res, isOverSpeed: isOverSpeed };
                    //return res;
                    break;
                default:
                    return false;
                    break;
            }
        }

    }

    main.checkAssetInsideZone = function (position, poly) {
        //console.log(position);
        if (poly) {
            var inside;
            var polygons = $.grep(main.polygons, function (e) { return e.type == 'polygon'; });
            polygons.some(function (f, s) {
                if (inside == true) {
                    inside = true;
                } else {
                    inside = false;
                    var polyPoints = f.getLatLngs();
                    var x = position.Latitude, y = position.Longitude;

                    //Ray Casting algorithm - search google
                    for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {

                        var xi = polyPoints[i].lat, yi = polyPoints[i].lng;
                        var xj = polyPoints[j].lat, yj = polyPoints[j].lng;

                        var intersect = ((yi > y) != (yj > y))
                            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                        if (intersect) inside = !inside;
                    }
                }

            });
            return inside;
        }
    };

    //======================================================
    //======================================================main.markerCluster
    //===================START OF MARKERCLUSTER===================
    //CREATEMARKERCLUSTER
    main.markerCluster = function (bool) {
        var that = this;
        main.map.addLayer(main.markerclusters);
        main.markerclusters.clearLayers();
        if (bool == true) {
            main.markers.forEach(function (e) {
                main.map.removeLayer(e);
                main.markerclusters.addLayer(e);
            });
        } else {
            main.markers.forEach(function (e) {
                e.addTo(that.map);
                if (e.options.visible == false) {
                    main.map.removeLayer(e);
                }
            });
        }
    }
    //======================================================
    //======================================================
    //===================END OF MARKERCLUSTER===================

    //START OF LANDMARKS
    main.drawLandmarkMarkers = function (_position, _icon, _id) {
        var marker = new osmLandmarkMarker(_position, _icon, _id);
        main.map.addLayer(marker);
        console.log(marker);
        main.landmarkMarkers.push(marker);
    }

    main.removeLandmark = function (_id) {
        var result = $.grep(main.landmarkMarkers, function (e) { return e.options.id == _id; });
        if (result[0] != undefined) {
            main.map.removeLayer(result[0]);
            main.landmarkMarkers.splice(main.landmarkMarkers.indexOf(result[0]), 1);
        }
    }

    main.cancelLandmark = function () {
        if (main.selectedOverlay['type'] === 'marker') {
            main.map.removeLayer(main.selectedOverlay);
        }
    }

    main.editLandmark = function (_id) {
        console.log(main.landmarkMarkers);
        var result = $.grep(main.landmarkMarkers, function (e) { return e.id == _id; });

        result[0].dragging.enable();
        //console.log(result[0].getLatLng());
        result[0].on('dragend', function (e) {
            //console.log(e.target.getLatLng());
            result[0].setLatLng(e.target.getLatLng());
            //console.log(result[0]);
            result[0]['type'] = 'marker';
            main.selectedOverlay = result[0];
        });
    }

    main.toggleVisibilityLandmark = function (_show) {
        if (_show === true) {
            main.landmarkMarkers.forEach(function (m) {
                m.setStyle({ opacity: 1 });
            });
        } else {
            main.landmarkMarkers.forEach(function (m) {
                m.setStyle({ opacity: 0 });
            });
        }
    }

    //END OF LANDMARKS


    //START OF MAP RULER
    main.snapToRoadOn = function () {
        // Snapping Layer
        snapping = new L.geoJson(null, {
            style: {
                opacity: 0
              , clickable: false
            }
        }).addTo(main.map);

        router = function (m1, m2, cb) {
            //var proxy = 'http://www2.turistforeningen.no/routing.php?url=';
            var route = 'http://www.yournavigation.org/api/dev/route.php?format=geojson&v=motorcar&fast=1&layer=mapnik&instructions=1';
            var params = '&flat=' + m1.lat + '&flon=' + m1.lng + '&tlat=' + m2.lat + '&tlon=' + m2.lng;
            //$.getJSON(proxy + route + params, function (geojson, status) {
            //  $.getJSON(route + params, function (geojson, status) {

            //      console.log(geojson);
            //    //console.log(geojson.properties.distance);
            //    main.rulerDistance = geojson.properties.distance;
            //    if (!geojson || !geojson.coordinates || geojson.coordinates.length === 0) {
            //        if (typeof console.log === 'function') {
            //            //console.log('OSM router failed', geojson);
            //        }
            //        return cb(new Error());
            //    }
            //    return cb(null, L.GeoJSON.geometryToLayer(geojson));
            //});
            $.ajax({
                url: route + params,
                type: "GET",
                dataType: "json",
                success: function (geojson) {
                    console.log(geojson);
                    main.rulerDistance = geojson.properties.distance;
                        if (!geojson || !geojson.coordinates || geojson.coordinates.length === 0) {
                            if (typeof console.log === 'function') {
                                //console.log('OSM router failed', geojson);
                            }
                            return cb(new Error());
                        }
                        return cb(null, L.GeoJSON.geometryToLayer(geojson));
                }
            })
        }

        main.routing = new L.Routing({
            position: 'topleft'
              , routing: {
                  router: router
              }
              , snapping: {
                  layers: []
              }
              , snapping: {
                  layers: [snapping]
                , sensitivity: 15
                , vertexonly: false
              }
                    });
         main.map.addControl(main.routing);

         main.routing.draw();

       

    };
    main.buff = null;
    main.getRulerSnapData = function (e,f) {
        main.rulerPolyline = main.routing.toPolyline();
    
        main.rulerPolyline.forEach(function (p) {
            p.setStyle({ color: '#e65c00' });
        });

        var latlngs = [];

        if (main.buff != null) {
            main.map.removeLayer(main.buff);
        }

        if (main.routing.toGeoJSON().coordinates.length > 0) {
           
            var pt = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": main.routing.toGeoJSON().coordinates
                }
            };
            //var buffered = turf.buffer(pt, 50, 'meters');
            //main.buff = L.geoJson(buffered);

            ////L.geoJson(pt).addTo(main.map);
            //main.buff.addTo(main.map);
        }
        

        var points = main.routing.getWaypoints();
        main.rulerMarkersDistanceList = [];

        var rulerMarkerSnapLabel = new L.marker([51.5, -0.09], {
            draggable: false,
            visible: true,
        });

        main.map.removeLayer(rulerMarkerSnapLabel);

        main.rulerMarkersSnap = main.routing.getAllMarkers();        

        var j = 0;
        for (var i = 0; i < main.rulerMarkersSnap.length; i++) {
            if (i > 0) {
                j = i - 1;
            }
            distance = main.computeDistance(main.rulerMarkersSnap[j].getLatLng(), main.rulerMarkersSnap[i].getLatLng());
            main.rulerMarkersSnap[i]['distance'] = distance === 0 ? 0 : distance.toFixed(3);
            //console.log("distance: " + distance);
            main.rulerMarkersDistanceList.push({ latitude: main.rulerMarkersSnap[i].getLatLng().lat.toFixed(3), longitude: main.rulerMarkersSnap[i].getLatLng().lng.toFixed(3), marker: main.rulerMarkersSnap[i], rulerlength: distance===0 ? 0 : distance.toFixed(3) });

        }

        main.rulerMarkersSnap.forEach(function (m) {
            //console.log(m.distance);
            m.on('mouseover', function (l) {
                rulerMarkerSnapLabel.setLatLng(l.latlng);
                var icon = L.divIcon({ html: m.distance + "&nbsp;m", className: 'ruler-marker-label-distance' });
                rulerMarkerSnapLabel.setIcon(icon);
                rulerMarkerSnapLabel.addTo(main.map);
            });

            m.on('mouseout', function (l) {
                main.map.removeLayer(rulerMarkerSnapLabel);
            });

        });

        return main.rulerMarkersDistanceList;
    };

    main.done = 0;
    main.straightRulerOn = function (_event) {
        var evtPos = _event.latlng;
            if (main.done == 0) {
                main.rulerLine = new osmRulerPolyline(
                    main.map
                    , '#e65c00'
                    , 3
                    , 2);
                main.rulerLine.setStyle({ color: "#e65c00",opacity:1,weight:3 });
                main.done++;
            }
           
            if (main.rulerMarkers.length > main.rulerMarkerLimit) {
                return;
            }
            markerlength = main.rulerMarkers.length + 1;

            var marker = new osmRulerMarker(main.map,evtPos,markerlength);

            for (var i = 0 ; i <= main.rulerMarkers.length; i++) {
                marker.setLatLng(evtPos);

            }

            main.rulerMarkers.push(marker);

            main.drawPath();

            return marker;
    };

    main.drawPath = function () {
        var coords = [];
        var distances = [];
        var j = 0;

        main.rulerMarkerDistanceList = [];

        for (var i = 0; i < main.rulerMarkers.length; i++) {
            if (j > 0) {
                j = i - 1;
            }
            coords.push(main.rulerMarkers[i].getLatLng());
            markerDistance = main.computeDistance(main.rulerMarkers[j].getLatLng(), main.rulerMarkers[i].getLatLng());
            main.rulerMarkers[i]['distance'] = markerDistance;
            distances.push(main.rulerMarkers[i]['distance']);

            j = 1;
            var newrm = new main.rulerMarker(i + 1, markerDistance, main.rulerMarkers[i].getLatLng().lat.toFixed(4), main.rulerMarkers[i].getLatLng().lng.toFixed(4), main.rulerMarkers[i]);

            main.rulerMarkerDistanceList.push(newrm);

            main.rulerMarkers.forEach(function (m) {
                m.bindLabel(m.distance, { noHide: true }).showLabel();
            });

        }

        main.rulerLine.setLatLngs(coords);

    }

    main.deleteRulerMarker = function (_marker) {

        var i = main.rulerMarkers.length - 1;
        //console.log("length: " + i);
        //console.log(_marker.getLatLng());
        //console.log(main.rulerMarkers[i].getLatLng());
        if (_marker.getLatLng() == main.rulerMarkers[i].getLatLng()) {
            main.map.removeLayer(_marker);
            main.rulerMarkers.splice(main.rulerMarkers.indexOf(_marker), 1);
            main.drawPath();
        } else {
        }
        //main.countMarkers();
    };

    main.countMarkers = function () {
        count = 0;
        for (var i = main.rulerMarkers.length - 1; i >= 0; i--) {
            if (main.rulerMarkers[i] == null) {
                main.rulerMarkers.splice(i, 1);
            } else {
                count++;


            }
        }
        return count;
    }

    main.rulerMarker = function (name, rulerlength, latitude, longitude, m) {
        this.name = name;
        this.rulerlength = rulerlength;
        this.latitude = latitude;
        this.longitude = longitude;
        this.m = m
    };

    main.rulerOff = function () {
        if (main.routing != null) {
            main.routing.draw(false);
        }
        main.rulerMarkers.forEach(function (m) {
            main.map.removeLayer(m);
        });
        main.rulerMarkersSnap.forEach(function (m) {
            main.map.removeLayer(m);
        });
        if (main.rulerPolyline != null) {
            main.rulerPolyline.forEach(function (p) {
                main.map.removeLayer(p);
            });
        }
        if (main.buff != null) {
            main.map.removeLayer(main.buff);
            main.buff = null;
        }
        if (main.rulerLine.length != 0) {
            main.map.removeLayer(main.rulerLine);
        }
        main.rulerMarkersSnap = [];
        main.rulerMarkers = [];
        main.rulerMarkersDistanceList = [];
        main.rulerLabelCount = 1;
        main.done = 0;
        main.map.off('click');
    }
    //END OF MAP RULER


    //DEVIATION
    main.isDeviating = function () {
        return { isDeviating: false, isOverspeed: false };
    }

}


function reverseArr(input) {
    var ret = new Array;
    for (var i = input.length - 1; i >= 0; i--) {
        ret.push(input[i]);
    }
    return ret;
}


function osmLatLng(_latitude, _longitude) {
    return new L.LatLng(_latitude, _longitude);
}
