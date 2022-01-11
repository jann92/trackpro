function osmHistoryMaps() {
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

    //CREATE A MAP INSTANCE
    main.createMap = function (_zoomLevel, _centerCoordinates, _element) {
        if (main.map != undefined) {
            main.map.remove();
        }
        var newMap = new L.map(_element, {
            center: [_centerCoordinates.latitude, _centerCoordinates.longitude],
            zoom: _zoomLevel,
            markerZoomAnimation: false,
            zoomAnimation: false,
            attributionControl: false
        });
        L.tileLayer("http://a.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png", {
            attribution: ''
        }).addTo(newMap);
        this.map = newMap;

        return newMap;
    }

    main.createMarker = function (_options, _content, _icon, _id, _type) {
        var marker = null;
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
        //console.log(marker);
        return marker;

    }

    main.createHistoryMarker = function (_options, _content, _icon, _id, _type) {
        var marker = new osmHistoryMarker(
          { latitude: _content.Latitude, longitude: _content.Longitude }
             , _options.labelClass
             , _content.labelContent
             , _options.color
             , parseInt(_content.DirectionDegrees)
             , { x: _options.labelAnchor.x, y: _options.labelAnchor.y }
             , _content.assetID
             , _content);

        marker['type'] = _type;
        marker['content'] = _content;
        //add click listener
        marker.on('click', function () {

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

        });

        return marker;

    };

    main.addMarker = function (_marker, _type) {
        _marker.addTo(main.map);
        main.historyMarkers.push(_marker);
    };


    main.updateMarker = function (_id, _content, _icon, _type) {
        var result = {};

        result = $.grep(main.historyMarkers, function (e) { return e.options.id == _id; });

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
            main.animateMarkerMovement(result[0], start, end);
            return result[0];
        }
    };

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

    //CHECK HISTORY MARKER EXIST
    main.isHistoryMarkerExist = function (_id) {
        var result = $.grep(main.historyMarkers, function (e) { return e.options.id == _id; });
        if (result[0] != null) {
            return result[0];
        }
        return null;
    }

    //PAN A MARKER
    main.panMarker = function (_id) {
        var result = {};
        result = $.grep(main.markers, function (e) { return e.options.id === _id; });
        main.map.setView(result[0].getLatLng(), 16);
    }
    //PAN MAP
    main.panMap = function (_latitude, _longitude) {
        var pos = osmLatLng(_latitude, _longitude);
        main.map.setView(pos, 16);
    }

    main.createOsmPoint = function (_latitude, _longitude) {
        var point = { lat: _latitude, lng: _longitude };
        return point;
    }

    //CLEAR ALL MAP OVERLAYS FOR HISTORY
    main.clearHistory = function () {
        main.historyMarkers.forEach(function (h) {
            main.map.removeLayer(h);
        });

        main.historyStartIndex = 0;
        main.historyMarkers = [];
        clearTimeout(main.historyTimeOut);
        alert(main.historyStartIndex);

    };

    //SET MARKER AS SELECTED MARKER
    main.selectMarker = function (_marker) {
        main.selectedMarker = _marker;
    }

    main.tempStart = {};
    main.tempEnd = {};
    main.historyTimeOut = null;


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
                var pos = osmLatLng(latx, i);
            }
            points.push(pos);
        }


        if (points.length < 2) {
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
                    main.tempStart = points[i - 1];
                    main.tempEnd = points[i];
                    main.historyTimeOut = setTimeout(moveMarker, 10);
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
        main.map.removeLayer(main.historyMarker);
        return main.historyMarker;
    }

    //ANIMATE THE HISTORY MARKERS
    var animateHistoryMarker = false;
    main.startAnimateHistoryMarker = function (_marker, _history) {
        main.historyMarker = _marker;
        animateHistoryMarker = true;

        main.historyStartIndex = main.historyMarkers.length;

        _marker.addTo(main.map);

        if (_history.length > 1) {
            var i = main.historyStartIndex;
            var tempPoints;
            if (i < 1) {
                tempPoints = { latitude: _history[0].Latitude, longitude: _history[0].Longitude };

            } else {
                tempPoints = { latitude: main.tempStart.lat, longitude: main.tempStart.lng };
            }

            function moveMarker() {

                var points = osmLatLng(_history[i].Latitude, _history[i].Longitude);

                var animate = main.animateMarkerMovement(_marker, tempPoints, { latitude: _history[i].Latitude, longitude: _history[i].Longitude });
                main.map.setView(points);

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
                        console.log(i);
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
            console.log(polyLineDrawer);
        } else {
            polyLineDrawer.disable();
        }
    }

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
    };

    //ADD A POLYLINE
    main.addPolyline = function (_polyline, _type) {
        if (main.historyMarkers.length === 0 && main.polylines.length === 0) {
            _polyline.addTo(this.map);
            _polyline['type'] = _type;
            this.polylines.push(_polyline);
        }
    };

    //EDIT A POLYLINE
    main.editPolyline = function (_id) {
        var result = $.grep(main.polylines, function (e) { return e.options.id == _id });
        result[0].editing.enable();
    };

    //REMOVE A POLYLINE
    main.removePolyline = function (_id) {
        var result = $.grep(main.polylines, function (e) { return e.options.id == _id });
        this.map.removeLayer(result[0]);
        //console.log(result.indexOf(result[0]));
        main.polylines.splice(main.polylines.indexOf(result[0]), 1);
        //console.log(this.polylines);
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

}

function osmLatLng(_latitude, _longitude) {
    return new L.LatLng(_latitude, _longitude);
}