function osmPolygon(_points, _color, _id) {
    this.points = _points;
    this.color = _color;
    this.weight = 3;
    this.opacity = 0.5;
    //this.fillColor = _fillColor;
    //this.className = _className;
    this.id = _id;

    this.polygon = new L.Polygon(this.points, {
        color: this.color,
        weight: this.weight,
        opacity: this.opacity,
        //fillColor: this.fillColor,
        //className: this.className,
        id: this.id
    });

    return this.polygon;
}


