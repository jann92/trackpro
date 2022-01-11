'use strict';
app.factory('MapHistoryFactory', ['$http', '$localStorage', '$filter', function ($http, $localStorage, $filter) {
    var baseUrl = "../";
    var gmap = new googleHistoryMaps();
    var pt = null;


    return {
        createMap: function (element_id) {
            return gmap.createMap(10, { latitude: 14.13, longitude: 121.23 }, element_id);
        },
        refreshMap: function(){
            google.maps.event.trigger(gmap.map, 'resize');
        },
        createIcon: function () {

        },
        createMarker: function (options, content, icon, id, type) {
     
            var markerChecker = gmap.isHistoryMarkerExist(id);
            if (markerChecker == null) {
                var marker = gmap.createMarker(options, content, icon, id, type);
                return marker;
            }
            else {
                return markerChecker;
            }
        },
        createHistoryMarker: function (options, content, icon, id, type,scope) {

            var markerChecker = gmap.isHistoryMarkerExist(id);
            if (markerChecker == null) {
                var marker = gmap.createHistoryMarker(options, content, icon, id, type,scope);
                return marker;
            }
            else {
                return markerChecker;
            }
        },
        isHistoryMarkerExist: function (id) {
            return gmap.isHistoryMarkerExist(id);
        },    
        addMarker: function (marker, type) {
            return gmap.addMarker(marker, type);
        },
        updateMarker: function (id, content, icon) {
            return gmap.updateMarker(id, content, icon);
        },
        animateHistoryMarkerDefault: function(polyline){
            return gmap.animateHistoryMarkerDefault(polyline);
        },
        animateHistoryMarker: function (marker, points) {
            gmap.startAnimateHistoryMarker(marker, points);
        },
        stopAnimateHistoryMarker: function () {
            return gmap.stopAnimateHistoryMarker();
        },
        showMartoggleMarkerker: function (id) {
            gmap.toggleMarker(id);
        },
        toggleMarker: function (id) {
            gmap.toggleMarker(id);
        },
        panMarker: function (id) {
            gmap.panMarker(id);
        },
        panMap: function (latitude, longitude) {
            gmap.panMap(latitude, longitude);
        },
        panHistoryMarker: function (id) {
            gmap.panHistoryMarker(id);
        },
        
        startDrawing: function (type, options) {
            gmap.startDrawing(type, options);
        },
        toggleAllMarkers: function (visible) {
            gmap.markers.forEach(function (m) {
                gmap.toggleMarker(m['id'], visible);
            });
        },

        toggleAllMarkerLabels: function () {
            gmap.markers.forEach(function (m) {
                gmap.toggleMarkerLabel(m['id']);
            });
        },
        clearHistory: function () {
            gmap.clearHistory();
        },
        markerCluster: function (cluster) {
            gmap.markerCluster(cluster);
        },
        stopDrawing: function () {
            gmap.stopDrawing();
        },
        createPolygon: function (type, points, options, id) {
            console.log(type);
            return gmap.createPolygon(type, points, options, id);
        },
        addPolygon: function (polygon) {
            gmap.addPolygon(polygon);
        },
        showPolygon: function (polygon, show) {
            gmap.showPolygon(polygon, show);
        },
        toggleVisibilityPolygon: function (show) {
            gmap.toggleVisibilityPolygon(show);
        },
        editPolygon: function (polygon_id) {
            gmap.editPolygon(polygon_id);
            return gmap.selectedOverlay;
        },
        emptyPolygon: function () {
            gmap.emptyPolygon();
        },
        cancelEditPolygon: function (polygon_id) {
            gmap.cancelEditPolygon(polygon_id);
        },
        removePolygon: function (polygon_id) {
            gmap.removePolygon(polygon_id);
        },
        panPolygon: function (polygon_id) {
            gmap.panPolygon(polygon_id);
        },
        getGeoCoordinateList: function () {
            return gmap.getPolygonPath(gmap.selectedOverlay);
        },
        getCircleCenter: function () {
            return gmap.getCircleCenter(gmap.selectedOverlay);
        },
        createPoint: function (latitude, longitude) {
            return gmap.createGooglePoint(latitude, longitude);
        },
        getZoneArea: function () {
            return gmap.getZoneArea(gmap.selectedOverlay);
        },
        updateZoneColor: function (color) {
            gmap.updateZoneColor(color);
        },
        getCircleRadiusFromArea: function (area) {
            return Math.sqrt(area / Math.PI);
        },
        createPolyline: function (points, options, id, marker) {
            return gmap.createPolyline(points, options, id, marker);
        },
        addPolyline: function (polyline, type) {
            return gmap.addPolyline(polyline, type);
        },
        placeSearch: function (element) {
            gmap.placeSearch(element);
        },
        removeOverlay: function () {
            gmap.removeOverlay();
        },
        addPolygonGeoJSON: function(_data){
            return gmap.addPolygonGeoJSON(_data);
        },
        loadGeoJSONZone: function (_json) {
            return gmap.loadGeoJson(_json);
        },
        showGeoJSON: function (_id, _show) {
            gmap.showGeoJson(_id, _show);
        },
        exportFileKML: function (_list, _type) {
            var result = gmap.exportToKML(_list, _type);
            return result;
        },
        createAlert: function (title, message, type) {
            var icon = '<i class="fa fa-info-circle"></i>&nbsp;';
            if (type === "danger") {
                icon = '<i class="fa fa-exclamation-triangle"></i>&nbsp;';
            }
            else if (type === "success") {
                icon = '<i class="fa fa-check-circle alert-icon"></i>&nbsp;';
            }
            else if (type === "info") {
                icon = '<i class="fa fa-refresh fa-spin alert-icon"></i>&nbsp;';
            }
            $('#alert_placeholder').show('slide');
            message = (message == null ? "Please contact your administrator for more information." : message);
            $('#alert_placeholder').html('<div class="alert alert-' + type + ' alert-dismissable alert-custom"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><span class="alert-title">' + icon + title + '</span><hr/><span class="alert-message">' + message + '</span></div>')
            setTimeout(function () {
                $('#alert_placeholder').hide('slide');
            }, 10000);
        }
    };
}
]);

