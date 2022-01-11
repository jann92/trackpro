function googleMarker(_position, _draggable, _visible, _labelClass, _labelContent, _labelAnchor, _icon, _id, _content, _iconAnchor, _iconSize, _iconScaleSize) {
    this.position = new google.maps.LatLng(_position.latitude, _position.longitude);
    this.draggable = _draggable;
    this.visible = _visible;
    this.labelClass = _labelClass;
    this.labelContent = _labelContent;
    this.labelAnchor = new google.maps.Point(_labelAnchor.x, _labelAnchor.y);
    this.id = _id;
    this.content = _content;
    this.icon = _icon;
    this.iconAnchor = _iconAnchor;
    this.iconSize = _iconSize;
    this.iconScaleSize = _iconScaleSize;
    this.marker = new MarkerWithLabel({
        icon: {
            url: this.icon.url,
            //scaledSize: new google.maps.Size(this.iconScaleSize.x, this.iconScaleSize.y),
            scaledSize: new google.maps.Size(100, 100),
            //size: new google.maps.Size(this.iconSize.x, this.iconSize.y),
            origin: new google.maps.Point(0, 0),
            //anchor: new google.maps.Point(this.iconAnchor.x, this.iconAnchor.y)
            anchor: new google.maps.Point(50, 50)
        },
        position: this.position,
        draggable: this.draggable,
        visible: this.visible,
        labelClass: this.labelClass,
        labelContent: this.labelContent,
        labelAnchor: this.labelAnchor,
        marker: MarkerWithLabel,
        labelInBackground: true,
        id: this.id,
        content: this.content
    });

    this.marker['options'] = { id: this.id };

    return this.marker;

}

function googleHistoryMarker(_position, _labelClass, _labelContent, _color, _rotation, _labelAnchor, _id, _content) {
    this.position = new google.maps.LatLng(_position.latitude, _position.longitude);
    this.labelClass = _labelClass;
    this.labelContent = _labelContent;
    this.labelAnchor = new google.maps.Point(_labelAnchor.x, _labelAnchor.y);
    this.color = _color;
    this.rotation = _rotation;
    this.content = _content
    this.marker = new MarkerWithLabel({
        icon: {
            //path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            path: google.maps.SymbolPath.CIRCLE,
            scale: 3,
            strokeColor: this.color,
            fillColor: this.color,
            rotation: this.rotation
        },
        position: this.position,
        draggable: false,
        visible: true,
        labelClass: this.labelClass,
        labelContent: this.labelContent,
        labelAnchor: this.labelAnchor,
        marker: MarkerWithLabel,
        id: _content.AssetID,
        content: this.content,
    });
    return this.marker;
}

function googleNearestAssetMarker(_point, _map) {
    this.marker = new google.maps.Marker({
        //icon: '../../../contents/images/marker/nearest_asset_marker.png',
        position: _point,
        map: _map,
        draggable: true
    });
    return this.marker;
}

function googleLandmarkMarker(_position, _icon, _id) {
    this.position = new google.maps.LatLng(_position.Latitude, _position.Longitude);
    this.icon = _icon;
    this.id = _id;
    this.marker = new google.maps.Marker({
        icon: this.icon,
        position: this.position,
        draggable: false
    });

    this.marker['id'] = this.id;
    return this.marker;
}

function googleRulerMarker(_map) {

    this.marker = new google.maps.Marker({
        map: _map,
        icon: {
            url: "../../contents/images/osm/circle-green.png",
            scaledSize: new google.maps.Size(30, 30),
            anchor: new google.maps.Point(15, 15),
            strokeColor: "#44B449"
        },
        draggable: true,
    });
    return this.marker;

}


function googleRouteMarker(_map, _points, url) {
    this.marker = new google.maps.Marker({
        map: _map,
        position: _points,
        icon: {
            url: url,
            scaledSize: new google.maps.Size(30, 30),
            anchor: new google.maps.Point(15, 15),
            strokeColor: "#44B449"
        },
    });
    return this.marker;
}

function googleTraceMarker(_map, _position) {
    this.marker = new google.maps.Marker({
        map: _map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 6,
            strokeColor: "#44B449",
            position: _position
        }
    });
    return this.marker;
}

function googleZoneMarker(_position, _labelContent) {
    this.marker = new MarkerWithLabel({
        icon: " ",
        position: _position,
        labelContent: _labelContent,
        labelInBackground: true,
        visible: false,
        labelClass: "zones-marker"
    });
    this.marker['type'] = "zone-marker";
    return this.marker;
}

function googleLandmarkLabelMarker(_position, _labelContent) {
    this.position = new google.maps.LatLng(_position.Latitude, _position.Longitude);
    this.marker = new MarkerWithLabel({
        icon: " ",
        position: this.position,
        labelContent: _labelContent,
        labelInBackground: true,
        visible: false,
        labelClass: "zones-marker"
    });
    this.marker['type'] = "landmark-label-marker";
    return this.marker;
}