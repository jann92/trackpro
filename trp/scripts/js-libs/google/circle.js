function googleCircle(_center, _radius, _color, _id) {
    this.strokeColor = _color;
    this.strokeOpacity = 0.5;
    this.strokeWeight = 3;
    this.id = _id;
    this.center = _center;
    this.fillOpacity = 0.2;
    this.radius = _radius;
    this.circle = new google.maps.Circle({
        center: this.center,
        radius: this.radius,
        strokeColor: this.strokeColor,
        fillColor: this.strokeColor,
        strokeOpacity: this.strokeOpacity,
        strokeWeight: this.strokeWeight,
        fillOpacity: this.fillOpacity,
        editable: false,
        id: this.id,
        //clickable: false,
        draggable: true
    });

    return this.circle;
}