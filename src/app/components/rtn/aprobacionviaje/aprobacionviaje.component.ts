import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
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
var marker: any;
var map: any;
var lat:number;
var lng:number;
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

@Component({
  selector: 'app-aprobacionviaje',
  templateUrl: './aprobacionviaje.component.html',
  styleUrls: ['./aprobacionviaje.component.css']
})
export class AprobacionviajeComponent implements OnInit {
  ruta: any = {};
  data: any = {};
  circles: any =[];
  manifiestos: any []=[];
  tiposServicio: any [] = [];
  tiposRechazo: any [] = [];
  cargues: any []=[];
  descargues: any []=[];
  vehiculo: any [] = [];
  rows = [];
  selected = [];
  solicitudes: any [] = [];
  solicitudExp: any = {};
  vehiculoExp: any = {};
  wAux: any []=[];
  loadsUbi: any []=[];
  unloadsUbi:any []=[];
  routeId:any = null;
  bufferSize = 50;
  origenViaje: any []=[];
  origenViajeBuffer =[];
  destinoViaje: any []=[];
  destinoViajeBuffer: any []=[];
  loadingOrigen = false;
  loadingDestino = false;
  rutas: any[]=[];
  deparment1:any = null;
  deparment2:any = null;
  origenViajeId: any = null;
  destinoViajeId: any = null;
  fechaHoraCita: any = null;
  userId: number;
  travelId:number  = -1;
  vehiculoId:number = -1;
  messages_1 = {
    'emptyMessage': '',
    'totalMessage': 'total',
    'selectedMessage': 'seleccionado'
  };
  itemList = [];
  selectedItems = [];
  settings = {};
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
    private alertService: AlertService,
    private rutaService: RutaService,
    private globals: Globals,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    try {
      clearInterval(this.globals.intVal);
    }catch(error) {}

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
    this.settings = {

            text: "Seleccionar",
            classes: "multiselect-style",
            enableCheckAll: false,
            maxHeight: '150'
    };
    this.obtenerTiposRechazo();
    this.obtenerManifiestos();
    this.obtenerPuntosControl();
    this.obtenerCiudades();
    this.obtenerCondiciones();
    //this.userId = this.commonService.obtenerUsuarioId();
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
  obtenerManifiestos(): void{
    this.manifiestoService.obtenerManifiestosPendientes().then(response => {
      this.manifiestos = response;
    });
  }
  obtenerCondiciones():void{
    this.manifiestoService.obtenerCondiciones().then(response => {
      for(var i=0;i<response.length;i++){
        this.itemList.push({id:response[i].id,itemName:response[i].Description});
      }
    });
  }
  obtenerTiposRechazo(): void{
    this.manifiestoService.obtenerTiposRechazo().then(response => {
      this.tiposRechazo = response;
    });
  }
  obtenerVehiculo(vehiculoId):void{
    this.vehiculo =[];
    this.vehiculoService.obtenerVehiculoPorId(vehiculoId).then(response => {
      if(response){
        this.vehiculo = response;
      }
    });
  }
  obtenerSolicitudesViaje(idViaje):void{
    this.rows =[];
    this.manifiestoService.obtenerManifiestoDetalleInfo(idViaje).then(response => {
      this.rows = response;
      //console.log("Solicitudes");
      //console.log(this.rows);
      this.obtenerUbicacionesCarguesDescargues()
    });
  }
  obtenerDetalleViaje(idViaje){
    this.manifiestoService.obtenerManifiesto(idViaje).then(response => {
      if (response) {
        this.routeId = response[0].routeId;
        this.obtenerRuta(this.routeId);
      }
    });
  }
  obtenerRuta(idRuta){
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
    var waypts = [];
    this.wAux = [];
    this.rutas = [];
    this.deparment1 = "";
    this.deparment2 = "";
    this.rutaService.obtenerRuta(this.routeId).then(response =>{
      if (response) {
        this.origenViajeId = response[0].routeOriginCityId;
        this.empresaService.obtenerDepatamentoPorCiudad(this.origenViajeId)
          .then(response =>{
            if (response) {
               this.deparment1=response[0].departmentName;
            }
        });
        this.destinoViajeId = response[0].routeDestinationCityId;
        this.empresaService.obtenerDepatamentoPorCiudad(this.destinoViajeId)
          .then(response =>{
            if (response) {
               this.deparment2=response[0].departmentName;
            }
        });
        if(this.origenViajeId!=null&&this.destinoViajeId!=null){
           this.rutaService.obtenerRutasOrigenDestino(this.origenViajeId,this.destinoViajeId)
             .then(response =>{
               if (response) {
                   this.rutas = response;
               }
           });
        }
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

           directionsService = new google.maps.DirectionsService();
           directionsDisplay = new google.maps.DirectionsRenderer({
              //draggable: true,
              suppressMarkers: true
           });
           var req = {
               origin:new google.maps.LatLng(originLat, originLng),
               destination: new google.maps.LatLng(destinationLat, destinationLng),
               //optimizeWaypoints: true,
               waypoints: waypts,
               travelMode: google.maps.DirectionsTravelMode.DRIVING
            };
            directionsDisplay.setMap(map);
             directionsService.route(req, function(response, status) {
                 if (status === google.maps.DirectionsStatus.OK) {
                     directionsDisplay.setDirections(response);
                      var point = response.routes[ 0 ].legs[ 0 ];
                      $( '#travel_data' ).html( '<b>Tiempo estimado de viaje:</b> ' + point.duration.text + ', <b>distancia:</b> ' + point.distance.text + '' );
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
                     var pinImage = new google.maps.MarkerImage("http://www.googlemapsmarkers.com/v1/7d2181/");
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
              //draggable: true,
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
                     var point = response.routes[ 0 ].legs[ 0 ];
                     $( '#travel_data' ).html( '<b>Tiempo estimado de viaje:</b> ' + point.duration.text + ', <b>distancia:</b> ' + point.distance.text + '' );
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
                     var pinImage = new google.maps.MarkerImage("http://www.googlemapsmarkers.com/v1/7d2181/");
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
                   var point = response.routes[ 0 ].legs[ 0 ];
                     $( '#travel_data' ).html( '<b>Tiempo estimado de viaje:</b> ' + point.duration.text + ', <b>distancia:</b> ' + point.distance.text + '' );
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
                      alert(response.routeId);
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
    for(var i=0;i<this.rows.length;i++){
      var idSolicitud = this.rows[i].id;
      this.manifiestoService.obtenerCargues(idSolicitud)
       .then(response =>{
         if (response) {
             console.log(response);
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
   //console.log('Select Event', selected, this.selected);
   //console.log('Número del viaje:'+this.selected[0].id);
   this.travelId = this.selected[0].id;
   this.vehiculoId = this.selected[0].vehicleId;
   this.fechaHoraCita = this.selected[0].travelAppointmentDate;
   //console.log('Número del viaje = '+this.travelId+", numeroVehiculo ="+this.vehiculoId);
   $( '#travel_data' ).html('');
   this.obtenerVehiculo(this.vehiculoId);
   this.obtenerSolicitudesViaje(this.travelId);
   this.obtenerDetalleViaje(this.travelId);

  }

  onActivate(event) {
     console.log('Activate Event', event);
  }
  onItemSelect(item:any){
  }
  onItemDeSelect(item:any){
  }
  approveTravel(){
    console.log(this.selectedItems);
    if(this.travelId>-1){
      if(this.selectedItems.length>0){
          let that = this;
          swal({
            title: '¿Esta seguro de aprobar el viaje seleccionado?',
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
                  var param_1 = {
                      "travelManifestId": that.travelId,
                      "manifestStatus" : "A",
                      "driverStatus" : "A"
                  };

                  for(var i=0;i<that.rows.length;i++){
                    console.log(that.rows[i].id);
                  }
                  that.manifiestoService.actualizarEstadoManifiesto(JSON.stringify(param_1))
                    .then(response =>{
                     if (response.estado == 'EXITO') {
                         var j =that.manifiestos.length-1;
                         while(j>=0){
                           if(that.travelId == that.manifiestos[j].id){
                             that.manifiestos.splice(j,1);
                             break;
                           }
                           j--;
                       }
                       that.manifiestos = [...that.manifiestos];
                       that.manifiestoService.actualizarEstadosSolicitudes(that.rows,'A')
                         .then(obj =>{
                             if (obj.estado == 'EXITO') {
                               var msg ="Te ha sido asignado un viaje y tiene cita de recogida de documentos para la fecha: "+that.fechaHoraCita;
                               that.manifiestoService.notificarConductor(that.vehiculoId, msg).then(response =>{
                               });
                               that.manifiestoService.guardarCondicionesViaje(that.travelId,that.selectedItems)
                                 .then(obj =>{
                                     if (obj.estado == 'EXITO') {
                                         that.selectedItems=[];
                                         that.travelId = -1;
                                     }
                               });
                               that.rows =[];
                               that.vehiculo =[];
                               that.selected =[];
                               //that.travelId = -1;
                               that.vehiculoId =-1;
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


                               swal('Se ha aprobado el viaje exitosamente', '', 'success');

                             }
                         });

                     }
                  });
                }
              }
            }
          });
      }else{
            swal('Para poder aprobar un viaje debe de seleccionar la lista de condiciones antes.', '', 'warning');
      }
    }else{
      swal('Para poder aprobar un viaje debe de seleccionar uno de la lista de viajes pendientes.', '', 'warning');
    }
  }
  rejectTravel(){
    if(this.travelId>-1){
      var options = {};
      $.map(this.tiposRechazo,
         function(o) {
             options[o.id] = o.Description;
      });
      let that = this;
      swal({
       title: '¿Esta seguro de rechazar el viaje seleccionado?',
       type: 'warning',
       input: 'select',
       inputOptions: options,
       inputPlaceholder: 'Seleccione el tipo de rechazo',
       html: 'Razón: <textarea id="swal-input1" rows="3" cols="28"></textarea>',
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
             //reject('Debe seleccionar el tipo de rechazo.')
              //swal('Debe seleccionar el tipo de rechazo.', '', 'error');
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
              var comment=result.value[0];
              var typeRejectId=parseInt(result.value[1]);
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
                  "travelManifestId": that.travelId,
                  "manifestStatus" : "R"
              };
              var param_2 = {
                  "date" : currentDate,
                  "comment" : comment,
                  "rejectionTypeId" : typeRejectId,
                  "travelManifestId": that.travelId,
                  "userName": that.commonService.obtenerNombreUsuario(),
                  "roleId": that.commonService.obtenerIdCodigoPerfilUsuario()
              };
              that.manifiestoService.actualizarEstadoManifiesto(JSON.stringify(param_1))
                .then(response =>{
                 if (response.estado == 'EXITO') {
                     var j =that.manifiestos.length-1;
                     while(j>=0){
                       if(that.travelId == that.manifiestos[j].id){
                         that.manifiestos.splice(j,1);
                         break;
                       }
                       j--;
                   }
                   that.manifiestos = [...that.manifiestos];
                   that.rows =[];
                   that.vehiculo =[];
                   that.selected =[];
                   that.travelId = -1;
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
                   that.manifiestoService.crearHistorialViaje(JSON.stringify(param_2))
                     .then(s =>{
                        swal('El viaje ha sido descartado exitosamente', '', 'success');
                    });
                 }
               });
            }
         }
       }
     });
    }else{
       swal('Para poder rechazar un viaje debe de seleccionar uno de la lista de viajes pendientes.', '', 'warning');
    }
  }

}
