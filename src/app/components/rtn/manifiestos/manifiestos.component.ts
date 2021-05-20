import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AlertService} from '../../../services/alert.service';
import {ManifiestoService} from '../../../services/manifiesto.service';
import {VehiculoService} from '../../../services/vehiculo.service';
import {EmpresaService} from '../../../services/empresa.service';
import {CommonService} from '../../../services/common.service';
import {RutaService} from '../../../services/ruta.service';
import {PuntoService} from '../../../services/punto.service';
import { Globals } from '../../../globals';
//import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbTabsetConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
declare const google: any;
//declare var intVal: any;
var currentDate:any;
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
var timeSeconds: number = 5000;

@Component({
  selector: 'app-manifiestos',
  templateUrl: './manifiestos.component.html',
  styleUrls: ['./manifiestos.component.css']
})
export class ManifiestosComponent implements OnInit {
  manifiestoExp: any = {};
  ruta: any = {};
  data: any = {};
  manifiestos: any []=[];
  historialViajes: any []=[];
  manifiestosRechazados: any []=[];
  tiposServicio: any [] = [];
  vehiculoPorPlaca: any [] = [];
  vehiculos: any [] = [];
  cargues: any []=[];
  descargues: any []=[];
  rows = [];
  rows1 = [];
  selected = [];
  selectedVehicles = [];
  selectedAux = [];
  selectedTravel = [];
  tiposVehiculo = [];
  solicitudes: any [] = [];
  solicitudExp: any = {};
  vehiculoExp: any = {};
  userId: number;
  travelId:number  = -1;
  vehiculoId:number = -1;
  bufferSize = 50;
  origenViaje: any []=[];
  origenViajeBuffer =[];
  destinoViaje: any []=[];
  destinoViajeBuffer: any []=[];
  loadingOrigen = false;
  loadingDestino = false;
  rutas: any[]=[];
  routeId:any = null;
  deparment1:any = null;
  deparment2:any = null;
  origenViajeId: any = null;
  destinoViajeId: any = null;
  wAux: any []=[];
  loadsUbi: any []=[];
  unloadsUbi:any []=[];
  routetrace: any = {};
  circles: any =[];
  messages_1 = {
    'emptyMessage': '',
    'totalMessage': 'total',
    'selectedMessage': 'seleccionado'
  };
  comments1:string = "";
  //@ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
    public parserFormatter: NgbDateParserFormatter,
    private route: ActivatedRoute,
    private router: Router,
    private puntoService: PuntoService,
    private vehiculoService: VehiculoService,
    private manifiestoService: ManifiestoService,
    private commonService:CommonService,
    private empresaService:EmpresaService,
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
    this.obtenerManifiestos();
    this.obtenerManifiestosRechazados();
    this.obtenerTipoServicios();
    this.obtenerHistorialViajes();
    this.obtenerCiudades();
    this.obtenerPuntosControl();
  }
  obtenerRespuestasConductores(){
    this.manifiestoService.obtenerRespuestasConductores(this.travelId)
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
    this.manifiestoService.obtenerManifiestos().then(response => {
      this.manifiestos = response;
    });
  }
  obtenerHistorialViajes():void{
    this.manifiestoService.obtenerHistorialViajes().then(response => {
      this.historialViajes = response;
      console.log(response);
    });
  }
  obtenerManifiestosRechazados(): void{
    this.manifiestoService.obtenerManifiestosRechazados().then(response => {
      this.manifiestosRechazados = response;
      console.log('Manifiestos rechazados : ', this.manifiestosRechazados)
    });
  }
  obtenerTipoServicios(): void{
    this.manifiestoService.obtenerTipoServicios().then(response => {
      this.tiposServicio = response;
    });
  }
  onSelect({ selected }) {
   this.vehiculos = [];
   this.travelId = this.selectedTravel[0].id;
   this.vehiculoId = this.selectedTravel[0].vehicleId;
   console.log(this.travelId+" "+this.vehiculoId);
   //this.obtenerSolicitudes(this.travelId);
   this.solicitudExp.serviceTypeId = null;
   this.obtenerSolicitudesViaje(this.travelId);
   this.obtenerDetalleViaje(this.travelId);
  }
  obtenerDetalleViaje(idViaje){
    this.manifiestoService.obtenerManifiesto(idViaje).then(response => {
      console.log(response);
      if (response) {
        this.routeId = response[0].routeId;
        this.solicitudExp.serviceTypeId = response[0].serviceTypeId;
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
  /*obtenerSolicitudes(idViaje):void{

    this.manifiestoService.obtenerManifiestoDetalleInfo(idViaje).then(response => {
      this.selected = [...response];
    });
  }*/
  obtenerSolicitudesViaje(idViaje):void{
    this.rows =[];
    this.selected = [];
    this.manifiestoService.obtenerSolicitudesDisponibles(idViaje).then(response => {
        this.rows  = response;
        for(var i=0;i<response.length;i++){
           if(response[i].travelStatus=='P'){
                this.selected.push(response[i]);
           }
        }
        this.selectedAux = this.selected;
        this.selected = [...this.selected];
        this.tiposVehiculo = [];
        for(var i=0;i<this.selected.length;i++){
          this.tiposVehiculo.push(this.selected[i].vehicleTypeId);
        }
        this.tiposVehiculo = this.eliminateDuplicates(this.tiposVehiculo);
        this.obtenerVehiculos(this.tiposVehiculo);
        this.obtenerUbicacionesCarguesDescargues();
    });
  }
  onSelect2({ selected }) {
  console.log('Select Event', selected);
   this.tiposVehiculo = [];
   this.selectedVehicles = [];
   for(var i=0;i<selected.length;i++){
     this.tiposVehiculo.push(selected[i].vehicleTypeId);
   }
   this.tiposVehiculo = this.eliminateDuplicates(this.tiposVehiculo);
   this.obtenerVehiculos(this.tiposVehiculo);
   this.obtenerUbicacionesCarguesDescargues();
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
     console.log('Activate Event', event);
  }
  onActivate2(event) {
     console.log('Activate Event', event);
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
  agregarVehiculo(index){

    if(this.selected.length>0){
      if(this.existeVehiculo(this.vehiculoPorPlaca[index].id)==false){
        this.vehiculos.push({id:this.vehiculoPorPlaca[index].id,urlImage:this.vehiculoPorPlaca[index].urlImage,driver:this.vehiculoPorPlaca[index].driver,vehicleTypeId:this.vehiculoPorPlaca[index].vehicleTypeId,vehicleType:this.vehiculoPorPlaca[index].vehicleType,plate:this.vehiculoPorPlaca[index].plate});
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
  onActivateVehicles(event) {
    //console.log('Activate Event', event);
  }
  onSelectVehicles({ selected }) {
    this.selectedVehicles.splice(0, this.selectedVehicles.length);
    this.selectedVehicles.push(...selected);
  }
  reasignarManifiesto(id){
    try {
      clearInterval(this.globals.intVal);
    }catch(error) {}

    var selectedTravelRequests = [];
    var typeOfServiceId = this.solicitudExp.serviceTypeId;
    if(this.manifiestoExp.appointmentDate!=null&&this.manifiestoExp.appointmentTime!=null){
      if(this.routeId!=null){
        if(this.selected.length>0){
            if(typeOfServiceId!=null){
              let that = this;
              swal({
                title: '¿Esta seguro de reasignar el viaje con las solicitudes seleccionadas?',
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
                       var fechaCita = that.parserFormatter.format(that.manifiestoExp.appointmentDate);
                       var fechaHoraCita = fechaCita+" "+that.manifiestoExp.appointmentTime+":00";

                       var param = {
                           "id":that.travelId,
                           "date" : currentDate,
                           "serviceTypeId" : typeOfServiceId,
                           "vehicleId" : vehicleId,
                           "routeId":that.routeId,
                           "travelAppointmentDate":fechaHoraCita,
                           "manifestStatus": "P"
                       };
                       that.manifiestoService.crearActualizarManifiesto(JSON.stringify(param))
                         .then(response =>{
                          if (response.estado == 'EXITO') {
                            var j =that.manifiestosRechazados.length-1;
                            while(j>=0){
                              if(that.travelId == that.manifiestosRechazados[j].id){
                                that.manifiestosRechazados.splice(j,1);
                                break;
                              }
                              j--;
                            }
                            that.manifiestosRechazados = [...that.manifiestosRechazados];

                            that.manifiestoService.actualizarEstadosSolicitudes(that.selectedAux,'N')
                              .then(obj =>{
                                  if (obj.estado == 'EXITO') {
                                      that.manifiestoService.borrarDetalleManifiesto(that.travelId)
                                        .then(s =>{
                                          that.manifiestoService.crearDetalleManifiesto(that.travelId,selectedTravelRequests,'P')
                                            .then(s =>{
                                            });
                                            that.selected = [];
                                            that.rows = [];
                                            that.vehiculoPorPlaca =[];
                                            that.vehiculos = [];
                                            that.solicitudExp.serviceTypeId = null;
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

                                          	//this.routetrace={};
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
                                              title: 'Se ha reasignado el viaje exitosamente',
                                              text: '',
                                              type: 'success'
                                             }).catch(swal.noop);
                                      });
                                  }
                              });
                          }
                       });

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
              title: 'Para poder reasignar el viaje debe por lo menos seleccionar una solicitud.',
              text: '',
              type: 'warning'
             }).catch(swal.noop);
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
  invitarConductores(){
    var typeOfServiceId = this.solicitudExp.serviceTypeId;
    var selectedTravelRequests = [];
    if(this.selectedVehicles.length>0){
      if(this.origenViajeId!=null&&this.destinoViajeId!=null&&this.routeId!=null){
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

                that.manifiestoService.enviarInvitacion(currentDate, that.origenViajeId, that.destinoViajeId, that.selectedVehicles, that.comments1)
                 .then(response =>{
                     if(response.estado =='EXITO'){
                       swal({
                         title: 'Se han enviado las invitaciones.',
                         text: '',
                         type: 'success'
                        }).catch(swal.noop);
                        var param = {
                            "id": that.travelId,
                            "date" : currentDate,
                            "serviceTypeId" : typeOfServiceId,
                            "vehicleId" : 1,
                            "routeId":that.routeId,
                            "manifestStatus": "N",
                            "driverStatus": "P",
                            "ManifestComment": that.comments1
                        };
                        that.manifiestoService.crearActualizarManifiesto(JSON.stringify(param))
                          .then(response =>{
                           if (response.estado == 'EXITO') {

                             that.manifiestoService.guardarRespuestasConductores(that.travelId, that.selectedVehicles)
                              .then(response =>{
                                that.globals.intVal=setInterval(that.obtenerRespuestasConductores.bind(that), timeSeconds);
                              });
                            }
                        });
                        that.comments1 = "";
                      }
                });
              }
            }
          }
        });
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
}
