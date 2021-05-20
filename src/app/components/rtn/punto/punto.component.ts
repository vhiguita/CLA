import { Component, OnInit } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AlertService} from '../../../services/alert.service';
import {PuntoService} from '../../../services/punto.service';
import swal from 'sweetalert2';
declare const google: any;
var marker: any;
var map: any;
var isPtCreated: boolean = false;
var lat:number;
var lng:number;
var idPt:any;

@Component({
  selector: 'app-punto',
  templateUrl: './punto.component.html',
  styleUrls: ['./punto.component.css']
})
export class PuntoComponent implements OnInit {
  punto: any []=[];
  data: any = {};
  d: any={};
  isSubmitted: any = false;

  constructor(
    private puntoService: PuntoService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private router: Router,
    private activeRoute:ActivatedRoute
  ) { }

  ngOnInit() {
    idPt=this.activeRoute.snapshot.params.idPunto;
    isPtCreated=false;
    marker=null;
    this.d.name="";
    this.d.description="";
    this.d.address="";
    this.d.pts=1;
    lat=null;
    lng=null;
    if(idPt=="-1"){
      var puntos=[];
      map = new google.maps.Map((<HTMLInputElement>document.getElementById('map')), {
             zoom: 7,
             center: new google.maps.LatLng(4.624335, -74.063644)
      });
      var places = new google.maps.places.Autocomplete((<HTMLInputElement>document.getElementById('address')));
      google.maps.event.addListener(places, 'place_changed', () =>{
        var place = places.getPlace();

        var src_addr = place.formatted_address;
        var src_lat = place.geometry.location.lat();
        var src_long = place.geometry.location.lng();
        lat=src_lat;
        lng=src_long;
        var mesg1 = "Address 1: " + src_addr;
        mesg1 += "\nLatitude: " + src_lat;
        mesg1 += "\nLongitude: " + src_long;
        if(isPtCreated==false){
           this.createPt();
        }else{
          swal({
            title: 'Ya se ha creado un punto interés, debe borrar el punto actual para generar otro.',
            text: '',
            type: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#ff5370',
            confirmButtonText: 'Ok',
          }).then(function (s) {

          });
          //this.alertService.error("Ya se ha creado un punto.");
        }
      });
      this.obtenerTiposPunto();
      this.obtenerPuntos();
      //this.loadPtsByCompany();
   }else if(idPt!="-1"){
     var puntos=[];
     map = new google.maps.Map((<HTMLInputElement>document.getElementById('map')), {
            zoom: 7,
            center: new google.maps.LatLng(4.624335, -74.063644)
     });
     var places = new google.maps.places.Autocomplete((<HTMLInputElement>document.getElementById('address')));
     google.maps.event.addListener(places, 'place_changed', () => {
       var place = places.getPlace();

       var src_addr = place.formatted_address;
       var src_lat = place.geometry.location.lat();
       var src_long = place.geometry.location.lng();
       lat=src_lat;
       lng=src_long;
       var mesg1 = "Address 1: " + src_addr;
       mesg1 += "\nLatitude: " + src_lat;
       mesg1 += "\nLongitude: " + src_long;
       if(isPtCreated==false){
          this.createPt();
       }else{
         swal({
           title: 'Ya se ha creado un punto interés, debe borrar el punto actual para generar otro.',
           text: '',
           type: 'warning',
           showCancelButton: false,
           confirmButtonColor: '#3085d6',
           cancelButtonColor: '#ff5370',
           confirmButtonText: 'Ok',
         }).then(function (s) {

         });
       }
     });
     this.obtenerTiposPunto();
     var name;
     var description;
     var type;
     this.puntoService.obtenerPunto(idPt).then(response => {
       name=response[0].name;
       description=response[0].description;
       type=response[0].idType;
       lat=parseFloat(response[0].latitude);
       lng=parseFloat(response[0].longitude);
       //console.log(response);
       //console.log(name+" "+description+" "+type);

        this.d.name=name;
        this.d.description=description;
        this.d.pts=type;
        var coordinate = new google.maps.LatLng(lat, lng);
        marker = new google.maps.Marker({
          position: coordinate,
          map: map,
          draggable: true
        });
        var infoWindowContent = '<div class="info_content">' +
            '<div style="text-align:center;font-weight:bold;">'+response[0].nameType+'</div>' +
            '<p> Nombre: '+this.d.name+'</p>' +
            '<p> Descripción: '+this.d.description+'</p>' +
        '</div>';
        var infoWindow = new google.maps.InfoWindow({
           content: infoWindowContent
        });
        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.open(map, marker);
        });
        google.maps.event.addListener(marker, 'dragend', function(marker){
          var latLng = marker.latLng;
          lat = latLng.lat();
          lng = latLng.lng();
          //alert(lat+" "+lng);
       });
       map.setZoom(10);
       map.setCenter(marker.getPosition());

       isPtCreated=true;
     });
   }
  }
  obtenerTiposPunto(){
    this.puntoService.obtenerTiposPunto().then(response => {
      //console.log(response);
      this.punto = response;
    });
  }
  obtenerPuntos(){
    this.puntoService.obtenerPuntos().then(response => {
      for(var i=0;i<response.length;i++){
        var uid=response[i].id;
        var idType=response[i].idType;
        var latitude=parseFloat(response[i].latitude);
        var longitude=parseFloat(response[i].longitude);
        var pinImage ="";
        if(idType==1){
           pinImage =new google.maps.MarkerImage("http://www.googlemapsmarkers.com/v1/7d2181/");
        }else if(idType==2){
           pinImage =new google.maps.MarkerImage("http://www.googlemapsmarkers.com/v1/ff0000/");
        }else if(idType==3){
           pinImage =new google.maps.MarkerImage("http://www.googlemapsmarkers.com/v1/bfff00/");
        }else if(idType==4){
           pinImage =new google.maps.MarkerImage("http://www.googlemapsmarkers.com/v1/add8e6/");
        }
        var pt = new google.maps.Marker({
                          position: new google.maps.LatLng(latitude, longitude),
                          map: map,
                          icon:pinImage,
                          title: name,
                          uid: uid
        });
        var html = '<div class="info_content">' +
            '<div style="text-align:center;font-weight:bold;">'+response[i].nameType+'</div>' +
            '<p> Nombre: '+response[i].name+'</p>' +
            '<p> Descripción: '+response[i].description+'</p>' +
        '</div>';
        pt.info = new google.maps.InfoWindow({
              content: html
        });
        google.maps.event.addListener(pt, 'click', function() {
          this.info.open(map, this);
        });
      }
    });
  }
  createPt(){

    //if(isPtCreated==false){
      if (!lat || !lng) return;

      var coordinate = new google.maps.LatLng(lat, lng);
      if (marker)
      {
        //if marker already was created change positon
        /*if(isOriginCreated==false){
           marker.setPosition(coordinate);
        }*/

      }
      else
      {
        //create a marker
        var infoWindowContent = '<div class="info_content">' +
            '<p> Nombre: '+this.d.name+'</p>' +
            '<p> Descripción: '+this.d.description+'</p>' +
        '</div>';
        /*var infoWindowContent = '<div class="info_content">' +
            '<p> Dirección: '+(<HTMLInputElement>document.getElementById('address')).value+'</p>' +
        '</div>';*/
        var infoWindow = new google.maps.InfoWindow({
           content: infoWindowContent
        });
        marker = new google.maps.Marker({
          position: coordinate,
          map: map,
          draggable: true
        });
        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.open(map, marker);
        });
        google.maps.event.addListener(marker, 'dragend', function(marker){
          var latLng = marker.latLng;
          lat = latLng.lat();
          lng = latLng.lng();
          //alert(lat+" "+lng);
       });
       map.setZoom(10);
       map.setCenter(marker.getPosition());
       isPtCreated=true;
     }
    /*}else{
      this.alertService.error("Ya se ha creado un punto.");
    }*/
  }
  erasePt(){
    if(isPtCreated){
      let that = this;
      swal({
        title: '¿Esta seguro de borrar el punto creado?',
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
              marker.setMap(null);
              marker=null;
              isPtCreated=false;
              that.d.name="";
              that.d.description="";
              that.d.address="";
              that.d.pts=1;
              lat=null;
              lng=null;
            }
         }
       }
     }).catch(swal.noop);
   }else{
     this.alertService.error("Aún no se ha creado un punto de interés.");
   }
  }
  savePt(){
    if(idPt=="-1"){
       if(isPtCreated){
         if(this.d.name!=""){
           let that = this;
           swal({
             title: '¿Esta seguro de guardar el punto creado?',
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
                   var name=that.d.name;
                   var description=that.d.description;
                   var address=that.d.address;
                   var selValPt=that.d.pts;
                   //console.log(name+" "+description+" "+" "+address+" "+lat+" "+lng+" "+selValPt);
                   var param = {
                             "name" : String(name),
                             "description" : String(description),
                             "latitude" : String(lat),
                             "longitude": String(lng),
                             "idType" : parseInt(selValPt)
                   };
                   console.log(param);
                   that.puntoService.crearActualizarPunto(JSON.stringify(param))
                     .then(response =>{
                       console.log('punto.component.crearActualizarPunto.response: ', response);
                       if (response) {
                         console.log('response : ', response);
                         marker.setMap(null);
                         marker=null;
                         isPtCreated=false;
                         lat=null;
                         lng=null;
                         that.d.name="";
                         that.d.description="";
                         that.d.address="";
                         that.d.pts=1;
                         that.router.navigate(['/home/rtn/puntos']);
                         if (response.estado == 'EXITO') {

                           that.alertService.success(response.mensaje);
                         } else {
                           that.alertService.error(response.mensaje);
                         }

                       }
                     });
                 }
              }
            }
          }).catch(swal.noop);
        }else{
           this.alertService.error("El nombre es requerido.");
        }
       }else{
           this.alertService.error("Debe de crear un punto de interés para poder guardar.");
       }
     }else if(idPt!="-1"){
       if(isPtCreated){
         if(this.d.name!=""){
           let that = this;
           swal({
             title: '¿Esta seguro de guardar el punto creado?',
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
                   var name=that.d.name;
                   var description=that.d.description;
                   var address=that.d.address;
                   var selValPt=that.d.pts;
                   //console.log(name+" "+description+" "+" "+address+" "+lat+" "+lng+" "+selValPt);

                   var params = {
                             "id" : parseInt(idPt),
                             "name" : String(name),
                             "description" : String(description),
                             "latitude" : String(lat),
                             "longitude": String(lng),
                             "idType" : parseInt(selValPt)
                   };
                   console.log(params);
                   that.puntoService.crearActualizarPunto(JSON.stringify(params))
                     .then(response =>{
                       console.log('punto.component.crearActualizarPunto.response: ', response);
                       if (response) {

                         that.router.navigate(['/home/rtn/puntos']);
                         if (response.estado == 'EXITO') {
                           that.alertService.success(response.mensaje);
                         } else {
                           that.alertService.error(response.mensaje);
                         }

                       }
                     });
                 }
              }
            }
          }).catch(swal.noop);
         }else{
            this.alertService.error("El nombre es requerido.");
         }
       }else{
           this.alertService.error("Debe de crear un punto de interés para poder guardar.");
       }
     }
  }
}
