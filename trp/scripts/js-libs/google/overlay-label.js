// Define the overlay
function overlayLabel(_map) {
    //this.setValues(opt_options);
    var span = this.span_ = document.createElement('span');
    span.style.cssText = 'position: relative; left: -50%; top: -10px;color:white; ' +
                         'white-space: nowrap;font-size:15px;font-weight:600;' +
                         'padding: 2px;text-shadow: 2px 2px 3px rgba(101, 129, 165, 1);';

    var div = this.div_ = document.createElement('div');
    div.appendChild(span);
    div.style.cssText = 'position: absolute; display: none';
}
overlayLabel.prototype = new google.maps.OverlayView();
// Label for Ruler Marker
overlayLabel.prototype.onAdd = function () {
    //var pane = this.getPanes().floatPane;
    //pane.overlayMouseTarget.appendChild(this.div_);
    this.getPanes().overlayMouseTarget.appendChild(this.div_);
    var me = this;
    this.listeners_ = [
        google.maps.event.addListener(this, 'position_changed',
            function () { me.draw(); }),
        google.maps.event.addListener(this, 'text_changed',
            function () { me.draw(); }),
        google.maps.event.addDomListener(this.div_, 'mouseover',
            function (e) {  })
    ];
};

// Implement onRemove
overlayLabel.prototype.onRemove = function () {
    var i, I;
    this.div_.parentNode.removeChild(this.div_);

    for (i = 0, I = this.listeners_.length; i < I; ++i) {
        google.maps.event.removeListener(this.listeners_[i]);
    }
};

// Implement draw
overlayLabel.prototype.draw = function () {
    var projection = this.getProjection();
    var position = projection.fromLatLngToDivPixel(this.get('position'));

    var div = this.div_;
    div.style.left = position.x + 'px';
    div.style.top = position.y + 'px';
    div.style.display = 'block';

    this.span_.innerHTML = this.get('text').toString();
};


// Set the visibility to 'hidden' or 'visible'.
overlayLabel.prototype.hide = function () {
    if (this.div_) {
        // The visibility property must be a string enclosed in quotes.
        this.div_.style.visibility = 'hidden';
    }
};

overlayLabel.prototype.show = function () {
    if (this.div_) {
        this.div_.style.visibility = 'visible';
    }
};

