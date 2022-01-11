function createMap(){
    var gmap = new googleMaps();
    gmap.createMap(10, { latitude: 14.13, longitude: 121.23 }, 'map-canvas');

    //var marker = new googleMarker({ latitude: 14.13, longitude: 121.23 }, true, true, 'label-map', "<input type='text' value='tester'/>", new google.maps.Point(50, 0));
    //marker.setMap(gmap.map);
    var position = { latitude: 14.13, longitude: 121.23 };

    //gmap.addMarker(marker);


    //for (var i = 0; i < 10; i++) {
    //    var marker = new googleMarker({ latitude: 14.13 + i, longitude: 121.23 + i }, true, true, 'label-map', "<input type='text' value='testesr"+ i +"'/>", new google.maps.Point(50, 0));
    //    marker.setMap(gmap.map);
    //}


}
    



    //$("#add-marker").click(function () {

    //    //var gm = new googleMarker(
    //    //    position
    //    //    , true
    //    //    , true
    //    //    , 'label-map'
    //    //    , "<input type='text' value='testesr'/>"
    //    //    , { x: 50, y: 0 }
    //    //    , { AssetID: '63620', Name: 'PLD-231' });

    //    position.longitude += 1
    //    //{draggable:true,visible:true,labelClass:'label-map',labelAnchor:{x:50,y:0}}
    //    var marker = gmap.createMarker({
    //        draggable: true
    //        , visible: true
    //        , labelClass: 'label-map'
    //        , labelAnchor: { x: 50, y: 0 }
    //    }, {
    //        labelContent: "<input type='text' value='testesr'/>"
    //        , values: { AssetID: '63620', Name: 'PLD-231', Latitude: 14.13, Longitude: 121.23 }
    //    });

    //    gmap.addMarker(marker);

    //    console.log(gmap.markers.length);
    //});


function removeMarker() {
   gmap.addMarker(marker);
}

