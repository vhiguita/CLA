import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgxDatatableModule} from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { NgbTabsetConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import {EmpresaService} from '../../../services/empresa.service';
import {TerceroService} from '../../../services/tercero.service';
import {VehiculoService} from '../../../services/vehiculo.service';
import {ManifiestoService} from '../../../services/manifiesto.service';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import {Observable} from 'rxjs/Rx';
import swal from 'sweetalert2';
import * as $ from 'jquery';    

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css']
})
export class SolicitudComponent implements OnInit {
  public isCollapsedCargue = true;
  public isCollapsedDescargue = true;
  bufferSize = 50;
  solicitud: any= {};
  cargue: any= {};
  cargueExp: any= {};
  descargueExp: any= {};
  descargue: any= {};
  solicitudExp: any= {};
  cargues: any []=[];
  descargues: any []=[];
  origenSolicitud: any []=[];
  origenSolicitudBuffer =[];
  loadingOrigen = false;
  destinoSolicitud: any []=[];
  destinoSolicitudBuffer =[];
  loadingDestino = false;
  propietarios: any []=[];
  propietariosBuffer = [];
  loading2 = false;
  propietariosCargue: any []=[];
  propietariosCargueBuffer = [];
  loading1 = false;
  clientes: any []=[];
  clientesBuffer = [];
  loading = false;
  remitentes: any []=[];
  destinatarios: any []=[];
  surcursalesPropietario: any []=[];
  surcursalesPropietarioCargue: any []=[];
  surcursalesRemitente: any []=[];
  surcursalesDestinatario: any []=[];
  productos: any []=[];
  tiposEmpaque: any []=[];
  tiposVehiculo: any []=[];
  tiposContenedor: any []=[];
  solicitudId: number = -1;
  origenSolicitudId: number = -1;
  destinoSolicitudId: number = -1;
  nSec: number = -1;
  itemList = [];
  selectedItems = [];
  settings = {};
  hideAddEditLoadUnload: boolean = true;
  hideAddEditCosignment: boolean = true;
  hideConsignmentList: boolean = false;
  hideConsignmentContent: boolean = true;
  hideManifestRelatedContent: boolean = true;
  hideSection: boolean = true;
  btnIsVisible: boolean = false;
  solicitudes: any []=[];
  //mainStepText: String = "";
  constructor(
    public parserFormatter: NgbDateParserFormatter,
    private route: ActivatedRoute,
    private router: Router,
    private completerService: CompleterService,
    private empresaService: EmpresaService,
    private terceroService: TerceroService,
    private vehiculoService: VehiculoService,
    private manifiestoService: ManifiestoService,
    private alertService: AlertService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
      this.solicitudId=this.route.snapshot.params.idSolicitud;
      this.solicitud.comment = "";
      this.nSec = -1;
      this.obtenerClientes();
      this.obtenerCiudades();

      this.obtenerTiposVehiculo();
      this.obtenerProductos();
      this.obtenerTiposEmpaque();
      this.obtenerTerceros();
      this.obtenerTiposContenedor();
      this.obtenerRequerimientos();
      this.settings = {

              text: "Seleccionar",
              classes: "multiselect-style",
              enableCheckAll: false,
              maxHeight: '150'
      };
      var date = new Date();
      var yearD = date.getFullYear();
      var monthD = date.getMonth() + 1;
      var dayD = date.getDate();
      this.solicitudExp.requestDate = {year: yearD, month: monthD, day: dayD};
      var min = date.getMinutes();
      var hour = date.getHours();
      var hourString = String(hour)
      var hourF = hourString
      if(hourString.length == 1){
        hourF = '0' + hourString
      }
      this.solicitud.requestTime = hourF+':'+min;
      console.log('this.solicitud.requestTime  : ', this.solicitud.requestTime)
      if(this.solicitudId>-1){
        this.hideSection = false;
        this.obtenerSolicitud();
        this.obtenerCargues();
        this.obtenerDescargues();
        this.obtenerRequerimientosSolicitud(this.solicitudId);
      }else if(this.solicitudId==-1){
        this.obtenerConsecutivo();
        this.btnIsVisible = true;
      }
  }
  obtenerRequerimientosSolicitud(requestId): void{
    this.manifiestoService.obtenerRequerimientosSolicitud(requestId)
      .then(response =>{
        if (response) {
            for(var i=0;i<response.length;i++){
              this.selectedItems.push({id:response[i].requirementId,itemName:response[i].requirementName});
            }
        }
    });
  }
  obtenerRequerimientos(): void{
    this.manifiestoService.obtenerListaRequerimientos().then(response => {
      for(var i=0;i<response.length;i++){
        this.itemList.push({id:response[i].id,itemName:response[i].Description});
      }
    });
  }
  obtenerTiposContenedor(): void{
    this.manifiestoService.obtenerTiposContenedor().then(response => {
     this.tiposContenedor=response;
    });
  }
  obtenerSolicitud(){
    this.manifiestoService.obtenerSolicitud(this.solicitudId).then(response => {
      this.obtenerTiposVehiculo();
      if(response){
        this.solicitud.id = response[0].id;
        this.nSec = this.solicitud.sequence;
        this.solicitud.clientId = response[0].clientId;
        this.solicitud.originCityId = response[0].originCityId;
        this.obtenerDepOrigen(this.solicitud.originCityId);
        this.solicitud.destinationCityId = response[0].destinationCityId;
        this.obtenerDepDestino(this.solicitud.destinationCityId);
        this.solicitud.productId = response[0].productId;
        this.solicitud.bodyWork = response[0].bodyWork;
        this.solicitud.bodyWorkId = response[0].bodyWorkId;
        this.solicitud.packageTypeId = response[0].packageTypeId;
        this.solicitud.guardIsRequired = response[0].guardIsRequired;
        this.solicitud.volume = response[0].volume;
        this.solicitud.weight = response[0].weight;
        this.solicitud.travelStatus = response[0].travelStatus;
        if(this.solicitud.travelStatus=='R' || this.solicitud.travelStatus=='N'){
          this.btnIsVisible = true;
        }
        var s = response[0].travelRequestDate.split(/-|:|T/g).slice(0,5);
        console.log('s s s s s   ', s)
        var fechaSolicitud = s[0]+'-'+s[1]+'-'+s[2];
        console.log('fecha de solicitud : ', fechaSolicitud)
        var date = new Date(fechaSolicitud);
        var mD = fechaSolicitud.split('-');
        this.solicitudExp.requestDate = {year: parseInt(mD[0]), month: parseInt(mD[1]), day: parseInt(mD[2])};
        this.solicitud.requestTime = s[3]+':'+s[4];
        //console.log(this.solicitud.travelStatus);
        //console.log("btn is visible:"+this.btnIsVisible);
        this.solicitud.comment = response[0].comment;
        this.solicitud.clientOrderNumber = response[0].clientOrderNumber;
        var merchandiseVal=String(response[0].merchandiseValue);
        merchandiseVal = merchandiseVal.substring(0, merchandiseVal.length - 3);
        this.solicitudExp.merchandiseValue  = merchandiseVal;
        this.formatMerchandiseValue();
        var rateVal=String(response[0].rateValue);
        rateVal = rateVal.substring(0, rateVal.length - 3);
        this.solicitudExp.rateValue  = rateVal;
        this.formatRateValue();
        var freightVal=String(response[0].freightValue);
        freightVal = freightVal.substring(0, freightVal.length - 3);
        this.solicitudExp.freightValue  = freightVal;
        this.formatFreightValue();
      }
    });
  }
  obtenerTerceros(){
    this.terceroService.obtenerTodosTerceros().then(response => {
      //console.log(response);
      response.map((i) => { i.description = i.fields.Identification+" - "+i.fields.Name; return i; });
      this.propietarios = response;
      this.propietariosBuffer = this.propietarios.slice(0, this.bufferSize);
      this.propietariosCargue = response;
      this.propietariosCargueBuffer = this.propietariosCargue.slice(0, this.bufferSize);
    });
  }
  obtenerConsecutivo(){
    this.manifiestoService.obtenerSolicitudes().then(response => {
      this.solicitudes = response;
      this.nSec = this.solicitudes.length + 1;
      console.log(this.nSec);
    });
  }
  back(){
    this.router.navigate(['/home/rtn/solicitudes']);
  }
  obtenerClientes(): void{
    this.terceroService.obtenerTerceroPorTipo(2).then(response => {
      this.clientes = response;
      console.log('clientes : ', this.clientes)
      this.clientesBuffer = this.clientes.slice(0, this.bufferSize);
    });
  }
  fetchMore() {
        const len = this.clientesBuffer.length;
        const more = this.clientes.slice(len, this.bufferSize + len);
        this.loading = true;
        // using timeout here to simulate backend API delay
        setTimeout(() => {
            this.loading = false;
            this.clientesBuffer = this.clientesBuffer.concat(more);
        }, 200)
  }
  fetchMore_1() {
        const len = this.propietariosCargueBuffer.length;
        const more = this.propietariosCargue.slice(len, this.bufferSize + len);
        this.loading1 = true;
        // using timeout here to simulate backend API delay
        setTimeout(() => {
            this.loading1 = false;
            this.propietariosCargueBuffer = this.propietariosCargueBuffer.concat(more);
        }, 200)
  }
  fetchMore_2() {
        const len = this.propietariosBuffer.length;
        const more = this.propietarios.slice(len, this.bufferSize + len);
        this.loading2 = true;
        // using timeout here to simulate backend API delay
        setTimeout(() => {
            this.loading2 = false;
            this.propietariosBuffer = this.propietariosBuffer.concat(more);
        }, 200)
  }
  fetchMoreOrigin() {
        const len = this.origenSolicitudBuffer.length;
        const more = this.origenSolicitud.slice(len, this.bufferSize + len);
        this.loadingOrigen = true;
        // using timeout here to simulate backend API delay
        setTimeout(() => {
            this.loadingOrigen = false;
            this.origenSolicitudBuffer = this.origenSolicitudBuffer.concat(more);
        }, 200)
  }
  fetchMoreDestination() {
        const len = this.destinoSolicitudBuffer.length;
        const more = this.destinoSolicitud.slice(len, this.bufferSize + len);
        this.loadingDestino = true;
        // using timeout here to simulate backend API delay
        setTimeout(() => {
            this.loadingDestino = false;
            this.destinoSolicitudBuffer = this.destinoSolicitudBuffer.concat(more);
        }, 200)
  }
  obtenerCiudades(): void {
    this.empresaService.obtenerCiudades().then(response => {
      console.log(response);
      response.map((i) => { i.cityName = i.fields.Description; return i; });
      this.origenSolicitud = response;
      this.origenSolicitudBuffer = this.origenSolicitud.slice(0, this.bufferSize);
      this.destinoSolicitud = response;
      this.destinoSolicitudBuffer = this.destinoSolicitud.slice(0, this.bufferSize);
    });
  }
  obtenerDepOrigen(idCiudad): void{
    this.solicitud.deparment1 ="";
    if(idCiudad!=null){
      this.empresaService.obtenerDepatamentoPorCiudad(idCiudad)
        .then(response =>{
          if (response) {
             this.solicitud.deparment1=response[0].departmentName;
          }
      });
    }
  }
  obtenerDepDestino(idCiudad): void{
    this.solicitud.deparment2 ="";
    if(idCiudad!=null){
      this.empresaService.obtenerDepatamentoPorCiudad(idCiudad)
        .then(response =>{
          if (response) {
             this.solicitud.deparment2=response[0].departmentName;
          }
      });
    }
  }
  obtenerProductos(): void{
    this.manifiestoService.obtenerProductos().then(response => {
     this.productos=response;
    });
  }
  obtenerTiposEmpaque():void{
    this.manifiestoService.obtenerTiposEmpaque().then(response => {
     this.tiposEmpaque=response;
    });
  }

/*
  obtenerTiposVehiculo(): void{
    this.vehiculoService.obtenerTiposCarroceria().then(response => {
      this.tiposVehiculo = response;
      console.log('response response response ; ', response)
    });
  }
*/


