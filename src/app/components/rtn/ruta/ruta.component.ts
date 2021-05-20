import { Component, OnInit } from '@angular/core';
declare const google: any;

var originMarker: any;
var destinationMarker:any;
var directionsService: any;
var directionsDisplay: any;
var map: any;
var originLat:number;
var originLng:number;
var destinationLat:number;
var destinationLng:number;
var arrCtrlPts: any = [];
var all_overlays : any = [];

var isOriginDestinationCreated: boolean = false;
var isOriginCreated: boolean = false;
var isDestinationCreated: boolean = false;
var isRouteCreated: boolean = false;
var isOptionalRouteCreated: boolean =false;

@Component({
  selector: 'app-ruta',
  templateUrl: './ruta.component.html',
  styleUrls: ['./ruta.component.css']
})
export class RutaComponent implements OnInit {
   ruta: any = {};
   data: any = {};
   public nombreRuta: string;
   public direccionOrigen: string;
   public direccionDestino: string;

/*  var arrCtrlPts: string[];
  arrCtrlPts = [];*/
  //var arrRtnPts=[];
  constructor() { }

  ngOnInit() {
    map = new google.maps.Map(document.getElementById('b-map'), {
           zoom: 7,
           center: new google.maps.LatLng(4.624335, -74.063644)
    });

    /*var drawingManager = new google.maps.drawing.DrawingManager({
         drawingControl: true,
         drawingControlOptions: {
           position: google.maps.ControlPosition.TOP_CENTER,
           drawingModes: ['marker']
         },
         markerOptions: {icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'}
       });
       drawingManager.setMap(map);
       google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
         all_overlays.push(event);
        if(event.type==google.maps.drawing.OverlayType.MARKER){
          var desCtrlPt = "";
          while (desCtrlPt == "") {
               desCtrlPt=prompt("Ingrese una descripción:", "");
               var pos = event.overlay.getPosition();
               //alert(pos.lat()+" "+pos.lng());
               if(desCtrlPt!=""){
                if(desCtrlPt!=null){
                 arrCtrlPts.push({
                    latitude: pos.lat(),
                    longitude: pos.lng(),
                    description: desCtrlPt
                 });
                }
               }
          }
        }
      });*/

    var places1 = new google.maps.places.Autocomplete(document.getElementById('originAddress'));
    google.maps.event.addListener(places1, 'place_changed', function() {
      var place1 = places1.getPlace();

      var src_addr = place1.formatted_address;
      var src_lat = place1.geometry.location.lat();
      var src_long = place1.geometry.location.lng();
      originLat=src_lat;
      originLng=src_long;
      var mesg1 = "Address 1: " + src_addr;
      mesg1 += "\nLatitude: " + src_lat;
      mesg1 += "\nLongitude: " + src_long;
      //alert(mesg1);
    });
    var places2 = new google.maps.places.Autocomplete(document.getElementById('destinationAddress'));
    google.maps.event.addListener(places2, 'place_changed', function() {
      var place2 = places2.getPlace();

      var src_addr = place2.formatted_address;
      var src_lat = place2.geometry.location.lat();
      var src_long = place2.geometry.location.lng();
      destinationLat=src_lat;
      destinationLng=src_long;
      var mesg2 = "Address 2: " + src_addr;
      mesg2 += "\nLatitude: " + src_lat;
      mesg2 += "\nLongitude: " + src_long;
      //alert(mesg2);
    });
  }
  addOriginPtn(){
    alert(isOriginCreated);
    var infoWindow = new google.maps.InfoWindow({map: map});
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(function(position) {
        if(isOriginCreated==false){
         var pos = {
           lat: position.coords.latitude,
           lng: position.coords.longitude
         };

         /*infoWindow.setPosition(pos);
         infoWindow.setContent('Location found.');*/
         map.setCenter(pos);
         originMarker = new google.maps.Marker({
           position: pos,
           map: map,
           draggable: true
         });
         //create a marker
         var infoWindowContent1 = '<div class="info_content">' +
             '<h5>'+(<HTMLInputElement>document.getElementById('originCity')).value+'</h5>' +
             '<p> Dirección: '+(<HTMLInputElement>document.getElementById('originAddress')).value+'</p>' +
         '</div>';
         var infoWindow1 = new google.maps.InfoWindow({
            content: infoWindowContent1
         });
         google.maps.event.addListener(originMarker, 'click', function() {
           //infoWindow1.open(map, originMarker);
         });
         google.maps.event.addListener(originMarker, 'dragend', function(marker){
           var latLng = marker.latLng;
           originLat = latLng.lat();
           originLng = latLng.lng();
           alert(originLat+" "+originLng);
        });
        isOriginCreated=true;
        }
       }, function() {
         //handleLocationError(true, infoWindow, map.getCenter());
       });
     } else {
       // Browser doesn't support Geolocation
       //handleLocationError(false, infoWindow, map.getCenter());
     }
  }
  addDestinationPtn(){
    var infoWindow = new google.maps.InfoWindow({map: map});
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(function(position) {
        if(isDestinationCreated==false){
         var pos = {
           lat: position.coords.latitude,
           lng: position.coords.longitude
         };

         //infoWindow.setPosition(pos);
         //infoWindow.setContent('Location found.');
         map.setCenter(pos);
         var infoWindowContent2 = '<div class="info_content">' +
             '<h5>'+(<HTMLInputElement>document.getElementById('destinationCity')).value+'</h5>' +
             '<p> Dirección: '+(<HTMLInputElement>document.getElementById('destinationAddress')).value+'</p>' +
         '</div>';
         var infoWindow2 = new google.maps.InfoWindow({
            content: infoWindowContent2
         });

        var pinImage = new google.maps.MarkerImage("http://www.googlemapsmarkers.com/v1/7d2181/");
         destinationMarker = new google.maps.Marker({
           position: pos,
           icon: pinImage,
           map: map,
           draggable: true
         });
         google.maps.event.addListener(destinationMarker, 'click', function() {
           infoWindow2.open(map, destinationMarker);
         });
         //isOriginDestinationCreated=true;
         //map.setCenter(coordinate);
         //map.setZoom(18);
         google.maps.event.addListener(destinationMarker, 'dragend', function(marker){
           var latLng = marker.latLng;
           destinationLat = latLng.lat();
           destinationLng = latLng.lng();
           alert(destinationLat+" "+destinationLng);
        });
        isDestinationCreated=true;
        }
       }, function() {
         //handleLocationError(true, infoWindow, map.getCenter());
       });
     } else {
       // Browser doesn't support Geolocation
       //handleLocationError(false, infoWindow, map.getCenter());
     }
  }
  //Create origin destination route
  createOriginDestination(){
    //alert(this.ruta.name);
    //alert(this.ruta.originAddress);
    var mesg2 = "nombre ruta: " + this.ruta.name;
    mesg2 += "\nLatitude 1: " + originLat;
    mesg2 += "\nLongitude 1: " + originLng;
    mesg2 += "\nLatitude 2: " + destinationLat;
    mesg2 += "\nLongitude 2: " + destinationLng;
    alert(mesg2);

    if (!originLat || !originLng) return;

    var coordinate = new google.maps.LatLng(originLat, originLng);
    if (originMarker)
    {
      //if marker already was created change positon
      if(isOriginCreated==false){
         originMarker.setPosition(coordinate);
      }

      //map.setCenter(coordinate);
      //map.setZoom(18);
    }
    else
    {
      //create a marker
      var infoWindowContent1 = '<div class="info_content">' +
          '<h5>'+(<HTMLInputElement>document.getElementById('originCity')).value+'</h5>' +
          '<p> Dirección: '+(<HTMLInputElement>document.getElementById('originAddress')).value+'</p>' +
      '</div>';
      var infoWindow1 = new google.maps.InfoWindow({
         content: infoWindowContent1
      });
      originMarker = new google.maps.Marker({
        position: coordinate,
        map: map,
        draggable: true
      });
      google.maps.event.addListener(originMarker, 'click', function() {
        infoWindow1.open(map, originMarker);
      });
      google.maps.event.addListener(originMarker, 'dragend', function(marker){
        var latLng = marker.latLng;
        originLat = latLng.lat();
        originLng = latLng.lng();
        alert(originLat+" "+originLng);
     });
     isOriginCreated=true;
      //map.setCenter(coordinate);
      //map.setZoom(18);
    }
    if (!destinationLat || !destinationLng) return;

    coordinate = new google.maps.LatLng(destinationLat, destinationLng);
    if (destinationMarker)
    {
      //if marker already was created change positon
      if(isDestinationCreated==false){
         destinationMarker.setPosition(coordinate);
      }
      //map.setCenter(coordinate);
      //map.setZoom(18);
    }
    else
    {
      //create a marker
      var infoWindowContent2 = '<div class="info_content">' +
          '<h5>'+(<HTMLInputElement>document.getElementById('destinationCity')).value+'</h5>' +
          '<p> Dirección: '+(<HTMLInputElement>document.getElementById('destinationAddress')).value+'</p>' +
      '</div>';
      var infoWindow2 = new google.maps.InfoWindow({
         content: infoWindowContent2
      });
      var pinImage = new google.maps.MarkerImage("http://www.googlemapsmarkers.com/v1/7d2181/");
      destinationMarker = new google.maps.Marker({
        position: coordinate,
        icon:pinImage,
        map: map,
        draggable: true
      });
      google.maps.event.addListener(destinationMarker, 'click', function() {
        infoWindow2.open(map, destinationMarker);
      });
      isDestinationCreated=true;
      isOriginDestinationCreated=true;
      //map.setCenter(coordinate);
      //map.setZoom(18);
      google.maps.event.addListener(destinationMarker, 'dragend', function(marker){
        var latLng = marker.latLng;
        destinationLat = latLng.lat();
        destinationLng = latLng.lng();
        alert(destinationLat+" "+destinationLng);
     });

    }
 }
 traceRtn(){
   if(isOriginCreated&&isDestinationCreated){
     if(isRouteCreated==false){
       directionsService = new google.maps.DirectionsService();
       directionsDisplay = new google.maps.DirectionsRenderer({
          draggable: true,
          suppressMarkers: true
      });
       var request = {
           origin:new google.maps.LatLng(originLat, originLng),
           destination: new google.maps.LatLng(destinationLat, destinationLng),
           travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        directionsDisplay.setMap(map);
         directionsService.route(request, function(response, status) {
             if (status === google.maps.DirectionsStatus.OK) {
                 directionsDisplay.setDirections(response);
                 originMarker.setMap(null);
                 destinationMarker.setMap(null);
                 var coordinateOrigin = new google.maps.LatLng(originLat, originLng);
                 var coordinateDestination=new google.maps.LatLng(destinationLat, destinationLng);
                 originMarker = new google.maps.Marker({
                   position: coordinateOrigin,
                   map: map
                 });
                 var pinImage = new google.maps.MarkerImage("http://www.googlemapsmarkers.com/v1/7d2181/");
                 destinationMarker = new google.maps.Marker({
                   position: coordinateDestination,
                   icon:pinImage,
                   map: map
                 });

             }
         });
         isRouteCreated=true;
     }else{

     }

   }else if(isOriginCreated==false || isDestinationCreated==false){
     alert("No se ha creado el punto de origen ó de destino.");
   }
 }
 /*displayRoutes(request1){
   var directionsService = new google.maps.DirectionsService();
   var directionsDisplay = new google.maps.DirectionsRenderer();
   directionsDisplay.setMap(map);
   directionsService.route(request1, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
 }*/
 saveRtn(){
   var nombreRtn=(<HTMLInputElement>document.getElementById('name')).value;
   var originAddr=(<HTMLInputElement>document.getElementById('originAddress')).value;
   var destinationAddr=(<HTMLInputElement>document.getElementById('destinationAddress')).value;
   console.log(nombreRtn);
   console.log(originAddr);
   console.log(destinationAddr);
   console.log(originLat+" "+originLng+" "+destinationLat+" "+destinationLng);
   var w=[],wp;
	 var rleg = directionsDisplay.directions.routes[0].legs[0];
	 this.data.origin = {'originLat': originLat, 'originLng':originLng};
	 this.data.destination = {'destinationLat': destinationLat, 'destinationLng':destinationLng};
	 var wp = rleg.via_waypoints;
	 for(var i=0;i<wp.length;i++){
     w[i] = [wp[i].lat(),wp[i].lng()];
   }
	 this.data.waypoints = w;
   var str = JSON.stringify(this.data);
   console.log(str);


     // if(isOptionalRouteCreated==false){
     //    if(arrCtrlPts.length>0){
     //      var directionsService = new google.maps.DirectionsService;
     //      var directionsDisplay = new google.maps.DirectionsRenderer;
     //      var directionsDisplay = new google.maps.DirectionsRenderer(
     //      {
     //        map: map, draggable:true
     //      },
     //      {
     //          polylineOptions: {
     //            strokeColor: "red"
     //          }
     //      });
     //      var wayPoints = [];
     //      console.log(arrCtrlPts);
     //      console.log(arrCtrlPts.length);
     //      directionsDisplay.setMap(map);
     //      for(var i=0;i<arrCtrlPts.length;i++){
     //        wayPoints.push({
     //            location: new google.maps.LatLng(arrCtrlPts[i].latitude,arrCtrlPts[i].longitude),
     //            stopover: true
     //        });
     //
     //      }
     //      console.log(wayPoints);
     //      var request = {
     //          origin:new google.maps.LatLng(originLat, originLng),
     //          destination: new google.maps.LatLng(destinationLat, destinationLng),
     //          waypoints: wayPoints,
     //          optimizeWaypoints: true,
     //          travelMode: google.maps.DirectionsTravelMode.DRIVING
     //      };
     //      directionsService.route(request, function(response, status) {
     //        if (status === 'OK') {
     //          directionsDisplay.setDirections(response);
     //          for (var i=0; i < all_overlays.length; i++)
     //          {
     //            all_overlays[i].overlay.setMap(null);
     //          }
     //          all_overlays = [];
     //          /*var route = response.routes[0];
     //          var summaryPanel = document.getElementById('directions-panel');
     //          summaryPanel.innerHTML = '';
     //          for (var i = 0; i < route.legs.length; i++) {
     //            var routeSegment = i + 1;
     //            summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
     //                '</b><br>';
     //            summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
     //            summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
     //            summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
     //          }*/
     //        } else {
     //          window.alert('Directions request failed due to ' + status);
     //        }
     //      });
     //
     //      isOptionalRouteCreated=true;
     //    }
     //
     // }else{
     //
     // }
 }

}
