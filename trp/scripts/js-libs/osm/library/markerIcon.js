function osmMarkerIcon(_url, _iconSize, _iconAnchor, _labelAnchor) {
    this.url = _url;
    this.iconSize = _iconSize;
    this.iconAnchor = _iconAnchor;
    this.labelAnchor = _labelAnchor;

    this.markerIcon = new L.Icon({
        iconUrl: this.url,
        iconSize: this.iconSize,
        iconAnchor: this.iconAnchor,
        labelAnchor: this.labelAnchor
    });
    
    return this.markerIcon;
}