  obtenerTiposVehiculo(): void {
    this.vehiculoService.obtenerTiposCarroceria().then(response => {
      response.map((i) => {
        i.description = i.fields.Description;
        i.code = i.fields.Code
        return i; 
      });      
      this.tiposVehiculo = response;
    });
  }






  isValidDate(dateString) {
    if(dateString=="" || dateString==null){
        return true;
    }else{
      var regEx = /^\d{4}-\d{2}-\d{2}$/;
      if(!dateString.match(regEx)) return false;  // Invalid format
      var d = new Date(dateString);
      if(!d.getTime() && d.getTime() !== 0) return false; // Invalid date
      return d.toISOString().slice(0,10) === dateString;
    }
  }
  formatFreightValue(){
    var num = this.solicitudExp.freightValue.replace(/\,/g,'');
    if(!isNaN(num)){
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\,?)(\d{3})/g,'$1,');
        num = num.split('').reverse().join('').replace(/^[\,]/,'');
        this.solicitudExp.freightValue = num;
    }
  }
  formatMerchandiseValue(){
    var num = this.solicitudExp.merchandiseValue.replace(/\,/g,'');
    if(!isNaN(num)){
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\,?)(\d{3})/g,'$1,');
        num = num.split('').reverse().join('').replace(/^[\,]/,'');
        this.solicitudExp.merchandiseValue = num;
    }
  }
  formatRateValue(){
    var num = this.solicitudExp.rateValue.replace(/\,/g,'');
    if(!isNaN(num)){
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\,?)(\d{3})/g,'$1,');
        num = num.split('').reverse().join('').replace(/^[\,]/,'');
        this.solicitudExp.rateValue = num;
    }
  }
  openModalCargue(content,i) {
    console.log('content : ', content)
    if(i>-1){
      var id=this.cargues[i].id;
     this.manifiestoService.obtenerCargue(id).then(response => {
        if(response){
          this.cargue= {};
          this.cargueExp ={};
          this.cargue.travelRequestId=this.solicitudId;
          this.cargue.receiverIdentificationLoad = response[0].receiverIdentificationLoad;
          this.cargue.receiverNameLoad = response[0].receiverNameLoad;
          this.cargue.receiverPhoneLoad = response[0].receiverPhoneLoad;
          this.cargue.id=response[0].id;
          var s =response[0].loadFullDate.split(/-|:|T/g).slice(0,5);
          var fechaCargue=s[0]+'-'+s[1]+'-'+s[2];
          var date=new Date(fechaCargue);
          var mD=fechaCargue.split('-');
          this.cargueExp.loadDate = {year: parseInt(mD[0]), month: parseInt(mD[1]), day: parseInt(mD[2])};
          this.cargue.loadTime=s[3]+':'+s[4];
          s =response[0].loadFullDepartureDate.split(/-|:|T/g).slice(0,5);
          var fechaSalidaCargue=s[0]+'-'+s[1]+'-'+s[2];
          date=new Date(fechaSalidaCargue);
          mD=fechaSalidaCargue.split('-');
          this.cargueExp.loadDepartureDate = {year: parseInt(mD[0]), month: parseInt(mD[1]), day: parseInt(mD[2])};
          this.cargue.loadDepartureTime=s[3]+':'+s[4];
          this.cargue.loadOwnerId = response[0].loadOwnerId;
          this.obtenerDireccionesPropietarioCargue(this.cargue.loadOwnerId);
          this.cargue.loadBranchId = response[0].loadBranchId;
          this.obtenerInfoDirCargue(this.cargue.loadBranchId);
        }
     });
    }else{
      this.cargue = {};
      this.cargueExp ={};
      this.cargue.travelRequestId=this.solicitudId;
    }
     const modalRef = this.modalService.open(content, {backdrop: 'static', size: 'lg'});

     modalRef.result.then(value => {
       console.log('component.abrirDialogoCrearCuenta.modalRef.result.then', value);

     }).catch(reason => {
         console.log('component.abrirDialogoCrearCuenta.modalRef.result.catch', reason);
     });
  }
  openModalDescargue(content,i) {
    if(i>-1){
      var id=this.descargues[i].id;
      this.manifiestoService.obtenerDescargue(id).then(response => {
        if(response){
          this.descargue= {};
          this.descargueExp= {};
          this.descargue.travelRequestId=this.solicitudId;
          this.descargue.id=response[0].id;
          this.descargue.receiverIdentificationUnload = response[0].receiverIdentificationUnload;
          this.descargue.receiverNameUnload = response[0].receiverNameUnload;
          this.descargue.receiverPhoneUnload = response[0].receiverPhoneUnload;

          var s = response[0].unloadFullDate.split(/-|:|T/g).slice(0,5);
          var fechaDescargue=s[0]+'-'+s[1]+'-'+s[2];
          var date = new Date(fechaDescargue);
          var mD = fechaDescargue.split('-');
          this.descargueExp.unloadDate = {year: parseInt(mD[0]), month: parseInt(mD[1]), day: parseInt(mD[2])};
          this.descargue.unloadTime = s[3]+':'+s[4];

          s = response[0].unloadFullDepartureDate.split(/-|:|T/g).slice(0,5);
          var fechaSalidaDescargue = s[0]+'-'+s[1]+'-'+s[2];
          date=new Date(fechaSalidaDescargue);
          mD = fechaSalidaDescargue.split('-');
          this.descargueExp.unloadDepartureDate = {year: parseInt(mD[0]), month: parseInt(mD[1]), day: parseInt(mD[2])};
          this.descargue.unloadDepartureTime = s[3]+':'+s[4];

          s = response[0].devolutionFullDate.split(/-|:|T/g).slice(0,5);
          var fechaDevolucionDescargue=s[0]+'-'+s[1]+'-'+s[2];
          date = new Date(fechaDevolucionDescargue);
          mD = fechaDevolucionDescargue.split('-');
          this.descargueExp.unloadDevolutionDate = {year: parseInt(mD[0]), month: parseInt(mD[1]), day: parseInt(mD[2])};
          this.descargue.unloadDevolutionTime = s[3]+':'+s[4];
          this.descargue.containerTypeId = response[0].containerTypeId;
          this.descargue.containerNumber = response[0].containerNumber;
          this.descargue.ownerDevolutionId = response[0].ownerDevolutionId;
          this.obtenerDireccionesPropietario(this.descargue.ownerDevolutionId);
          this.descargue.devolutionBranchId = response[0].devolutionBranchId;
          this.obtenerInfoDirDescargue(this.descargue.devolutionBranchId);
        }
      });
    }else{
      this.descargue = {};
      this.descargueExp= {};
      this.descargue.travelRequestId=this.solicitudId;
    }
     const modalRef = this.modalService.open(content, {backdrop: 'static', size: 'lg'});

     modalRef.result.then(value => {
       console.log('component.abrirDialogoCrearCuenta.modalRef.result.then', value);

     }).catch(reason => {
         console.log('component.abrirDialogoCrearCuenta.modalRef.result.catch', reason);
     });
  }
  obtenerDireccionesPropietario(thirdId){
    if(thirdId!=null){
      this.surcursalesPropietario = [];
      this.descargue.unloadName = "";
      this.descargue.unloadPhone = "";
      this.descargue.unloadCity = "";
      this.terceroService.obtenerSurcursalesTercero(thirdId)
         .then(response =>{
           if (response) {
             this.surcursalesPropietario = response;
           }
      });
    }
  }
  obtenerDireccionesPropietarioCargue(thirdId){
    if(thirdId!=null){
      this.surcursalesPropietarioCargue = [];
      this.cargue.loadName = "";
      this.cargue.loadPhone = "";
      this.cargue.loadCity = "";
      this.terceroService.obtenerSurcursalesTercero(thirdId)
         .then(response =>{
           if (response) {
             this.surcursalesPropietarioCargue = response;
           }
      });
    }
  }
  crearActualizarCargue(){
    var fechaCargue=this.parserFormatter.format(this.cargueExp.loadDate);
    var fechaSalidaCargue=this.parserFormatter.format(this.cargueExp.loadDepartureDate);
    this.cargue.loadFullDate= fechaCargue+" "+this.cargue.loadTime+":00";
    this.cargue.loadFullDepartureDate= fechaSalidaCargue+" "+this.cargue.loadDepartureTime+":00";
    this.manifiestoService.crearActualizarCargue(this.cargue).then(response =>{
      if (response) {
        if (response.estado == 'EXITO') {
          this.obtenerCargues();
          swal({
            title: response.mensaje,
            text: '',
            type: 'success'
           }).catch(swal.noop);
        }
      }
    });
  }
  obtenerCargues(){
    this.manifiestoService.obtenerCargues(this.solicitudId)
      .then(response =>{
        if (response) {
            this.cargues = response;
        }
    });
  }
  crearActualizarDescargue(){
    var fechaDescargue = this.parserFormatter.format(this.descargueExp.unloadDate);
    var fechaSalidaDescargue = this.parserFormatter.format(this.descargueExp.unloadDepartureDate);
    var fechaDevolucion = this.parserFormatter.format(this.descargueExp.unloadDevolutionDate);
    this.descargue.unloadFullDate= fechaDescargue+" "+this.descargue.unloadTime+":00";
    this.descargue.unloadFullDepartureDate= fechaSalidaDescargue+" "+this.descargue.unloadDepartureTime+":00";
    this.descargue.devolutionFullDate= fechaDevolucion+" "+this.descargue.unloadDevolutionTime+":00";
    //console.log(this.descargue);
    this.manifiestoService.crearActualizarDescargue(this.descargue).then(response =>{
      if (response) {
        if (response.estado == 'EXITO') {
          this.obtenerDescargues();
          swal({
            title: response.mensaje,
            text: '',
            type: 'success'
           }).catch(swal.noop);
        }
      }
    });
  }
  obtenerDescargues(){
    this.manifiestoService.obtenerDescargues(this.solicitudId)
      .then(response =>{
        if (response) {
            this.descargues = response;
        }
    });
  }
  obtenerInfoDirCargue(branchId){
    if(branchId!=null){
        this.terceroService.obtenerSurcursal(branchId).then(response => {
          if (response) {
              this.cargue.loadName = response[0].address;
              this.cargue.loadPhone = response[0].phone;
              this.cargue.loadCity = response[0].city+" - "+response[0].department;
          }
        });
     }
  }
  obtenerInfoDirDescargue(branchId){
    if(branchId!=null){
        this.terceroService.obtenerSurcursal(branchId).then(response => {
          if (response) {
              this.descargue.unloadName = response[0].address;
              this.descargue.unloadPhone = response[0].phone;
              this.descargue.unloadCity = response[0].city+" - "+response[0].department;
          }
        });
     }
  }
  doTextareaValueChange(ev) {
    try {
      if (ev.target.value.trim().length != 0){
          this.solicitud.comment = ev.target.value.trim();
      }

    } catch(e) {
      console.info('could not set textarea-value');
    }
  }
  crearActualizarSolicitud(){
    var fechaSolicitud = this.parserFormatter.format(this.solicitudExp.requestDate);

    this.solicitud.travelRequestDate = fechaSolicitud+" "+this.solicitud.requestTime+":00";

    console.log('this.solicitud : ', this.solicitud);

    if(this.solicitudId>-1){
      var merchandiseValue = String(this.solicitudExp.merchandiseValue);
      merchandiseValue = this.replaceAll(merchandiseValue, ',', '');
      this.solicitud.merchandiseValue = parseFloat(merchandiseValue);

      var rateValue = String(this.solicitudExp.rateValue);
      rateValue = this.replaceAll(rateValue, ',', '');
      this.solicitud.rateValue = parseFloat(rateValue);

      var freightValue = String(this.solicitudExp.freightValue);
      freightValue = this.replaceAll(freightValue, ',', '');
      this.solicitud.freightValue = parseFloat(freightValue);

      this.solicitud.sequence = this.nSec;
      this.solicitud.travelStatus = 'N';
      //console.log(this.solicitud);
      this.manifiestoService.crearActualizarSolicitud(this.solicitud)
        .then(response =>{
          if (response) {
            console.log('response : ', response)
            if (response.estado == 'EXITO') {
              this.manifiestoService.borrarRequerimientosSolicitud(this.solicitudId).then(resp => {
                  if (resp){
                    for(var i=0;i<this.selectedItems.length;i++){
                      var requerimentId=this.selectedItems[i].id;
                      this.manifiestoService.crearRequerimientoSolicitud(this.solicitudId,requerimentId)
                        .then(s =>{
                        });
                    }
                  }
              });
              swal({
                title: response.mensaje,
                text: '',
                type: 'success'
               }).catch(swal.noop);
            }
          }
        });
    }else{
      var merchandiseValue = String(this.solicitudExp.merchandiseValue);
      merchandiseValue = this.replaceAll(merchandiseValue, ',', '');
      this.solicitud.merchandiseValue = parseFloat(merchandiseValue);

      var rateValue = String(this.solicitudExp.rateValue);
      rateValue = this.replaceAll(rateValue, ',', '');
      this.solicitud.rateValue = parseFloat(rateValue);

      var freightValue = String(this.solicitudExp.freightValue);
      freightValue = this.replaceAll(freightValue, ',', '');
      this.solicitud.freightValue = parseFloat(freightValue);

      this.solicitud.sequence = this.nSec;
      this.solicitud.travelStatus = 'N';
      //console.log(this.solicitud);
      this.manifiestoService.crearActualizarSolicitud(this.solicitud)
        .then(response =>{
          if (response) {
            console.log('response : ', response)
            $("#home1").removeClass("active show");
            $("#titleHome1").removeClass("active show");
            // $("#home1").removeClass("show");
            $("#consignment").addClass("active show");
            $("#titleConsignment").addClass("active show");
            //this.router.navigate(['/#consignment']);

            if (response.estado == 'EXITO') {
                this.solicitudId = response.requestId;
                this.solicitud.id = this.solicitudId;
                this.hideSection = false;
                // this.openModalCargue(modalContentCargue,-1)
                this.manifiestoService.borrarRequerimientosSolicitud(this.solicitudId).then(resp => {
                    if (resp){
                      for(var i=0;i<this.selectedItems.length;i++){
                        var requerimentId = this.selectedItems[i].id;
                        this.manifiestoService.crearRequerimientoSolicitud(this.solicitudId,requerimentId)
                          .then(s =>{
                          });
                      }
                    }
                });

              swal({
                title: response.mensaje + ', debes cargar la información del cargue y el descargue', 
                text: '',
                type: 'success'
               }).catch(swal.noop);

            }
          }
        });
    }
  }
  escapeRegExp(string){
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  /* Define functin to find and replace specified term with replacement string */
  replaceAll(str, term, replacement) {
     return str.replace(new RegExp(this.escapeRegExp(term), 'g'), replacement);
  }
  borrarCargue(index){
    var id=this.cargues[index].id;
    let that = this;
    swal({
      title: '¿Esta seguro de borrar el cargue seleccionado?',
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
            that.manifiestoService.borrarCargue(id).then(response => {
                if (response){
                  if (response.estado == 'EXITO') {
                    that.cargues.splice(index, 1);
                    that.obtenerCargues();
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
  borrarDescargue(index){
    var id=this.descargues[index].id;
    let that = this;
    swal({
      title: '¿Esta seguro de borrar el descargue seleccionado?',
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
            that.manifiestoService.borrarDescargue(id).then(response => {
                if (response){
                  if (response.estado == 'EXITO') {
                    that.descargues.splice(index, 1);
                    //that.obtenerCargues();
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
}
