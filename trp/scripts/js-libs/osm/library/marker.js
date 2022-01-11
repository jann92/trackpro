function osmMarker(_coordinates, _draggable, _visible, _icon, _label, _labelClass, _id) {
    this.coordinates = [_coordinates.latitude, _coordinates.longitude];
    this.draggable = _draggable;
    this.visible = _visible;
    this.icon = _icon;
    this.label = _label;
    this.labelClass = _labelClass;
    this.id = _id;

    this.marker = new L.marker(this.coordinates, {
        icon: this.icon,
        draggable: this.draggable,
        visible: this.visible,
        id: this.id,
    }).bindLabel(this.label, {
            noHide: true,
            className: this.labelClass,
            clickable: true,
            opacity: 1

    });
    this.marker['id'] = this.id;

    return this.marker;
}

function osmHistoryMarker(_coordinates,_labelClass,_labelContent,_color,_rotation,_labelAnchor,_id) {
    this.coordinates = [_coordinates.latitude, _coordinates.longitude];
    this.labelClass = _labelClass;
    this.labelContent = _labelContent;
    this.color = _color;
    this.rotation = _rotation;
    this.labelAnchor = _labelAnchor;
    this.id = _id;

    this.icon = new L.Icon({
        iconUrl: 'https://cdn2.iconfinder.com/data/icons/orientation/32/location-north-512.png',
        labelAnchor: [-200, 90],
        iconSize: [30,30]
    });

    this.marker = new L.marker(this.coordinates, {
       // icon: this.icon,
        draggable: false,
        visible: true,
        id: this.id
    }).bindLabel(this.labelContent, {
        noHide: true,
        className: this.labelClass,

    });

    this.marker['id'] = this.id;

    this.marker.setIconAngle(this.rotation);

    return this.marker;
}

function osmNearestAssetMarker(_point, _map) {
    //var icon = new L.Icon({
    //    iconUrl: 
    //});

    this.marker = new L.marker(_point, {
        draggable: true
    }).addTo(_map);

    return this.marker;
}

function osmLandmarkMarker(_position, _icon, _id) {
    this.position = new L.LatLng(_position.Latitude, _position.Longitude);
    this.id = _id;
    this.icon = new L.Icon({
        iconUrl: _icon,
    });

    this.marker = new L.Marker(this.position,{
        icon: this.icon,
        position: this.position,
        draggable: false
    });

    this.marker['id'] = this.id;
    return this.marker;
}

function osmRulerMarker(_map, _points, _count) {
    var span = "<span class='ruler-marker-label'>" + _count + "</span>";
    this.icon = L.divIcon({ html: "<img src='../../contents/images/osm/circle-green.png' style='width:30px;height:30px;'>" + span + "</img>", className: 'ruler-marker-label' });
    this.marker = new L.Marker(_points, {
        icon: this.icon,
        color: "#44B449",
        draggable: true
    }).addTo(_map);
    return this.marker;
}

function osmZoneMarker(_points,_content) {
    this.icon = L.divIcon({ html: _content });
    this.marker = new L.Marker(_points, {
        icon: this.icon,
        color: "#44B449",
        draggable: true
    });
    return this.marker;
}