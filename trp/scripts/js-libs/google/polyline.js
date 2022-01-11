function googlePolyline(_points, _strokeColor, _strokeOpacity, _strokeWeight, _id) {
    this.strokeColor = _strokeColor;
    this.strokeOpacity = _strokeOpacity;
    this.strokeWeight = _strokeWeight;
    this.id = _id;
    this.path = _points;
    this.polyline = new google.maps.Polyline({
        path: this.path,
        strokeColor: this.strokeColor,
        strokeOpacity: this.strokeOpacity,
        strokeWeight: this.strokeWeight,
        editable: false,
        id: this.id
    });

    return this.polyline;
}
var lineSymbol = {
    path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
          scale: 4,
          strokeColor: '#393'
        };
function googlePolylineAnimate(_points, _strokeColor, _strokeOpacity, _strokeWeight, _id, _lineSymbol) {
    this.strokeColor = _strokeColor;
    this.strokeOpacity = _strokeOpacity;
    this.strokeWeight = _strokeWeight;
    this.id = _id;
    this.path = _points;
    this.lineSymbol = _lineSymbol;
    this.polyline = new google.maps.Polyline({
        path: this.path,
        icons:[{
            icon: lineSymbol,
            offset: '100%'
        }],
        strokeColor: this.strokeColor,
        strokeOpacity: this.strokeOpacity,
        strokeWeight: this.strokeWeight,
        editable: false,
        id: this.id
    });

    return this.polyline;
}

function googleNearestPolyline(_points, _strokeColor, _strokeOpacity, _strokeWeight) {
    this.path = _points;
    this.strokeColor = _strokeColor;
    this.strokeOpacity = _strokeOpacity;
    this.strokeWeight = 10;

    this.polyline = new google.maps.Polyline({
        path: this.path,
        geodesic: true,
        strokeColor: this.strokeColor,
        strokeOpacity: this.strokeOpacity,
        strokeWeight: this.strokeWeight
    });

    return this.polyline;
}

function googleRulerPolyline(_map, _strokeColor, _strokeOpacity, _strokeWeight) {
    this.polyline = new google.maps.Polyline({
        map: _map,
        strokeColor: _strokeColor,
        strokeOpacity: _strokeOpacity,
        strokeWeight: _strokeWeight
    });
    return this.polyline;

}

function googleRoutePolyline(_map, _strokeColor, _strokeOpacity, _strokeWeight) {
    this.polyline = new google.maps.Polyline({
        map: _map,
        strokeColor: _strokeColor,
        strokeOpacity: _strokeOpacity,
        strokeWeight: _strokeWeight
    });
    return this.polyline;
}


function googleTracerPolyline(_map, _strokeColor, _strokeOpacity, _strokeWeight) {

    this.polyline = new google.maps.Polyline({
        map: _map,
        strokeColor: _strokeColor,
        strokeOpacity: _strokeOpacity,
        strokeWeight: _strokeWeight
    });

    return this.polyline;
}