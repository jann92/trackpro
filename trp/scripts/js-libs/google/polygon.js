function googlePolygon(_points, _color, _id) {
    this.strokeColor = _color;
    this.strokeOpacity = 0.5;
    this.strokeWeight = 3;
    this.id = _id;
    this.path = _points;
    this.fillOpacity = 0.2;
    this.polygon = new google.maps.Polygon({
        path: this.path,
        strokeColor: this.strokeColor,
        fillColor: this.strokeColor,
        strokeOpacity: this.strokeOpacity,
        strokeWeight: this.strokeWeight,
        fillOpacity: this.fillOpacity,
        editable: false,
        clickable: false,
        id: this.id,
        geodesic: false,
    });

    return this.polygon;
}