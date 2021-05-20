import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AlertService} from '../../../services/alert.service';
import {ManifiestoService} from '../../../services/manifiesto.service';
import {TerceroService} from '../../../services/tercero.service';
import {VehiculoService} from '../../../services/vehiculo.service';
import {EmpresaService} from '../../../services/empresa.service';
import {CommonService} from '../../../services/common.service';
import {RutaService} from '../../../services/ruta.service';
import {PuntoService} from '../../../services/punto.service';
import { Globals } from '../../../globals';
import { NgbTabsetConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2'
declare const google: any;
//declare var intVal: any;
var marker: any;
var map: any;
var lat:number;
var lng:number;
var currentDate:any;
var originMarker: any;
var destinationMarker:any;
var directionsService: any;
var directionsDisplay: any;
var directionsService: any;
var alternateDirectionsDisplay: any;
var alternateDirectionsService: any;
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
var timeSeconds: number = 5000;

@Component({
  selector: 'app-asignacionsolicitud',
  templateUrl: './asignacionsolicitud.component.html',
  styleUrls: ['./asignacionsolicitud.component.css']
})
export class AsignacionsolicitudComponent implements OnInit {
  manifiestoExp: any = {};
  ruta: any = {};
  data: any = {};
  circles: any =[];
  vehiculoPorPlaca: any [] = [];
  viajes: any [] = [];
  vehiculos: any [] = [];
  cargues: any []=[];
  descargues: any []=[];
  rows = [];
  rows1 = [];
  selected = [];
  selectedManifest = [];
  selectedVehicles = [];
  tiposVehiculo = [];
  solicitudes: any [] = [];
  tiposServicio: any [] = [];
  tiposRechazo: any [] = [];
  bufferSize = 50;
  origenViaje: any []=[];
  origenViajeBuffer =[];
  destinoViaje: any []=[];
  destinoViajeBuffer: any []=[];
  loadingOrigen = false;
  loadingDestino = false;
  rutas: any[]=[];
  solicitudExp: any = {};
  vehiculoExp: any = {};
  routeId:any = null;
  deparment1:any = null;
  deparment2:any = null;
  origenViajeId: any = null;
  destinoViajeId: any = null;
  userId: number;
  wAux: any []=[];
  loadsUbi: any []=[];
  unloadsUbi:any []=[];
  comments1:string = "";
  comments2:string = "";
  viajeId:number=-1;
  selectedTravelId:number=-1;
  username: any;
  //routetrace: any = {};
  trafficControlIsRequired: boolean = false;
  messages_1 = {
    'emptyMessage': '',
    'totalMessage': 'total',
    'selectedMessage': 'seleccionado'
  };
  messages_2 = {
    'emptyMessage': '',
    'totalMessage': 'total'
  };
  constructor(
    public parserFormatter: NgbDateParserFormatter,
    private route: ActivatedRoute,
    private router: Router,
    private puntoService: PuntoService,
    private commonService:CommonService,
    private empresaService:EmpresaService,
    private manifiestoService: ManifiestoService,
    private terceroService: TerceroService,
    private vehiculoService: VehiculoService,
    private rutaService: RutaService,
    private alertService: AlertService,
    private globals: Globals,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    try {
      clearInterval(this.globals.intVal);
    }catch(error) {}

    this.vehiculoExp.plate = "";
    this.vehiculoExp.driverIdentification = "";
    this.vehiculoExp.driverName = "";
    this.manifiestoExp.appointmentInOffice == true

    map = new google.maps.Map((<HTMLInputElement>document.getElementById('map')), {
           zoom: 7,
           center: new google.maps.LatLng(4.624335, -74.063644)
    });
    var icons = {
          load: {
            name: 'Cargues',
            color:'#00f'
          },
          unload: {
            name: 'Descargues',
            color:'#f00'
          },
          origin: {
            name: 'Inicio ruta',
            color:'#27893e'
          },
          destination: {
            name: 'Fin ruta',
            color:'#7d2181'
          }
    };
    var icon_control_points = {
      puesto_control: {
        name: 'Puesto de control',
        color:'#7f7f7f'
      },
      lugar_prohibido: {
        name: 'Lugar prohibido',
        color:'#ffff00'
      },
      parada: {
        name: 'Parada y descanso',
        color:'#0000ff'
      },
      riesgo: {
        name: 'Alto riesgo',
        color:'#A60404'
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
    var div = document.createElement('div');
    div.innerHTML = '<b>Puntos de control</b>';
    legend.appendChild(div);
    for (var key in icon_control_points) {
     var type = icon_control_points[key];
     var name = type.name;
     var color = type.color;
     var icon = type.icon;
     var div = document.createElement('div');
     div.innerHTML = '<i style="background:' + color + ';width:30px;height:18px;float:left;margin-right:8px;border: 1px solid ' + color + ';opacity:0.8;"></i> ' + name;
     legend.appendChild(div);
    }
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
    this.userId = this.commonService.obtenerUsuarioId();
    this.obtenerControlTraficoEsRequerido();
    this.obtenerSolicitudes();
    this.obtenerTipoServicios();
    this.obtenerTiposRechazo();
    this.obtenerCiudades();
    this.obtenerPuntosControl();
    this.obtenerViajesCita();
    this.obtenerDatosEmpresa();
    //this.anularViajes();
  }
  anularViajes(){
    this.manifiestoService.anularViajes()
    .then(response =>{
    });
  }
  obtenerViajesCita(){
    this.selectedManifest = [];
    this.manifiestoService.obtenerViajesCita().then(response => {
      this.viajes = response;
      for(var i=0;i<response.length;i++){
         if(response[i].travelAttendedAppointment==true){
              this.selectedManifest.push(response[i]);
         }
      }
      this.selectedManifest = [...this.selectedManifest];
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
        circle.info = new google.maps.InfoWindow({
              content: html
        });
        google.maps.event.addListener(circle, 'click', function() {
          this.info.setPosition(this.getCenter());
          this.info.open(map, this);
        });
        map.setZoom(10);
        map.setCenter(new google.maps.LatLng(latitude, longitude));
      }
    });
  }
  obtenerCiudades(): void {
    this.empresaService.obtenerCiudades().then(response => {
      response.map((i) => { i.cityName = i.fields.Description; return i; });
      this.origenViaje = response;
      this.origenViajeBuffer = this.origenViaje.slice(0, this.bufferSize);
      this.destinoViaje = response;
      this.destinoViajeBuffer = this.destinoViaje.slice(0, this.bufferSize);
    });
  }
  obtenerDepartamentoOrigenViaje(originId){
   this.origenViajeId = originId;
   this.deparment1 ="";
   if(this.origenViajeId !=null){
     this.empresaService.obtenerDepatamentoPorCiudad(this.origenViajeId)
       .then(response =>{
         if (response) {
            this.deparment1=response[0].departmentName;
         }
     });
   }
   this.obtenerRutas();
  }
  obtenerDepartamentoDestinoViaje(destinationId){
   this.destinoViajeId = destinationId;
   this.deparment2 ="";
   if(this.destinoViajeId !=null){
     this.empresaService.obtenerDepatamentoPorCiudad(this.destinoViajeId)
       .then(response =>{
         if (response) {
            this.deparment2=response[0].departmentName;
         }
     });
   }
   this.obtenerRutas();
  }
  obtenerRespuestasConductores(){
    this.manifiestoService.obtenerRespuestasConductores(this.viajeId)
    .then(response =>{
      if (response) {
         console.log(response);
         for(var i=0;i<response.length;i++){
           for(var j=0;j<this.vehiculos.length;j++){
             if(response[i].status==''){
                break;
             }
             if(response[i].vehicleId==this.vehiculos[j].id){
                this.vehiculos[j].status = response[i].status;
                this.vehiculos = [...this.vehiculos];
                break;
             }
           }
         }
      }
    });
  }




  obtenerRutas(){
   this.rutas=[];
   this.routeId = null;
   if(this.origenViajeId!=null&&this.destinoViajeId!=null){
      this.rutaService.obtenerRutasOrigenDestino(this.origenViajeId,this.destinoViajeId)
        .then(response =>{
          if (response) {
              this.rutas = response;
              console.log(response);
          }
      });
   }
  }
  seleccionarRuta(value){
   //if(this.selected.length>0){
    	if(originMarker!=null){
           originMarker.setMap(null);
           originMarker=null;
        }
    	if(destinationMarker!=null){
    	   destinationMarker.setMap(null);
    	   destinationMarker=null;
    	}
    	isOriginCreated=false;
    	isDestinationCreated=false;

    	//this.routetrace={};
    	originLat=null;
    	originLng=null;
    	destinationLat=null;
    	destinationLng=null;
    	if(directionsDisplay != null) {
    	   directionsDisplay.setMap(null);
    	   directionsDisplay = null;
    	}
    	isRouteCreated=false;
    	this.wAux = [];
      this.routeId=value;
    	this.cargarRuta(value);
  }
  obtenerUbicacionesCarguesDescargues(){
    for (var i = 0; i < this.circles.length; i++) {
         this.circles[i].location.setMap(null);
    }
    this.circles=[];
    this.loadsUbi=[];
    this.unloadsUbi=[];
    if(alternateDirectionsDisplay != null) {
       alternateDirectionsDisplay.setMap(null);
       alternateDirectionsDisplay = null;
    }
    for(var i=0;i<this.selected.length;i++){
      var idSolicitud = this.selected[i].id;
      this.manifiestoService.obtenerCargues(idSolicitud)
       .then(response =>{
         if (response) {
             for(var j=0;j<response.length;j++){
               try{
                 var lat= parseFloat(response[j].latitude);
                 var lng = parseFloat(response[j].longitude);
                 this.loadsUbi[j]=[lat, lng];
                 var coordinate = new google.maps.LatLng(lat, lng);
                 var marker = new google.maps.Marker({
                   position: coordinate,
                   icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10, //tamaño
                    strokeColor: '#00f', //color del borde
                    strokeWeight: 1, //grosor del borde
                    fillColor: '#00f', //color de relleno
                    fillOpacity:1// opacidad del relleno
                  },
                   map: map,
                 });
                 this.circles.push({location:marker});
                 map.setZoom(10);
                 map.setCenter(marker.getPosition());
               }catch(e){}
             }
         }
      });
      this.manifiestoService.obtenerDescargues(idSolicitud)
       .then(response =>{
         if (response) {
           console.log(response);
           for(var k=0;k<response.length;k++){
              try{
                var lat= parseFloat(response[k].latitude);
                var lng = parseFloat(response[k].longitude);
                this.unloadsUbi[k]=[parseFloat(response[k].latitude), parseFloat(response[k].longitude)];
                var coordinate = new google.maps.LatLng(lat, lng);
                var marker = new google.maps.Marker({
                  position: coordinate,
                  icon: {
                   path: google.maps.SymbolPath.CIRCLE,
                   scale: 10, //tamaño
                   strokeColor: '#f00', //color del borde
                   strokeWeight: 1, //grosor del borde
                   fillColor: '#f00', //color de relleno
                   fillOpacity:1// opacidad del relleno
                 },
                  map: map,
                });
                this.circles.push({location:marker});
                map.setZoom(10);
                map.setCenter(marker.getPosition());
              }catch(e){}
           }
         }
      });
    }
  }
  borrarRuta(){
    if(isOptionalRouteCreated){
     let that = this;
     swal({
       title: '¿Esta seguro de borrar la ruta trazada?',
       text: '',
       type: 'warning',
       showCancelButton: true,
       confirmButtonColor: '#3085d6',
       cancelButtonColor: '#d33',
       confirmButtonText: 'Sí',
       cancelButtonText: 'No'
     }).then(function (s) {
      if(s.dismiss !== undefined){
        if (s.dismiss.toString() === 'cancel') {
        }
      }else{
        if(s.value!== undefined){
           if(s.value){
             isOptionalRouteCreated = false;
             if(alternateDirectionsDisplay != null) {
                alternateDirectionsDisplay.setMap(null);
                alternateDirectionsDisplay = null;
             }
           }
        }
      }
    }).catch(swal.noop);
   }else{
    swal({
      title: "No se ha trazado una ruta",
      text: '',
      type: 'warning'
     }).catch(swal.noop);
   }
  }
  trazarRuta(){
    var waypts = [];
    isOptionalRouteCreated = false;
    if(alternateDirectionsDisplay != null) {
       alternateDirectionsDisplay.setMap(null);
       alternateDirectionsDisplay = null;
    }
    if(this.selected.length>0){
      if(this.routeId!=null){
        this.rutaService.obtenerRuta(this.routeId).then(response =>{
          if (response) {
            var routeData= response[0].routeData;
            var str = routeData;
            var obj=JSON.parse(str);
            originLng = obj.origin.originLng;
            originLat = obj.origin.originLat;
            destinationLat = obj.destination.destinationLat;
            destinationLng = obj.destination.destinationLng;
            /*for(var i=0;i<this.loadsUbi.length;i++){
              waypts.push({
                  location: new google.maps.LatLng(this.loadsUbi[i][0], this.loadsUbi[i][1]),
                  stopover: true
              });
            }
            for(var i=0;i<this.unloadsUbi.length;i++){
              waypts.push({
                  location: new google.maps.LatLng(this.loadsUbi[i][0], this.loadsUbi[i][1]),
                  stopover: true
              });
            }*/
            var req = {
                origin:new google.maps.LatLng(originLat, originLng),
                destination: new google.maps.LatLng(destinationLat, destinationLng),
                //waypoints: waypts,
                //optimizeWaypoints: true,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
             };
             alternateDirectionsService = new google.maps.DirectionsService();
             alternateDirectionsDisplay = new google.maps.DirectionsRenderer({
               polylineOptions: {
                   strokeColor: "red"
                }
             });
             alternateDirectionsDisplay.setMap(map);
             alternateDirectionsDisplay.setOptions({ draggable: true, suppressMarkers: true });
             alternateDirectionsService.route(req, function(response, status) {
                 if (status === google.maps.DirectionsStatus.OK) {
                     alternateDirectionsDisplay.setDirections(response);
                     isOptionalRouteCreated = true;
                 }
             });
            console.log(waypts);
          }
        });
      }else{
        swal({
          title: 'Debe seleccionar una ruta de referencia.',
          text: '',
          type: 'warning'
         }).catch(swal.noop);
      }
    }else{
      swal({
        title: 'Debe por lo menos seleccionar una solicitud antes de trazar la ruta.',
        text: '',
        type: 'warning'
       }).catch(swal.noop);
    }
  }
  cargarRuta(idRoute){
    var waypts = [];
    this.wAux = [];
      this.rutaService.obtenerRuta(idRoute).then(response =>{
        if (response) {
          //this.ruta={};
          //this.ruta.id = response[0].id;
          //this.ruta.name = response[0].name;
          //this.ruta.routeOriginCityId = response[0].routeOriginCityId;
          //this.ruta.routeDestinationCityId = response[0].routeDestinationCityId;
          var routeData= response[0].routeData;
          //var str = JSON.stringify(routeData);
          var str = routeData;
          var obj=JSON.parse(str);
          originLng = obj.origin.originLng;
          originLat = obj.origin.originLat;
          destinationLat = obj.destination.destinationLat;
          destinationLng = obj.destination.destinationLng;

          if(obj.waypoints.length>0){

             for(var i=0;i<obj.waypoints.length;i++){
               this.wAux[i]=[obj.waypoints[i][0],obj.waypoints[i][1]];
               waypts.push({
                   location: new google.maps.LatLng(obj.waypoints[i][0], obj.waypoints[i][1]),
                   stopover: true
               });
             }
             //console.log(this.wAux);
             directionsService = new google.maps.DirectionsService();
             directionsDisplay = new google.maps.DirectionsRenderer({
                suppressMarkers: true
             });
             var req = {
                 origin:new google.maps.LatLng(originLat, originLng),
                 destination: new google.maps.LatLng(destinationLat, destinationLng),
                 waypoints: waypts,
                 optimizeWaypoints: true,
                 travelMode: google.maps.DirectionsTravelMode.DRIVING
              };
              directionsDisplay.setMap(map);
               directionsService.route(req, function(response, status) {
                   if (status === google.maps.DirectionsStatus.OK) {
                       directionsDisplay.setDirections(response);
                       if(originMarker!=null){
                          originMarker.setMap(null);
                          originMarker = null;
                       }
                       if(destinationMarker!=null){
                          destinationMarker.setMap(null);
                          destinationMarker = null;
                       }
                       var coordinateOrigin = new google.maps.LatLng(originLat, originLng);
                       var coordinateDestination=new google.maps.LatLng(destinationLat, destinationLng);
                       originMarker = new google.maps.Marker({
                         position: coordinateOrigin,
                         icon: {
                          path: google.maps.SymbolPath.CIRCLE,
                          scale: 10, //tamaño
                          strokeColor: '#27893e', //color del borde
                          strokeWeight: 1, //grosor del borde
                          fillColor: '#27893e', //color de relleno
                          fillOpacity:1// opacidad del relleno
                         },
                         map: map
                       });
                       //var pinImage = new google.maps.MarkerImage("http://www.googlemapsmarkers.com/v1/7d2181/");
                       destinationMarker = new google.maps.Marker({
                         position: coordinateDestination,
                         icon: {
                          path: google.maps.SymbolPath.CIRCLE,
                          scale: 10, //tamaño
                          strokeColor: '#7d2181', //color del borde
                          strokeWeight: 1, //grosor del borde
                          fillColor: '#7d2181', //color de relleno
                          fillOpacity:1// opacidad del relleno
                         },
                         map: map
                       });

                   }
               });
               isRouteCreated = true;
               isOriginCreated = true;
               isDestinationCreated = true;
               map.setZoom(10);
               map.setCenter(new google.maps.LatLng(originLat, originLng));
          }else{
             directionsService = new google.maps.DirectionsService();
             directionsDisplay = new google.maps.DirectionsRenderer({
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
                       if(originMarker!=null){
                          originMarker.setMap(null);
                          originMarker = null;
                       }
                       if(destinationMarker!=null){
                          destinationMarker.setMap(null);
                          destinationMarker = null;
                       }
                       var coordinateOrigin = new google.maps.LatLng(originLat, originLng);
                       var coordinateDestination=new google.maps.LatLng(destinationLat, destinationLng);
                       originMarker = new google.maps.Marker({
                         position: coordinateOrigin,
                         icon: {
                          path: google.maps.SymbolPath.CIRCLE,
                          scale: 10, //tamaño
                          strokeColor: '#27893e', //color del borde
                          strokeWeight: 1, //grosor del borde
                          fillColor: '#27893e', //color de relleno
                          fillOpacity:1// opacidad del relleno
                         },
                         map: map
                       });
                       //var pinImage = new google.maps.MarkerImage("http://www.googlemapsmarkers.com/v1/7d2181/");
                       destinationMarker = new google.maps.Marker({
                         position: coordinateDestination,
                         icon: {
                          path: google.maps.SymbolPath.CIRCLE,
                          scale: 10, //tamaño
                          strokeColor: '#7d2181', //color del borde
                          strokeWeight: 1, //grosor del borde
                          fillColor: '#7d2181', //color de relleno
                          fillOpacity:1// opacidad del relleno
                         },
                         map: map
                       });

                   }
               });
               map.setZoom(10);
               map.setCenter(new google.maps.LatLng(originLat, originLng));
               isRouteCreated = true;
               isOriginCreated = true;
               isDestinationCreated = true;
           }
        }
    });
  }
  fetchMoreOrigin() {
        const len = this.origenViajeBuffer.length;
        const more = this.origenViaje.slice(len, this.bufferSize + len);
        this.loadingOrigen = true;
        // using timeout here to simulate backend API delay
        setTimeout(() => {
            this.loadingOrigen = false;
            this.origenViajeBuffer = this.origenViajeBuffer.concat(more);
        }, 200)
  }
  fetchMoreDestination() {
        const len = this.destinoViajeBuffer.length;
        const more = this.destinoViaje.slice(len, this.bufferSize + len);
        this.loadingDestino = true;
        // using timeout here to simulate backend API delay
        setTimeout(() => {
            this.loadingDestino = false;
            this.destinoViajeBuffer = this.destinoViajeBuffer.concat(more);
        }, 200)
  }
  actualizarRuta(){
    if(isOptionalRouteCreated){
       let that = this;
       swal({
         title: '¿Esta seguro de actualizar la ruta?',
         text: '',
         type: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: 'Sí',
         cancelButtonText: 'No'
       }).then(function (s) {
         console.log(s);
        if(s.dismiss !== undefined){
          if (s.dismiss.toString() === 'cancel') {
          }
        }else{
          if(s.value!== undefined){
             if(s.value){
               var w=[],wp;
               var rleg = alternateDirectionsDisplay.directions.routes[0].legs[0];
               that.data = {};
               that.ruta = {};
               that.data.origin = {'originLat': originLat, 'originLng':originLng};
               that.data.destination = {'destinationLat': destinationLat, 'destinationLng':destinationLng};
               var wp = rleg.via_waypoints;
               console.log(wp);
               console.log("---------");
               /*if(that.wAux.length==0){
                 for(var i=0;i<wp.length;i++){
                   w[i] = [wp[i].lat(),wp[i].lng()];
                 }
               }else{
                 for(var i=0;i<that.wAux.length;i++){
                   w[i] = [that.wAux[i][0],that.wAux[i][1]];
                 }
                 var j=that.wAux.length;
                 for(var i=0;i<wp.length;i++){
                   w[j] = [wp[i].lat(),wp[i].lng()];
                   j++;
                 }
               }*/
               for(var i=0;i<wp.length;i++){
                 w[i] = [wp[i].lat(),wp[i].lng()];
               }
               console.log(w);
               var polyline = new google.maps.Polyline({
                   path: [],
                   strokeColor: '#FF0000',
                   strokeWeight: 3
               });
               var bounds = new google.maps.LatLngBounds();
               var legs = alternateDirectionsDisplay.directions.routes[0].legs;
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

               var pathArr = polyline.getPath();
               var codeStr = '';
               for (var i = 0; i < pathArr.length; i++){
                   codeStr += '(' + pathArr.getAt(i).lat() + ',' + pathArr.getAt(i).lng() + ')' ;
                   if (i !== pathArr.length-1) {
                       codeStr += ',';
                   };
               }

               that.data.waypoints = w;
               that.ruta.id = that.routeId;
               that.ruta.routeData=JSON.stringify(that.data);
               that.ruta.routePoints = codeStr;
               that.rutaService.crearActualizarRuta(that.ruta).then(response =>{
                 if (response) {
                   if (response.estado == 'EXITO') {
                     swal({
                       title: 'Ruta actualizada exitosamente',
                       text: '',
                       type: 'success'
                      }).catch(swal.noop);
                   }
                 }
               });
             }
          }
        }
      });
    }else{
      swal({
        title: 'Debe de trazar una ruta antes.',
        text: '',
        type: 'warning'
       }).catch(swal.noop);
    }
  }
  guardarRuta(){
    if(isOptionalRouteCreated){
      let that = this;
      swal({
       title: '¿Desea guardar la ruta como una nueva?',
       type: 'warning',
       html: 'Nombre de la ruta: <input type="text" id="input1" />',
       showCancelButton: true,
       confirmButtonColor: '#3085d6',
       cancelButtonColor: '#d33',
       confirmButtonText: 'Sí',
       cancelButtonText: 'No',
       //showLoaderOnConfirm: true,
       preConfirm: function () {
         return new Promise(function (resolve , reject) {
           var nombreRuta = $('#input1').val();
           if(nombreRuta!=""){
             resolve([
                nombreRuta
             ])
           }else{
             swal.showValidationError('Debe ingresar el nombre de la ruta.');
             swal.enableButtons();
             return false;
           }
         });
       },
       onOpen: function () {
         $('#input1').focus();
       }
     }).then(function (result) {
       //console.log(result);
       if(result.dismiss !== undefined){
         if (result.dismiss.toString() === 'cancel') {
         }
       }else{
         if(result.value!== undefined){
            if(result.value){
              var name=result.value[0];
              var w=[],wp;
              var rleg = alternateDirectionsDisplay.directions.routes[0].legs[0];
              that.data = {};
              that.ruta = {};
              that.data.origin = {'originLat': originLat, 'originLng':originLng};
              that.data.destination = {'destinationLat': destinationLat, 'destinationLng':destinationLng};
              var wp = rleg.via_waypoints;
              console.log(wp);
              console.log("---------");
              /*if(that.wAux.length==0){
                for(var i=0;i<wp.length;i++){
                  w[i] = [wp[i].lat(),wp[i].lng()];
                }
              }else{
                for(var i=0;i<that.wAux.length;i++){
                  w[i] = [that.wAux[i][0],that.wAux[i][1]];
                }
                var j=that.wAux.length;
                for(var i=0;i<wp.length;i++){
                  w[j] = [wp[i].lat(),wp[i].lng()];
                  j++;
                }
              }*/
              for(var i=0;i<wp.length;i++){
                w[i] = [wp[i].lat(),wp[i].lng()];
              }
              console.log(w);
              var polyline = new google.maps.Polyline({
                  path: [],
                  strokeColor: '#FF0000',
                  strokeWeight: 3
              });
              var bounds = new google.maps.LatLngBounds();
              var legs = alternateDirectionsDisplay.directions.routes[0].legs;
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

              var pathArr = polyline.getPath();
              var codeStr = '';
              for (var i = 0; i < pathArr.length; i++){
                  codeStr += '(' + pathArr.getAt(i).lat() + ',' + pathArr.getAt(i).lng() + ')' ;
                  if (i !== pathArr.length-1) {
                      codeStr += ',';
                  };
              }

              that.data.waypoints = w;
              that.ruta.name = name;
              that.ruta.routeData=JSON.stringify(that.data);
              that.ruta.routePoints = codeStr;
              that.ruta.routeOriginCityId = that.origenViajeId;
              that.ruta.routeDestinationCityId = that.destinoViajeId;
              that.rutaService.crearActualizarRuta(that.ruta).then(response =>{
                if (response) {
                  if (response.estado == 'EXITO') {
                      that.routeId = response.routeId;
					            that.rutaService.obtenerRutasOrigenDestino(that.origenViajeId,that.destinoViajeId).then(response =>{
            					  if (response) {
            						  that.rutas = response;
            						  console.log(response);
            					  }
                      });
                      swal({
                        title: 'Ruta guardada exitosamente',
                        text: '',
                        type: 'success'
                       }).catch(swal.noop);
                  }
                }
              });
            }
         }
       }
     });
    }else{
      swal({
        title: 'Debe de trazar una ruta antes.',
        text: '',
        type: 'warning'
       }).catch(swal.noop);
    }
  }
  obtenerTiposRechazo(): void{
    this.manifiestoService.obtenerTiposRechazo().then(response => {
      this.tiposRechazo = response;
    });
  }
  obtenerControlTraficoEsRequerido(): void{
    this.empresaService.obtenerControlTraficoEsRequerido().then(response => {
      this.trafficControlIsRequired = response[0].trafficControlIsRequired;
      //console.log(this.trafficControlIsRequired);
    });
  }
  obtenerTipoServicios(): void{
    this.manifiestoService.obtenerTipoServicios().then(response => {
      this.tiposServicio = response;
    });
  }

  obtenerDatosEmpresa(): void{
    this.manifiestoService.obtenerSolicitudesParaAsignar().then(response => {
      this.rows = response;
      this.manifiestoExp.appointmentmanager = this.commonService.obtenerNombreUsuario()
      // this.manifiestoExp.appointmentaddress = this.commonService.obtenerDireccionCompania()
      console.log('manifiestoExp.appointmentInOffice : ', this.manifiestoExp.appointmentInOffice)
      console.log('this.manifiestoExp.appointmentmanager : ', this.manifiestoExp.appointmentmanager)
      //console.log('rows', this.rows);
    });
  }

  FieldsChange(values:any){
    console.log(values.currentTarget.checked);
  }

  obtenerModulos(values: any){
    var value = values.currentTarget.checked;
    console.log('valuec: ', value)
    if(value == true){
      this.manifiestoExp.appointmentaddress = this.commonService.obtenerDireccionCompania();      
      console.log('this.manifiestoExp.appointmentaddress : ', this.manifiestoExp.appointmentaddress)
    }
    else{
      this.manifiestoExp.appointmentaddress = '';
    }
    this.manifiestoExp.appointmentInOffice = value
}


  obtenerSolicitudes(): void{
    this.manifiestoService.obtenerSolicitudesParaAsignar().then(response => {
      this.rows = response;
      this.manifiestoExp.appointmentmanager = this.commonService.obtenerNombreUsuario()
      console.log('this.manifiestoExp.appointmentmanager : ', this.manifiestoExp.appointmentmanager)
      //console.log('rows', this.rows);
    });
  }
  openModalCargue(content,idSolicitud) {
     this.cargues = [];
     this.manifiestoService.obtenerCargues(idSolicitud)
      .then(response =>{
        if (response) {
            this.cargues = response;
        }
     });
     const modalRef = this.modalService.open(content, {backdrop: 'static', size: 'lg'});

     modalRef.result.then(value => {
       console.log('component.abrirDialogoCrearCuenta.modalRef.result.then', value);

     }).catch(reason => {
         console.log('component.abrirDialogoCrearCuenta.modalRef.result.catch', reason);
     });
  }
  openModalDescargue(content,idSolicitud) {
     this.descargues = [];
     this.manifiestoService.obtenerDescargues(idSolicitud)
       .then(response =>{
         if (response) {
             this.descargues = response;
         }
     });
     const modalRef = this.modalService.open(content, {backdrop: 'static', size: 'lg'});

     modalRef.result.then(value => {
       console.log('component.abrirDialogoCrearCuenta.modalRef.result.then', value);

     }).catch(reason => {
         console.log('component.abrirDialogoCrearCuenta.modalRef.result.catch', reason);
     });
  }
  onSelect({ selected }) {
    //console.log('Select Event', selected);
    this.tiposVehiculo = [];
    this.selectedVehicles = [];
    /*if(originMarker!=null){
         originMarker.setMap(null);
         originMarker=null;
    }
    if(destinationMarker!=null){
       destinationMarker.setMap(null);
       destinationMarker=null;
    }
    isOriginCreated=false;
    isDestinationCreated=false;

    this.routetrace={};
    originLat=null;
    originLng=null;
    destinationLat=null;
    destinationLng=null;
    if(directionsDisplay != null) {
       directionsDisplay.setMap(null);
       directionsDisplay = null;
    }
    isRouteCreated=false;
    this.wAux = [];
    this.routeId=null;
    isOptionalRouteCreated = false;
    if(alternateDirectionsDisplay != null) {
       alternateDirectionsDisplay.setMap(null);
       alternateDirectionsDisplay = null;
    }*/
    for(var i=0;i<selected.length;i++){
      console.log('selected[i] : : : ', selected[i])
      this.tiposVehiculo.push(selected[i].bodyWorkId);
    }
    console.log('1111111111111111111111111 : ', this.tiposVehiculo);
    this.tiposVehiculo = this.eliminateDuplicates(this.tiposVehiculo);
    console.log('2222222222222222222222222 : ', this.tiposVehiculo);
    this.obtenerVehiculos(this.tiposVehiculo);
    this.obtenerUbicacionesCarguesDescargues();

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onSelectVehicles({ selected }) {
    this.selectedVehicles.splice(0, this.selectedVehicles.length);
    this.selectedVehicles.push(...selected);
  }
  onSelectManifests({ selected }) {
    console.log(selected);

    for(var i=0;i<selected.length;i++){
      if(selected[i].id==this.selectedTravelId){
          console.log("travelid:"+this.selectedTravelId);
          this.setAttendedAppointment(this.selectedTravelId);
          break;
      }
    }
  }
  eliminateDuplicates(arr) {
     var i,
         len=arr.length,
         out=[],
         obj={};

     for (i=0;i<len;i++) {
        obj[arr[i]]=0;
     }
     for (i in obj) {
        out.push(i);
     }
     return out;
  }

  obtenerVehiculos(arr){
    console.log('ben array array array array array array : ', arr)
    this.vehiculos = [];
    //this.rows1 = [];
    var s="";
    for(var i=0;i<arr.length;i++){
      var tipoId = parseInt(arr[i]);
      s=s+tipoId+",";
    }
    s=s.substring(0, s.length - 1);
    //console.log(s);
    if(s!=""){
      console.log('f s s s s s ss  s : ', s)
      this.vehiculoService.obtenerVehiculosPorTipo(s).then(response => {
        //console.log(response);
        if(response){
          if(response.length>0){
            this.vehiculos = response;
          }
        }
      });
    }
  }
  onActivate(event) {
    //console.log('Activate Event', event);
  }
  onActivateVehicles(event) {
    //console.log('Activate Event', event);
  }
  onActivateManifests(event) {
    //console.log('Activate Event', event);
    //console.log('Row', event.row);
    this.selectedTravelId =event.row.id;
  }
  onCheckboxChangeFunction(event){
    //console.log('checked Event', event);
  }
  setAttendedAppointment(idManifiest){
    var attendedAppointment = true;
    var comments;
    let that = this;
    swal({
     title: '',
     type: 'info',
     html: 'Comentarios: <textarea id="swal-comments" rows="3" cols="50"></textarea>',
     showCancelButton: false,
     confirmButtonColor: '#3085d6',
     cancelButtonColor: '#d33',
     confirmButtonText: 'Aceptar',
     cancelButtonText: 'No',
     preConfirm: function () {
       return new Promise(function (resolve , reject) {
           resolve([
              $('#swal-comments').val()
           ])
       });
     },
     onOpen: function () {
       $('#swal-comments').focus();
     }
   }).then(function (result) {

     if(result.dismiss !== undefined){
       if (result.dismiss.toString() === 'cancel') {
       }
     }else{
       if(result.value!== undefined){
          if(result.value){
             comments=result.value[0];
             var param_1 = {
                 "travelManifestId": idManifiest,
                 "travelAppointmentComment" : comments,
                 "travelAttendedAppointment" : attendedAppointment
             };
             console.log(param_1);
             console.log(that.viajes);

             that.manifiestoService.actualizarEstadoCita(JSON.stringify(param_1))
               .then(response =>{
                if (response.estado == 'EXITO') {
                   for(var k=0;k<that.viajes.length;k++){
                     if(that.viajes[k].id == idManifiest){
                      that.viajes[k].travelAppointmentComment = comments;
                      that.viajes = [...that.viajes];
                      break;
                   }
                 }
                }
              });
          }
        }
      }
    });


  }
  rechazarSolicitud(id):void{
    var options = {};
    $.map(this.tiposRechazo,
       function(o) {
           options[o.id] = o.Description;
    });
    let that = this;
    swal({
     title: '¿Esta seguro de rechazar la solicitud seleccionada?',
     type: 'warning',
     input: 'select',
     inputOptions: options,
     inputPlaceholder: 'Seleccione el tipo de rechazo',
     html: 'Razón: <textarea id="swal-input1" rows="3" cols="50"></textarea>',
     showCancelButton: true,
     confirmButtonColor: '#3085d6',
     cancelButtonColor: '#d33',
     confirmButtonText: 'Sí',
     cancelButtonText: 'No',
     preConfirm: function (selectedOption) {
       return new Promise(function (resolve , reject) {
         if(selectedOption!=""){
           console.log(selectedOption);
           resolve([
              $('#swal-input1').val(),
              selectedOption,
           ])
         }else{
            swal.showValidationError('Debe seleccionar el tipo de rechazo.');
            swal.enableButtons();
            return false;
         }
       });
     },
     onOpen: function () {
       $('#swal-input1').focus();
     }
   }).then(function (result) {
     //console.log(result);
     if(result.dismiss !== undefined){
       if (result.dismiss.toString() === 'cancel') {
       }
     }else{
       if(result.value!== undefined){
          if(result.value){
            //console.log(result.value);
            //swal(JSON.stringify(result))
            var comment=result.value[0];
            var typeRejectId=parseInt(result.value[1]);
            var idSolicitud=id;
            //console.log(comment+" "+typeRejectId+" "+id);
            var dateTime = new Date();

            var day = dateTime.getDate().toString().length > 1 ? dateTime.getDate() : '0' + dateTime.getDate();
            //var month = dateTime.getMonth().toString().length > 1 ? dateTime.getMonth() + 1 : '0' + (dateTime.getMonth() + 1);
            let month: any = dateTime.getMonth() + 1;
            var hours = dateTime.getHours().toString().length > 1 ? dateTime.getHours() : '0' + dateTime.getHours();
            var minutes = dateTime.getMinutes().toString().length > 1 ? dateTime.getMinutes() : '0' + dateTime.getMinutes();
            var seconds = dateTime.getSeconds().toString().length > 1 ? dateTime.getSeconds() : '0' + dateTime.getSeconds();
            if(month<10){
               month='0'+month;
            }
            var currentDate = dateTime.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' +seconds;
            var param_1 = {
                "travelRequestId": idSolicitud,
                "requestStatus" : "R"
            };
            var param_2 = {
                "date" : currentDate,
                "comment" : comment,
                "rejectionTypeId" : typeRejectId,
                "travelRequestId": idSolicitud,
                "userId": that.userId
            };
            that.manifiestoService.actualizarEstadoSolicitud(JSON.stringify(param_1))
              .then(response =>{
               if (response.estado == 'EXITO') {
                   var j =that.rows.length-1;
                   while(j>=0){
                     if(idSolicitud == that.rows[j].id){
                       that.rows.splice(j,1);
                       break;
                     }
                     j--;
                 }
                 that.rows = [...that.rows];
                 that.manifiestoService.crearHistorialSolicitud(JSON.stringify(param_2))
                   .then(s =>{
                     swal({
                       title: 'Solicitud rechazada exitosamente',
                       text: '',
                       type: 'success'
                      }).catch(swal.noop);
                  });
               }
             });
          }
       }
     }
   });
  }
  buscarVehiculo():void{
    this.vehiculoPorPlaca =[];
    if(this.vehiculoExp.plate!=""){
      this.vehiculoService.obtenerVehiculoPorPlaca(this.vehiculoExp.plate.trim()).then(response => {
        console.log(response);
        if(response){
          if(response.length!=0){
             this.vehiculoPorPlaca = response;
             this.vehiculoExp.plate = "";
          }else{
            swal({
              title: 'No se encontró ningún vehículo para la placa digitada.',
              text: '',
              type: 'warning'
             }).catch(swal.noop);
          }
        }
      });
    }else if(this.vehiculoExp.driverIdentification!=""){
      this.vehiculoService.obtenerVehiculoPorCedulaConductor(this.vehiculoExp.driverIdentification.trim()).then(response => {
        if(response){
          if(response.length!=0){
             this.vehiculoPorPlaca = response;
             this.vehiculoExp.driverIdentification = "";
          }else{
            swal({
              title: 'No se encontró ningún vehículo para la cedula digitada.',
              text: '',
              type: 'warning'
             }).catch(swal.noop);
          }
        }
      });
    }else if(this.vehiculoExp.driverName!=""){
      this.vehiculoService.obtenerVehiculoPorNombreConductor(this.vehiculoExp.driverName.trim()).then(response => {
        if(response){
          console.log(response);
          if(response.length!=0){
             this.vehiculoPorPlaca = response;
             this.vehiculoExp.driverName = "";
          }else{
            swal({
              title: 'No se encontró ningún vehículo para el nombre digitado.',
              text: '',
              type: 'warning'
             }).catch(swal.noop);
          }
        }
      });
    }
  }
  limpiar(){
    this.vehiculoExp.plate = "";
    this.vehiculoExp.driverIdentification = "";
    this.vehiculoExp.driverName = "";
    this.vehiculoPorPlaca =[];
  }
  invitarConductores(){
    var typeOfServiceId = this.solicitudExp.serviceTypeId;
    var selectedTravelRequests = [];
    if(this.selectedVehicles.length>0){
      console.log(this.manifiestoExp.appointmentaddress)
      console.log(this.manifiestoExp.appointmentmanager)

      if(this.origenViajeId!=null&&this.destinoViajeId!=null&&this.routeId!=null){
        if(typeOfServiceId!=null){
            let that = this;
            swal({
              title: '¿Esta seguro de enviar la invitación a los conductores seleccionados?',
              text: '',
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Sí',
              cancelButtonText: 'No'
            }).then(function (s) {
              console.log(s);
             if(s.dismiss !== undefined){
               if (s.dismiss.toString() === 'cancel') {
               }
             }else{
               if(s.value!== undefined){
                  if(s.value){

                    var dateTime = new Date();

                    var day = dateTime.getDate().toString().length > 1 ? dateTime.getDate() : '0' + dateTime.getDate();
                    //var month = dateTime.getMonth().toString().length > 1 ? dateTime.getMonth() + 1 : '0' + (dateTime.getMonth() + 1);
                    let month: any = dateTime.getMonth() + 1;

                    var hours = dateTime.getHours().toString().length > 1 ? dateTime.getHours() : '0' + dateTime.getHours();
                    var minutes = dateTime.getMinutes().toString().length > 1 ? dateTime.getMinutes() : '0' + dateTime.getMinutes();
                    var seconds = dateTime.getSeconds().toString().length > 1 ? dateTime.getSeconds() : '0' + dateTime.getSeconds();
                    if(month<10){
                       month='0'+month;
                    }
                    currentDate = dateTime.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' +seconds;
                    console.log(currentDate);
                    that.manifiestoService.enviarInvitacion(currentDate, that.origenViajeId, that.destinoViajeId, that.selectedVehicles, that.comments1)
                     .then(response =>{
                         if(response.estado =='EXITO'){
                           swal({
                             title: 'Se han enviado las invitaciones.',
                             text: '',
                             type: 'success'
                            }).catch(swal.noop);

                            that.viajeId = -1;
                            var param;
                            for(var i=0;i<that.selected.length;i++){
                                selectedTravelRequests.push({id:that.selected[i].id});
                            }
                            if(that.viajeId==-1){
                              param = {
                                  "date" : currentDate,
                                  "serviceTypeId" : typeOfServiceId,
                                  "vehicleId" : 1,
                                  "routeId":that.routeId,
                                  "manifestStatus": "N",
                                  "driverStatus": "P",
                                  "ManifestComment": that.comments1, 
                                  "travelAppointmentDate" : that.manifiestoExp.appointmentDate,

                                  "appointmentInOffice": that.manifiestoExp.appointmentInOffice,
                                  "appointmentmanager": that.manifiestoExp.appointmentmanager,
                                  "appointmentaddress": that.manifiestoExp.appointmentaddress,
                              };
                              that.manifiestoService.crearActualizarManifiesto(JSON.stringify(param))
                                .then(response =>{
                                 if (response.estado == 'EXITO') {
                                  console.log('ingreso a guardar a la tabla driver response')


                                   var manifiestoId = response.travelManifestId;
                                   that.viajeId = manifiestoId;
                                   //alert(that.viajeId);

                                     that.manifiestoService.guardarRespuestasConductores(that.viajeId, that.selectedVehicles)
                                      .then(response =>{
                                        that.globals.intVal=setInterval(that.obtenerRespuestasConductores.bind(that), timeSeconds);
                                      });
                                  }
                              });
                            }else{
                              param = {
                                  "id": that.viajeId,
                                  "date" : currentDate,
                                  "serviceTypeId" : typeOfServiceId,
                                  "vehicleId" : 1,
                                  "routeId":that.routeId,
                                  "manifestStatus": "N",
                                  "driverStatus": "P",
                                  "ManifestComment": that.comments1,
                                  "travelAppointmentDate" : that.manifiestoExp.appointmentDate,

                                  "appointmentInOffice": that.manifiestoExp.appointmentInOffice,
                                  "appointmentmanager": that.manifiestoExp.appointmentmanager,
                                  "appointmentaddress": that.manifiestoExp.appointmentaddress,
                              };
                              that.manifiestoService.crearActualizarManifiesto(JSON.stringify(param))
                                .then(response =>{
                                 if (response.estado == 'EXITO') {

                                   that.manifiestoService.guardarRespuestasConductores(that.viajeId, that.selectedVehicles)
                                    .then(response =>{
                                      that.globals.intVal=setInterval(that.obtenerRespuestasConductores.bind(that), timeSeconds);
                                    });
                                  }
                              });
                            }
                            that.comments1 = "";
                         }
                    });
                  }
                }
              }
            });
        }else{
          swal({
            title: 'Debe seleccionar el tipo de servicio.',
            text: '',
            type: 'warning'
           }).catch(swal.noop);
        }
      }else{
        swal({
          title: 'Debe de seleccionar un origen, destino y/o ruta',
          text: '',
          type: 'warning'
         }).catch(swal.noop);
      }
    }else{
      swal({
        title: 'Debe de seleccionar por lo menos un conductor.',
        text: '',
        type: 'warning'
       }).catch(swal.noop);
    }
  }
  doTextareaValueChange1(ev) {
    try {
      if (ev.target.value.trim().length != 0){
          this.comments1 = ev.target.value.trim();
      }

    } catch(e) {
      console.info('could not set textarea-value');
    }
  }
  crearManifiesto(id){
    console.log('crearManifiesto ')
    try {
      clearInterval(this.globals.intVal);
    }catch(error) {}
    if(this.manifiestoExp.appointmentDate!=null&&this.manifiestoExp.appointmentTime!=null){
      if(this.routeId!=null){
        if(this.trafficControlIsRequired==false){
          var selectedTravelRequests = [];
          var typeOfServiceId = this.solicitudExp.serviceTypeId;
          if(this.selected.length>0){
            if(typeOfServiceId!=null){
              let that = this;
              swal({
                title: '¿Esta seguro de generar el viaje con las solicitudes seleccionadas?',
                text: '',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí',
                cancelButtonText: 'No'
              }).then(function (s) {
                console.log(s);
               if(s.dismiss !== undefined){
                 if (s.dismiss.toString() === 'cancel') {
                 }
               }else{
                 if(s.value!== undefined){
                    if(s.value){
                       var vehicleId=id;
                       var dateTime = new Date();
                       if(currentDate==null){
                         var day = dateTime.getDate().toString().length > 1 ? dateTime.getDate() : '0' + dateTime.getDate();
                         //var month = dateTime.getMonth().toString().length > 1 ? dateTime.getMonth() + 1 : '0' + (dateTime.getMonth() + 1);
                         let month: any = dateTime.getMonth() + 1;
                         var hours = dateTime.getHours().toString().length > 1 ? dateTime.getHours() : '0' + dateTime.getHours();
                         var minutes = dateTime.getMinutes().toString().length > 1 ? dateTime.getMinutes() : '0' + dateTime.getMinutes();
                         var seconds = dateTime.getSeconds().toString().length > 1 ? dateTime.getSeconds() : '0' + dateTime.getSeconds();
                         if(month<10){
                            month='0'+month;
                         }
                         currentDate = dateTime.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' +seconds;
                       }
                       for(var i=0;i<that.selected.length;i++){
                           selectedTravelRequests.push({id:that.selected[i].id});
                       }

                       if(that.viajeId==-1){
                        var fechaCita = that.parserFormatter.format(that.manifiestoExp.appointmentDate);
                        var fechaHoraCita = fechaCita+" "+that.manifiestoExp.appointmentTime+":00";

                         var param = {
                             "date" : currentDate,
                             "serviceTypeId" : typeOfServiceId,
                             "vehicleId" : vehicleId,
                             "manifestStatus": "A",
                             "routeId":that.routeId,
                             "travelAppointmentDate":fechaHoraCita,
                             "driverStatus": "A",

                             "appointmentInOffice": that.manifiestoExp.appointmentInOffice,
                             "appointmentmanager": that.manifiestoExp.appointmentmanager,
                             "appointmentaddress": that.manifiestoExp.appointmentaddress,
                         };
                         that.manifiestoService.crearActualizarManifiesto(JSON.stringify(param))
                           .then(response =>{
                            if (response.estado == 'EXITO') {
                              var manifiestoId = response.travelManifestId;

                              that.manifiestoService.crearDetalleManifiesto(manifiestoId,selectedTravelRequests,'A')
                                .then(s =>{

                                });
                                that.selected = [];
                                for(var i=0;i<selectedTravelRequests.length;i++){
                                  var j =that.rows.length-1;
                                  while(j>=0){
                                    if(selectedTravelRequests[i].id== that.rows[j].id){
                                      that.rows.splice(j,1);
                                      break;
                                    }
                                    j--;
                                  }
                                }
                                that.rows = [...that.rows];
                                that.vehiculoPorPlaca =[];
                                that.vehiculos = [];
                                that.solicitudExp.serviceTypeId = null;
                                if(originMarker!=null){
                                    originMarker.setMap(null);
                                    originMarker=null;
                                }
                                if(destinationMarker!=null){
                                   destinationMarker.setMap(null);
                                   destinationMarker=null;
                                }
                                isOriginCreated=false;
                                isDestinationCreated=false;

                                originLat=null;
                                originLng=null;
                                destinationLat=null;
                                destinationLng=null;
                                if(directionsDisplay != null) {
                                   directionsDisplay.setMap(null);
                                   directionsDisplay = null;
                                }
                                isRouteCreated=false;
                                that.wAux = [];
                                for (var i = 0; i < that.circles.length; i++) {
                                   that.circles[i].location.setMap(null);
                                  }
                                that.circles=[];
                                that.loadsUbi=[];
                                that.unloadsUbi=[];
                                if(alternateDirectionsDisplay != null) {
                                   alternateDirectionsDisplay.setMap(null);
                                   alternateDirectionsDisplay = null;
                                }
                                isOptionalRouteCreated = false;
                                that.routeId= null;
                                that.deparment1 = "";
                                that.deparment2 = "";
                                that.origenViajeId = null;
                                that.destinoViajeId = null;
                                currentDate=null;
                                that.manifiestoExp.appointmentDate = null;
                                that.manifiestoExp.appointmentTime = null;
                                swal({
                                  title: 'Se ha realizado la invitación exitosamente',
                                  text: '',
                                  type: 'success'
                                 }).catch(swal.noop);
                                var msg = "Has sido invitado a un viaje "
                                that.manifiestoService.notificarConductor(vehicleId, msg).then(response =>{
                                });
                            }
                         });
                       }else{
                         var fechaCita = that.parserFormatter.format(that.manifiestoExp.appointmentDate);
                         var fechaHoraCita = fechaCita+" "+that.manifiestoExp.appointmentTime+":00";

                         var param1 = {
                             "id": that.viajeId,
                             "date" : currentDate,
                             "serviceTypeId" : typeOfServiceId,
                             "vehicleId" : vehicleId,
                             "manifestStatus": "A",
                             "routeId":that.routeId,
                             "travelAppointmentDate":fechaHoraCita,
                             "driverStatus": "A",

                             "appointmentInOffice": that.manifiestoExp.appointmentInOffice,
                             "appointmentmanager": that.manifiestoExp.appointmentmanager,
                             "appointmentaddress": that.manifiestoExp.appointmentaddress,
                         };
                         that.manifiestoService.crearActualizarManifiesto(JSON.stringify(param1))
                           .then(response =>{
                            if (response.estado == 'EXITO') {
                              var manifiestoId = that.viajeId;

                              that.manifiestoService.crearDetalleManifiesto(manifiestoId,selectedTravelRequests,'A')
                                .then(s =>{

                                });

                                that.selected = [];
                                for(var i=0;i<selectedTravelRequests.length;i++){
                                  var j =that.rows.length-1;
                                  while(j>=0){
                                    if(selectedTravelRequests[i].id== that.rows[j].id){
                                      that.rows.splice(j,1);
                                      break;
                                    }
                                    j--;
                                  }
                                }
                                that.rows = [...that.rows];
                                that.vehiculoPorPlaca =[];
                                that.vehiculos = [];
                                that.solicitudExp.serviceTypeId = null;
                                if(originMarker!=null){
                                    originMarker.setMap(null);
                                    originMarker=null;
                                }
                                if(destinationMarker!=null){
                                   destinationMarker.setMap(null);
                                   destinationMarker=null;
                                }
                                isOriginCreated=false;
                                isDestinationCreated=false;

                                originLat=null;
                                originLng=null;
                                destinationLat=null;
                                destinationLng=null;
                                if(directionsDisplay != null) {
                                   directionsDisplay.setMap(null);
                                   directionsDisplay = null;
                                }
                                isRouteCreated=false;
                                that.wAux = [];
                                for (var i = 0; i < that.circles.length; i++) {
                                   that.circles[i].location.setMap(null);
                                  }
                                that.circles=[];
                                that.loadsUbi=[];
                                that.unloadsUbi=[];
                                if(alternateDirectionsDisplay != null) {
                                   alternateDirectionsDisplay.setMap(null);
                                   alternateDirectionsDisplay = null;
                                }
                                isOptionalRouteCreated = false;
                                that.routeId= null;
                                that.deparment1 = "";
                                that.deparment2 = "";
                                that.origenViajeId = null;
                                that.destinoViajeId = null;
                                that.viajeId = -1;
                                currentDate=null;
                                that.manifiestoExp.appointmentDate = null;
                                that.manifiestoExp.appointmentTime = null;
                                swal({
                                  title: 'Se ha asignado el viaje exitosamente',
                                  text: '',
                                  type: 'success'
                                 }).catch(swal.noop);
                                var msg = "Te ha sido asignado un viaje y tiene cita de recogida de documentos para la fecha: "+fechaHoraCita;
                                that.manifiestoService.notificarConductor(vehicleId, msg).then(response =>{
                                });
                            }
                         });
                       }


                     }
                   }
                 }
              }).catch(swal.noop);
            }else{
              swal({
                title: 'Debe seleccionar el tipo de servicio.',
                text: '',
                type: 'warning'
               }).catch(swal.noop);
            }
          }else{
            swal({
              title: 'Para poder asignar el viaje debe por lo menos seleccionar una solicitud.',
              text: '',
              type: 'warning'
             }).catch(swal.noop);
          }
        }else{
          var selectedTravelRequests = [];
          var typeOfServiceId = this.solicitudExp.serviceTypeId;
          if(this.selected.length>0){
            if(typeOfServiceId!=null){
              let that = this;
              swal({
                title: '¿Esta seguro de generar el viaje con las solicitudes seleccionadas?',
                text: '',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí',
                cancelButtonText: 'No'
              }).then(function (s) {
                console.log(s);
               if(s.dismiss !== undefined){
                 if (s.dismiss.toString() === 'cancel') {
                 }
               }else{
                 if(s.value!== undefined){
                    if(s.value){
                       var vehicleId=id;
                       var dateTime = new Date();
                      if(currentDate==null){
                         var day = dateTime.getDate().toString().length > 1 ? dateTime.getDate() : '0' + dateTime.getDate();
                         //var month = dateTime.getMonth().toString().length > 1 ? dateTime.getMonth() + 1 : '0' + (dateTime.getMonth() + 1);
                         let month: any = dateTime.getMonth() + 1;
                         var hours = dateTime.getHours().toString().length > 1 ? dateTime.getHours() : '0' + dateTime.getHours();
                         var minutes = dateTime.getMinutes().toString().length > 1 ? dateTime.getMinutes() : '0' + dateTime.getMinutes();
                         var seconds = dateTime.getSeconds().toString().length > 1 ? dateTime.getSeconds() : '0' + dateTime.getSeconds();
                         if(month<10){
                            month='0'+month;
                         }

                         currentDate = dateTime.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' +seconds;
                       }
                       for(var i=0;i<that.selected.length;i++){
                           selectedTravelRequests.push({id:that.selected[i].id});
                       }
                       if(that.viajeId==-1){
                         var fechaCita = that.parserFormatter.format(that.manifiestoExp.appointmentDate);
                         var fechaHoraCita = fechaCita+" "+that.manifiestoExp.appointmentTime+":00";
                         console.log(fechaHoraCita);
                         var param = {
                             "date" : currentDate,
                             "serviceTypeId" : typeOfServiceId,
                             "vehicleId" : vehicleId,
                             "routeId":that.routeId,
                             "travelAppointmentDate":fechaHoraCita,
                             "manifestStatus": "P",

                             "appointmentInOffice": that.manifiestoExp.appointmentInOffice,
                             "appointmentmanager": that.manifiestoExp.appointmentmanager,
                             "appointmentaddress": that.manifiestoExp.appointmentaddress,
                         };
                         console.log(param);
                         that.manifiestoService.crearActualizarManifiesto(JSON.stringify(param))
                           .then(response =>{
                            if (response.estado == 'EXITO') {
                              var manifiestoId = response.travelManifestId;
                              that.manifiestoService.crearDetalleManifiesto(manifiestoId,selectedTravelRequests,'P')
                                .then(s =>{

                                });
                                that.selected = [];
                                for(var i=0;i<selectedTravelRequests.length;i++){
                                  var j =that.rows.length-1;
                                  while(j>=0){
                                    if(selectedTravelRequests[i].id== that.rows[j].id){
                                      that.rows.splice(j,1);
                                      break;
                                    }
                                    j--;
                                  }
                                }
                                that.rows = [...that.rows];
                                that.vehiculoPorPlaca =[];
                                that.vehiculos = [];
                                that.solicitudExp.serviceTypeId = null;
                                if(originMarker!=null){
                                    originMarker.setMap(null);
                                    originMarker=null;
                                }
                                if(destinationMarker!=null){
                                   destinationMarker.setMap(null);
                                   destinationMarker=null;
                                }
                                isOriginCreated=false;
                                isDestinationCreated=false;

                                originLat=null;
                                originLng=null;
                                destinationLat=null;
                                destinationLng=null;
                                currentDate=null;
                                if(directionsDisplay != null) {
                                   directionsDisplay.setMap(null);
                                   directionsDisplay = null;
                                }
                                isRouteCreated=false;
                                that.wAux = [];
                                for (var i = 0; i < that.circles.length; i++) {
                                   that.circles[i].location.setMap(null);
                                  }
                                that.circles=[];
                                that.loadsUbi=[];
                                that.unloadsUbi=[];
                                if(alternateDirectionsDisplay != null) {
                                   alternateDirectionsDisplay.setMap(null);
                                   alternateDirectionsDisplay = null;
                                }
                                isOptionalRouteCreated = false;
                                that.routeId= null;
                                that.deparment1 = "";
                                that.deparment2 = "";
                                that.origenViajeId = null;
                                that.destinoViajeId = null;
                                that.manifiestoExp.appointmentDate = null;
                                that.manifiestoExp.appointmentTime = null;
                                swal({
                                  title: 'Se ha asignado el viaje exitosamente',
                                  text: '',
                                  type: 'success'
                                 }).catch(swal.noop);
                            }
                         });
                       }else{
                         var fechaCita = that.parserFormatter.format(that.manifiestoExp.appointmentDate);
                         var fechaHoraCita = fechaCita+" "+that.manifiestoExp.appointmentTime+":00";

                         var param1 = {
                             "id" : that.viajeId,
                             "date" : currentDate,
                             "serviceTypeId" : typeOfServiceId,
                             "vehicleId" : vehicleId,
                             "routeId":that.routeId,
                             "travelAppointmentDate":fechaHoraCita,
                             "manifestStatus": "P",

                             "appointmentInOffice": that.manifiestoExp.appointmentInOffice,
                             "appointmentmanager": that.manifiestoExp.appointmentmanager,
                             "appointmentaddress": that.manifiestoExp.appointmentaddress,
                         };
                         that.manifiestoService.crearActualizarManifiesto(JSON.stringify(param1))
                           .then(response =>{
                            if (response.estado == 'EXITO') {
                              var manifiestoId = that.viajeId;
                              that.manifiestoService.crearDetalleManifiesto(manifiestoId,selectedTravelRequests,'P')
                                .then(s =>{

                                });
                                that.selected = [];
                                for(var i=0;i<selectedTravelRequests.length;i++){
                                  var j =that.rows.length-1;
                                  while(j>=0){
                                    if(selectedTravelRequests[i].id== that.rows[j].id){
                                      that.rows.splice(j,1);
                                      break;
                                    }
                                    j--;
                                  }
                                }
                                that.rows = [...that.rows];
                                that.vehiculoPorPlaca =[];
                                that.vehiculos = [];
                                that.solicitudExp.serviceTypeId = null;
                                if(originMarker!=null){
                                    originMarker.setMap(null);
                                    originMarker=null;
                                }
                                if(destinationMarker!=null){
                                   destinationMarker.setMap(null);
                                   destinationMarker=null;
                                }
                                isOriginCreated=false;
                                isDestinationCreated=false;

                                originLat=null;
                                originLng=null;
                                destinationLat=null;
                                destinationLng=null;
                                if(directionsDisplay != null) {
                                   directionsDisplay.setMap(null);
                                   directionsDisplay = null;
                                }
                                isRouteCreated=false;
                                that.wAux = [];
                                for (var i = 0; i < that.circles.length; i++) {
                                   that.circles[i].location.setMap(null);
                                  }
                                that.circles=[];
                                that.loadsUbi=[];
                                that.unloadsUbi=[];
                                if(alternateDirectionsDisplay != null) {
                                   alternateDirectionsDisplay.setMap(null);
                                   alternateDirectionsDisplay = null;
                                }
                                isOptionalRouteCreated = false;
                                that.routeId= null;
                                that.deparment1 = "";
                                that.deparment2 = "";
                                that.viajeId = -1;
                                that.origenViajeId = null;
                                that.destinoViajeId = null;
                                currentDate=null;
                                that.manifiestoExp.appointmentDate = null;
                                that.manifiestoExp.appointmentTime = null;
                                swal({
                                  title: 'Se ha asignado el viaje exitosamente',
                                  text: '',
                                  type: 'success'
                                 }).catch(swal.noop);
                            }
                         });
                       }


                     }
                   }
                 }
              }).catch(swal.noop);
            }else{
              swal({
                title: 'Debe seleccionar el tipo de servicio.',
                text: '',
                type: 'warning'
               }).catch(swal.noop);
            }
          }else{
            swal({
              title: 'Para poder asignar el viaje debe por lo menos seleccionar una solicitud.',
              text: '',
              type: 'warning'
             }).catch(swal.noop);
          }
        }
      }else{
        swal({
          title: 'Debe seleccionar una ruta.',
          text: '',
          type: 'warning'
         }).catch(swal.noop);
      }
    }else{
      swal({
        title: 'Se requiere la fecha y hora para la programación de recogida de documentos.',
        text: '',
        type: 'warning'
       }).catch(swal.noop);
    }
  }
  agregarVehiculo(index){
    if(this.selected.length>0){
      if(this.existeVehiculo(this.vehiculoPorPlaca[index].id)==false){
        this.vehiculos.push({id:this.vehiculoPorPlaca[index].id,urlImage:this.vehiculoPorPlaca[index].urlImage,driver:this.vehiculoPorPlaca[index].driver,vehicleTypeId:this.vehiculoPorPlaca[index].vehicleTypeId,vehicleType:this.vehiculoPorPlaca[index].vehicleType,plate:this.vehiculoPorPlaca[index].plate,driverId:this.vehiculoPorPlaca[index].driverId,status:""});
        this.vehiculos = [...this.vehiculos];
      }else{
        swal({
          title: 'El vehículo ya fue agregado previamente.',
          text: '',
          type: 'warning'
         }).catch(swal.noop);
      }
      this.vehiculoPorPlaca =[];
    }else{
      swal({
        title: 'Debe de seleccionar por lo menos una solicitud antes de agregar un vehículo.',
        text: '',
        type: 'warning'
       }).catch(swal.noop);
    }
  }
  existeVehiculo(vehicleId){
    var b=false;
    for(var i=0;i<this.vehiculos.length;i++){
      if(this.vehiculos[i].id==vehicleId){
         b=true;
         break;
      }
    }
    return b;
  }
}
