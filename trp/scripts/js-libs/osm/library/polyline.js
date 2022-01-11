function osmPolyline(_points, _color, _opacity, _weight, _className, _id) {
    this.points = _points;
    this.color = _color;
    this.opacity = _opacity;
    this.weight = _weight;
    this.className = _className;
    this.id = _id;

    this.polyline = new L.Polyline(this.points,
        {
            color: this.color,
            weight: this.weight,
            opacity: this.opacity,
            className: this.className,
            id: this.id
        });
    return this.polyline;
}

function osmNearestPolyline(_points, _strokeColor, _strokeOpacity, _strokeWeight) {
    this.path = _points;
    this.color = _strokeColor;
    this.opacity = _strokeOpacity;
    this.weight = 10;

    this.polyline = new L.Polyline(this.path, {
        color: this.color,
        weight: this.weight,
        opacity: this.opacity
    });

    return this.polyline;
}

function osmRulerPolyline(_map, _strokeColor, _strokeOpacity, _strokeWeight) {
    this.polyline = new L.Polyline({
        color: _strokeColor,
        opacity: _strokeOpacity,
        weight:_strokeWeight
    }).addTo(_map);
    return this.polyline;
}