function osmCircle(_center, _radius, _color, _id) {
    this.center = _center
    this.color = _color;
    this.opacity = 0.5;
    this.weight = 3;
    this.id = _id;
    this.radius = _radius;
    this.fillOpacity = 0.2;

    this.circle = new L.Circle([this.center.lat,this.center.lng], this.radius, {
        color: this.color,
        weight: this.weight,
        opacity: this.opacity,
        fillOpacity: this.fillOpacity,
        id: this.id
    });

    return this.circle;
}