function osmMarkerClusters() {
    var markerCluster = L.markerClusterGroup();

    //create a cluster
    this.createMarkerCluster = function (_marker) {
        markerCluster.addLayer(_marker);
        osmMap.map.addLayer(markerCluster);
    }

    //remove cluster

    this.removeMarkerCluster = function (_marker) {

    }
    
}