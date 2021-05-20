import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AlertService} from '../../../services/alert.service';
import {RutaService} from '../../../services/ruta.service';
import {UsuarioService} from '../../../services/usuario.service';
import {CommonService} from '../../../services/common.service';
import {PuntoService} from '../../../services/punto.service';
import {ManifiestoService} from '../../../services/manifiesto.service';
import { Globals } from '../../../globals';
import {Observable,Subject,Observer}  from 'rxjs/Rx';
import swal from 'sweetalert2';
declare const google: any;
var PNotify = window['PNotify']|| [];
var travelService: any;
var marker: any;
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
var routes: any = [];
var vehicles: any = [];
var cur = 0;
var arrReq: any [] =[];
var ptsCtrl: any []=[];
var z=0, k=0;
var timeSeconds = 5000;// 10000 son 10 segundos, 5000 son 5 segundos
var tolerance = 0.0001;
var requestArray = [], renderArray = [], originMarkers = [], destinationMarkers = [];
function drawRoute(){
  //if(z<1){
  if(z<arrReq.length){
    var req=arrReq[z].req;
    console.log('ruta');
    console.log(arrReq[z]);
    directionsService.route(req, function(result, status) {
          console.log(status);
          if (status === google.maps.DirectionsStatus.OK) {
            var polyline = new google.maps.Polyline({
                path: [],
                strokeColor: '#FF0000',
                strokeWeight: 3
              });
              var bounds = new google.maps.LatLngBounds();
              var legs = result.routes[0].legs;
              for (var i = 0; i < legs.length; i++) {
                var steps = legs[i].steps;
                for (var j = 0; j < steps.length; j++) {
                  var nextSegment = steps[j].path;
                  for (var k = 0; k < nextSegment.length; k++) {
                    polyline.getPath().push(nextSegment[k]);
                    bounds.extend(nextSegment[k]);
                  }
                }
              }
              console.log(polyline.getPath().getArray());

              var pathArr = polyline.getPath();
              /*var codeStr = '  var linePath = [\n';
              for (var i = 0; i < pathArr.length; i++){
                  codeStr += '    {lat: ' + pathArr.getAt(i).lat() + ', lng: ' + pathArr.getAt(i).lng() + '}' ;
                  if (i !== pathArr.length-1) {
                      codeStr += ',\n';
                  };

              }
              codeStr += '\n  ];';*/
              var codeStr = '';
              for (var i = 0; i < pathArr.length; i++){
                  codeStr += '(' + pathArr.getAt(i).lat() + ',' + pathArr.getAt(i).lng() + ')' ;
                  if (i !== pathArr.length-1) {
                      codeStr += ',';
                  };
                /*  var marker = new google.maps.Marker({
                   position: new google.maps.LatLng(pathArr.getAt(i).lat(), pathArr.getAt(i).lng()),
                   map: map,
                });*/
              }
              //codeStr += '\n  ];';
              //console.log(codeStr);
              var param ={
                "routeId":arrReq[z].routeId,
                "routePts":codeStr
              }
              //console.log(param);
              /*travelService.actualizarRutaPuntos(param).then(response =>{
              });*/
              /*travelService.enviarNotificacionPush('SWX275', 'Prueba').then(response =>{
              });*/
              var col = '#' + (( 1 << 24) * Math.random() | 0).toString(16);
              console.log('color : ', col);
              var pinImage = new google.maps.MarkerImage('http://www.googlemapsmarkers.com/v1/27893e/');
              originMarker = new google.maps.Marker({
                position: req.origin,
                icon: pinImage
              });
              originMarkers[cur] = originMarker;
              originMarkers[cur].setMap(map);
              pinImage = new google.maps.MarkerImage('http://www.googlemapsmarkers.com/v1/7d2181/');
              destinationMarker = new google.maps.Marker({
                position: req.destination,
                icon: pinImage
              });
              destinationMarkers[cur] = destinationMarker;
              destinationMarkers[cur].setMap(map);
              var color = col;
              directionsDisplay = new google.maps.DirectionsRenderer({
                polylineOptions: {
                  strokeColor: color
                }
              });
              routes.push({routeId:arrReq[z].routeId, routeDisplay:directionsDisplay, polyline:polyline});
              routes[routes.length-1].routeDisplay.setOptions({suppressMarkers: true});
              //routes[routes.length-1].routeDisplay.setMap(map);
              routes[routes.length-1].routeDisplay.setDirections(result);
              polyline.setMap(map);

              google.maps.event.addListener(polyline, 'click', function(e) {
                alert("ruta: "+e.latLng.lat() + " " + e.latLng.lng());
                var coordinate = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
                //this.validarTrayecto(placa, coordinate);
              });

              z++;
              drawRoute();
          }
      });
      map.setZoom(10);
      map.setCenter(new google.maps.LatLng(originLat, originLng));
  }else{
    console.log(routes);
    console.log(renderArray);
  }
}

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {
  rutas: any [] = [];
  ptsCtrlVehicle: any[] = [];
  posBus: any [] = [[6.183103742556153, -75.58970409622293],[6.177445225140724, -75.59363650793347],[6.164865576617846, -75.61102468374588], [6.154009049529543, -75.6285678635943], [6.150072571234621, -75.63263073583488], [6.147264751189824, -75.63152331420969], [6.146349746497127, -75.63132688373844],[6.144762203404475, -75.63105904733624],[6.140457241778923, -75.63209440713393],[6.136496548431326, -75.63194274902344],[6.119597996845973, -75.62899133917449],[6.113561444416182, -75.62979406557253],[6.1142588763134675, -75.63185077852097],[6.1119645785679655, -75.63356223522777],[6.107534777504247, -75.6333032591196]];
  title = 'app';
  URL = 'ws://127.0.0.1:8000/stocks';
  posVehicles: any[] = [];
  //socket:WebSocket;
  public messages: Subject<string>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rutaService:RutaService,
    private alertService: AlertService,
    private usuarioService: UsuarioService,
    private puntoService: PuntoService,
    private manifiestoService: ManifiestoService,
    private globals: Globals,
    private commonService: CommonService
  ) { }

  ngOnInit() {
      try {
        clearInterval(this.globals.intVal);
        //this.globals.socket.close();
      }catch(error) {}
      travelService =this.manifiestoService;
      this.setsock();
    /*var PNotify = window['PNotify']|| [];
      PNotify.desktop.permission();
          (new PNotify({
              title: 'Danger Desktop Notice',
              type: 'danger',
              text: 'I\'m a danger desktop notification, if you have given me a permission.',
              desktop: {
                  desktop: true,
                  icon: 'assets/images/pnotify/danger.png'
              }
          })
          ).get().click(function(e) {
              if ($('.ui-pnotify-closer, .ui-pnotify-sticker, .ui-pnotify-closer *, .ui-pnotify-sticker *').is(e.target)) return;
              alert('Hey! You clicked the desktop notification!');
          });
      new PNotify({
              title: 'Primary notice',
              text: 'Check me out! I\'m a notice.',
              icon: 'icofont icofont-info-circle',
              type: 'default'
      });
      new PNotify({
              title: 'Success notice',
              text: 'Check me out! I\'m a notice.',
              icon: 'icofont icofont-info-circle',
              type: 'success'
      });
      var notice = new PNotify({
              title: 'Mensaje',
              text: 'Escriba por favor un mensaje.',
              hide: false,
              confirm: {
                  prompt: true,
                  prompt_multi_line: true,
                  prompt_default: 'Mensaje de prueba\n',
                  buttons: [
                      {
                          text: 'Yes',
                          addClass: 'btn btn-sm btn-primary'
                      },
                      {
                          addClass: 'btn btn-sm btn-link'
                      }
                  ]
              },
              buttons: {
                  closer: false,
                  sticker: false
              },
              history: {
                  history: false
              }
          });
          notice.get().on('pnotify.confirm', function(e, notice, val) {
              notice.cancelRemove().update({
                  title: 'Su mensaje',
                  text: $('<div/>').text(val).html(),
                  icon: 'icon-checkmark3',
                  type: 'success',
                  hide: true,
                  confirm: {
                      prompt: false
                  },
                  buttons: {
                      closer: true,
                      sticker: true
                  }
              });
          });
          notice.get().on('pnotify.cancel', function(e, notice) {
              notice.cancelRemove().update({
                  title: 'You don\'t like poetry',
                  text: 'Roses are dead,\nViolets are dead,\nI at gardening.',
                  icon: 'icon-blocked',
                  type: 'error',
                  hide: true,
                  confirm: {
                      prompt: false
                  },
                  buttons: {
                      closer: true,
                      sticker: true
                  }
              });
          });*/

          map = new google.maps.Map(document.getElementById('b-map'), {
                 zoom: 7,
                 center: new google.maps.LatLng(4.624335, -74.063644)
          });
          var icons = {
                origin: {
                  name: 'Inicio ruta',
                  color:'#27893e'
                },
                destination: {
                  name: 'Fin ruta',
                  color:'#7d2181'
                }
          };
          var legend = document.getElementById('legend');
          for (var key in icons) {
           var type = icons[key];
           var name = type.name;
           var color = type.color;
           var icon = type.icon;
           var div = document.createElement('div');
           div.innerHTML = '<i style="background:' + color + ';width: 18px;height:18px;float:left;margin-right:8px;"></i> ' + name;
           legend.appendChild(div);
          }
          map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
          var that=this;
          google.maps.event.addListener(map, 'click', function( event ){
              alert( "Latitude: "+event.latLng.lat()+" "+", longitude: "+event.latLng.lng());
              //that.validarPuntosControl(event.latLng.lat(), event.latLng.lng());
          });
          this.obtenerPuntosControl();
          //this.obtenerRutas();
          this.obtenerViajesActivos();


  }
  setsock() {
    this.globals.intVal = setInterval(this.obtenerPosicionesVehiculos.bind(this), timeSeconds);
    var companyId =this.commonService.obtenerIdEmpresaLogueada();
    var url = this.commonService.obtenerPrefijoUrlSocket();
    //url = url+companyId;
    url = url+'stocks';
	  //this.socket = new WebSocket('ws://localhost:8000/stocks');
    this.globals.socket = new WebSocket(url);
    this.globals.socket.onopen = () => {
      console.log('WebSockets connection created.');
    };

    this.globals.socket.onmessage = (event) => {
      //  var data = JSON.parse(event.data);
      console.log("data from socket:" + event.data);
      var arrayDeCadenas = event.data.split(',');

      if(arrayDeCadenas[0]!="connected"){
         console.log("-----------");
         console.log(arrayDeCadenas);
         var company = parseInt(arrayDeCadenas[0]);
         var type = parseInt(arrayDeCadenas[1]); //if type is 0, it means that is a route
         var msg = arrayDeCadenas[2];

    		 if(company == companyId){
    			 switch (type) {
             case 0:
              new PNotify({
                title: 'Notificación',
                text: msg,
                icon: 'icofont icofont-info-circle',
                type: 'danger'
              });
              break;

    				 case 1:
    					 new PNotify({
    							 title:'Notificación',
    							 text: msg,
    							 icon: 'icofont icofont-info-circle',
    							 type: 'info'
    					 });

    					 break;

    				 case 2:
    					 new PNotify({
    							 title:'Notificación',
    							 text: msg,
    							 icon: 'icofont icofont-info-circle',
    							 type: 'danger'
    					 });

    					 break;

    				  case 3:
    					 new PNotify({
    							 title:'Notificación',
    							 text: msg,
    							 icon: 'icofont icofont-info-circle',
    							 type: 'info'
    					 });

    					 break;

    				   case 4:
    					  new PNotify({
    							  title:'Notificación',
    							  text: msg,
    							  icon: 'icofont icofont-info-circle',
    							  type: 'danger'
    					  });
    					  break;

                case 10:
      					 new PNotify({
      							 title:'Notificación',
      							 text: msg,
      							 icon: 'icofont icofont-info-circle',
      							 type: 'info'
      					 });
                 break;

                 case 20:
       					 new PNotify({
       							 title:'Notificación',
       							 text: msg,
                     icon: 'icofont icofont-info-circle',
                     type: 'error'
       					 });
                  break;
    			 }
    		 }
      }
      //this.title = event.data;
    };

    if (this.globals.socket.readyState == WebSocket.OPEN) {
      this.globals.socket.onopen(null);
    }
  }
  /*start1(){
     this.socket.send('start');
  }
  stop1(){
     this.socket.send('stop');
  }
  start(){
    this.messages.next("start");
  }
  stop(){
    this.messages.next("stop");
  }*/
  /*private connect(url): Subject<MessageEvent> {
    console.log(url);
    let ws = new WebSocket(url);

    let observable = Observable.create(
      (obs: Observer<MessageEvent>) => {
        ws.onmessage = obs.next.bind(obs);
        ws.onerror = obs.error.bind(obs);
        ws.onclose = obs.complete.bind(obs);
        return ws.close.bind(ws);
      })
    let observer = {
      next: (data: string) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(data);
          if(data=="stop")
            ws.close(1000,"bye")
        }
      }
    }
    return Subject.create(observer, observable);
  }*/
  execute1(){
     this.globals.intVal = setInterval(this.obtenerPosicionVehiculo.bind(this), timeSeconds);
  }
  execute2(){
     this.globals.intVal = setInterval(this.test.bind(this), timeSeconds);
  }
  test(){
    if(k<this.posBus.length){
      var lat = this.posBus[k][0];
      var lng = this.posBus[k][1];
      var plate = vehicles[0].vehiclePlate;
      var coordinate = new google.maps.LatLng(lat , lng);
      if(marker!=null){
         marker.setVisible(false);
      }
      var coordinate = new google.maps.LatLng(lat, lng);
      marker = new google.maps.Marker({
        position: coordinate,
        map: map
      });
      this.validarPuntosControl(plate, lat, lng);
      this.validarTrayecto(plate, coordinate);
      k++;
    }
  }

  obtenerPosicionesVehiculos(){
    console.log('obtenerPosicionesVehiculos mapa')
    this.manifiestoService.obtenerUbicacionVehiculos().then(obj => {
       if(obj){
         for (var i = 0; i < this.posVehicles.length; i++) {
             this.posVehicles[i].m.setMap(null);
         }
         this.posVehicles = [];
         for (var i = 0; i < obj.length; i ++) {
           var latitude = obj[i].latitude;
           var longitude = obj[i].longitude;
           var plate = obj[i].plate;
           console.log(latitude +' '+longitude+' '+plate);
           var coordinate = new google.maps.LatLng(latitude, longitude);
           marker = new google.maps.Marker({
             position: coordinate,
             map: map
           });
           this.posVehicles.push({m:marker});
         }
       }
   });
  }
  obtenerPosicionVehiculo(){
    var userName = vehicles[0].vehicleUser;
    var userPwd = vehicles[0].vehiclePwd;
    //console.log(userName+" "+userPwd);
    this.manifiestoService.obtenerUbicacionVehiculo(userName, userPwd).then(obj => {
      //console.log(obj);
     for (var i = 0; i < obj.length; i ++) {
       var uid = obj[i].id;
       var latitude = obj[i].Latitude;
       latitude = parseFloat(latitude.replace(',', '.'));
       var longitude = obj[i].Longitude;
       var plate = obj[i].TrackerName;
       if(plate==vehicles[0].vehiclePlate){
         longitude = parseFloat(longitude.replace(',', '.'));
         if(marker!=null){
            marker.setVisible(false);
         }
         var coordinate = new google.maps.LatLng(latitude, longitude);
         marker = new google.maps.Marker({
           position: coordinate,
           map: map
         });
         this.validarPuntosControl(plate, latitude, longitude);
         this.validarTrayecto(plate, coordinate);
         //map.setZoom(10);
         //map.setCenter(new google.maps.LatLng(latitude, longitude));
         break;
       }
     }
   });

  }
  validarTrayecto(placa, coordinate){
    var pol= routes[0].polyline;
    //if (google.maps.geometry.poly.containsLocation(coordinate, pol)) {
    if (google.maps.geometry.poly.isLocationOnEdge(coordinate, pol, tolerance)) {
      console.log("dentro de la ruta " + coordinate.lat() + " " + coordinate.lng());
    } else {
      new PNotify({
              title: 'Notificación',
              text: 'El vehiculo con placas # '+placa+' se ha desviado de la ruta.',
              icon: 'icofont icofont-info-circle',
              type: 'danger'
      });
      var mensaje ="Cuidado se ha salido de la ruta.";
      this.manifiestoService.enviarNotificacionPush(placa, mensaje).then(response =>{});
      console.log("se ha salido de la ruta " + coordinate.lat() + " " + coordinate.lng());
    }
  }
  validarPuntosControl(placa, latitude, longitude){
     for(var i=0;i<ptsCtrl.length;i++){
       var ptId = ptsCtrl[i].id;
       var pt = ptsCtrl[i].circle;
       var tipo = ptsCtrl[i].type;
       var centerLat =  ptsCtrl[i].centerLat; //Get latitude from the circle center
       var centerLng = ptsCtrl[i].centerLng; //Get longitude from the circle center
       var radius = ptsCtrl[i].radius; //Get the radius in meters

       if(this.validarInterseccionPuntoControl(latitude, longitude, centerLat, centerLng, radius)&&this.placaNotificada(placa,ptId)==false){
          switch (tipo) {
              case 1:
                  new PNotify({
                          title:'Notificación',
                          text: 'El vehiculo con placas # '+placa+' ha pasado por un puesto de control',
                          icon: 'icofont icofont-info-circle',
                          type: 'info'
                  });
                  this.ptsCtrlVehicle.push({ptId:ptId,placa:placa});
                  break;
              case 2:
                  new PNotify({
                          title:'Notificación',
                          text: 'El vehiculo con placas # '+placa+' ha pasado por un punto prohibido',
                          icon: 'icofont icofont-info-circle',
                          type: 'danger'
                  });
                  this.ptsCtrlVehicle.push({ptId:ptId,placa:placa});
                  break;
               case 3:
                  new PNotify({
                          title:'Notificación',
                          text: 'El vehiculo con placas # '+placa+' ha pasado por un punto de parada y descanso',
                          icon: 'icofont icofont-info-circle',
                          type: 'info'
                  });
                  this.ptsCtrlVehicle.push({ptId:ptId,placa:placa});
                  break;
                case 4:
                   new PNotify({
                           title:'Notificación',
                           text: 'El vehiculo con placas # '+placa+' ha ingresado por un punto de alto riesgo',
                           icon: 'icofont icofont-info-circle',
                           type: 'danger'
                   });
                   this.ptsCtrlVehicle.push({ptId:ptId,placa:placa});
                   var mensaje ="Ingreso/salida a zona de alto riesgo.";
                   this.manifiestoService.enviarNotificacionPush(placa, mensaje).then(response =>{
                   });
                   break;
          }
       }
     }
  }
  placaNotificada(placa, ptId){
    var b = false;
    for(var i=0;i<this.ptsCtrlVehicle.length;i++){
      if(this.ptsCtrlVehicle[i].placa==placa&&this.ptsCtrlVehicle[i].ptId==ptId){
         b= true;
         break;
      }
    }
    return b;
  }
  validarInterseccionPuntoControl(latitude, longitude, centerLat, centerLng, radius){
    //var centerLat = pt.getCenter().lat(); //Get latitude from the circle center
    //var centerLng = pt.getCenter().lng(); //Get longitude from the circle center
    //var radius = pt.getRadius(); //Get the radius in meters
    var km= radius/1000; //Get the value in kilometers
    //km = km - 0.01;
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerLat / 180.0) * ky;
    var dx = Math.abs(centerLng - longitude) * kx;
    var dy = Math.abs(centerLat - latitude) * ky;
    return Math.sqrt(dx * dx + dy * dy) < km;
  }
  obtenerViajesActivos(){
    var waypts = [];
    var req;
    directionsService = new google.maps.DirectionsService();
    this.manifiestoService.obtenerViajesActivos().then(response => {
      for(var i=0;i<response.length;i++){
            var routeData= response[i].routeData;
            var str = routeData;
            var obj=JSON.parse(str);
            originLng = obj.origin.originLng;
            originLat = obj.origin.originLat;
            destinationLat = obj.destination.destinationLat;
            destinationLng = obj.destination.destinationLng;
            var routeId= response[i].routeId;
            var vehiclePlate = response[i].vehiclePlate;
            var vehicleUser = response[i].vehicleUser;
            var vehiclePwd = response[i].vehiclePwd;
            var vehicleId = response[i].vehicleId;
            if(obj.waypoints.length>0){
               //console.log(obj.waypoints);
               for(var j=0;j<obj.waypoints.length;j++){
                 waypts.push({
                     location: new google.maps.LatLng(obj.waypoints[j][0], obj.waypoints[j][1]),
                     stopover: true
                 });
               }
               req = {
                   origin:new google.maps.LatLng(originLat, originLng),
                   destination: new google.maps.LatLng(destinationLat, destinationLng),
                   waypoints: waypts,
                   travelMode: google.maps.DirectionsTravelMode.DRIVING
                };

                waypts = [];
            }else{
               req = {
                   origin:new google.maps.LatLng(originLat, originLng),
                   destination: new google.maps.LatLng(destinationLat, destinationLng),
                   travelMode: google.maps.DirectionsTravelMode.DRIVING
                };
             }
             arrReq.push({routeId:routeId,req:req});
             vehicles.push({routeId:routeId,vehiclePlate:vehiclePlate, vehicleUser:vehicleUser, vehiclePwd:vehiclePwd, vehicleId:vehicleId});
          }
          drawRoute();
    });
  }
  obtenerPuntosControl(){
    this.puntoService.obtenerPuntos().then(response => {
      for(var i=0;i<response.length;i++){
        var uid=response[i].id;
        var idType=response[i].idType;
        var latitude=parseFloat(response[i].latitude);
        var longitude=parseFloat(response[i].longitude);

        var pinImage ="";
        var circleColor="";
        if(idType==1){
           circleColor="#7f7f7f";
        }else if(idType==2){
            circleColor="#ffff00";
        }else if(idType==3){
           circleColor="#0000ff";
        }else if(idType==4){
           circleColor="#A60404";
        }
        var html = '<div class="info_content">' +
            '<div style="text-align:center;font-weight:bold;">'+response[i].nameType+'</div>' +
            '<p> Nombre: '+response[i].name+'</p>' +
            '<p> Descripción: '+response[i].description+'</p>' +
        '</div>';
        var circle = new google.maps.Circle({
          strokeColor: circleColor,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: circleColor,
          fillOpacity: 0.35,
          center: new google.maps.LatLng(latitude, longitude),
          radius: 200,
          map: map,
          uid: uid
        });
        /*circle.info = new google.maps.InfoWindow({
              content: html
        });
        google.maps.event.addListener(circle, 'click', function() {
          this.info.setPosition(this.getCenter());
          this.info.open(map, this);
        });*/
        var that=this;
        google.maps.event.addListener(circle, 'dblclick', function( event ){
            alert( "Latitude: "+event.latLng.lat()+" "+", longitude: "+event.latLng.lng() );
            //that.validarPuntosControl(event.latLng.lat(), event.latLng.lng());
        });
        ptsCtrl.push({id:uid,circle:circle,type:idType,centerLat:latitude,centerLng:longitude,radius:2000});
        map.setZoom(10);
        map.setCenter(new google.maps.LatLng(latitude, longitude));
      }
    });
  }
  obtenerRutas(){
    var waypts = [];
    //this.wAux = [];
    var req;

    directionsService = new google.maps.DirectionsService();
    this.rutaService.obtenerRutas().then(response => {
            this.rutas = response;
            for(var i=0;i<this.rutas.length;i++){
                  var routeData= this.rutas[i].routeData;
                  var str = routeData;
                  var obj=JSON.parse(str);
                  originLng = obj.origin.originLng;
                  originLat = obj.origin.originLat;
                  destinationLat = obj.destination.destinationLat;
                  destinationLng = obj.destination.destinationLng;
                  var routeId= this.rutas[i].id;



                  if(obj.waypoints.length>0){
                     //console.log(obj.waypoints);
                     for(var j=0;j<obj.waypoints.length;j++){
                       waypts.push({
                           location: new google.maps.LatLng(obj.waypoints[j][0], obj.waypoints[j][1]),
                           stopover: true
                       });
                     }
                     req = {
                         origin:new google.maps.LatLng(originLat, originLng),
                         destination: new google.maps.LatLng(destinationLat, destinationLng),
                         waypoints: waypts,
                         travelMode: google.maps.DirectionsTravelMode.DRIVING
                      };

                      waypts = [];
                  }else{
                     req = {
                         origin:new google.maps.LatLng(originLat, originLng),
                         destination: new google.maps.LatLng(destinationLat, destinationLng),
                         travelMode: google.maps.DirectionsTravelMode.DRIVING
                      };
                   }
                   arrReq.push({routeId:routeId,req:req});

                }
                drawRoute();
            });

      }
}
