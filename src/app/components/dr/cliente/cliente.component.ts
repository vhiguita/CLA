import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgxDatatableModule} from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { NgbTabsetConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import {EmpresaService} from '../../../services/empresa.service';
import {TerceroService} from '../../../services/tercero.service';
import {ConductorService} from '../../../services/conductor.service';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import {Observable} from 'rxjs/Rx';
import swal from 'sweetalert2';
declare const google: any;
var marker: any;
var map: any;
var isLocCreated: boolean = false;
var lat:number;
var lng:number;

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit, AfterViewInit  {
  cliente: any= {};
  clienteExp: any= {};
  clienteAccount: any= {};
  ciudades: any = [];
  regimenes: any = [];
  ciudadesSurcursal: any = [];
  lugarDocumento: any = [];
  barrios: any = [];
  tiposCuenta: any = [];
  tipos: any = [];
  clientId: number = -1;
  surcursalesCliente: any = {};
  surcursalCliente: any = {};
  contactosCliente: any ={};
  contactoCliente: any ={};
  hideAddEditBranch: boolean = true;
  hideBranchesList: boolean = false;
  hideClientContactContent: boolean = true;
  hideClientBranchContent: boolean = true;
  //plazos: any = [{id:0,description:"0"},{id:8,description:"8"},{id:30,description:"30"},{id:45,description:"45"},{id:60,description:"60"}];

  constructor(
    public parserFormatter: NgbDateParserFormatter,
    private route: ActivatedRoute,
    private router: Router,
    private completerService: CompleterService,
    private empresaService: EmpresaService,
    private conductorService: ConductorService,
    private terceroService: TerceroService,
    private alertService: AlertService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.clientId=this.route.snapshot.params.idCliente;
    this.cliente.thirdTypeId=1;
    isLocCreated=false;
    marker=null;
    map = new google.maps.Map((<HTMLInputElement>document.getElementById('map')), {
           zoom: 7,
           center: new google.maps.LatLng(4.624335, -74.063644)
    });
    var places = new google.maps.places.Autocomplete((<HTMLInputElement>document.getElementById('location')));
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
      if(isLocCreated==false){
         this.crearUbicacion();
      }else{
        swal({
          title: 'Ya se ha una ubicación, debe borrar la actual actual para generar otra.',
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
    this.obtenerCiudades();
    this.obtenerTiposCuentas();
    this.obtenerTiposReferencia();
    this.obtenerRegimenes();
    if(this.clientId>-1){
       this.obtenerCliente();
       this.obtenerSurcursalesCliente();
       this.obtenerContactosCliente();
       this.hideClientContactContent = false;
       this.hideClientBranchContent = false;
    }else if(this.clientId==-1){
      this.cliente.status = true;
      this.hideClientContactContent = true;
      this.hideClientBranchContent = true;
    }
  }
  ngAfterViewInit() {
  }
  obtenerRegimenes():void{
    this.terceroService.obtenerRegimenes().then(response => {
       this.regimenes =response;
    });
  }
  obtenerTiposReferencia(): void {
    this.conductorService.obtenerTiposReferencia().then(response => {
      //console.log(response);
      this.tipos = response;
    });
  }
  atras(){
    this.hideAddEditBranch=true;
    this.hideBranchesList=false;
    try {
     map = new google.maps.Map((<HTMLInputElement>document.getElementById('map')), {
                 zoom: 7,
                 center: new google.maps.LatLng(4.624335, -74.063644)
     });
     marker.setMap(null);
    }catch(e){}
    marker=null;
    isLocCreated=false;
    lat=null;
    lng=null;
  }
  nuevaSurcursal(){
    this.hideAddEditBranch=false;
    this.hideBranchesList=true;
    this.surcursalCliente = {};
    this.surcursalCliente.thirdId = this.clientId;
    try {
    map = new google.maps.Map((<HTMLInputElement>document.getElementById('map')), {
             zoom: 7,
             center: new google.maps.LatLng(4.624335, -74.063644)
    });
     marker.setMap(null);
    }catch(e){}
    marker=null;
    isLocCreated=false;
    lat=null;
    lng=null;
  }
  crearUbicacion(){
      if (!lat || !lng) return;

      var coordinate = new google.maps.LatLng(lat, lng);
      if (marker)
      {

      }
      else
      {
        //create a marker
        /*var infoWindowContent = '<div class="info_content">' +
            '<p> Nombre: '+this.d.name+'</p>' +
            '<p> Descripción: '+this.d.description+'</p>' +
        '</div>';
        var infoWindow = new google.maps.InfoWindow({
           content: infoWindowContent
        });*/
        marker = new google.maps.Marker({
          position: coordinate,
          map: map,
          draggable: true
        });
        /*google.maps.event.addListener(marker, 'click', function() {
          infoWindow.open(map, marker);
        });*/
        google.maps.event.addListener(marker, 'dragend', function(marker){
          var latLng = marker.latLng;
          lat = latLng.lat();
          lng = latLng.lng();
       });
       map.setZoom(10);
       map.setCenter(marker.getPosition());
       isLocCreated=true;
     }

  }
  borrarUbicacion(){
    if(isLocCreated){
      let that = this;
      swal({
        title: '¿Esta seguro de borrar la ubicación creada?',
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
              isLocCreated=false;
              that.surcursalCliente.location="";
              lat=null;
              lng=null;
            }
         }
       }
     }).catch(swal.noop);
   }else{
     swal({
       title: 'Aún no se ha creado una ubicación.',
       text: '',
       type: 'warning',
       showCancelButton: false,
       confirmButtonColor: '#3085d6',
       cancelButtonColor: '#ff5370',
       confirmButtonText: 'Ok',
     }).then(function (s) {

     });
   }
  }
  crearActualizarSurcursal():void {
   if(isLocCreated){
    this.surcursalCliente.latitude = String(lat);
    this.surcursalCliente.longitude = String(lng);
    this.terceroService.crearActualizarSurcursal(this.surcursalCliente)
      .then(response =>{
        if (response) {
          console.log('response : ', response)
          if (response.estado == 'EXITO') {
            this.hideAddEditBranch=true;
            this.hideBranchesList=false;
            marker.setMap(null);
            marker=null;
            isLocCreated=false;
            lat=null;
            lng=null;
            this.obtenerSurcursalesCliente();
            swal({
              title: response.mensaje,
              text: '',
              type: 'success'
             }).catch(swal.noop);
          } else {
            this.alertService.error(response.mensaje);
          }

        }
      });
    }else{
      swal({
        title: 'Debe crear una ubicación para poder guardar la surcursal.',
        text: '',
        type: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#ff5370',
        confirmButtonText: 'Ok',
      }).then(function (s) {

      });
    }
  }
  editarSurcursal(i){
    map = new google.maps.Map((<HTMLInputElement>document.getElementById('map')), {
               zoom: 7,
               center: new google.maps.LatLng(4.624335, -74.063644)
    });
    this.hideAddEditBranch=false;
    this.hideBranchesList=true;
    var id=this.surcursalesCliente[i].id;
    this.terceroService.obtenerSurcursal(id).then(response => {
      this.surcursalCliente = {};
      this.surcursalCliente.thirdId = this.clientId;
      this.surcursalCliente.id=response[0].id;
      this.surcursalCliente.phone=response[0].phone;
      this.surcursalCliente.address=response[0].address;
      this.surcursalCliente.cityId=response[0].cityId;
      this.surcursalCliente.latitude=response[0].latitude;
      this.surcursalCliente.longitude=response[0].longitude;
      this.obtenerDep(this.surcursalCliente.cityId);
      lat=parseFloat(this.surcursalCliente.latitude);
      lng=parseFloat(this.surcursalCliente.longitude);
      var coordinate = new google.maps.LatLng(lat, lng);
      marker = new google.maps.Marker({
        position: coordinate,
        map: map,
        draggable: true
      });
      google.maps.event.addListener(marker, 'dragend', function(marker){
        var latLng = marker.latLng;
        lat = latLng.lat();
        lng = latLng.lng();
     });
     map.setZoom(10);
     map.setCenter(marker.getPosition());

     isLocCreated=true;
    });
  }
  obtenerCliente(): void {
    this.terceroService.obtenerTercero(this.clientId)
      .then(response =>{
        if (response) {
          this.cliente.id = response[0].id;
          this.clienteAccount.thirdId = response[0].id;
          this.obtenerCuentaBancaria(this.clienteAccount.thirdId);
          this.cliente.identification = response[0].identification;
          this.cliente.regimeId = response[0].regimeId;
          this.cliente.name = response[0].name;
          this.cliente.contact = response[0].contact;
          this.cliente.identificationPlaceId = response[0].identificationPlaceId;
          this.obtenerDepartamento(this.cliente.identificationPlaceId);
          this.cliente.cityId = response[0].cityId;
          this.cliente.address = response[0].address;
          this.cliente.email = response[0].email;
          this.cliente.website = response[0].website;
          this.cliente.phone1 = response[0].phone1;
          this.cliente.phone2 = response[0].phone2;
          this.cliente.phone3 = response[0].phone3;
          this.cliente.quota = response[0].quota;
          this.cliente.deadLine = response[0].deadLine;
          this.cliente.discount = response[0].discount;
          this.cliente.userPUC = response[0].userPUC;
          this.cliente.advisor = response[0].advisor;
          this.cliente.applyRetention = response[0].applyRetention;
          this.cliente.retentionCREE = response[0].retentionCREE;
          this.obtenerBarrio(this.cliente.cityId);
          this.cliente.districtId = response[0].districtId;
          this.cliente.status = response[0].status;
          this.cliente.bascCertificate = response[0].bascCertificate;
        }
    });
  }
  obtenerSurcursalesCliente(): void {
    this.terceroService.obtenerSurcursalesTercero(this.clientId)
      .then(response =>{
        if (response) {
          this.surcursalesCliente=response;
        }
    });
  }
  obtenerDepartamento(idCiudad): void {
    this.empresaService.obtenerDepatamentoPorCiudad(idCiudad)
      .then(response =>{
        if (response) {
           this.clienteExp.deparment1=response[0].departmentName;
        }
    });
  }
  obtenerDep(idCiudad): void{
    this.empresaService.obtenerDepatamentoPorCiudad(idCiudad)
      .then(response =>{
        if (response) {
           this.surcursalCliente.deparment=response[0].departmentName;
           this.surcursalCliente.departmentId=response[0].departmentId;
        }
    });
  }
  obtenerCuentaBancaria(thirdId): void {
    this.terceroService.obtenerCuentaBancaria(thirdId)
      .then(response =>{
        if (response) {
           console.log(response);
           this.clienteAccount.id=response[0].id;
           this.clienteAccount.bank=response[0].bank;
           this.clienteAccount.accountNumber=response[0].accountNumber;
           this.clienteAccount.accountName=response[0].accountName;
           this.clienteAccount.accountTypeId=response[0].accountTypeId;
        }
    });
  }
  obtenerTiposCuentas(): void {
    this.conductorService.obtenerTiposCuentas().then(response => {
      //console.log(response);
      this.tiposCuenta = response;
    });
  }
  obtenerCiudades(): void {
    this.empresaService.obtenerCiudades().then(response => {
      this.ciudades = response;
      this.lugarDocumento = response;
      this.ciudadesSurcursal = response;
    });
  }
  obtenerBarriosCiudad(idCiudad): void {
    this.empresaService.obtenerBarriosPorCiudad(idCiudad)
      .then(response =>{
        if (response) {
           this.barrios=response;
           this.cliente.districtId = response[0].id;
           console.log(response[0].id);
        }
    });
    this.empresaService.obtenerDepatamentoPorCiudad(idCiudad)
      .then(response =>{
        if (response) {
           this.clienteExp.deparment2=response[0].departmentName;
        }
    });
  }
  obtenerBarrio(idCiudad): void {
    this.empresaService.obtenerBarriosPorCiudad(idCiudad)
      .then(response =>{
        if (response) {
           this.barrios=response;
        }
    });
    this.empresaService.obtenerDepatamentoPorCiudad(idCiudad)
      .then(response =>{
        if (response) {
           this.clienteExp.deparment2=response[0].departmentName;
        }
    });
  }
  openModal(content,i) {

    if(i>-1){
      var id=this.surcursalesCliente[i].id;
      this.terceroService.obtenerSurcursal(id).then(response => {
        this.surcursalCliente = {};
        this.surcursalCliente.thirdId = this.clientId;
        this.surcursalCliente.id=response[0].id;
        this.surcursalCliente.phone=response[0].phone;
        this.surcursalCliente.address=response[0].address;
        this.surcursalCliente.cityId=response[0].cityId;
      });
    }else{
      this.surcursalCliente = {};
      this.surcursalCliente.thirdId = this.clientId;
    }

    //google.maps.event.trigger(map, "resize");

     const modalRef = this.modalService.open(content, {backdrop: 'static', size: 'lg'});

     modalRef.result.then(value => {
       console.log('component.abrirDialogoCrearCuenta.modalRef.result.then', value);

     }).catch(reason => {
         console.log('component.abrirDialogoCrearCuenta.modalRef.result.catch', reason);
     });
  }
  openModal_(content,i) {
    if(i>-1){
      var id=this.contactosCliente[i].id;
      this.terceroService.obtenerContacto(id).then(response => {
        this.contactoCliente= {};
        this.contactoCliente.thirdId=this.clientId;
        this.contactoCliente.id=response[0].id;
        this.contactoCliente.occupation=response[0].occupation;
        this.contactoCliente.workplace=response[0].workplace;
        this.contactoCliente.workphone=response[0].workphone;
        this.contactoCliente.name=response[0].name;
        this.contactoCliente.phone=response[0].phone;
        this.contactoCliente.cellphone=response[0].cellphone;
        this.contactoCliente.optionalphone=response[0].optionalphone;
        this.contactoCliente.email=response[0].email;
        this.contactoCliente.address=response[0].address;
        this.contactoCliente.relationship=response[0].relationship;
        this.contactoCliente.idTypeReference=response[0].idTypeReference;
      });
    }else{
      this.contactoCliente= {};
      this.contactoCliente.thirdId=this.clientId;
    }
     const modalRef = this.modalService.open(content, {backdrop: 'static', size: 'lg'});

     modalRef.result.then(value => {
       console.log('component.abrirDialogoCrearCuenta.modalRef.result.then', value);

     }).catch(reason => {
         console.log('component.abrirDialogoCrearCuenta.modalRef.result.catch', reason);
     });
  }
  crearActualizarContacto(): void{
    if(this.clientId!=-1){
     this.terceroService.crearActualizarContacto(this.contactoCliente)
       .then(response =>{
         if (response) {
           console.log('response : ', response)
           if (response.estado == 'EXITO') {
             this.obtenerContactosCliente();
             swal({
               title: response.mensaje,
               text: '',
               type: 'success'
              }).catch(swal.noop);
           } else {
             this.alertService.error(response.mensaje);
           }

         }
       });
     }else{
       this.alertService.error("No se ha creado aún un conductor para asociar la referencia.");
     }
  }
  obtenerContactosCliente(): void{
    this.route.paramMap
      .switchMap((params: ParamMap) => this.terceroService.obtenerContactosTercero(params.get('idCliente')))
      .subscribe(response => {
        if(response){
          //console.log(response);
          this.contactosCliente=response;
        }
      });
  }
  borrarContacto(index){
    var id=this.contactosCliente[index].id;
    let that = this;
    swal({
      title: '¿Esta seguro de borrar el contacto seleccionado?',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#ff5370',
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
            //alert(id);
            that.terceroService.borrarContactoTercero(id).then(response => {
                if (response){
                  if (response.estado == 'EXITO') {
                    that.contactosCliente.splice(index, 1);
                    swal({
                      title: response.mensaje,
                      text: '',
                      type: 'success'
                     }).catch(swal.noop);
                  } else {
                    that.alertService.error(response.mensaje);
                  }
                }
            });
          }
       }
     }
   }).catch(swal.noop);
  }
  borrarSurcursal(index){
    var id=this.surcursalesCliente[index].id;
    let that = this;
    swal({
      title: '¿Esta seguro de borrar la surcursal seleccionada?',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#ff5370',
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
            //alert(id);
            that.terceroService.borrarSurcursal(id).then(response => {
                if (response){
                  if (response.estado == 'EXITO') {
                    that.surcursalesCliente.splice(index, 1);
                    swal({
                      title: response.mensaje,
                      text: '',
                      type: 'success'
                     }).catch(swal.noop);
                  } else {
                    that.alertService.error(response.mensaje);
                  }
                }
            });
          }
       }
     }
   }).catch(swal.noop);
  }
  crearActualizarCliente(): void {
    console.log(this.cliente);
    if(this.clientId>-1){
      this.terceroService.crearActualizarTercero(this.cliente)
        .then(response =>{
          console.log('cliente.component.crearActualizarCliente.response: ', response);
          if (response) {
            console.log('response : ', response)
            if (response.estado == 'EXITO') {
                this.terceroService.crearActualizarCuenta(this.clienteAccount)
                .then(resp =>{
                  console.log('conductor.component.crearActualizarCliente.response: ', resp);
                  if (resp) {
                    console.log('response : ', resp);
                     this.router.navigate(['/home/dr/clientes']);
                    if (resp.estado == 'EXITO') {
                      swal({
                        title: 'Se modifico el cliente exitosamente',
                        text: '',
                        type: 'success'
                       }).catch(swal.noop);
                    } else {
                      this.alertService.error(resp.mensaje);
                    }
                  }
                });
            } else {
              this.alertService.error(response.mensaje);
            }
          }
        });
    }else{
      this.terceroService.crearActualizarTercero(this.cliente)
        .then(response =>{
          console.log('cliente.component.crearActualizarCliente.response: ', response);
          if (response) {
            console.log('response : ', response)
            if (response.estado == 'EXITO') {
                this.clienteAccount.thirdId = response.thirdId;
                this.terceroService.crearActualizarCuenta(this.clienteAccount)
                .then(resp =>{
                  console.log('conductor.component.crearActualizarCliente.response: ', resp);
                  if (resp) {
                    console.log('response : ', resp);
                     this.router.navigate(['/home/dr/clientes']);
                    if (resp.estado == 'EXITO') {
                      swal({
                        title: resp.mensaje,
                        text: '',
                        type: 'success'
                       }).catch(swal.noop);
                    } else {
                      this.alertService.error(resp.mensaje);
                    }
                  }
                });
            } else {
              this.alertService.error(response.mensaje);
            }
          }
        });
    }
  }

}
