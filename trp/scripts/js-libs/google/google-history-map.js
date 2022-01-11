function googleHistoryMaps() {
    var main = this;

    main.zoomLevel = 0;
    main.centerCoordinates = null;
    main.mapDomElement = null;
    main.markers = [];
    main.polylines = [];
    main.polygons = [];
    main.historyMarkers = [];
    main.drawingManger = null;
    main.selectedMarker = null;
    main.drawShapes = [];
    main.selectedOverlay = null;
    main.markerClusterer = null;
    main.historyMarker = {};
    main.historyStartIndex = 0;
    main.geometryJSON = null;

    //DATA LAYER
    main.zoneLayer = new google.maps.Data();
    main.markerLayer = new google.maps.Data();

    //Service Direction google map
    main.service = new google.maps.DirectionsService();
    main.directionRenderer = new google.maps.DirectionsRenderer();

    //CREATE A MAP INSTANCE
    main.createMap = function (_zoomLevel, _position, _element) {
        this.zoomLevel = _zoomLevel;
        this.centerCoordinates = new google.maps.LatLng(_position.latitude, _position.longitude)

        var mapOptions = {
            zoom: this.zoomLevel,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM,
                style: google.maps.ZoomControlStyle.SMALL
            },
            //styles: [{ "featureType": "landscape.natural", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#e0efef" }] }, { "featureType": "poi", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "hue": "#1900ff" }, { "color": "#c0e8e8" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "lightness": 100 }, { "visibility": "simplified" }] }, { "featureType": "road", "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit.line", "elementType": "geometry", "stylers": [{ "visibility": "on" }, { "lightness": 700 }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#7dcdcd" }] }],
            center: this.centerCoordinates,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            }
        };

        var newMap = new google.maps.Map(document.getElementById(_element), mapOptions);
        this.map = newMap;

        main.drawingManger = new google.maps.drawing.DrawingManager({
            drawingMode: null,
            drawingControl: false,
            drawingControlOptions: {
                position: google.maps.ControlPosition.BOTTOM_LEFT,
                drawingModes: null,
            },
            polylineOptions: {
                fillColor: null,
                strokeColor: null,
                strokeWeight: null,
                fillOpacity: null,
                clickable: false,
                editable: true,
                draggable: true,
            },
            polygonOptions: {
                fillColor: null,
                strokeColor: null,
                strokeWeight: null,
                fillOpacity: null,
                clickable: false,
                editable: true,
                draggable: true,
            },
            map: this.map
        });

        //drawing mode start
        google.maps.event.addListener(main.drawingManger, 'overlaycomplete', function (e) {
            main.stopDrawing();
            var newOverlay = e.overlay;
            newOverlay.setOptions({ editable: true, draggable: true });

            switch (e.type) {
                case google.maps.drawing.OverlayType.POLYGON:
                    newOverlay['type'] = 'polygon';
                    break;
                case google.maps.drawing.OverlayType.CIRCLE:
                    newOverlay['type'] = 'circle';
                    break;
                case google.maps.drawing.OverlayType.MARKER:
                    newOverlay['type'] = 'marker';
                    break;
                default:
            }
            newOverlay['id'] = 0;
            main.selectedOverlay = newOverlay;
        });

        //removes if drawing mode changed.. (e.g) polygon changed to polyline..
        google.maps.event.addListener(main.drawingManger, "drawingmode_changed", function () {
            if (main.drawingManger.getDrawingMode() != null) {
                for (var i = 0; i < main.drawShapes.length; i++) {
                    shapes[i].setMap(null);
                }
                main.drawShapes = [];
            }
        });


        main.zoneLayer.setMap(newMap);
        main.markerLayer.setMap(newMap);


        main.map.addListener('bounds_changed', function (e) {
            if (main.map.getZoom() >= 16) {
                main.zoneLayer.revertStyle();
                main.zoneLayer.setStyle(function (feature) {
                        return {
                            visible: true,
                            fillColor: feature.getProperty('color'),
                            strokeColor: feature.getProperty('color'),
                            strokeWeight: 2,
                            clickable: false,
                            zIndex: 1,
                        }
                  
                });


                main.markerLayer.setStyle(function (feature) {

                    if (main.map.getBounds().contains(feature.getGeometry().get())) {

                        return {
                            icon: " ",
                            label: {
                                color: "black",
                                fontSize: "12px",
                                fontWeight: "bold",
                                text: feature.getProperty('title')
                            },
                            visible: true
                        }

                    } else {

                        return { visible: false }

                    }

                });

            } else {

                main.markerLayer.setStyle({ visible: false });

                main.zoneLayer.setStyle({ visible: false });


            }
        });


        return newMap;
    }


    //======================================================
    //======================================================
    //===================START OF MARKERS===================
    //OPTIONS {draggable,visible,labelClass}
    //VALUE {labelContent,otherValues}
    //CREATE A NEW INSTANCE OF MARKER
    main.createMarker = function (_options, _content, _icon, _id, _type) {

        marker = new googleMarker(
                    {
                        latitude: _content.Latitude
                        , longitude: _content.Longitude
                    }
                    , _options.draggable
                    , _options.visible
                    , _options.labelClass
                    , _content.labelContent
                    , { x: _options.labelAnchor.x, y: _options.labelAnchor.y }
                    , _icon
                    , _id
                    , _content
                   , { x: _icon.iconAnchor.x, y: _icon.iconAnchor.y }
                   , { x: _icon.iconSize.x, y: _icon.iconSize.y }
                   , { x: _options.iconScaleSize.x, y: _options.iconScaleSize.y });

        marker['type'] = _type;


        return marker;
    };

    main.createHistoryMarker = function (_options, _content, _icon, _id, _type, _scope) {
        marker = new googleHistoryMarker(
            {
                latitude: _content.Latitude
               , longitude: _content.Longitude
            }
            , _options.labelClass
            , _content.labelContent
            , _options.color
            , parseInt(_content.DirectionDegrees)
            , { x: _options.labelAnchor.x, y: _options.labelAnchor.y }
            , _content.AssetID
            , _content);

        marker['type'] = _type;
        marker['trackID'] = _id;
        marker['scope'] = _scope;
        //add click listener
        google.maps.event.addListener(marker, 'click', function () {
            var that = this;
            
            if (main.selectedMarker != null) {
                if (main.selectedMarker['infowindow']) {
                    this['isInfoWindowOpen'] = false;
                    main.selectedMarker['infowindow'].close();
                }
                main.selectMarker(null);
            }

            this.setVisible(true);

            var markerContent = this['content'];

            var infowindowContent = "<div style='height:80px;overflow-x:hidden;'><table class='table table-condensed'>" +
                 "<tr '><td style='font-size:11px;padding:1px;'>GPSTime: </td><td style='font-size:11px;padding:1px;'>" + markerContent.GPSTime + "</td></tr>" +
                 "<tr><td style='font-size:11px;padding:1px;'>Speed (kph): </td><td style='font-size:11px;padding:1px;'>" + markerContent.Speed + "</td></tr>" +
                 //"<tr><td style='font-size:11px;padding:1px;'>Location: </td><td style='font-size:11px;padding:1px;'>" + markerContent.Location + "</td></tr>" +
                 "<tr><td style='font-size:11px;padding:1px;'>Status: </td><td style='font-size:11px;padding:1px;'>" + markerContent.Status
            + "<i class='icon icon-pgps-zone infowindow-buttons create-zones' title='Create Zone' id='new_zone' style='float:right;'><span class='infowindow-label'>Zones</span></i>";
            + "</td></tr></table></div>";

            var infowindow = new google.maps.InfoWindow({ content: infowindowContent });

            google.maps.event.addListenerOnce(infowindow, 'domready', function () {
                $("#new_zone").click(function () {
                    $(".right-side-panel-menu-item").removeClass('side-panel-menu-item-active active-icon');
                    $('.right-side-content-container').hide("slide");
                    $("#rspmi-zones").addClass('side-panel-menu-item-active active-icon');
                    var target = $('#rspmi-zones').attr('data-slidetoggle');
                    $('#' + target).show("slide");

                    if (main.selectedOverlay != null) {
                        main.selectedOverlay.setMap(null);
                    }

                    var circle = new google.maps.Circle({
                        map: main.map,
                        radius: 500,    // 10 miles in metres
                        fillColor: '#000',
                        editable: true,
                        id: 0
                    });
                    circle['type'] = "circle";
                    circle['ZoneTypeID'] = 2;
                    circle.setOptions({ zIndex: 99999 });
                    circle.setCenter(that.getPosition());
                    main.selectedOverlay = circle;
                    if (!marker.scope.ZoneNewMode) {
                        marker.scope.ZoneNewMode = true;
                    } else {
                        marker.scope.ZoneNewMode = false;
                    }

                });
            });

            main.selectMarker(this);
            this['infowindow'] = infowindow;
            this.infowindow.open(main.map, this);
            this['isInfoWindowOpen'] = true;
        });
        main.markers.push(marker);
        return marker;
    };

    //UPDATE A MARKER POSITION

    //UPDATE A MARKER POSITION
    main.updateMarker = function (_id, _content, _icon) {
        var result = {};

        result = $.grep(main.historyMarkers, function (e) { return e.id == _id; });


        if (result[0]) {
            //20160620
            main.markerCluster2(false);
            var start = { latitude: result[0].getPosition().lat(), longitude: result[0].getPosition().lng() };
            var end = { latitude: _content.Latitude, longitude: _content.Longitude };

            var icon = {
                url: _icon.url,
                // This marker is 20 pixels wide by 32 pixels high.
                scaledSize: new google.maps.Size(_icon.iconSize.x, _icon.iconSize.y),
                // The origin for this image is (0, 0).
                origin: new google.maps.Point(0, 0),
                // The anchor for this image is the base of the flagpole at (0, 32).
                anchor: new google.maps.Point(_icon.iconAnchor.x, _icon.iconAnchor.y)
            };
            result[0].icon = icon;
            result[0].labelContent = _content.labelContent;
            result[0].label.draw();
            result[0]['content'] = _content;
            main.animateMarkerMovement(result[0], start, end);
            return result[0];
        }
    }

    //CHECK MARKER EXIST
    main.isHistoryMarkerExist = function (_id) {

        var result = $.grep(main.historyMarkers, function (e) { return e.id == _id; });
        if (result[0] != null) {
            return result[0];
        }
        return null;
    }

    //PAN A MARKER
    main.panMarker = function (_history) {
        var result = {};
        result = $.grep(main.markers, function (e) { return e.trackID === _history.TrackID; });
        if (result[0] != undefined) {
            result[0].setMap(main.map);
            google.maps.event.trigger(result[0], 'click');
            main.map.setCenter(result[0].getPosition());
            main.map.setZoom(20);
        }
    }

    //PAN POLYLINE HISTORY
    main.panPolyline = function () {
        var bounds = new google.maps.LatLngBounds();
        var points = main.polylines[0].line.getPath().getArray();
        for (var n = 0; n < points.length ; n++) {
            bounds.extend(points[n]);
        }
        main.map.fitBounds(bounds);
    }

    //PAN MAP
    main.panMap = function (_latitude, _longitude) {
        var pos = glatlng(_latitude, _longitude);
        main.map.setCenter(pos);
        main.map.setZoom(16);
    }

    main.createGooglePoint = function (_latitude, _longitude) {
        var point = glatlng(_latitude, _longitude);
        return point;
    }

    //CLEAR ALL MAP OVERLAYS FOR HISTORY
    main.clearHistory = function () {
        main.historyMarkers.forEach(function (h) {
            h.setMap(null);
        });

        var result = $.grep(main.polylines, function (e) { return e.type == 'history'; });

        if (result[0]) {
            result[0].line.setMap(null);
        }
        main.historyMarkers = [];
    }

    //ADD A MARKER TO THE MAP
    main.addMarker = function (_marker, _type) {
        _marker.setMap(main.map);
        main.historyMarkers.push(_marker);
    }

    //REMOVE A MARKER FROM THE MAP
    main.removeMarker = function (_marker, _type) {
        switch (_type) {
            case 'asset':
                _marker.setMap(null);
                main.markers.splice(main.markers.indexOf(_marker), 1);
                break;
            case 'history':
                _marker.setMap(null);
                main.historyMarkers.splice(main.historyMarkers.indexOf(_marker), 1);


                break;
            default:
        }
    }

    //SET MARKER AS SELECTED MARKER
    main.selectMarker = function (_marker) {
        main.selectedMarker = _marker;
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
        for (var i = x1; i <= x2; i += 0.0001) {
            var latx = (m * i) + b;
            if (isNaN(latx) === false) {
                var pos = glatlng(latx, i);
            }
            points.push(pos);
        }

        if (points.length < 2) {
            //_marker.setPosition(glatlng(y2, x2));
            deferred.resolve(0);
            return deferred.promise();
        } else {

            var i = 0;
            function moveMarker() {

                //_marker.setPosition(points[i]);
                _marker.setOptions({ zIndex: 999999 });
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
        main.historyMarker.setMap(null);
        return main.historyMarker;
    }

    //ANIMATE THE HISTORY MARKERS
    var animateHistoryMarker = false;
    main.startAnimateHistoryMarker = function (_marker, _history) {
        main.historyMarker = _marker;
        main.panPolyline();
        animateHistoryMarker = true;

        _marker.setMap(main.map);
        _marker.setVisible(false);
        main.map.setCenter(_marker.getPosition());
        if (_history.length > 1) {

            var i = main.historyStartIndex;
            var tempPoints = { latitude: _history[0].Latitude, longitude: _history[0].Longitude };
            function moveMarker() {
                //_marker.setIcon(_history[i].icon);

                //_marker.label.draw();

                var points = glatlng(_history[i].Latitude, _history[i].Longitude);

                var animate = main.animateMarkerMovement(_marker, tempPoints, { latitude: _history[i].Latitude, longitude: _history[i].Longitude });

                animate.done(function (result) {
                    //_marker.label.draw();
                    main.historyMarkers.push(_history[i].historyContent);
                    _history[i].historyContent.setVisible(false);

                    _history[i].historyContent.setMap(main.map);
                    tempPoints = { latitude: _history[i].Latitude, longitude: _history[i].Longitude };

                    var timer = 1;
                    if (result === 0) {
                        timer = 10;
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

                });
            }

            moveMarker();


        }

    }

    main.animateHistoryMarkerDefault = function (polyline) {
        var count = 0;
        var speed = 100;
        //console.log(polyline.getPath().b.length);
        window.setInterval(function () {
            count = (count + 1) % 200;

            var icons = polyline.get('icons');
            icons[0].offset = (count / 2) + '%';
            polyline.set('icons', icons);
        }, speed);
    };

    //===================END OF MARKERS===================
    //======================================================
    //======================================================


    //======================================================
    //======================================================
    //===================START OF POLYLINE===================

    //DRAW A POLYLINE
    main.drawPolyline = function (_bool, _options) {
        var polylineOptions = main.drawingManger.get('polylineOptions');
        polylineOptions.fillColor = _options.fillColor;
        polylineOptions.strokeColor = _options.strokeColor;
        polylineOptions.fillOpacity = _options.fillOpacity;
        if (_bool == true) {
            main.drawingManger.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
        } else {
            main.drawingManger.setDrawingMode(null);
        }
    };

    //OPTIONS {strokeColor, strokeOpacity, strokeWeight, position{longitude,latitude}}
    //ADD A POLYLINE

    main.segments = [];

    main.addSegmentHistory = function (start, end, segIdx) {
        main.markerDistanceList = [];
        main.service.route(
            {
                origin: start,
                destination: end,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            },
            function (result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    main.segments[segIdx] = result;
                    //main.rulerLine.setPath(main.getSegmentsPathHistory());
                }
            }
        );
    }


    main.getSegmentsPathHistory = function (_pointlen) {
        var a, c, arr = [];
        //if (z) { var len = main.rulerMarkers.length - z; } else { len = main.rulerMarkers.length; }
        var len = _pointlen;
        for (c = 0; c < len; c++) {
            a = main.segments[c];

            if (a && a.routes) {
                arr = arr.concat(a.routes[0].overview_path);
            }
        }
        return arr;
    };
    

    main.waypointsList = [];
    main.waypoints = [];

    //main.addWayPoint = function (_point) {
    //    if (main.waypointsList.length > 8) {
    //        var temp = [];
    //        temp.push(main.waypointsList[0]);
    //        temp.push(main.waypointsList[7]);
    //        temp.push(_point);
    //        main.waypointsList = temp;
    //    } else {
    //        main.waypointsList.push(_point);
    //    }
    //}

    main.createPolyline = function (_points, _options, _id, _marker) {
        var directionsDisplay = new google.maps.DirectionsRenderer();

        //_points.forEach(function (p,idx) {
        //    if (idx < 21)
            
        //    main.waypointsList.push({
        //        location: p,
        //        stopover: true
        //    });


        //});
        //var j = 23;
        //var c = 0;
        //for (var i = 0 ; i < main.waypointsList.length; i++)
        //{
        //    if (i === j) {
        //        j = i + 23;
        //        c++;
        //    }

        //    if (i < j) {
                
        //        main.waypoints[c].push(main.waypointsList[i]);
            
        //        main.service.route(
        //         {
        //             origin: main.waypoints[c][0],
        //             destination: main.waypoints[c][main.waypoints[c].length - 1],//_points[_points.length - 1],
        //             travelMode: google.maps.DirectionsTravelMode.DRIVING,
        //             optimizeWaypoints: true,
        //             waypoints: main.waypoints[c]
        //         },
        //         function (result, status) {
        //             if (status == google.maps.DirectionsStatus.OK) {
        //                 directionsDisplay.setDirections(result);
        //             }
        //         }
        //         );
        //    }



        //}

        //main.service.route(
        //     {
        //         origin: _points[0],
        //         destination: _points[_points.length - 1],
        //         travelMode: google.maps.DirectionsTravelMode.DRIVING,
        //         optimizeWaypoints: true,
        //         waypoints: main.waypointsList
        //     },
        //     function (result, status) {
        //         if (status == google.maps.DirectionsStatus.OK) {
        //             directionsDisplay.setDirections(result);
        //             //main.segments[segIdx] = result;
        //         }
        //     }
         //);


        //console.log(main.getSegmentsPathHistory(_points.length));

        

        var polyline = new googlePolylineAnimate(
            _points,
            _options.strokeColor
            , _options.strokeOpacity
            , _options.strokeWeight
            , _id
            , _marker);

        main.animateHistoryMarkerDefault(polyline);

        return polyline;
    }

    //ADD A POLYLINE TO THE MAP
    main.addPolyline = function (_polyline, _type) {
        _polyline.setMap(this.map);
        main.polylines.push({ line: _polyline, id: _polyline['id'], type: _type });
    }

    //EDIT POLYLINE 
    main.editPolyline = function (_id) {
        var result = $.grep(main.polylines, function (e) { return e.id == _id; });
        result[0].editable = true;
    }

    //REMOVE A POLYLINE FROM THE MAP
    main.removePolyline = function (_id) {
        var result = $.grep(main.polylines, function (e) { return e.id == _id; });
        result[0].setMap(null);
        main.polylines.splice(main.polylines.indexOf(result[0]), 1);
    }

    //ADD A PATH TO THE POLYLINE
    main.addPolylinePath = function (_id, _position) {
        var result = $.grep(main.polylines, function (e) { return e.id == _id; });
        var polylinePath = result[0].getPath();
        polylinePath.push(glatlng(14.51, _position.longitude));
    }

    //REMOVE LAST PATH FROM THE POLYLINE
    main.removePolylineLast = function (_id) {
        var result = $.grep(main.polylines, function (e) { return e.id == _id; });
        var polylinePath = result[0].getPath();
        polylinePath.pop();
    }

    //GET PATH OF POLYLINE
    main.getPolylinePath = function (_polyline) {
        var latlngArray = [];
        for (var i = 0; i < _polyline.getPath().getLength() ; i++) {
            var latlng = _polyline.getPath().getAt(i).toUrlValue(5);
            var res = latlng.split(",");
            latlngArray.push({ "Latitude": res[0], "Longitude": res[1] });
        }
        return latlngArray;
    };
    //===================END OF POLYLINE===================
    //======================================================
    //======================================================

    //======================================================
    //======================================================
    //===================START OF POLYGON===================
    //DRAW A POLYGON
    main.startDrawing = function (_type, _options) {
        if (main.selectedOverlay != null) {
            main.selectedOverlay.setMap(null);
        }
        var polygonOptions = main.drawingManger.get('polygonOptions');
        polygonOptions.fillColor = _options.fillColor;
        polygonOptions.strokeColor = _options.strokeColor;
        polygonOptions.fillOpacity = _options.fillOpacity;

        main.drawingManger.set('polygonOptions', polygonOptions);

        switch (_type) {
            case 'polygon':
                main.drawingManger.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
                break;
            case 'circle':
                main.drawingManger.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
                break;
            default:
        }

    }

    //CREATE A POLYGON
    main.createPolygon = function (_type, _points, _options, _id, _assignedAssetList, _speedLimit) {
        var polygon = null;
        var result = {};
        result = $.grep(main.polygons, function (e) { return e.id == _id; });
        if (result.length === 0) {

            switch (_type) {
                case 'polygon':
                    polygon = new googlePolygon(
                                 _points,
                                 _options.color,
                                 _id);
                    var bounds = new google.maps.LatLngBounds();
                    polygon.getPath().forEach(function (i, e) {
                        bounds.extend(i);
                    });
                    content = "<span class='zone-marker-label'><div'><span style='color:white;'>" + _options['name'] + "</span></div></span>";
                    var marker = new googleZoneMarker(glatlng(bounds.getCenter().lat(), bounds.getCenter().lng()), content);
                    marker.setMap(main.map);
                    marker.setVisible(true);
                    polygon.setOptions({ zIndex: 1, draggable: false });
                    polygon['marker'] = marker;
                    polygon['type'] = 'polygon';
                    break;
                case 'circle':
                    polygon = new googleCircle(
                                _points[0],
                                 _options.radius,
                                 _options.color,
                                 _id);
                    content = "<span class='zone-marker-label'><div'><span style='color:white;'>" + _options['name'] + "</span></div></span>";
                    var marker = new googleZoneMarker(glatlng(polygon.getCenter().lat(), polygon.getCenter().lng()), content);
                    marker.setMap(main.map);
                    marker.setVisible(true);
                    polygon.setOptions({ zIndex: 1, draggable: false });
                    polygon['marker'] = marker;
                    polygon['type'] = 'circle';
                    break;
                default:
            }
        }
        else {
            return result[0];
        }
        polygon['speedLimit'] = _speedLimit;
        polygon['assignedAssetList'] = _assignedAssetList;
        main.addPolygon(polygon);
        return polygon;

    }

    //SHOW A POLYGON
    main.showPolygon = function (_zone, _show) {
        var result = $.grep(main.polygons, function (e) { return e.id == _zone.ZoneID});
        if (_show === true) {
            result[0].setMap(main.map);
            result[0].setOptions({ visible: true });
            result[0].marker.setVisible(true);
        }
        else {
            //_polygon.setMap(main.map);
            result[0].marker.setVisible(false);
            result[0].setOptions({ visible: false });
        }
    }

    //TOGGLE VISIBILITY A POLYGON
    main.toggleVisibilityPolygon = function (_show) {
        main.polygons.forEach(function (p) {
            if (_show === false) {
                p.setOptions({ visible: false });
                p.marker.setVisible(false);
            }
            else {
                p.setMap(main.map);
                p.setOptions({ visible: true });
                p.marker.setVisible(true);
            }
        });
    }

    //ADD A POLYGON
    main.addPolygon = function (_polygon) {
        //if (main.isPolygonExist(_polygon['id']) === null) {
        _polygon.setMap(main.map);
        _polygon.marker.setMap(main.map);
        main.polygons.push(_polygon);
        //}
    }


    //CHECK MARKER EXIST
    main.isPolygonExist = function (_id) {
        var result = {};

        result = $.grep(main.polygons, function (e) { return e.id === _id; });

        if (result.length !== 0) {
            return result[0];
        } else {
            return null;
        }
    }

    //EDIT A POLYGON
    main.editPolygon = function (_id) {
        var result = {};
        result = $.grep(main.polygons, function (e) { return e.id == _id; });
        if (result.length > 0) {
            result[0].setOptions({ editable: true, draggable: true });
            main.selectedOverlay = result[0];
        }
    }

    //CANCEL EDIT A POLYGON
    main.cancelEditPolygon = function (_id) {
        if (main.selectedOverlay != null && _id == null) {
            main.selectedOverlay.setOptions({ editable: false, draggable: false });
        }
        var result = $.grep(main.polygons, function (e) { return e.id == _id; });
        if (result.length > 0) {
            result[0].setOptions({ editable: false, draggable: false });
            main.selectedOverlay = null;
        }
    }

    //REMOVE A POLYGON
    main.removePolygon = function (_id) {
        if (main.selectedOverlay != null && _id == 0) {
            main.selectedOverlay.setMap(null);
        }
        var result = $.grep(main.polygons, function (e) { return e.id == _id; });
        if (result.length > 0) {
            main.polygons.splice(main.polygons.indexOf(result[0]), 1);
            result[0].setMap(null);
        }
    }

    main.removeOverlay = function () {
        if (main.selectedOverlay != null) {
            main.selectedOverlay.setMap(null);
        }
    }

    main.stopDrawing = function () {
        if (main.drawingManger != null) {
            main.drawingManger.setDrawingMode(null);
            if (main.selectedOverlay != null) {
                main.selectedOverlay.setOptions({ draggable: false });
            }
        }
    }

    //EMPTY POLYGON
    main.emptyPolygon = function (_id) {
        main.polygons.forEach(function (p) {
            p.setMap(null);

        });
        main.polygons = [];
    }

    //PAN A POLYGON
    main.panPolygon = function (_id) {
        var result = $.grep(main.polygons, function (e) { return e.id == _id; });
        var polygon = result[0];
        switch (polygon['type']) {
            case 'polygon':
                var bounds = new google.maps.LatLngBounds();
                polygon.getPath().forEach(function (i, e) {
                    bounds.extend(i);
                });
                main.map.fitBounds(bounds);
                break;
            case 'circle':
                main.map.fitBounds(polygon.getBounds());
                break;
            default:
        }
    }

    //GET PATH OF POLYGON
    main.getPolygonPath = function (_polygon) {
        var latlngArray = [];
        switch (_polygon['type']) {
            case 'polygon':
                var shapeLength = _polygon.getPath().getLength();
                for (var i = 0; i < shapeLength ; i++) {
                    var latlng = _polygon.getPath().getAt(i).toUrlValue(5);
                    var res = latlng.split(",");
                    latlngArray.push({ "Latitude": res[0], "Longitude": res[1] });
                }
                break;
            case 'circle':
                var center = _polygon.getCenter();
                latlngArray.push({ "Latitude": center.lat(), "Longitude": center.lng() });
                break;
            case 'marker':
                var center = _polygon.getPosition();
                latlngArray.push({ "Latitude": center.lat(), "Longitude": center.lng() });
                break;
            case 'route':
                var shapeLength = _polygon.getPath().getLength();
                for (var i = 0; i < shapeLength ; i++) {
                    var latlng = _polygon.getPath().getAt(i).toUrlValue(5);
                    var res = latlng.split(",");
                    latlngArray.push({ "Latitude": res[0], "Longitude": res[1] });
                }
                break;
            default:
        }
        return latlngArray;
    };

    //======================================================
    //======================================================
    //===================START OF GEOJSON===================
    main.addPolygonGeoJSON = function (_data) {
        if (main.map != undefined) {
            var coords = [], coordsList;
            coordsList = JSON.parse(_data.Geometry).coordinates;
            coordsList[0].forEach(function (c) {
                coords.push({ lat: c[1], lng: c[0] });
            });
            coords.push(coords[0]);

            var data = {
                "id": _data.ZoneID,
                "properties": {
                    "name": _data.Name,
                    "id": _data.ZoneID,
                    "color": _data.Color,
                    "type": _data.ZoneTypeID,
                    "radius": _data.Radius
                },
                geometry: new google.maps.Data.Polygon([coords])
            };

            main.zoneLayer.add(data);


            var feature = main.zoneLayer.getFeatureById(_data.ZoneID);
            var bounds = new google.maps.LatLngBounds();
            var paths = [];

            feature.getGeometry().getArray().forEach(function (path) {
                path.getArray().forEach(function (latLng) {
                    bounds.extend(latLng);
                    paths.push(latLng);
                });
            });


            var area = google.maps.geometry.spherical.computeArea(paths);
            var radius = Math.sqrt(area / Math.PI);


            feature.setProperty('radius', radius);
            feature.setProperty('bounds', bounds);


            //add label marker for zone
            var marker = {
                "type": "Feature",
                "id": "zonemarker" + _data.ZoneID,
                "properties": {
                    "title": _data.Name
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [feature.getProperty('bounds').getCenter().lng(), feature.getProperty('bounds').getCenter().lat()]
                }
            }

            main.markerLayer.addGeoJson(marker);

            main.markerLayer.setStyle(function (feature) {
                return {
                    icon: " ",
                    label: {
                        color: "black",
                        fontSize: "12px",
                        fontWeight: "bold",
                        text: feature.getProperty('title')
                    },
                    visible: true
                }
            });

        }
    }

    //show one geojson
    main.showGeoJson = function (_id, _bool) {
        var data = main.zoneLayer.getFeatureById(_id);
        var color = data.getProperty('color');
        if (data != undefined) {
            if (_bool) {
                main.zoneLayer.overrideStyle(data, {
                    fillColor: color,
                    strokeColor: color,
                    strokeWeight: 2,
                    clickable: false,
                    zIndex: 0,
                    visible: true
                });
            } else {
                main.zoneLayer.overrideStyle(data, { visible: false });
            }
        }
    }
    //======================================================
    //======================================================
    //===================END OF GEOJSON===================

    //COMPUTE ZONE AREA IN SQM
    main.getZoneArea = function (_polygon) {
        var area = 0;
        switch (_polygon['type']) {
            case 'polygon':
                area = google.maps.geometry.spherical.computeArea(_polygon);
                break;
            case 'circle':
                var radius = _polygon.getRadius();
                area = (radius * radius) * Math.PI;
                break;
            default:
        }
        return area;
    };

    //===================END OF POLYGON===================
    //========================================B==============
    //======================================================

    //PLACE SEARCH
    main.placeSearch = function (element) {
        var markers = [];
        var input = document.getElementById(element);
        var searchBox = new google.maps.places.SearchBox(input);

        searchBox.addListener('places_changed', function () {

            var places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }

            // Clear out the old markers.
            markers.forEach(function (marker) {
                marker.setMap(null);
            });

            markers = [];
            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();


            places.forEach(function (place) {
                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                    map: main.map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                }));


                if (place.geometry.viewport) {

                    bounds.union(place.geometry.viewport);


                } else {
                    bounds.extend(place.geometry.location);
                }

            });
            main.map.fitBounds(bounds);
        });
    }


    //======================================================
    //======================================================
    //===================START OF EXPORT KML================
    main.exportToKML = function (_list, _type) {
        var xw = new XMLWriter('UTF-8');
        xw.formatting = 'indented';//add indentation and newlines
        xw.indentChar = ' ';//indent with spaces
        xw.indentation = 2;//add 2 spaces per level

        xw.writeStartDocument();
        xw.writeStartElement('kml');
        xw.writeAttributeString("xmlns", "http://www.opengis.net/kml/2.2");
        xw.writeStartElement('Document');


       if (_type === 'history') {

            for (var i = 0; i < _list.length; i++) {
                xw.writeStartElement('Placemark');

                xw.writeStartElement('Style');
                xw.writeAttributeString('id', 'PlacemarkMarker' + _list[i].AssetID);
                xw.writeStartElement('IconStyle');
                xw.writeStartElement('Icon');
                xw.writeElementString('href', 'http://maps.google.com/mapfiles/kml/shapes/donut.png');

                xw.writeEndElement();
                xw.writeElementString('color', _list[i].IconStatusColor);
                xw.writeElementString('scale', '0.8');

                xw.writeStartElement('hotSpot', '');
                xw.writeAttributeString('x', '0.3');
                xw.writeAttributeString('y', '0.3');
                xw.writeAttributeString('xunits', 'fraction');
                xw.writeAttributeString('yunits', 'fraction');
                xw.writeEndElement();

                xw.writeEndElement();
                xw.writeEndElement();

                xw.writeStartElement('name');
                xw.writeString(_list[i].Speed + ' kph, ' + _list[i].DirectionDegrees + ' ' + _list[i].DirectionCardinal);
                xw.writeEndElement();
                xw.writeElementString('speed-course', _list[i].Speed + ' kph, ' + _list[i].DirectionDegrees + ' ' + _list[i].DirectionCardinal);
                xw.writeElementString('styleUrl', '#PlacemarkMarker' + _list[i].AssetID);
                xw.writeStartElement('Point');
                xw.writeElementString('coordinates', _list[i].Longitude + "," + _list[i].Latitude + ",0");
                xw.writeEndElement();
                xw.writeEndElement();


            }

           //style of polyline
            xw.writeStartElement('Style');
            xw.writeAttributeString('id', 'polylineStyle');
            xw.writeStartElement('LineStyle');
            xw.writeElementString('color', 'ff806eeb');
            xw.writeElementString('width', '6');
            xw.writeEndElement();
            xw.writeEndElement();

           //create polyline
            xw.writeStartElement('Placemark');
            xw.writeElementString('styleUrl', 'polylineStyle');
            xw.writeStartElement('name');
            xw.writeString('');
            xw.writeEndElement();


            xw.writeStartElement('LineString');
            xw.writeElementString('altitudeMode', 'relativeToGround');
            xw.writeStartElement('coordinates');
            xw.writeString(_list.KMLPoints);
            xw.writeEndElement();
            xw.writeEndElement();
            xw.writeEndElement();

           //end of create polyline

            xw.writeEndElement();

        }

        xw.writeEndElement();
        xw.writeEndDocument();


        var xml = xw.flush();//generate xml string
        xw.close();//clean the writer

        return xml;
    }
    //======================================================
    //======================================================
    //===================END OF EXPORT KML==================
}

function glatlng(_latitude, _longitude) {
    return new google.maps.LatLng(_latitude, _longitude);
}
