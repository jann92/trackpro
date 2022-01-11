
function googleMaps() {
    var main = this;
    main.geocoder = new google.maps.Geocoder;

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
    main.isMarkerClustererOn = false;
    main.historyMarker = {};
    main.historyStartIndex = 0;
    main.polylineNearestList = [];
    main.nearestAssetMarker = null;
    main.nearByObjects = [];
    main.markerDistanceList = [];
    main.polylineNearestList = [];
    main.trafficLayer = null;
    main.landmarkMarkers = [];
    main.pointMarkers = [];
    main.isShowAllMarkers = false;

    //color
    main.mainColor = '#22B573';

    //RULER
    main.rulerMarkers = [];
    main.rulerMarkerDistanceList = [];
    main.rulerMarkerLabels = [];
    main.rulerLine = null;
    main.segments = [];
    main.rulerMarkerLimit = 99;
    main.rulerDistanceLabel = null;
    main.rulerDistanceLabels = [];
    main.snapMarker = null;
    main.snapDistanceLabel = null;
    main.snapDistanceLabels = [];

    //ROUTE
    main.route = {};
    main.routeMarkers = [];
    main.routeMarker;
    main.routeLine = [];
    main.routeSegments = [];
    main.routeData = [];
    main.routeList = [];
    main.routePolyline = {};
    main.routePolygonList = [];
    main.polyRoute = null;

    main.shiftPressed = true,
     google.maps.event.addDomListener(document, "keydown", function (e) {
         main.shiftPressed = e.shiftKey;
     });
    google.maps.event.addDomListener(document, "keyup", function (e) {
        main.shiftPressed = e.shiftKey;
    });
    main.newRouteData = [];
    main.startRouteMarker = null;
    main.endRouteMarker = null;



    //POLYGON
    main.polygonClusterer = null;
    main.selectedZone = null;
    main.circleRadiusListener = null;
    main.circleInfowindow = null;

    //DATA LAYER
    main.zoneLayer = new google.maps.Data();
    main.markerLayer = new google.maps.Data();
    main.markerGeoJSON = {
        "type": "FeatureCollection",
        "features": []
    };

    main.pinMarker = null;


    //Service Direction google map
    main.service = new google.maps.DirectionsService();
    main.directionRenderer = new google.maps.DirectionsRenderer();


    var getGoogleClusterInlineSvg = function (color) {
        var encoded = window.btoa('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-100 -100 200 200"><defs><g id="a" transform="rotate(45)"><path d="M0 47A47 47 0 0 0 47 0L62 0A62 62 0 0 1 0 62Z" fill-opacity="0.7"/><path d="M0 67A67 67 0 0 0 67 0L81 0A81 81 0 0 1 0 81Z" fill-opacity="0.5"/><path d="M0 86A86 86 0 0 0 86 0L100 0A100 100 0 0 1 0 100Z" fill-opacity="0.3"/></g></defs><g fill="' + color + '"><circle r="42"/><use xlink:href="#a"/><g transform="rotate(120)"><use xlink:href="#a"/></g><g transform="rotate(240)"><use xlink:href="#a"/></g></g></svg>');
        return ('data:image/svg+xml;base64,' + encoded);
    };


    var cluster_styles = [
    {
        width: 40,
        height: 40,
        //url: getGoogleClusterInlineSvg('#000066'),
        url: getGoogleClusterInlineSvg('#000066'),
        textColor: 'white',
        textSize: 12
    },
    {
        width: 50,
        height: 50,
        url: getGoogleClusterInlineSvg('#000066'),
        textColor: 'white',
        textSize: 14
    },
    {
        width: 60,
        height: 60,
        url: getGoogleClusterInlineSvg('#000066'),
        textColor: 'white',
        textSize: 16
    }

    ];


    var mcOptions = {
        styles: cluster_styles
    };


    main.refreshMap = function () {
        google.maps.event.trigger(main.map, 'resize');
    }

    main.TileToQuadKey = function (x, y, zoom) {
        var quad = "";
        for (var i = zoom; i > 0; i--) {
            var mask = 1 << (i - 1);
            var cell = 0;
            if ((x & mask) != 0) cell++;
            if ((y & mask) != 0) cell += 2;
            quad += cell;
        }
        return quad;
    }

    //CREATE A MAP INSTANCE
    main.createMap = function (_zoomLevel, _position, _element) {
        var osmMapTypeOptions = {
            getTileUrl: function (coord, zoom) {
                return "http://tile.openstreetmap.org/" +
                zoom + "/" + coord.x + "/" + coord.y + ".png";
            },
            tileSize: new google.maps.Size(256, 256),
            isPng: true,
            maxZoom: 19,
            minZoom: 0,
            name: "OSM"
        };

        var bingMapTypeOptions = {
            name: "Bing",
            getTileUrl: function (coord, zoom) {
                // this returns aerial photography
                return "http://ecn.t1.tiles.virtualearth.net/tiles/a" +
                  main.TileToQuadKey(coord.x, coord.y, zoom) + ".jpeg?g=1173&n=z";
                // i dont know what g=1173 means
            },
            tileSize: new google.maps.Size(256, 256),
            maxZoom: 21,
            minZoom: 0,
            isPng: true
        };

        var osmMapType = new google.maps.ImageMapType(osmMapTypeOptions);

        this.zoomLevel = _zoomLevel;
        this.centerCoordinates = new google.maps.LatLng(_position.latitude, _position.longitude);

        var googleMapType = new google.maps.StyledMapType([], { name: 'Google' });

        var mapOptions = {
            zoom: this.zoomLevel,
            zoomControl: true,
            streetViewControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM,
                style: google.maps.ZoomControlStyle.SMALL
            },
            center: this.centerCoordinates,
            mapTypeControl: true,
            mapTypeControlOptions: {
                mapTypeIds: ['google', 'OSM', 'Bing'],
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
            },
            clickableIcons: false ,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM
            }
        };

        var newMap = new google.maps.Map(document.getElementById(_element), mapOptions);

        newMap.mapTypes.set('OSM', osmMapType);
        newMap.mapTypes.set('google', googleMapType);
        newMap.setMapTypeId('google');

        this.map = newMap;


        main.trafficLayer = new google.maps.TrafficLayer();
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
                clickable: true,
                editable: true,
                draggable: true,
            },
            markerOptions: {
                clickable: false,
                editable: true,
                draggable: true,
            },
            map: this.map
        });


        //drawing mode start
        google.maps.event.addListener(main.drawingManger, 'overlaycomplete', function (e) {
            main.stopDrawing();
            var newOverlay;
            main.drawShapes.push(e.overlay);
            switch (e.type) {
                case google.maps.drawing.OverlayType.POLYGON:
                    main.zoneLayer.add(new google.maps.Data.Feature({
                        id: "drawpolygon",
                        geometry: new google.maps.Data.Polygon([e.overlay.getPath().getArray()])
                    }));
                    newOverlay = main.zoneLayer.getFeatureById("drawpolygon");
                    newOverlay['type'] = 1;


                    //triggers when new draw polygon is compplete and insert new dots.
                    google.maps.event.addListener(e.overlay.getPath(), 'insert_at', function (index, obj) {
                        var p = main.zoneLayer.getFeatureById("drawpolygon");
                        main.zoneLayer.remove(p);

                        var newp = main.zoneLayer.add(new google.maps.Data.Feature({
                            id: "drawpolygon",
                            geometry: new google.maps.Data.Polygon([e.overlay.getPath().getArray()])
                        }));

                        newOverlay = main.zoneLayer.getFeatureById("drawpolygon");
                        newOverlay['type'] = 1;

                        main.selectedOverlay = newOverlay;

                    });

                    //triggers when new draw polygon is compplete and edit dots.
                    google.maps.event.addListener(e.overlay.getPath(), 'set_at', function (index, obj) {
                        var p = main.zoneLayer.getFeatureById("drawpolygon");
                        main.zoneLayer.remove(p);

                        var newp = main.zoneLayer.add(new google.maps.Data.Feature({
                            id: "drawpolygon",
                            geometry: new google.maps.Data.Polygon([e.overlay.getPath().getArray()])
                        }));

                        newOverlay = main.zoneLayer.getFeatureById("drawpolygon");
                        newOverlay['type'] = 1;

                        main.selectedOverlay = newOverlay;

                    });

                    break;
                case google.maps.drawing.OverlayType.CIRCLE:
                    newOverlay = e.overlay;
                    newOverlay.setOptions({ editable: true, draggable: true });
                    newOverlay['type'] = 2;
                    main.tempPoly = newOverlay;

                    main.circleInfowindow = new google.maps.InfoWindow({});

                    var lat = main.tempPoly.getCenter().lat();
                    var lon = main.tempPoly.getCenter().lng();

                    radius = (main.tempPoly.getRadius() * 0.001).toFixed(2);

                    main.circleInfowindow.setContent("<span>Radius: " + radius + "km</span>")
                    main.circleInfowindow.setPosition(new google.maps.LatLng(lat, lon));
                    main.circleInfowindow.open(main.map);


                    if (main.circleRadiusListener != null) {
                        main.circleRadiusListener = null;
                    }

                    main.circleRadiusListener = google.maps.event.addListener(main.tempPoly, 'radius_changed', function (ev) {
                        radius = (main.tempPoly.getRadius() * 0.001).toFixed(2);
                        var lat = main.tempPoly.getCenter().lat();
                        var lon = main.tempPoly.getCenter().lng();
                        main.circleInfowindow.setContent("<span>Radius: " + radius + "km</span>")
                        main.circleInfowindow.setPosition(new google.maps.LatLng(lat, lon));
                        main.circleInfowindow.open(main.map);
                    });

                    main.circleRadiusListener = google.maps.event.addListener(main.tempPoly, 'drag', function (ev) {
                        radius = (main.tempPoly.getRadius() * 0.001).toFixed(2);
                        var lat = main.tempPoly.getCenter().lat();
                        var lon = main.tempPoly.getCenter().lng();
                        main.circleInfowindow.setContent("<span>Radius: " + radius + "km</span>")
                        main.circleInfowindow.setPosition(new google.maps.LatLng(lat, lon));
                        main.circleInfowindow.open(main.map);
                    });

                    break;
                case google.maps.drawing.OverlayType.MARKER:
                    newOverlay = e.overlay;
                    newOverlay['event'] = 'new';
                    newOverlay['type'] = 'marker';
                    break;
                case google.maps.drawing.OverlayType.POLYLINE:
                    newOverlay = e.overlay;
                    newOverlay['type'] = 3;

                    var deleteNode = function (mev) {
                        if (mev.vertex != null) {
                            newOverlay.getPath().removeAt(mev.vertex);

                        }
                    }

                    google.maps.event.addListener(newOverlay, 'rightclick', deleteNode);
                default:
            }
            main.selectedOverlay = newOverlay;

        });


        //nixons phone driver app
        //  var coords = [
        //{lng: 121.0543783, lat: 14.6949851},
        //{lng: 121.0543783, lat: 14.6949851},
        //{lng: 121.0544635, lat: 14.6949866},
        //{lng: 121.0545454, lat: 14.6949684},
        //{lng: 121.0542833, lat: 14.69493},
        //{lng: 121.054479, lat: 14.6949659},
        //{lng: 121.0544667, lat: 14.6950279},
        //{lng: 121.05433,lat: 14.6949417},
        //{lng: 121.0565531, lat: 14.6955067},
        //{lng: 121.05699, lat:	14.6965917},
        //{lng: 121.0582029, lat: 14.6995196},
        //{lng: 121.06172, lat: 14.69986},
        //{lng: 121.0598517, lat: 14.7008567},
        //{ lng: 121.0626573, lat: 14.6991838 }
        //    ];

        ////nixons phone trackme app
        //var coords2 = [
        //   { lng: 121.05437, lat: 14.69504 },
        //    { lng: 121.05449, lat: 14.69493 },
        //    { lng: 121.05449, lat: 14.69505 },
        //    { lng: 121.05429, lat: 14.69497 },
        //    { lng: 121.05448, lat: 14.69497 },
        //    { lng: 121.05655, lat: 14.69551 },
        //    { lng: 121.05699, lat: 14.69659 },
        //    { lng: 121.0582, lat: 14.69952 },
        //    { lng: 121.0582, lat: 14.69952 },
        //    { lng: 121.06172, lat: 14.69986 },
        //    { lng: 121.05985, lat: 14.70086 },
        //    { lng: 121.06266, lat: 14.69918 },
        //    { lng: 121.06266, lat: 14.69918 },
        //    { lng: 121.0628, lat: 14.69947 },
        //    { lng: 121.06446, lat: 14.69976 },
        //    { lng: 121.06681, lat: 14.70001 },
        //    { lng: 121.06832, lat: 14.70247 },
        //    { lng: 121.06955, lat: 14.70535 }

        //];

        //biansor driver app
        var coords = [
           { lng: 121.0339047, lat: 14.6423045 },
            { lng: 121.0338483, lat: 14.6423116 },
            { lng: 121.0338378, lat: 14.6422788 },
            { lng: 121.0339693, lat: 14.6422398 },
            { lng: 121.0345324, lat: 14.6426315 },
            { lng: 121.031539, lat: 14.6393227 },
            { lng: 121.0221586, lat: 14.6351869 },
            { lng: 121.0219938, lat: 14.6350063 },
            { lng: 121.0221586, lat: 14.6351869 },
            { lng: 121.0222633, lat: 14.6351383 },
            { lng: 121.0221586, lat: 14.6351869 }

        ];

        //biansor trackme app
        var coords2 = [
            { lng: 121.03355, lat: 14.64241 },
            { lng: 121.03414, lat: 14.64235 },
            { lng: 121.03496, lat: 14.64287 },
            { lng: 121.03527, lat: 14.64309 },
            { lng: 121.03527, lat: 14.64309 },
            { lng: 121.02234, lat: 14.63506 },
            { lng: 121.02214, lat: 14.6351 },
            { lng: 121.02236, lat: 14.63527 },
            { lng: 121.022, lat: 14.63501 },
            { lng: 121.02224, lat: 14.63505 },
            { lng: 121.0224, lat: 14.63531 },
            { lng: 121.02263, lat: 14.63507 },
            { lng: 121.0223, lat: 14.63506 },
            { lng: 121.02182, lat: 14.6354 },
            { lng: 121.0222, lat: 14.63517 },
            { lng: 121.02211, lat: 14.63506 },
            { lng: 121.02221, lat: 14.6351 },
            { lng: 121.02233, lat: 14.63537 }
        ];

        //coords.forEach(function (c) {
        //    var marker = new google.maps.Marker({
        //        position: c,
        //        map: main.map
        //    });
        //});

        //coords2.forEach(function (c2) {
        //    var marker = new google.maps.Marker({
        //        position: c2,
        //        icon: {
        //            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        //        },
        //        map: main.map
        //    });
        //});



        //var flightPath = new google.maps.Polyline({
        //    path: coords,
        //    //geodesic: true,
        //    strokeColor: '#FF0000',
        //    strokeOpacity: 2,
        //    strokeWeight: 3
        //});

        //flightPath.setMap(main.map);


        //var flightPath2 = new google.maps.Polyline({
        //    path: coords2,
        //    geodesic: true,
        //    strokeColor: '#4679bd',
        //    strokeOpacity: 2,
        //    strokeWeight: 3
        //});

        //flightPath2.setMap(main.map);

        //20160620
        main.map.addListener('bounds_changed', function (e) {
           
            if (main.map.getZoom() >= 10) {

                main.zoneLayer.revertStyle();

                main.zoneLayer.setStyle(function (feature) {
                    var type = feature.getProperty('type');

                    if (main.oldGeoJSON != null) {
                       
                        if (feature.getProperty('id') == main.oldGeoJSON.id && type == 1) {
                          
                            return {
                                editable: true,
                                visible: true,
                                fillColor: feature.getProperty('color'),
                                strokeColor: feature.getProperty('color'),
                                clickable: true,
                                zIndex: 999,
                                draggable: true
                            }

                        } else if (feature.getProperty('id') == main.oldGeoJSON.id && type == 2) {

                            return { visible: false }
                        }
                        else {
                            if (feature.getProperty('visible')) {
                                return {
                                    visible: true,
                                    fillColor: feature.getProperty('color'),
                                    strokeColor: feature.getProperty('color'),
                                    strokeWeight: 2,
                                    clickable: false,
                                    zIndex: 1,
                                }
                            } else {
                                return { visible: false }
                            }
                        }
                    } else {
                        
                        if (feature.getProperty('visible')) {
                            return {
                                visible: true,
                                fillColor: feature.getProperty('color'),
                                strokeColor: feature.getProperty('color'),
                                strokeWeight: 2,
                                clickable: false,
                                zIndex: 1,
                            }
                        } else {
                            return { visible: false }
                        }
                    }

                });



                //landmarks
                main.landmarkMarkers.forEach(function (l) {
                    if (l['show'] === true)
                    {
                        l['label-marker'].setVisible(true);
                        l['label-marker'].setMap(main.map);
                        l.setVisible(true);

                        if (l.map === undefined) {
                            l.setMap(main.map);
                        }
                    }
                });
                //end of landmarks
           
            } else {

                //main.markerLayer.setStyle({ visible: false });

                main.zoneLayer.setStyle({ visible: false });


                //landmarks
                main.landmarkMarkers.forEach(function (l) {
                        l['label-marker'].setVisible(false);
                        l.setVisible(false);
                });


            }
        });

        //removes if drawing mode changed.. (e.g) polygon changed to polyline..
        google.maps.event.addListener(main.drawingManger, "drawingmode_changed", function () {
            if (main.drawingManger.getDrawingMode() != null) {
                for (var i = 0; i < main.drawShapes.length; i++) {
                    main.drawShapes[i].setMap(null);
                }
                main.drawShapes = [];
            }
        });


        //set up zone data layer
        main.zoneLayer.addGeoJson(main.geometryJSON);
        main.zoneLayer.setStyle({ visible: false });
        main.zoneLayer.setMap(newMap);


        //set up marker data layer
        main.markerLayer.addGeoJson(main.markerGeoJSON);
        main.markerLayer.setStyle({
            icon: " ",
            label: "test",
            visible: false
        });

        main.markerLayer.setMap(newMap);


        //listener when adding feature for zone layer
        google.maps.event.addListener(main.zoneLayer, 'addfeature', function (e) {
            if (e.feature.getGeometry() != null) {
                var type = e.feature.getGeometry().getType();
                if (type === "Polygon") {
                    var bounds = new google.maps.LatLngBounds();
                    var paths = [];
                    e.feature.getGeometry().getArray().forEach(function (path) {
                        path.getArray().forEach(function (latLng) {
                            bounds.extend(latLng);
                            paths.push(latLng);
                        });
                    });
                    var area = google.maps.geometry.spherical.computeArea(paths);
                    var radius = Math.sqrt(area / Math.PI);

                    e.feature.setProperty('radius', radius);
                    e.feature.setProperty('bounds', bounds);

                }
            }

        });


        //listener for markers when zoom reaches level 11
        //google.maps.event.addListener(main.map, 'bounds_changed', function () {
        //    var zoomLevel = main.map.getZoom();
        //    if (zoomLevel >= 15 && main.isShowAllMarkers) {
        //        main.markerCluster(false);
        //        main.markers.forEach(function (m) {
        //            if (main.map.getBounds().contains(m.getPosition())) {
        //                if (m.getMap() == null) {
        //                    m.setMap(main.map);
        //                }
        //            } else {
        //                m.setMap(null);
        //            }
        //        });
        //    } else {
        //        if (main.isShowAllMarkers) {
        //            main.toggleAllMarkers(true);
        //        }

        //        main.markerCluster(true);
        //    }
        //});


        google.maps.event.addListener(main.map, 'bounds_changed', function () {
            var zoomLevel = main.map.getZoom();

            //zone markers zoom level show/hide
            if (zoomLevel >= 15) {
                //update markers
                main.markerLayer.setStyle(function (feature) {

                    if (main.map.getBounds().contains(feature.getGeometry().get())) {

                        if (feature.getProperty('visible')) {

                            content = "<span><i class='icon-pgps-map-zone-b'></i><div'><span style='padding-left: 2px; color:black; text-shadow: 1px 1px white; font-size: 14px'> "
                                + feature.getProperty('title') + "</span></div></span>";
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

                    } else {

                        return { visible: false }

                    }

                });

            } else {
                main.markerLayer.setStyle({ visible: false });
            }


        })

        return newMap;
    }


    main.changeMapType = function (_type) {
        switch (_type) {
            case 'Satellite':
                main.map.setOptions({ 'mapTypeId': google.maps.MapTypeId.HYBRID });
                break;
            case 'Road':
                main.map.setOptions({ 'mapTypeId': google.maps.MapTypeId.ROADMAP });
                break;
            default:

        }
    }


    //======================================================
    //======================================================
    //===================START OF MARKERS===================
    //OPTIONS {draggable,visible,labelClass}
    //VALUE {labelContent,otherValues}
    //CREATE A NEW INSTANCE OF MARKER
    main.createMarker = function (_options, _content, _icon, _id, _type, _scope) {
        var marker = {};
        switch (_type) {
            case "asset":
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
                    , { x: _options.iconAnchor.x, y: _options.iconAnchor.y }
                    , { x: _options.iconSize.x, y: _options.iconSize.y }
                    , { x: _options.iconScaleSize.x, y: _options.iconScaleSize.y }
                    );
                marker['content'].url = _icon.url;
                marker['content'] = _content;
                marker['scope'] = _scope;
                break;
            case "history":

                break;
            default:

        }

        marker['type'] = _type;
        marker['id'] = _id;
        return marker;
    };



    main.createTracerMarker = function (_options, _content, _id) {
        marker = new googleHistoryMarker(
            {
                latitude: _content.Latitude
               , longitude: _content.Longitude
            }
            , _options.labelClass
            , _content.labelContent
            , _options.color
            , parseInt(_content.directionDegrees)
            , { x: _options.labelAnchor.x, y: _options.labelAnchor.y }
            , _content.AssetID
            , _content);

        return marker;
    };


    //UPDATE A MARKER POSITION
    main.updateMarker = function (_id, _content, _icon) {
        var result = {};
        result = $.grep(main.markers, function (e) { return e.id == _id; });
        if (result[0]) {
            var start = { latitude: result[0].getPosition().lat(), longitude: result[0].getPosition().lng() };
            var end = { latitude: _content.Latitude, longitude: _content.Longitude };
            var icon = {
                url: _icon.url,
                scaledSize: new google.maps.Size(100, 100),
                size: new google.maps.Size(120, 120),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(50, 50)
            };
            //if (_icon.url != result[0].content.url || result[0].labelContent != _content.labelContent) {
                result[0].setIcon(icon);
                result[0].labelContent = _content.labelContent;
            //}
            result[0]['content'] = _content;
            result[0].setPosition(glatlng(_content.Latitude, _content.Longitude));

            return result[0];
        }
    }

    main.updatePopupWindowMarker = function (markerContent) {
        var marker = {};
        marker = $.grep(main.markers, function (e) { return e.id == "asset" + markerContent.AssetID; });

        var lastreportstatus = markerContent.Status.LastReport;
        if (lastreportstatus != null) {
            lastreportstatus = "(Last Report: " + markerContent.Status.LastReport + ")";
        }
        else {
            lastreportstatus = "";
        }

        if (markerContent.Delivery == "") {
            markerContent.Delivery = "No Delivery";
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
                + "<div id='asset_focus' title='Asset Focus' class='btn btn-default pop-up-button'><i class='fa fa-crosshairs pop-up-icon' style='color: "+main.mainColor+" !important'></i><span class='pop-up-label'>Focus</span></div>&nbsp;&nbsp;"
                + "<div id='show_info' title='View Info' class='btn btn-default pop-up-button'><i class='icon icon-pgps-asset-info pop-up-icon info' style='color:"+main.mainColor+" !important'></i><span class='pop-up-label'>Info</span></div>&nbsp;&nbsp;"
                + "<div id='start_trace' title='Start Trace' class='btn btn-default pop-up-button'><i class='icon icon-pgps-asset-tracer pop-up-icon info' style='color: "+main.mainColor+" !important'></i><span class='pop-up-label'>Tracer</span></div>&nbsp;&nbsp;"
                 + "<div id='asset_history' title='Asset History' class='btn btn-default pop-up-button'><i class='fa fa-history pop-up-icon' style='color:"+main.mainColor+" !important'></i><span class='pop-up-label'>History</span></div>&nbsp;&nbsp;"
                + "<div id='new_zone' title='Create Zone' class='btn btn-default pop-up-button'><i class='icon icon-pgps-zone pop-up-icon info' style='color:"+main.mainColor+" !important'></i><span class='pop-up-label'>Zones</span></div>",
            ender: "</table></div>"
        }

        //if  user not have role delivery
        if (marker[0].scope.isDelivery != true) {
            detailsContent.delivery = "";
        }

        var infowindowContent = detailsContent.starter + detailsContent.asset + detailsContent.speed + detailsContent.time + detailsContent.status + detailsContent.driver + detailsContent.delivery + detailsContent.button + detailsContent.ender

        marker[0].infowindow.setContent(infowindowContent);

        marker[0].scope.newZone = function () {
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
            circle.setCenter(marker[0].getPosition());
            cmap.selectedOverlay = circle;
            marker[0].scope.ZoneInfoWindowMode = true;
        }

        marker[0].scope.traceVehicle = function () {
            $('.left-side-panel-menu-item').removeClass('side-panel-menu-item-active active-icon');
            $('.left-side-content-container').hide("slide");
            $('#lspmi-asset-tracer').addClass('side-panel-menu-item-active active-icon');
            $('#asset-tracer').show("slide");
        }

        google.maps.event.addListenerOnce(marker[0].infowindow, 'domready', function () {
            $("#new_zone").click(function () {
                marker[0].scope.newZone();
                if (!marker[0].scope.ZoneNewMode) {
                    marker[0].scope.ZoneNewMode = true;
                } else {
                    marker[0].scope.ZoneNewMode = false;
                }
            });

            $("#start_trace").click(function () {
                marker[0].scope.traceVehicle();
                if (!marker[0].scope.autoTrace) {
                    marker[0].scope.autoTrace = true;
                } else {
                    marker[0].scope.autoTrace = false;
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
                marker[0].scope.assetFocus = markerContent.AssetID;
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

    }

    //UPDATE A MARKER POSITION
    main.updateMarker2 = function (_id, _content) {
        var result = $.grep(main.markers, function (e) { return e.id == _id; });
        if (result[0]) {
            result[0].labelContent = _content
            result[0].label.draw();
        }
    }


    //CHECK MARKER EXIST
    main.isMarkerExist = function (_id) {
        var result = $.grep(main.markers, function (e) { return e.id == _id; });
        if (result[0] != null) {
            return result[0];
        }
        return null;
    }

    //CHECK MARKER INFOWINDOW IS OPEN
    main.isMarkerInfoWindowOpen = function (_id) {
        var result = $.grep(main.markers, function (e) { return e.id == _id });
        if (result[0].infowindow != undefined) {
            if (result[0].infowindow.getMap() != null) {
                return true;
            }
            else {
                return false;
            }
        } else {
            return false;
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
    main.panMarker = function (_id) {
        var result = {};
        result = $.grep(main.markers, function (e) { return e.id === _id; });
        if (result[0] != undefined) {
            main.map.setCenter(result[0].getPosition());
            main.map.setZoom(16);
        }
    }


    //PAN MAP
    main.panMap = function (_latitude, _longitude, _zoom) {
        var pos = glatlng(_latitude, _longitude);
        main.map.setCenter(pos);
        //if (_zoom == true) {
            main.map.setZoom(16);
        //}
    }


    //TOGGLER MARKER'S VISIBILITY
    main.toggleMarker = function (_id, _mode) {
        var result = $.grep(main.markers, function (e) { return e.id == _id; });
        if (result[0]) {
            if (_mode == true) {
                result[0].setMap(main.map);
                result[0]['visible'] = true;
                result[0].setVisible(true);
            } else {
                result[0].setMap(null);
                result[0]['visible'] = false;
                if (main.markerClusterer != null) {
                    main.markerClusterer.clearMarkers();
                }
                main.markerClusterer = null;
                //result[0].setVisible(false);
                if (result[0].infowindow) {
                    result[0].infowindow.close();
                }
            }
        }
    }

    main.toggleAllMarkers = function (_mode) {
        main.isShowAllMarkers = _mode;
        main.markers.forEach(function (m) {
            if (_mode) {
                m.setMap(main.map);
                m['visible'] = true;
                m.setVisible(true);
            } else {
                m.setMap(null);
                m['visible'] = false;
                if (main.markerClusterer != null) {
                    main.markerClusterer.clearMarkers();
                }
                main.markerClusterer = null;
                //result[0].setVisible(false);
                if (m.infowindow) {
                    m.infowindow.close();
                }
            }
        });
    }


    main.toggleMarkerVisibility = function (_id) {
        var result = $.grep(main.markers, function (e) { return e.id == "asset" + _id; });
        if (result[0] != undefined) {
            if (result[0].visible == false) {
                result[0].setVisible(true);
            } else {
                result[0].setVisible(false);
            }
        }
    }

    //ADD A MARKER TO THE MAP
    main.addMarker = function (_marker, _type) {
        switch (_type) {
            case 'asset':
                var result = {};
                if (_marker != undefined) {
                    result = $.grep(main.markers, function (e) { return e.id === _marker['id']; });
                    if (main.markerClusterer !== null) {
                        var result = $.grep(main.markerClusterer.getMarkers(), function (e) { return e.id == _marker['id']; });

                        if (result[0]) {
                            main.markerClusterer.addMarkers(main.markers);
                        }
                    } else {
                        //_marker.setMap(this.map);
                    }
                    _marker['type'] = 'asset';
                    main.markers.push(_marker);

                }
                break;
            case 'history':
                _marker.setMap(main.map);
                main.historyMarkers.push(_marker);
                break;
            case 'tracer':
                _marker['type'] = 'tracer';
                _marker.setMap(main.map);
                main.markers.push(_marker);
            default:
        }
    }

    //REMOVE A MARKER FROM THE MAP
    main.removeMarker = function (_id, _type) {
        switch (_type) {
            case 'asset':
                result = $.grep(main.markers, function (e) { return e.id == _id; });
                if (result[0] != undefined) {
                    result[0].setMap(null);
                    main.markers.splice(main.markers.indexOf(result[0]), 1);
                }
                break;
            case 'history':
                result = $.grep(main.historyMarkers, function (e) { return e.id == _id; });
                if (result[0] != undefined) {
                    result[0].setMap(null);
                    main.historyMarkers.splice(main.historyMarkers.indexOf(result[0]), 1);
                }
            case 'tracer':
                result = $.grep(main.markers, function (e) { return e.id == _id; });
                if (result[0] != undefined) {
                    result[0].setMap(null);
                    main.markers.splice(main.markers.indexOf(result[0]), 1);
                }
                break;
            default:
        }
    }

    main.pinMarkerToMap = function (_pos) {
        var latlng = new google.maps.LatLng(_pos.lat, _pos.lng);
        if (main.pinMarker == null) {
            main.pinMarker = new google.maps.Marker({
                position: latlng,
                map: main.map
            });
            main.map.setCenter(main.pinMarker.getPosition());
            main.map.setZoom(16);
        } else {
            main.pinMarker.setPosition(latlng);
            main.map.setCenter(main.pinMarker.getPosition());
            main.map.setZoom(16);
        }
    }

    main.removePinMarker = function () {
        if (main.pinMarker != null) {
            main.pinMarker.setMap(null);
            main.pinMarker = null;
        }
    }

    //SET MARKER AS SELECTED MARKER
    main.selectMarker = function (_marker) {
        main.selectedMarker = _marker;
    }

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
    main.createPolyline = function (_points, _options, _id) {
        var polyline = new googlePolyline(
            _points,
            _options.strokeColor
            , _options.strokeOpacity
            , _options.strokeWeight
            , _id)
        return polyline;
    }


    //ADD A POLYLINE TO THE MAP
    main.addPolyline = function (_polyline, _type) {
        _polyline.setMap(this.map);
        _polyline['type'] = _type;
        main.polylines.push(_polyline);
    }

    //EDIT POLYLINE 
    main.editPolyline = function (_id) {
        var result = $.grep(main.polylines, function (e) { return e.id == _id; });
        result[0].editable = true;
    }

    //REMOVE A POLYLINE FROM THE MAP
    main.removePolyline = function (_id) {
        var result = $.grep(main.polylines, function (e) { return e.id == _id; });
        if (result[0] != undefined) {
            result[0].setMap(null);
            main.polylines.splice(main.polylines.indexOf(result[0]), 1);
        }
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


    //======================================================
    //======================================================
    //===================START OF NEAREST ASSET=============
    main.nearestAssetModeOff = function () {
        google.maps.event.clearListeners(main.map, 'click');
        main.polylineNearestList.forEach(function (m) {
            m.setMap(null);
            main.polylineNearestList = [];
        });
        main.nearestAssetMarker.setMap(null);
        main.nearByObjects = [];
    };


    main.nearestAssetModeOn = function (_event, _limit) {
        google.maps.event.clearListeners(main.map, 'click');

        main.nearestAssetMarker = new googleNearestAssetMarker(_event.latLng, main.map);
        main.getNearestAssets(_event.latLng, _limit);

        return main.nearestAssetMarker;
    }


    main.nearestMapDragEnd = function (_event, _limit) {
        if (main.nearestAssetMarker) {
            main.polylineNearestList.forEach(function (m) {
                m.setMap(null);
                main.polylineNearestList = [];
            });
        }
        main.getNearestAssets(_event.latLng, _limit);

    };


    main.getNearestAssets = function (_point, _limit) {
        main.nearByObjects = [];
        main.markerDistanceList = [];
        var markers = main.markers.filter(function (item, pos) {
            return main.markers.indexOf(item) === pos && item.id === "asset" + item.content.AssetID;
        });
        markers.forEach(function (m) {

            var distance = main.computeDistance(m.getPosition(), _point);
            main.markerDistanceList.push(
                { assetID: m.id, distance: Math.round(distance), coordinates: m.getPosition(), latitude: m.getPosition().lat, longitude: m.getPosition().lng, content: m.content }
                );
        });

        var markerDistanceArray = main.markerDistanceList.sort(function (a, b) {
            return (a.distance - b.distance);
        }).slice(0, 10);

        //create invisible marker
        var mousemarker = new google.maps.Marker({
            position: _point,
            map: main.map,
            visible: false,
        });

        var count = 0;
        markerDistanceArray.forEach(function (m) {
            count += 1;
            if (count < 11 && m.distance <= _limit) {
                var clist = [];
                clist.push(_point);
                clist.push(m.coordinates);

                var t = main.createPolylineNearby(clist);
                t.setMap(main.map);
                main.polylineNearestList.push(t);

                var lineSymbol = {
                    path: 'M 0,-1 0,1',
                    strokeOpacity: 0.9,
                    scale: 2
                };

                var nearbyLabel = new overlayLabel();

                nearbyLabel.span_.style.cssText = 'position: relative; left: -50%; top: -50px;color:#000000; ' +
               'white-space: nowrap;font-size:16px;font-weight:600;' +
               'padding: 2px;text-shadow: 3px 0px 2px rgba(101, 129, 165, 1);';

                google.maps.event.addListener(t, 'mouseover', function (e) {
                    main.animateLine(t);
                    this.setOptions({
                        icons: [{
                            icon: lineSymbol,
                            offset: '0',
                            repeat: '10px'
                        }],
                        strokeColor: "#2378A3",
                        strokeWeight: 10,
                        strokeOpacity: 0,
                        zIndex: 9999,
                    });
                    mousemarker.setPosition(e.latLng);
                    nearbyLabel.bindTo('position', mousemarker, 'position');
                    nearbyLabel.set('text', "Distance: " + m.distance + " m");
                    nearbyLabel.setMap(main.map);
                });

                google.maps.event.addListener(t, 'mouseout', function (e) {
                    this.setOptions({
                        icons: [{
                            offset: '0%'
                        }],
                        strokeColor: "#2378A3",
                        strokeOpacity: 0.5,
                        strokeWeight: 10,
                    });
                    nearbyLabel.setMap(null);
                });
                var nearData = {
                    AssetID: m.content.AssetID,
                    Name: m.content.Name,
                    Distance: m.distance,
                    Status: m.content.Status,
                    content: m.content
                }

                main.nearByObjects.push(nearData);
            }

        });

        return main.nearByObjects;

    }


    main.animateLine = function (t) {
        var count = 0;
        window.setInterval(function () {
            count = (count + 1) % 200;

            var icons = t.get('icons');
            icons[0].offset = (count / 2) + '%';
            t.set('icons', icons);

        }, 20);
    }


    main.createPolylineNearby = function (_points) {
        var polyline = new googleNearestPolyline(
            _points,
            '#2378A3',
            0.65,
            3)
        return polyline;
    }


    main.computeDistance = function (_p1, _p2) {
        var result = google.maps.geometry.spherical.computeDistanceBetween(_p1, _p2);
        return result;
    };
    //======================================================
    //======================================================
    //===================END OF NEAREST ASSET===============


    //======================================================
    //======================================================
    //===================START OF POLYGON===================
    //DRAW A POLYGON
    main.startDrawing = function (_type, _options) {
        if (main.selectedOverlay != null && main.selectedOverlay['event'] === 'new') {
            main.selectedOverlay.setMap(null);
        }
        var polygonOptions = main.drawingManger.get('polygonOptions');
        polygonOptions.fillColor = _options.fillColor;
        polygonOptions.strokeColor = _options.strokeColor;
        polygonOptions.fillOpacity = _options.fillOpacity;
        polygonOptions.draggable = true;

        var polylineOptions = main.drawingManger.get('polylineOptions');
        polylineOptions.fillColor = _options.fillColor;
        polylineOptions.strokeColor = _options.strokeColor;
        polylineOptions.fillOpacity = _options.fillOpacity;

        var markerOptions = main.drawingManger.get('markerOptions');
        markerOptions.icon = _options.icon;

        main.drawingManger.set('polygonOptions', polygonOptions);
        main.drawingManger.set('polylineOptions', polylineOptions);
        main.drawingManger.set('markerOptions', markerOptions);

        switch (_type) {
            case 'polygon':
                main.drawingManger.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
                break;
            case 'circle':
                main.drawingManger.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
                break;
            case 'marker':
                main.drawingManger.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
                break;
            case 'polyline':
                main.drawingManger.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
                break;
            default:
        }

    }


    main.stopDrawing = function () {
        if (main.drawingManger != null) {
            main.drawingManger.setDrawingMode(null);
            if (main.selectedOverlay != null) {
                if (main.selectedOverlay.type === 1) {
                    main.zoneLayer.remove(main.selectedOverlay);
                } else {
                    main.selectedOverlay.setMap(null);
                }
            }
            for (var i = 0; i < main.drawShapes.length; i++) {
                main.drawShapes[i].setMap(null);
            }
            main.drawShapes = [];
        }
        if (main.circleInfowindow != null) {
            main.circleInfowindow.setMap(null);
        }
    }


    main.removeOverlay = function () {
        if (main.selectedOverlay != null) {
            main.selectedOverlay.setMap(null);
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

                    var polygonLabel = new overlayLabel();

                    polygonLabel.span_.style.cssText = 'position:relative;font-size:11px;color:#ffff;'

                    marker = new googleZoneMarker(glatlng(bounds.getCenter().lat(), bounds.getCenter().lng()), content);
                    polygonLabel.bindTo('position', marker, 'position');
                    polygonLabel.set('text', content);

                    result['marker'] = polygonLabel;
                    polygon.setOptions({ editable: false, draggable: false, zIndex: 0, clickable: false });
                    //marker = new googleZoneMarker(glatlng(bounds.getCenter().lat(), bounds.getCenter().lng()), content);
                    //marker.setMap(main.map);
                    //marker.setOptions({ zIndex: 0, clickable: false });
                    polygon['marker'] = result['marker'];
                    polygon['type'] = 'polygon';
                    break;
                case 'circle':
                    polygon = new googleCircle(
                                _points[0],
                                 _options.radius,
                                 _options.color,
                                 _id);
                    content = "<span class='zone-marker-label'><div'><span style='color:white;'>" + _options['name'] + "</span></div></span>";

                    var polygonLabel = new overlayLabel();

                    polygonLabel.span_.style.cssText = 'position:relative;font-size:11px;color:#ffff;'

                    marker = new googleZoneMarker(glatlng(polygon.getCenter().lat(), polygon.getCenter().lng()), content);
                    polygonLabel.bindTo('position', marker, 'position');
                    polygonLabel.set('text', content);

                    result['marker'] = polygonLabel;

                    polygon.setOptions({ editable: false, draggable: false, zIndex: 0, clickable: false });
                    polygon['marker'] = result['marker'];
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
        return polygon;

    }


    main.showTraffic = function (traffic) {

        if (traffic) {

            main.trafficLayer.setMap(main.map);
        }
        else {
            main.trafficLayer.setMap(null);
        }

    };


    //ADD A POLYGON
    main.addPolygon = function (_polygon) {
        if (main.isPolygonExist(_polygon['id']) === null) {
            _polygon.setMap(main.map);
            _polygon.isVisible = false;
            _polygon.setOptions({ visible: false });
            main.polygons.push(_polygon);

        }
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


    //REMOVE A POLYGON
    main.removePolygon = function (_id) {
        if (main.selectedOverlay != null && _id == 0) {
            main.selectedOverlay.setMap(null);
        }
        var result = $.grep(main.polygons, function (e) { return e.id == _id; });
        if (result.length > 0) {
            main.polygons.splice(main.polygons.indexOf(result[0]), 1);
            result[0].marker.setMap(null);
            result[0].setMap(null);
        }
    }


    //UPDATE THE COLOR
    main.updateZoneColor = function (_zoneID, _color) {

        var result = $.grep(main.polygons, function (e) { return e.id == _zoneID });
        if (result[0] != undefined) {
            result[0].setOptions({ strokeColor: _color, fillColor: _color });
        }
    }


    //UPDATE GEOJSON ZONE COLOR
    main.updateGeoJSONColor = function (_data) {
        var data = main.zoneLayer.getFeatureById(_data.ZoneID);
        data.setProperty('color', _data.Color);

        //update marker 
        var marker = main.markerLayer.getFeatureById("zonemarker" + _data.ZoneID);
        marker.setProperty('title', _data.Name);

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


    main.createPoint = function (_latitude, _longitude) {
        var point = glatlng(_latitude, _longitude);
        return point;
    }

    //======================================================
    //======================================================
    //===================START OF GEOJSON===================
    //add data layer geojson on map
    main.geometryJSON = null;
    main.loadGeoJson = function (_json) {
        main.geometryJSON = _json;
        if (main.map != undefined) {
            main.zoneLayer.addGeoJson(main.geometryJSON);
            main.zoneLayer.forEach(function (feature) {
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

                //var marker = {
                //    "type": "Feature",
                //    "id": "zonemarker" + feature.getProperty('id'),
                //    "properties": {
                //        "title": feature.getProperty('name')
                //    },
                //    "geometry": {
                //        "type": "Point",
                //        "coordinates": [feature.getProperty('bounds').getCenter().lng(), feature.getProperty('bounds').getCenter().lat()]
                //    }
                //}


                //main.markerLayer.addGeoJson(marker);

                if (!feature.getProperty('visible')) {
                    feature.setProperty('visible', false);
                }


            });


        }
    }


    //COMPUTE ZONE AREA IN SQM
    main.getZoneJSONArea = function (_polygon) {
        var area = 0;
        switch (_polygon['type']) {
            case 1:
                area = google.maps.geometry.spherical.computeArea(_polygon);
                break;
            case 2:
                var radius = main.tempPoly.getRadius();
                area = (radius * radius) * Math.PI;
                break;
            default:
        }
        return area;
    };


    //get path of geojson
    main.getPolygonJSONPath = function (_data) {
        var latlngArray = [];
        switch (_data.type) {
            case 1:
                _data.getGeometry().getArray().forEach(function (path) {
                    path.getArray().forEach(function (latLng) {
                        latlngArray.push({ "Latitude": latLng.lat(), "Longitude": latLng.lng() });
                    });
                });
                break;
            case 2:
                var center = _data.getCenter();
                latlngArray.push({ "Latitude": center.lat(), "Longitude": center.lng() });
                break;
            case 'marker':
                var center = _data.getPosition();
                latlngArray.push({ "Latitude": center.lat(), "Longitude": center.lng() });
                break;
            case 'route':
                var shapeLength = _data.getPath().getLength();
                for (var i = 0; i < shapeLength ; i++) {
                    var latlng = _data.getPath().getAt(i).toUrlValue(5);
                    var res = latlng.split(",");
                    latlngArray.push({ "Latitude": res[0], "Longitude": res[1] });
                }
                break;
            default:
        }
        return latlngArray;
    }


    //toggle visibility of all geojson
    main.toggleGeoJson = function (_bool) {
        if (main.map != undefined) {
            if (_bool) {

                main.zoneLayer.setStyle(function (feature) {

                    feature.setProperty('visible', true);

                    if (main.map.getZoom() < 7) { return { visible: false } };
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

                    feature.setProperty('visible', true);

                    if (main.map.getZoom() < 7) { return { visible: false } };

                    content = "<span><i class='icon-pgps-map-zone-b'></i><div'><span style='padding-left: 2px; color:black; text-shadow: 1px 1px white; font-size: 14px'> "
                             + feature.getProperty('title') + "</span></div></span>";

                    return {
                        visible: true,
                        icon: " ",
                        label: {
                            color: "black",
                            fontSize: "12px",
                            fontWeight: "bold",
                            text: feature.getProperty('title')
                        },

                    }

                });

            } else {

                main.markerLayer.setStyle(function (feature) {
                    feature.setProperty('visible', false);
                    return { visible: false }
                });

                main.zoneLayer.setStyle(function (feature) {
                    feature.setProperty('visible', false);
                    return { visible: false }
                });

            }
        }
    }

    //show one geojson
    main.showGeoJson = function (_id, _bool) {

        var zone = main.zoneLayer.getFeatureById(_id);
        var marker = main.markerLayer.getFeatureById("zonemarker" + _id);
        //var color = zone.getProperty('color');
        if (zone != undefined) {
            if (_bool) {

                if (marker != undefined) {
                    marker.setProperty('visible', true);
                }

                zone.setProperty('visible', true);

            } else {

                main.zoneLayer.overrideStyle(zone, { visible: false });
                marker.setProperty('visible', false);
                zone.setProperty('visible', false);
               

            }
        }
    }


    //pan polygon geojson
    main.panPolygonGeoJson = function (_id) {

        var data = main.zoneLayer.getFeatureById(_id);

        if (data != undefined) {

            data.setProperty('show', true);
            var bounds = data.getProperty('bounds');
            main.map.fitBounds(bounds);
            //main.setZoom(17);

        }

    }


    //edit polygon geojson
    main.oldGeoJSON = null;
    main.tempPoly = null;
    main.editPolygonGeoJson = function (_id) {

        var data = main.zoneLayer.getFeatureById(_id);
        data.setProperty('show', true);
        var bounds = data.getProperty('bounds');

        main.map.fitBounds(bounds);
        if (data != undefined) {

            var type = data.getProperty('type');

            var color = data.getProperty('color');

            main.oldGeoJSON = data; //set to store old data of geo
            main.oldGeoJSON.oldGeometry = data.getGeometry();
            switch (type) {

                case 1:
                    //main.zoneLayer.overrideStyle(data, {
                    //    visible:false
                    //    fillColor: color,
                    //    strokeColor: color,
                    //    strokeWeight: 2,
                    //    editable: true,
                    //    draggable: true,
                    //    clickable: true,
                    //    zIndex: 999,
                    //    visible: true
                    //});

                    main.tempPoly = data;
                    main.tempPoly['type'] = 1;
                    break;

                case 2:

                    var radius = data.getProperty('radius');
                    data.setProperty('visible', false);
                    main.tempPoly = new google.maps.Circle({
                        map: main.map,
                        center: bounds.getCenter(),
                        radius: radius,
                        fillColor: color,
                        strokeColor: color,
                        strokeWeight: 2,
                        clickable: true,
                        editable: true,
                        draggable: true,
                        zIndex: 999
                    });
                    main.tempPoly['type'] = 2;
                    main.tempPoly['geocircle'] = main.generateGeoJSONCircle(main.tempPoly.getCenter(), main.tempPoly.getRadius(), 70);

                    main.circleInfowindow = new google.maps.InfoWindow({});

                    var radiusInkm = (main.tempPoly.getRadius() * 0.001).toFixed(2);
                    var lat = main.tempPoly.getCenter().lat();
                    var lon = main.tempPoly.getCenter().lng();
                    main.circleInfowindow.setContent("<span>Radius: " + radiusInkm + "km</span>")
                    main.circleInfowindow.setPosition(new google.maps.LatLng(lat, lon));
                    main.circleInfowindow.open(main.map);

                    google.maps.event.addListener(main.tempPoly, 'dragend', function (e) {
                        main.tempPoly['geocircle'] = main.generateGeoJSONCircle(main.tempPoly.getCenter(), main.tempPoly.getRadius(), 70);

                        var radiusInkm = (main.tempPoly.getRadius() * 0.001).toFixed(2);
                        var lat = main.tempPoly.getCenter().lat();
                        var lon = main.tempPoly.getCenter().lng();
                        main.circleInfowindow.setContent("<span>Radius: " + radiusInkm + "km</span>")
                        main.circleInfowindow.setPosition(new google.maps.LatLng(lat, lon));
                        main.circleInfowindow.open(main.map);
                    });
                    google.maps.event.addListener(main.tempPoly, 'radius_changed', function (e) {
                        main.tempPoly['geocircle'] = main.generateGeoJSONCircle(main.tempPoly.getCenter(), main.tempPoly.getRadius(), 70);

                        var radiusInkm = (main.tempPoly.getRadius() * 0.001).toFixed(2);
                        var lat = main.tempPoly.getCenter().lat();
                        var lon = main.tempPoly.getCenter().lng();
                        main.circleInfowindow.setContent("<span>Radius: " + radiusInkm + "km</span>")
                        main.circleInfowindow.setPosition(new google.maps.LatLng(lat, lon));
                        main.circleInfowindow.open(main.map);
                    });
                    break;

                default:

            }

            main.tempPoly['id'] = data.getProperty('id');

            main.selectedOverlay = main.tempPoly;


            var marker = main.markerLayer.getFeatureById('zonemarker' + _id);
            if (marker) {
                marker.setProperty('visible', false);
            };

        }

    }


    main.editColorPolygonGeoJson = function (_id, _color) {
        var data = main.zoneLayer.getFeatureById(_id);
        var type = data.getProperty('type');

        switch (type) {

            case 1:
                main.tempPoly.setProperty('color', _color);
                break;
            case 2:
                main.tempPoly.setOptions({
                    fillColor: _color,
                    strokeColor: _color
                });
                break;
            default:
                break;
        }
    }

    //cancel edit polygon geojson
    main.cancelEditPolygonGeoJSON = function () {

        switch (main.oldGeoJSON.getProperty('type')) {

            case 1:

                main.oldGeoJSON.setGeometry(main.oldGeoJSON.oldGeometry);
                main.zoneLayer.overrideStyle(main.oldGeoJSON, {
                    editable: false,
                    draggable: false,
                    clickable: false,
                    zIndex: 0,
                    //visible: true
                });
                break;

            case 2:

                if (main.tempPoly != null) { main.tempPoly.setMap(null); }
                main.oldGeoJSON.setGeometry(main.oldGeoJSON.oldGeometry);
                //main.zoneLayer.overrideStyle(main.oldGeoJSON, {
                //    zIndex: 0,
                //    visible: true
                //});

                if (main.circleInfowindow != null) {
                    main.circleInfowindow.setMap(null);
                }
                break;

            default:

        }

        if (main.oldGeoJSON.marker) { main.oldGeoJSON.marker.setVisible(true) };
        main.oldGeoJSON = null;
        main.selectedOverlay = null;
    }


    //update polygon geojson
    main.updatePolygonGeoJSON = function (_data) {
        var data = main.zoneLayer.getFeatureById(_data.id);
        switch (data.getProperty('type')) {
            case 1:
                main.zoneLayer.overrideStyle(data, {
                    clickable: false,
                    editable: false,
                    draggable: false,
                    zIndex: 0
                });
                main.oldGeoJSON = null;

                break;
            case 2:
                if (main.tempPoly != null) { main.tempPoly.setMap(null); }
                if (_data.geocircle != undefined) {
                    main.zoneLayer.overrideStyle(data, {
                        visible: true,
                        editable: false,
                        draggable: false,
                        clickable: false,
                        zIndex: 0,
                        visible: true
                    });
                    data.setGeometry(new google.maps.Data.Polygon(_data.geocircle.coordinates));

                }
                main.oldGeoJSON = null;

                if (main.circleInfowindow != null) {
                    main.circleInfowindow.setMap(null);
                }

                break;
            default:

        }

        var bounds = main.getGeoJSONBounds(data);

        data.setProperty('bounds', bounds);

        main.showGeoJson(_data.id, true);
        main.panPolygonGeoJson(_data.id);



        //marker
        var marker = main.markerLayer.getFeatureById('zonemarker' + _data.id);
        var latlng = new google.maps.LatLng(data.getProperty('bounds').getCenter().lat(), parseFloat(data.getProperty('bounds').getCenter().lng()));
        marker.setGeometry(new google.maps.Data.Point(latlng));

    }


    //get geojson bounds
    main.getGeoJSONBounds = function (data) {
        var bounds = new google.maps.LatLngBounds();
        data.getGeometry().getArray().forEach(function (path) {
            path.getArray().forEach(function (latLng) {
                bounds.extend(latLng);
            });
        });
        return bounds;
    }


    //add polygon geojson
    main.addPolygonGeoJSON = function (_data) {

        //check if geometry is empty/null
        if (_data.Geometry != null) {

            var coords = [], coordsList;
            coordsList = JSON.parse(_data.Geometry).coordinates;

            var type = JSON.parse(_data.Geometry).type;
            if (type == "MultiPolygon") {
                //coordsList.forEach(function (c, i) {

                //    c.forEach(function (d,i) {
                //        d[i].forEach(function (e) {
                //            coords.push({ lat: e[1], lng: e[0] });
                //        });
                //        coords.push(d[i]);
                //    });


                //    //if (c[i] != undefined)
                //    //{
                //    //    c[i].forEach(function (d) {
                //    //        coords.push({ lat: d[1], lng: d[0] });
                //    //    });
                //    //    coords.push(c[i]);
                //    //}
                //});
                console.log(coordList[0])
                //coordsList[0].forEach(function (c) {
                //    c.forEach(function (d, idx) {
                //        d[0].forEach(function (e) {
                //            coords.push({ lat: e[1], lng: e[0] });
                //        });
                //    });
                //});
                coordsList[0].forEach(function (c) {
                    c.forEach(function (d) {
                        coords.push({ lat: d[1], lng: d[0] });
                    });
                });

            }
            else {
                coordsList[0].forEach(function (c) {
                    coords.push({ lat: c[1], lng: c[0] });
                });
                coords.push(coords[0]);
            }



            var data = {
                "id": _data.ZoneID,
                "properties": {
                    "name": _data.Name,
                    "id": _data.ZoneID,
                    "color": _data.Color,
                    "type": _data.ZoneTypeID,
                    "radius": _data.Radius,
                    "visible": false,
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
                    "title": _data.Name,
                    "visible": false,
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [feature.getProperty('bounds').getCenter().lng(), feature.getProperty('bounds').getCenter().lat()]
                }
            }


            main.markerLayer.addGeoJson(marker);


            //feature.addListener('click', function (event) {
            //    alert('clicked');
            //});
        }


    }


    //remvoe polygon geojson
    main.removePolygonGeoJSON = function (_id) {

        var zone = main.zoneLayer.getFeatureById(_id);
        var marker = main.markerLayer.getFeatureById("zonemarker" + _id);

        if (zone != undefined) {
            main.zoneLayer.remove(zone);
        }
        if (marker != undefined) {
            main.markerLayer.remove(marker);
        }
    }


    //check if polygon geojson exist
    main.isPolygonGeoJSONExist = function (_id) {
        var data = main.zoneLayer.getFeatureById(_id);
        var bool = false;
        if (data != undefined) {
            bool = true;
        }
        return bool;
    }


    main.generateGeoJSONCircle = function (_center, _radius, _numSides) {
        var points = [],
        degreeStep = 360 / _numSides;

        for (var i = 0; i < _numSides; i++) {
            var gpos = google.maps.geometry.spherical.computeOffset(_center, _radius, degreeStep * i);
            points.push({ lat: gpos.lat(), lng: gpos.lng() });
        };

        points.push(points[0]);

        return {
            type: 'Polygon',
            coordinates: [points]
        };
    }
    //======================================================
    //======================================================
    //===================END OF GEOJSON===================


    //======================================================
    //======================================================
    //===================START OF MARKERCLUSTER===================
    //CREATEMARKERCLUSTER
    main.markerCluster = function (bool) {
        var markers = $.grep(main.markers, function (e) { return e.visible == true && e.type == 'asset' });
        if (main.markerClusterer != null) {
            if (bool) { //already clicked the checkbox for marker cluster then wants to check it again
                main.markerClusterer.clearMarkers();
                main.markerClusterer.addMarkers(markers);
            }
            else {
                main.markerClusterer.clearMarkers();
                main.markerClusterer = null;
                main.markers.forEach(function (m) {
                    m.setMap(main.map);
                });
            }
        }
        else { // first time click of marker cluster
            if (bool) {
                if (markers.length > 0) {
                    main.markerClusterer = new MarkerClusterer(main.map, markers, mcOptions);
                }
            } else {
                main.markerClusterer = null;
            }
        }

        ////20160620
        //main.isMarkerClustererOn = bool;
    };

    //20160620
    main.markerCluster2 = function (bool) {

        if (main.markerClusterer) {
            if (bool) {
                main.markerClusterer.clearMarkers();
                main.markerClusterer.addMarkers(main.markers);
            }
            else {
                main.markerClusterer.clearMarkers();
                main.markerClusterer = null;
                main.markers.forEach(function (m) {
                    m.setMap(main.map);
                });
            }
        }
        else {
            if (bool) {
                main.markerClusterer = new MarkerClusterer(main.map, main.markers, mcOptions);
            } else {
                main.markerClusterer = null;
            }
        }
    };
    //======================================================
    //======================================================
    //===================END OF MARKERCLUSTER===================


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


    //CREATE A POINT MARKER
    main.createPointMarker = function (_latitude, _longitude) {
        main.pointMarkers.forEach(function (marker) {
            marker.setMap(null);
        });
        main.pointMarkers = [];

        // Create a marker for point.
        main.pointMarkers.push(new google.maps.Marker({
            map: main.map,
            position: main.createPoint(_latitude, _longitude),
        }));

        main.pointMarkers[0].setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () { main.pointMarkers[0].setAnimation(null); }, 900);
    }



    //START OF LANDMARK
    main.drawLandmarkMarkers = function (_position, _icon, _id, _label) {
        var marker = new googleLandmarkMarker(_position, _icon, _id);
        content = "<span class='landmark-marker-label'><div'><span style='color:white;'>" + _label + "</span></div></span>";
        var label = new googleLandmarkLabelMarker(_position, content);
        marker['label-marker'] = label;
        marker['label-marker'].setMap(this.map);
        marker.setMap(this.map);
        marker['show'] = null;
        
        main.landmarkMarkers.push(marker);
    }


    main.removeLandmark = function (_id) {
        var result = $.grep(main.landmarkMarkers, function (e) { return e.id == _id; });
        if (result[0] != undefined) {
            result[0].setMap(null);
            result[0]['label-marker'].setMap(null);
            main.landmarkMarkers.splice(main.landmarkMarkers.indexOf(result[0]), 1);
        }
    }


    main.toggleLandMark = function (_id, _visible) {
        var result = $.grep(main.landmarkMarkers, function (e) { return e.id == _id });
        if (result[0]) {

            result[0]['show'] = _visible;

            result[0]['label-marker'].setVisible(_visible);
            result[0].setVisible(_visible);

            if (result[0].map === undefined) {
                result[0]['label-marker'].setMap(main.map);
                result[0].setMap(main.map);
            }

        }
    }


    main.cancelLandmark = function () {
        if (main.selectedOverlay != null) {
            if (main.selectedOverlay['type'] === 'marker' && main.selectedOverlay['event'] === 'new') {
                main.selectedOverlay.setMap(null);
            }
        }
    }


    main.cancelEditLandmark = function (_id) {
        var result = $.grep(main.landmarkMarkers, function (e) { return e.id == _id });
        if (result[0]) {
            result[0].setOptions({ draggable: false });
            result[0].setPosition(result[0]['old_points']);
            result[0]['label-marker'].setPosition(result[0]['old_points']);
        }

    }


    main.editLandmark = function (_id) {
        var result = $.grep(main.landmarkMarkers, function (e) { return e.id == _id; });
        var overlay;
        result[0].setOptions({ draggable: true });
        overlay = result[0];
        result[0]['old_points'] = result[0].getPosition();
        google.maps.event.addListener(result[0], 'dragend', function (m) {
            result[0]['temp_points'] = result[0].getPosition();
            result[0].setPosition(m.latLng);
            overlay = result[0];
        });
        google.maps.event.addListener(result[0], 'drag', function (m) {
            result[0]['label-marker'].setPosition(result[0].getPosition());
        });
        overlay['event'] = 'edit';
        overlay['type'] = 'marker';
        main.selectedOverlay = overlay;
    }


    main.toggleVisibilityLandmark = function (_show) {
        if (_show === true) {
            main.landmarkMarkers.forEach(function (m) {
                m['show'] = true;
            });
            if (main.map.getZoom() >= 7) {
                main.landmarkMarkers.forEach(function (m) {
                    m['label-marker'].setVisible(true);
                    m.setVisible(true);


                    if (m.map === undefined) {
                        m['label-marker'].setMap(main.map);
                        m.setMap(main.map);
                    }

                });
            }
         
        } else {
            main.landmarkMarkers.forEach(function (m) {
                m['label-marker'].setVisible(false);
                m.setVisible(false);
                m['show'] = false;

                if (m.map === undefined) {
                    m['label-marker'].setMap(main.map);
                    m.setMap(main.map);
                }
            });
        }
    }
    //END OF LAND MARK


    //======================================================
    //======================================================
    //===================START OF MEASURE ROUTE=============
    main.rulerOff = function () {
        google.maps.event.clearListeners(main.map, 'click');
        main.rulerMarkerLabels.forEach(function (h) {
            h.setMap(null);
        });

        main.rulerMarkers.forEach(function (m) {
            m.setMap(null);
        })
        main.rulerMarkers.length = 0;

        main.rulerDistanceLabels.forEach(function (l) {
            l.setMap(null);
        });

        main.snapDistanceLabels.forEach(function (l) {
            l.setMap(null);
        });

        main.segments = [];
        main.rulerMarkers = [];
        if (main.rulerLine != null) {
            main.rulerLine.setMap(null);
        }

        main.rulerLine = null;
        main.rulerMarkerDistanceList = [];
        main.doneStraight = 0;
        main.done = 0;
    }


    main.doneStraight = 0;
    main.straightRulerOn = function (_event) {
        if (main.rulerMarkers.length > 9) {
            return;
        }
        if (main.doneStraight === 0) {
            main.rulerLine = new googleRulerPolyline(
            main.map,
            '#e65c00'
            , 3
            , 2
            );
            main.doneStraight++;
        }

        var evtPos = _event.latLng;
        var markerLabel = new overlayLabel();

        markerLabel.span_.style.cssText = 'position: relative; left: -50%; top: -10px;color:white; ' +
                        'white-space: nowrap;font-size:15px;font-weight:600;' +
                        'padding: 2px;text-shadow: 2px 2px 3px rgba(101, 129, 165, 1)';

        markerlength = main.rulerMarkers.length + 1;

        var marker = new googleRulerMarker(main.map);

        for (var i = 0 ; i <= main.rulerMarkers.length; i++) {

            marker.setPosition(evtPos);
            markerLabel.bindTo('position', marker, 'position');
            markerLabel.set('text', markerlength);
            markerLabel.setMap(main.map);
            marker['markerLabel'] = markerLabel;

        }

        main.rulerMarkerLabels.push(markerLabel);
        main.rulerMarkers.push(marker);

        var rulStr = true;

        main.drawPath(rulStr);

        return marker;
    };


    main.drawPath = function (rulStr) {
        var mousemarker = new google.maps.Marker({
            map: main.map,
            visible: false,
        });

        main.rulerDistanceLabel = new overlayLabel(); //overlay Label for marker hover
        main.rulerDistanceLabel.span_.style.cssText = 'position: relative; left: -50%; top: -30px; ' +
                                 'white-space: nowrap;font-size:13px;font-weight:600;' +
                                 'padding: 2px;text-shadow: rgb(144, 157, 173) 2px 0px 1px;background-color: rgba(245, 245, 245, 0.5);    border-radius: 3px;';

        google.maps.event.addListener(main.rulerLine, 'mouseout', function (e) {
            main.rulerDistanceLabel.setMap(null);
        });

        main.countMarkers();
        var coords = [];
        var distances = [];
        var j = 0;

        main.rulerMarkerDistanceList = [];

        for (var i = 0; i < main.rulerMarkers.length; i++) {
            if (j > 0) {
                j = i - 1;
            }

            coords.push(main.rulerMarkers[i].getPosition());
            markerDistance = main.computeDistance(main.rulerMarkers[j].getPosition(), main.rulerMarkers[i].getPosition());

            main.rulerMarkers[i]['distance'] = markerDistance;
            distances.push(main.rulerMarkers[i]['distance']);
            if (main.rulerMarkerDistanceList.length > 0) {
                accDistance = google.maps.geometry.spherical.computeLength(coords);
            } else {
                accDistance = 0;
            }
            j = 1;
            var newrm = new main.rulerMarker(i + 1, markerDistance, accDistance, main.rulerMarkers[i].getPosition().lat().toFixed(4), main.rulerMarkers[i].getPosition().lng().toFixed(4), main.rulerMarkers[i]);

            main.rulerMarkerDistanceList.push(newrm);
            main.rulerMarkerDistanceList.forEach(function (m) {
                main.rulerDistanceLabels.forEach(function (l) {
                    l.setMap(null);
                });

                google.maps.event.addListener(m.m, 'mouseover', function (e) {
                    mousemarker.setPosition(e.latLng);
                    main.rulerDistanceLabel.bindTo('position', mousemarker, 'position');
                    main.rulerDistanceLabel.set('text', "Distance: " + m.rulerlength.toFixed(0) + " m");
                    main.rulerDistanceLabel.setMap(main.map);
                    main.rulerDistanceLabels.push(main.rulerDistanceLabel);
                });
                google.maps.event.addListener(m.m, 'mouseout', function (e) {
                    main.rulerDistanceLabels.forEach(function (l) {
                        l.setMap(null);
                    });

                });

            });

        }
        main.rulerLine.setPath(coords);

        meters = google.maps.geometry.spherical.computeLength(coords);
        main.rulerMarkerDistanceList['total'] = meters;
        //_scope.measureRouteList = main.rulerMarkerDistanceList;
        //_scope.$apply();

    }


    main.rulerMarker = function (name, rulerlength, accdistance, latitude, longitude, m) {
        this.name = name;
        this.rulerlength = rulerlength;
        this.accdistance = accdistance;
        this.latitude = latitude;
        this.longitude = longitude;
        this.m = m
    };


    main.deleteRulerMarker = function (marker, markerLabel, evtPos, delSnap) {

        var i = main.rulerMarkers.length - 1;

        var rulStr = true;
        if (marker.getPosition() == main.rulerMarkers[i].getPosition()) {
            marker.setMap(null);
            main.drawPath(rulStr);
            main.rulerDistanceLabel.setMap(null);
            markerLabel.setMap(null);

        } else {
            alert("can't delete");
        }
        main.snapDistanceLabels.forEach(function (e) {
            e.setMap(null);
        });
        main.countMarkers();
    };


    main.countMarkers = function () {
        count = 0;
        for (var i = main.rulerMarkers.length - 1; i >= 0; i--) {
            if (main.rulerMarkers[i].getMap() == null) {
                main.rulerMarkers.splice(i, 1);
            } else {
                count++;

            }
        }
        return count;
    }


    main.getRulerDistance = function (rulerMarker) {
        if (main.rulerMarkerDistanceList[0]) {
            var distance = computeDistance(rulerMarker);

            main.rulerMarkerDistanceList.push({});

        }
    };


    main.snapToRoadOn = function (_event, _markerLimit, _type) {
        if (main.rulerMarkers.length > 9) {
            return;
        }
        var markerLimit = _markerLimit;
        main.rulerMarkerDistanceList = [];
        var evtPos = _event.latLng;

        // Label for ruler marker
        var markerLabel = new overlayLabel();
        markerLabel.span_.style.cssText = 'position: relative; left: -50%; top: -10px;color:white; ' +
                         'white-space: nowrap;font-size:15px;font-weight:600;' +
                         'padding: 2px;text-shadow: 2px 2px 3px rgba(101, 129, 165, 1)';

        markerlength = main.rulerMarkers.length + 1;

        main.snapMarker = new googleRulerMarker(main.map);
        main.snapMarker.id = main.rulerMarkers.length;
        main.snapMarker.segmentIndex = main.rulerMarkers.length - 1;
        main.rulerMarkers.push(main.snapMarker);

        main.snapMarker['markerLabel'] = markerLabel;
        main.snapMarker.setPosition(evtPos);
        markerLabel.bindTo('position', main.snapMarker, 'position');
        markerLabel.set('text', markerlength);
        markerLabel.setMap(main.map);

        main.rulerMarkerLabels.push(markerLabel);

        if (main.rulerMarkers.length > 1) {
            service = new google.maps.DirectionsService();
            //initialize ruler
            if (main.rulerMarkers.length == 2) {
                main.rulerLine = new googleRulerPolyline(
                main.map,
                '#2e0854',
                  10,
                  5
                );
            }
            main.drawPathSnap();
            main.rulerLine.setPath(new main.getSegmentsPath());
            main.addSegment(main.rulerMarkers[main.rulerMarkers.length - 2].getPosition(), evtPos, main.snapMarker.segmentIndex);
        }

        google.maps.event.addListener(main.rulerLine, 'mouseout', function (e) {
            main.snapDistanceLabel.setMap(null);
        });
        return main.rulerMarkers;

    }


    main.addSegment = function (start, end, segIdx) {
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
                    main.rulerLine.setPath(main.getSegmentsPath());
                }
            }
        );
    }


    main.updateSegment = function (_m) {
        _m.markerLabel.bindTo('position', _m, 'position');
        var start, end, inserts, i,
            idx = _m.segmentIndex,
            segLen = main.segments.length, //segLen will always be 1 shorter than that.rulerMarkers.length
            myPos = _m.getPosition();
        if (idx == -1) { //this is the first marker
            start = [myPos];
            end = [main.rulerMarkers[1].getPosition()];
            inserts = [0];
        } else if (idx == segLen - 1) { //this is the last marker
            start = [main.rulerMarkers[main.rulerMarkers.length - 2].getPosition()];
            end = [myPos];
            inserts = [idx];
        }
        else {
            start = [main.rulerMarkers[idx].getPosition(), myPos];
            end = [myPos, main.rulerMarkers[idx + 1].getPosition()];
            inserts = [idx, idx + 1];
        }
        for (i = 0; i < start.length; i++) {
            main.addSegment(start[i], end[i], inserts[i]);
        }
        main.rulerMarkerDistanceList = [];
        main.drawPathSnap();
    }


    main.drawPathSnap = function () {

        //create invisible marker
        var mousemarker = new google.maps.Marker({
            map: main.map,
            visible: false,
        });

        main.snapDistanceLabel = new overlayLabel(); //overlay Label for marker hover
        main.snapDistanceLabel.span_.style.cssText = 'position: relative; left: -50%; top: -30px; ' +
                                 'white-space: nowrap;font-size:13px;font-weight:600;' +
                                 'padding: 2px;text-shadow: 2px 0px 1px rgba(101, 129, 165, 1);background-color: rgba(245, 245, 245, 0.5);    border-radius: 3px;';

        main.countMarkersSnap();

        var coords = [];
        var distances = [];
        var j = 0;

        for (var i = 0; i < main.rulerMarkers.length; i++) {

            if (j > 0) {
                j = i - 1;
            }
            coords.push(main.rulerMarkers[i].getPosition());
            markerDistance = main.computeDistance(main.rulerMarkers[j].getPosition(), main.rulerMarkers[i].getPosition());
            main.rulerMarkers[i]['distance'] = markerDistance;
            distances.push(main.rulerMarkers[i]['distance']);
            if (main.rulerMarkerDistanceList.length > 0) {
                accDistance = google.maps.geometry.spherical.computeLength(coords);
            } else {
                accDistance = 0;
            }
            j = 1;
            var newrm = new main.rulerMarker(i + 1, markerDistance, accDistance, main.rulerMarkers[i].getPosition().lat().toFixed(4), main.rulerMarkers[i].getPosition().lng().toFixed(4), main.rulerMarkers[i]);

            main.rulerMarkerDistanceList.push(newrm);

            main.rulerMarkerDistanceList.forEach(function (m) {
                main.snapDistanceLabels.forEach(function (e) {
                    e.setMap(null);
                });
                google.maps.event.addListener(m.m, 'mouseover', function (e) {
                    mousemarker.setPosition(e.latLng);
                    main.snapDistanceLabel.bindTo('position', mousemarker, 'position');
                    main.snapDistanceLabel.set('text', "Distance: " + m.rulerlength.toFixed(0) + " m");
                    main.snapDistanceLabel.setMap(main.map);
                    main.snapDistanceLabels.push(main.snapDistanceLabel);
                });

                google.maps.event.addListener(m.m, 'mouseout', function (e) {
                    main.snapDistanceLabel.setMap(null);
                    main.snapDistanceLabels.forEach(function (e) {
                        e.setMap(null);
                    });
                });
            });

        }
        main.rulerLine.setPath(new main.getSegmentsPath);

        meters = google.maps.geometry.spherical.computeLength(coords);

        main.rulerMarkerDistanceList['total'] = meters;
        return main.rulerMarkerDistanceList;
    }


    main.deleteRulerMarkerSnap = function (marker, markerLabel, evtPos, delSnap) {
        var i = main.rulerMarkers.length - 1;
        if (marker.getPosition() == main.rulerMarkers[i].getPosition()) {
            marker.setMap(null);
            main.rulerMarkerDistanceList = [];
            main.drawPathSnap();
            main.rulerLine.setPath(new main.getSegmentsPath(delSnap));
            markerLabel.setMap(null);
            main.snapDistanceLabels.forEach(function (e) {
                e.setMap(null);
            });
        }
    }


    main.countMarkersSnap = function () {
        count = 0;
        for (var i = main.rulerMarkers.length - 1; i >= 0; i--) {
            if (main.rulerMarkers[i].getMap() == null) {
                main.rulerMarkers.splice(i, 1);
            } else {
                count++;


            }
        }
        return count;
    }


    main.getSegmentsPath = function (z) {
        var a, c, arr = [];
        if (z) { var len = main.rulerMarkers.length - z; } else { len = main.rulerMarkers.length; }

        for (c = 0; c < len; c++) {
            a = main.segments[c];

            if (a && a.routes) {
                arr = arr.concat(a.routes[0].overview_path);
            }
        }
        return arr;
    };
    //======================================================
    //======================================================
    //===================END OF MEASURE ROUTE===============


    //======================================================
    //======================================================
    //===================START OF ROUTE=====================
    main.routeOn = function (_event) {
        var evtPos = _event.latLng;

        if (main.routeMarkers.length >= 2) { return null; }

        if (main.routeMarkers.length == 1) {
            var infowindow_end = new google.maps.InfoWindow({
                content: "End point."
            });
            main.routeMarker = new googleRouteMarker(main.map, evtPos, '../../contents/images/track/map/asset-marker/route/endpoint.svg');
            infowindow_end.open(main.map, main.routeMarker);
        } else {
            var infowindow_start = new google.maps.InfoWindow({
                content: "Start point."
            });
            main.routeMarker = new googleRouteMarker(main.map, evtPos, '../../contents/images/track/map/asset-marker/route/startpoint.svg');
            infowindow_start.open(main.map, main.routeMarker);
        }


        main.routeMarker.segmentIndex = main.routeMarkers.length - 1;
        main.routeMarkers.push(main.routeMarker);
        //main.routeMarker.setPosition(evtPos);

        if (main.routeMarkers.length > 1) {

            main.routeLine = new googleRulerPolyline(
                main.map,
                '#2e0854',
                  10,
                  5
                );
            var lineSymbol = {
                path: 'M 0,-1 0,1',
                strokeOpacity: 1,
                scale: 2,
                zIndex: 9999
            };
            main.routeLine.setOptions({
                icons: [{
                    icon: lineSymbol,
                    offset: '0',
                    repeat: '10px'
                }],
                strokeOpacity: 0,
            });
            main.animateLine(main.routeLine);
            main.drawRoute(main.routeMarkers[0], main.routeMarkers[1], main.routeMarker.segmentIndex, main.routeLine);

            main.routeMarkers.forEach(function (m) {
                m.setOptions({ draggable: true });
            });
            google.maps.event.addListener(main.routeMarkers[0], 'dragend', function () {
                main.drawRoute(main.routeMarkers[0], main.routeMarkers[1], 0, main.routeLine);
            });

            google.maps.event.addListener(main.routeMarkers[1], 'dragend', function () {
                main.drawRoute(main.routeMarkers[0], main.routeMarkers[1], 0, main.routeLine);
            });

        }
    }


    main.getRouteDataSnap = function (_start, _end) {
        main.routeData = [];
        var distance = main.computeDistance(_start.getPosition(), _end.getPosition());
        main.routeData.push({ startLatitude: _start.getPosition().lat(), startLongitude: _start.getPosition().lng(), endLatitude: _end.getPosition().lat(), endLongitude: _end.getPosition().lng(), distance: distance });
        return main.routeData;
    }


    main.getSegmentsPathRoute = function (z) {
        var a, c, arr = [];
        len = 2;//main.routeMarkers.length;

        for (c = 0; c < len; c++) {
            a = main.routeSegments[c];

            if (a && a.routes) {
                arr = arr.concat(a.routes[0].overview_path);
            }
        }
        return arr;
    };


    main.drawRoute = function (start, end, segIdx, line) {
        main.service.route(
            {
                origin: start.getPosition(),
                destination: end.getPosition(),
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            },
            function (result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    main.routeSegments[segIdx] = result;
                    var pathArray = main.getSegmentsPathRoute();
                    pathArray.unshift(start.getPosition());
                    pathArray.push(end.getPosition());
                    line.setPath(pathArray);
                    line['type'] = "route";
                    main.getRouteDataSnap(start, end);
                    main.selectedOverlay = line;
                }
            }
        );
    }


    main.bufferPolyline = function (_id, _path) {

        var overviewPath = _path,
        overviewPathGeo = [];
        for (var i = 0; i < overviewPath.length; i++) {
            overviewPathGeo.push([overviewPath[i].lng, overviewPath[i].lat]);
        }

        var distance = 0.0001,
        geoInput = {
            type: "LineString",
            coordinates: overviewPathGeo
        };
        var geoReader = new jsts.io.GeoJSONReader(),
        geoWriter = new jsts.io.GeoJSONWriter();
        var geometry = geoReader.read(geoInput).buffer(distance);
        var polygon = geoWriter.write(geometry);

        var oLanLng = [];
        var oCoordinates;
        oCoordinates = polygon.coordinates[0];
        for (i = 0; i < oCoordinates.length; i++) {
            var oItem;
            oItem = oCoordinates[i];
            oLanLng.push(new google.maps.LatLng(oItem[1], oItem[0]));
        }

        return oLanLng;

    }


    main.updateSegmentRoute = function (_m, _line) {
        var start, end, inserts, i,
            idx = _m.segmentIndex,
            segLen = main.routeSegments.length, //segLen will always be 1 shorter than that.rulerMarkers.length
            myPos = _m;
        if (idx == -1) { //this is the first marker
            start = [myPos];
            end = [main.routeMarkers[1]];
            inserts = [0];
        } else if (idx == segLen - 1) { //this is the last marker
            start = [main.routeMarkers[main.routeMarkers.length - 2]];
            end = [myPos];
            inserts = [idx];
        }
        else {
            start = [main.routeMarkers[idx], myPos];
            end = [myPos, main.routeMarkers[idx + 2]];
            inserts = [idx, idx + 1];
        }
        for (i = 0; i < start.length; i++) {
            main.drawRoute(start[i], end[i], inserts[i], _line);
        }
    }


    main.routeOff = function () {
        google.maps.event.clearListeners(main.map, 'click');
        main.routeMarkers.forEach(function (r) {
            r.setMap(null);
        });
        if (main.routeMarkers.length > 1) {
            main.routeLine.setMap(null);
        }
        main.routeMarkers = [];

    }


    main.createRoute = function (route) {
        main.removeRoute(route.RouteID);
        var startMarker = new googleRouteMarker(main.map, glatlng(route.StartLatitude, route.StartLongitude), '../../contents/images/track/map/asset-marker/route/startpoint.svg');
        var endMarker = new googleRouteMarker(main.map, glatlng(route.EndLatitude, route.EndLongitude), '../../contents/images/track/map/asset-marker/route/endpoint.svg');

        var polyline = new googleRoutePolyline(
              main.map,
              '#931d9b',
                1,
                5
              );

        var pathArray = [];
        for (var i = 0; i < route.GeoCoordinateList.length; i++) {
            pathArray.push({ lat: route.GeoCoordinateList[i].Latitude, lng: route.GeoCoordinateList[i].Longitude });
        }
       
        polyline.setPath(pathArray);

       
        polyline['type'] = 'route';

        var buffer = main.bufferPolyline(route.RouteID, pathArray);

        var polygon = new google.maps.Polygon({
            paths: buffer,
            map: main.map,
            visible: false
        });

        polygon['id'] = route.RouteID;
        polygon['polyline'] = polyline;
        polygon['startMarker'] = startMarker;
        polygon['endMarker'] = endMarker;
        polygon['speedLimit'] = route.SpeedLimitRoute;

        main.routePolygonList.push(polygon);

        var routedata = {};
        routedata['id'] = route.RouteID;
        routedata['type'] = "route";
        routedata['startMarker'] = startMarker;
        routedata['endMarker'] = endMarker;
        routedata['routeLine'] = polyline;
        routedata['polygon'] = polygon;

        routedata['old_startMarkerPosition'] = glatlng(route.StartLatitude, route.StartLongitude);
        routedata['old_endMarkerPosition'] = glatlng(route.EndLatitude, route.EndLongitude);
        routedata['old_routeLinePath'] = pathArray;
        routedata['old_polygonPath'] = buffer;

        var checkRouteExist = main.isRouteExist(route.RouteID);

        if (checkRouteExist == true) {
            var data = $.grep(main.routeList, function (c) {
                c.id != route.RouteID;
            });
            main.routeList = data;
        }
        main.routeList.push(routedata);

    }


    main.isRouteExist = function (_id) {
        var result = $.grep(main.routeList, function (e) { return e.id == _id; });
        if (result.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }


    main.toggleVisibilityRoute = function (_show) {
        main.routeList.forEach(function (p) {
            if (_show === true) {
                p.routeLine.setOptions({ visible: true });
                p.startMarker.setOptions({ visible: true });
                p.endMarker.setOptions({ visible: true });
            }
            else {
                p.routeLine.setOptions({ visible: false });
                p.startMarker.setOptions({ visible: false });
                p.endMarker.setOptions({ visible: false });
            }
        });
    }


    main.showRoute = function (_id, _show) {
        var result = $.grep(main.routeList, function (e) {
            return e.id == _id;
        });
        if (result[0]) {
            result[0].startMarker.setMap(main.map);
            result[0].endMarker.setMap(main.map);
            result[0].routeLine.setMap(main.map);
            if (_show == true) {
                result[0].startMarker.setOptions({ visible: true });
                result[0].endMarker.setOptions({ visible: true });
                result[0].routeLine.setOptions({ visible: true });
                
            }
            else {
                result[0].startMarker.setOptions({ visible: false });
                result[0].endMarker.setOptions({ visible: false });
                result[0].routeLine.setOptions({ visible: false });
            }
        }

    }


    main.editRouteSnap = function (_id) {
        var infowindow_end = new google.maps.InfoWindow({
            content: "End point."
        });

        var infowindow_start = new google.maps.InfoWindow({
            content: "Start point."
        });

        var result = $.grep(main.routeList, function (e) { return e.id == _id; });

        if (result[0]) {
            result[0].startMarker.setOptions({ draggable: true });
            result[0].endMarker.setOptions({ draggable: true });

            infowindow_start.open(main.map, result[0].startMarker);
            infowindow_end.open(main.map, result[0].endMarker);

            var lineSymbol = {
                path: 'M 0,-1 0,1',
                strokeOpacity: 1,
                scale: 2,
                zIndex: 9999
            };


            result[0].routeLine.setOptions({
                icons: [{
                    icon: lineSymbol,
                    offset: '0',
                    repeat: '10px'
                }],
                strokeOpacity: 0,
            });

            main.animateLine(result[0].routeLine);
            main.selectedOverlay = result[0].routeLine;
            main.selectedOverlay['old_routeLinePath'] = result[0].old_routeLinePath;
            main.selectedOverlay['old_polygonPath'] = result[0].old_polygonPath;
            main.selectedOverlay['startMarker'] = result[0].startMarker;
            main.selectedOverlay['endMarker'] = result[0].endMarker;
            //main.getRouteDataSnap(result[0].startMarker, result[0].endMarker);

            var latlngArray = [];
            result[0].routeLine.getPath().getArray().forEach(function (latLng) {
                latlngArray.push({ "Latitude": latLng.lat(), "Longitude": latLng.lng() });
            });

            main.routeData = [];
            var distance = google.maps.geometry.spherical.computeLength(result[0].routeLine.getPath());
            main.routeData = [{
                startLatitude: result[0].routeLine.getPath().getAt(0).lat(),
                startLongitude: result[0].routeLine.getPath().getAt(0).lng(),
                endLatitude: result[0].routeLine.getPath().getAt(result[0].routeLine.getPath().getLength() - 1).lat(),
                endLongitude: result[0].routeLine.getPath().getAt(result[0].routeLine.getPath().getLength() - 1).lng(),
                distance: distance,
                geocoordinates: latlngArray
            }];

            google.maps.event.addListener(result[0].startMarker, 'dragend', function () {
                main.drawRoute(result[0].startMarker, result[0].endMarker, 0, result[0].routeLine);
            });

            google.maps.event.addListener(result[0].endMarker, 'dragend', function () {
                main.drawRoute(result[0].startMarker, result[0].endMarker, 0, result[0].routeLine);
            });
        }

    }


    main.newEditRoute = function (_id, _type)
    {
       

        var infowindow_end = new google.maps.InfoWindow({
            content: "End point."
        });

        var infowindow_start = new google.maps.InfoWindow({
            content: "Start point."
        });

        var result = $.grep(main.routeList, function (e) { return e.id == _id; });
        if (_type == 'line')
        {
          
            if (result[0]) {
                result[0].startMarker.setOptions({ zIndex: 99});
                result[0].endMarker.setOptions({ zIndex: 99 });

                infowindow_start.open(main.map, result[0].startMarker);
                infowindow_end.open(main.map, result[0].endMarker);
                result[0].startMarker['infowindow'] = infowindow_start;
                result[0].endMarker['infowindow'] = infowindow_end;


                result[0].routeLine.setOptions({
                    editable: true,
                    zIndex: 100
                });


                var latlngArray = [];
                result[0].routeLine.getPath().getArray().forEach(function (latLng) {
                    latlngArray.push({ "Latitude": latLng.lat(), "Longitude": latLng.lng() });
                });


                main.routeData = [];
                var distance = google.maps.geometry.spherical.computeLength(result[0].routeLine.getPath());
                main.routeData = [{
                    startLatitude: result[0].routeLine.getPath().getAt(0).lat(),
                    startLongitude: result[0].routeLine.getPath().getAt(0).lng(),
                    endLatitude: result[0].routeLine.getPath().getAt(result[0].routeLine.getPath().getLength() - 1).lat(),
                    endLongitude: result[0].routeLine.getPath().getAt(result[0].routeLine.getPath().getLength() - 1).lng(),
                    distance: distance,
                    geocoordinates: latlngArray
                }];


                google.maps.event.addListener(result[0].routeLine, 'mouseup', editVertex);
                google.maps.event.addListener(result[0].routeLine, 'mousedown', editVertex);


                function editVertex() {
                    var start = { lat: result[0].routeLine.getPath().getAt(0).lat(), lng: result[0].routeLine.getPath().getAt(0).lng() };
                    result[0].startMarker.setPosition(start);

                    var end = { lat: result[0].routeLine.getPath().getAt(result[0].routeLine.getPath().getLength() - 1).lat(), lng: result[0].routeLine.getPath().getAt(result[0].routeLine.getPath().getLength() - 1).lng() };
                    result[0].endMarker.setPosition(end);


                    var latlngArray = [];
                    result[0].routeLine.getPath().getArray().forEach(function (latLng) {
                        latlngArray.push({ "Latitude": latLng.lat(), "Longitude": latLng.lng() });
                    });

                    main.routeData = [];
                    var distance = google.maps.geometry.spherical.computeLength(result[0].routeLine.getPath());
                    main.routeData = [{
                        startLatitude: start.lat,
                        startLongitude: start.lng,
                        endLatitude: end.lat,
                        endLongitude: end.lng,
                        distance: distance,
                        geocoordinates: latlngArray
                    }];
                }

                main.selectedOverlay = result[0].routeLine;
                main.selectedOverlay['old_routeLinePath'] = result[0].old_routeLinePath;
                main.selectedOverlay['old_polygonPath'] = result[0].old_polygonPath;
                main.selectedOverlay['startMarker'] = result[0].startMarker;
                main.selectedOverlay['endMarker'] = result[0].endMarker;


            }

        }

        else
        {
            main.editRouteSnap(_id);
        }
    }


    main.cancelEditRoute = function (_id) {

        var result = $.grep(main.routeList, function (e) { return e.id == _id; });

        if (result[0]) {
            main.selectedOverlay.setOptions({
                icons: [{
                    offset: '0%'
                }],
                strokeOpacity: 1,
                editable: false
            });

            main.selectedOverlay.startMarker.setOptions({ draggable: false });
            main.selectedOverlay.endMarker.setOptions({ draggable: false });

            result[0].startMarker.setPosition(result[0].old_startMarkerPosition);
            result[0].endMarker.setPosition(result[0].old_endMarkerPosition);
            result[0].routeLine.setPath(result[0].old_routeLinePath);
            result[0].polygon.setPath(result[0].old_polygonPath);

            result[0].startMarker.infowindow.close();
            result[0].endMarker.infowindow.close();
        }


    }


    main.isDeviating = function (_id, asset) {
        var getPolygon = $.grep(main.routeList, function (e) { return e.id == _id });
        var position = glatlng(asset.Latitude, asset.Longitude);
        if (getPolygon.length > 0) {
            var result = google.maps.geometry.poly.containsLocation(position, getPolygon[0].polygon);
            //return result;
            var isOverspeed;
            if (result == true) {
                if (asset.Speed <= getPolygon[0].speedLimit) {
                    isOverspeed = true;
                } else {
                    isOverspeed = false;
                }
            }
            return { isDeviating: result, isOverspeed: isOverspeed };
        }
    };


    main.removeRoute = function (_id) {
        if (main.selectedOverlay != null && _id == null) {
            main.selectedOverlay.setMap(null);
        }
        var result = $.grep(main.routeList, function (e) { return e.id == _id; });
        if (result.length > 0) {
            main.routeList.splice(main.routeList.indexOf(result[0]), 1);
            result[0].polygon.setMap(null);
            result[0].routeLine.setMap(null);
            result[0].startMarker.setMap(null);
            result[0].endMarker.setMap(null);

        }
    };


    main.panRoutePolyline = function (_id) {
        main.routeList.forEach(function (r) {
            r.routeLine.setOptions({ strokeColor: "#931d9b" });
        });
        var result = $.grep(main.routeList, function (e) { return e.id == _id });
        var bounds = new google.maps.LatLngBounds();
        result[0].routeLine.setOptions({ strokeColor: "#f564ff" });
        //result[0].polygon.setMap(main.map);
        //result[0].polygon.getPath().forEach(function (i, e) {
        //    bounds.extend(i);
        //});
        result[0].routeLine.getPath().forEach(function (i, e) {
            bounds.extend(i);
        });
        main.map.fitBounds(bounds);
    }
    //======================================================
    //======================================================
    //===================END OF ROUTE=======================


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


        if (_type === 'marker') {

            for (var i = 0; i < _list.length; i++) {
                xw.writeStartElement('Placemark');

                xw.writeStartElement('Style');
                xw.writeAttributeString('id', 'PlacemarkMarker' + _list[i].AssetID);
                xw.writeStartElement('IconStyle');
                xw.writeStartElement('Icon');
                xw.writeElementString('href', _list[i].IconURL);

                xw.writeEndElement();
                xw.writeElementString('scale', '4');

                xw.writeStartElement('hotSpot', '');
                xw.writeAttributeString('x', '0.3');
                xw.writeAttributeString('y', '0.3');
                xw.writeAttributeString('xunits', 'fraction');
                xw.writeAttributeString('yunits', 'fraction');
                xw.writeEndElement();

                xw.writeEndElement();
                xw.writeEndElement();

                xw.writeStartElement('name');
                xw.writeCDATA(_list[i].Name);
                xw.writeEndElement();
                xw.writeElementString('speed-course', _list[i].Speed + ' kph, ' + _list[i].DirectionDegrees + ' ' + _list[i].DirectionCardinal);
                xw.writeElementString('styleUrl', '#PlacemarkMarker' + _list[i].AssetID);
                xw.writeStartElement('Point');
                xw.writeElementString('coordinates', _list[i].Longitude + "," + _list[i].Latitude + ",0");
                xw.writeEndElement();
                xw.writeEndElement();
            }
            xw.writeEndElement();
        }
        else if (_type === 'tracer') {

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


    main.mapZoom = function () {
        main.map.setZoom(16);
    };

    main.setZoom = function (_zoom) {
        main.map.setZoom(_zoom);
    }


    main.NewRoute = function (_mode,_type) {
        
        var lineSymbol = {
            path: 'M 0,-1 0,1',
            strokeOpacity: 1,
            scale: 3
        };
       
        //straight line
        if (_mode == 'on' && _type == 'line')
        {
            //start marker
            var infowindow_start = new google.maps.InfoWindow({
                content: "Start point."
            });
            main.startRouteMarker = new google.maps.Marker({
                map: main.map,
                zIndex: 99,
                icon: {
                    url: '../../contents/images/track/map/asset-marker/route/startpoint.svg',
                    scaledSize: new google.maps.Size(30, 30),
                    anchor: new google.maps.Point(15, 15),
                },
            });

            //end marker
            var infowindow_end = new google.maps.InfoWindow({
                content: "End point."
            });
            main.endRouteMarker = new google.maps.Marker({
                map:main.map,
                zIndex: 99,
                icon: {
                    url: '../../contents/images/track/map/asset-marker/route/endpoint.svg',
                    scaledSize: new google.maps.Size(30, 30),
                    anchor: new google.maps.Point(15, 15),
                },
            });

            //polyline route
            main.routeLine = new google.maps.Polyline({
                map: main.map,
                strokeOpacity: 1,
                fillColor: '#2e0854',
                strokeColor: '#2e0854',
                zIndex: 100,
                editable: true
            });


            var path = new google.maps.MVCArray(),
             service = new google.maps.DirectionsService();
            main.map.setOptions({
                draggableCursor: "crosshair"
            });


            var deleteNode = function (mev) {
                if (mev.vertex != null) {
                    main.routeLine.getPath().removeAt(mev.vertex);
                    editVertex();
                }
            }

            //polyline listeners
            google.maps.event.addListener(main.routeLine, 'rightclick', deleteNode);

            google.maps.event.addListener(main.routeLine, 'mouseup', editVertex);
            google.maps.event.addListener(main.routeLine, 'mousedown', editVertex);
            

            function editVertex() {
                var start = { lat: main.routeLine.getPath().getAt(0).lat(), lng: main.routeLine.getPath().getAt(0).lng() };
                main.startRouteMarker.setPosition(start);

                var end = { lat: main.routeLine.getPath().getAt(main.routeLine.getPath().getLength() - 1).lat(), lng: main.routeLine.getPath().getAt(main.routeLine.getPath().getLength() - 1).lng() };
                main.endRouteMarker.setPosition(end);
            }


            google.maps.event.addListener(main.map, "click", function (evt) {

                
                if (path.getLength() === 0) {
                    main.startRouteMarker.setPosition(evt.latLng);
                    infowindow_start.open(main.map, main.startRouteMarker);
                    main.startRouteMarker['infowindow'] = infowindow_start;

                } else if (main.startRouteMarker != null) {
                    main.endRouteMarker.setPosition(evt.latLng);
                    infowindow_end.open(main.map, main.endRouteMarker);
                    main.endRouteMarker['infowindow'] = infowindow_end;

                }
            

                path.push(evt.latLng);
                main.routeLine.setPath(path);

                var distance = google.maps.geometry.spherical.computeLength(main.routeLine.getPath());
                var latlngArray = [];
                path.getArray().forEach(function (latLng) {
                    latlngArray.push({ "Latitude": latLng.lat(), "Longitude": latLng.lng() });
                });

                main.newRouteData = [{
                    startLatitude: main.routeLine.getPath().getAt(0).lat(),
                    startLongitude: main.routeLine.getPath().getAt(0).lng(),
                    endLatitude: main.routeLine.getPath().getAt(main.routeLine.getPath().getLength() - 1).lat(),
                    endLongitude: main.routeLine.getPath().getAt(main.routeLine.getPath().getLength() - 1).lng(),
                    distance: distance,
                    geocoordinates: latlngArray 
                }];

            });


        }
        //snap to road
        else if(_mode == 'on' && _type == 'snap')
        {
            //start marker
            var infowindow_start = new google.maps.InfoWindow({
                content: "Start point."
            });
            main.startRouteMarker = new google.maps.Marker({
                map: main.map,
                zIndex: 99,
                icon: {
                    url: '../../contents/images/track/map/asset-marker/route/startpoint.svg',
                    scaledSize: new google.maps.Size(30, 30),
                    anchor: new google.maps.Point(15, 15),
                },
            });

            //end marker
            var infowindow_end = new google.maps.InfoWindow({
                content: "End point."
            });
            main.endRouteMarker = new google.maps.Marker({
                zIndex: 99,
                map: main.map,
                icon: {
                    url: '../../contents/images/track/map/asset-marker/route/endpoint.svg',
                    scaledSize: new google.maps.Size(30, 30),
                    anchor: new google.maps.Point(15, 15),
                },
            });

            //polyline route
            main.routeLine = new google.maps.Polyline({
                map: main.map,
                strokeOpacity: 0,
                fillColor: '#2e0854',
                strokeColor: '#2e0854',
                zIndex: 100,
                icons: [{
                    icon: lineSymbol,
                    offset: '0',
                    repeat: '20px'
                }],

            });


            var path = new google.maps.MVCArray(),
             service = new google.maps.DirectionsService();
            main.map.setOptions({
                draggableCursor: "crosshair"
            });
            var latlngArray = [];

            google.maps.event.addListener(main.routeLine, 'mouseup', editVertex);
            google.maps.event.addListener(main.routeLine, 'mousedown', editVertex);


            function editVertex() {
                var start = { lat: main.routeLine.getPath().getAt(0).lat(), lng: main.routeLine.getPath().getAt(0).lng() };
                main.startRouteMarker.setPosition(start);

                var end = { lat: main.routeLine.getPath().getAt(main.routeLine.getPath().getLength() - 1).lat(), lng: main.routeLine.getPath().getAt(main.routeLine.getPath().getLength() - 1).lng() };
                main.endRouteMarker.setPosition(end);
            }

            google.maps.event.addListener(main.map, "click", function (evt) {

                if (path.getLength() === 0) {
                    path.push(evt.latLng);

                    main.startRouteMarker.setPosition(evt.latLng);
                    infowindow_start.open(main.map, main.startRouteMarker);
                    if (path.getLength() === 1) {
                        main.routeLine.setPath(path);

                    }
                } else if (main.startRouteMarker != null) {
                    main.endRouteMarker.setPosition(evt.latLng);
                    infowindow_end.open(main.map, main.endRouteMarker);
                }


                service.route({
                    origin: path.getAt(path.getLength() - 1),
                    destination: evt.latLng,
                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                }, function (result, status) {
                    latlngArray = [];
                    if (status == google.maps.DirectionsStatus.OK) {
                        for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                            path.push(result.routes[0].overview_path[i]);
                        }
                        path.getArray().forEach(function (latLng) {
                            latlngArray.push({ "Latitude": latLng.lat(), "Longitude": latLng.lng() });
                        });

                        var distance = google.maps.geometry.spherical.computeLength(main.routeLine.getPath());

                        main.newRouteData = [{
                            startLatitude: main.routeLine.getPath().getAt(0).lat(),
                            startLongitude: main.routeLine.getPath().getAt(0).lng(),
                            endLatitude: main.routeLine.getPath().getAt(main.routeLine.getPath().getLength() - 1).lat(),
                            endLongitude: main.routeLine.getPath().getAt(main.routeLine.getPath().getLength() - 1).lng(),
                            distance: distance,
                            geocoordinates: latlngArray
                        }];


                    } else {
                        // create polyline
                        path.push(evt.latLng);
                    }

                });

                main.animateLine(main.routeLine);

             
            });
        }
        else // is off
        {
            if (main.routeLine == null || main.routeLine.length == 0) { return null; }
            //main.startRouteMarker.infowindow.close();
            //main.endRouteMarker.infowindow.close();
            main.routeLine.setMap(null);
            main.startRouteMarker.setMap(null);
            main.endRouteMarker.setMap(null);
            google.maps.event.clearListeners(main.map, 'click');
            google.maps.event.clearListeners(main.routeLine, 'rightclick');
            main.map.setOptions({
                draggableCursor: ""
            });
            main.newRouteData = [];
       
        }
    }


  
}

function glatlng(_latitude, _longitude) {
    return new google.maps.LatLng(_latitude, _longitude);
}

