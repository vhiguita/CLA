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
import {ConductorService} from '../../../services/conductor.service';
import {VehiculoService} from '../../../services/vehiculo.service';
import {ManifiestoService} from '../../../services/manifiesto.service';
import {RutaService} from '../../../services/ruta.service';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import {NotificationsService} from 'angular2-notifications';

import {ToastData, ToastOptions, ToastyService} from 'ng2-toasty';
import {Observable} from 'rxjs/Rx';
import swal from 'sweetalert2';

@Component({
  selector: 'app-manifiesto',
  templateUrl: './manifiesto.component.html',
  styleUrls: ['./manifiesto.component.css']
})
export class ManifiestoComponent implements OnInit {
  public isCollapsedCargue = true;
  public isCollapsedDescargue = true;
  manifiesto: any= {};
  cargue: any= {};
  cargueExp: any= {};
  descargueExp: any= {};
  descargue: any= {};
  manifiestoExp: any= {};
  conexo: any= {};
  conexoAux: any = {};
  remesa: any= {};
  remesaAux: any= {};
  remesas: any []=[];
  cargues: any []=[];
  descargues: any []=[];
  origenManifiesto: any []=[];
  origenRemesa: any []=[];
  destinoManifiesto: any []=[];
  destinoRemesa: any []=[];
  rutas: any[]=[];
  conexos: any []=[];
  vehiculos: any []=[];
  propietarios: any []=[];
  remitentes: any []=[];
  destinatarios: any []=[];
  riesgos: any []=[];
  surcursalesPropietario: any []=[];
  surcursalesRemitente: any []=[];
  surcursalesDestinatario: any []=[];
  productos: any []=[];
  tiposEmpaque: any []=[];
  tiposServicio: any []=[];
  tiposVehiculo: any []=[];
  tiposContenedor: any []=[];
  manifiestoId: number = -1;
  origenManifiestoId: number = -1;
  destinoManifiestoId: number = -1;
  itemList = [];
  selectedItems = [];
  settings = {};
  vehicleTypeID: number = -1;
  remesaId: number = -1;
  hideAddEditLoadUnload: boolean = true;
  hideAddEditCosignment: boolean = true;
  hideConsignmentList: boolean = false;
  hideConsignmentContent: boolean = true;
  hideManifestRelatedContent: boolean = true;

  constructor(
    public parserFormatter: NgbDateParserFormatter,
    private route: ActivatedRoute,
    private router: Router,
    private completerService: CompleterService,
    private empresaService: EmpresaService,
    private conductorService: ConductorService,
    private terceroService: TerceroService,
    private vehiculoService: VehiculoService,
    private manifiestoService: ManifiestoService,
    private rutaService: RutaService,
    private alertService: AlertService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.manifiestoId=this.route.snapshot.params.idManifiesto;
    this.obtenerVehiculos();
    this.obtenerCiudades();
    this.obtenerTipoServicios();
    this.obtenerTiposVehiculo();
    this.obtenerRiesgos();
    this.obtenerRequerimientos();
    this.settings = {

            text: "Seleccionar",
            classes: "multiselect-style",
            enableCheckAll: false,
            maxHeight: '150'
    };
    if(this.manifiestoId>-1){
       this.hideConsignmentContent=false;
       this.hideManifestRelatedContent=false;
       this.cargarManifiesto(this.manifiestoId);
       this.obtenerRequerimientosManifiesto(this.manifiestoId);
       this.obtenerConexos(this.manifiestoId);
       this.obtenerRemitentesDestinatarios();
       this.obtenerProductos();
       this.obtenerTiposEmpaque();
       this.obtenerRemesas(this.manifiestoId);
       this.obtenerTiposContenedor();
    }
  }
  obtenerTiposContenedor(): void{
    this.manifiestoService.obtenerTiposContenedor().then(response => {
     this.tiposContenedor=response;
    });
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
  obtenerTiposVehiculo(): void{
    this.vehiculoService.obtenerTiposCarroceria().then(response => {
      this.tiposVehiculo = response;
    });
  }
  obtenerRequerimientos(): void{
    this.manifiestoService.obtenerListaRequerimientos().then(response => {
      for(var i=0;i<response.length;i++){
        this.itemList.push({id:response[i].id,itemName:response[i].Description});
      }
    });
  }
  obtenerConexos(manifestId): void{
    this.manifiestoService.obtenerConexos(manifestId)
      .then(response =>{
        if (response) {
            this.conexos = response;
        }
    });
  }
  formatSaleValue(){
    var num = this.conexoAux.saleValue.replace(/\,/g,'');
    if(!isNaN(num)){
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\,?)(\d{3})/g,'$1,');
        num = num.split('').reverse().join('').replace(/^[\,]/,'');
        this.conexoAux.saleValue = num;
    }else{
        //this.empresa.InsuranceValue = this.empresa.InsuranceValue.replace(/[^\d\.]*/g,'');
    }
  }
  formatContractValue(){
    var num = this.conexoAux.contractValue.replace(/\,/g,'');
    if(!isNaN(num)){
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\,?)(\d{3})/g,'$1,');
        num = num.split('').reverse().join('').replace(/^[\,]/,'');
        this.conexoAux.contractValue = num;
    }else{
        //this.empresa.InsuranceValue = this.empresa.InsuranceValue.replace(/[^\d\.]*/g,'');
    }
  }
  formatInsuranceValue(){
    var num = this.remesaAux.insuranceValue.replace(/\,/g,'');
    if(!isNaN(num)){
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\,?)(\d{3})/g,'$1,');
        num = num.split('').reverse().join('').replace(/^[\,]/,'');
        this.remesaAux.insuranceValue = num;
    }else{
        //this.empresa.InsuranceValue = this.empresa.InsuranceValue.replace(/[^\d\.]*/g,'');
    }
  }
  formatFreightValue(){
    var num = this.remesaAux.freightValue.replace(/\,/g,'');
    if(!isNaN(num)){
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\,?)(\d{3})/g,'$1,');
        num = num.split('').reverse().join('').replace(/^[\,]/,'');
        this.remesaAux.freightValue = num;
    }else{
        //this.empresa.InsuranceValue = this.empresa.InsuranceValue.replace(/[^\d\.]*/g,'');
    }
  }
  borrarConexo(index){
    var id=this.conexos[index].id;
    let that = this;
    swal({
      title: '¿Esta seguro de borrar el conexo seleccionado?',
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
            that.manifiestoService.borrarConexo(id).then(response => {
                if (response){
                  if (response.estado == 'EXITO') {
                    that.conexos.splice(index, 1);
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
  obtenerRequerimientosManifiesto(manifestId): void{
    this.manifiestoService.obtenerRequerimientosManifiesto(manifestId)
      .then(response =>{
        if (response) {
            for(var i=0;i<response.length;i++){
              this.selectedItems.push({id:response[i].requirementId,itemName:response[i].requirementName});
            }
        }
    });
  }
  onItemSelect(item:any){
       console.log(this.selectedItems);
   }
   OnItemDeSelect(item:any){

       console.log(this.selectedItems);
   }
  cargarManifiesto(manifiestoId){
    this.manifiestoService.obtenerManifiesto(manifiestoId).then(response =>{
      if (response) {
         this.manifiesto.id = response[0].id;
         this.manifiesto.advisor = response[0].advisor;
         this.manifiesto.originCityId = response[0].originCityId;
         this.manifiesto.destinationCityId = response[0].destinationCityId;
         this.manifiesto.vehicleId = response[0].vehicleId;
         this.manifiesto.vehicleTypeId = response[0].vehicleTypeId;
         this.manifiesto.serviceTypeId = response[0].serviceTypeId;
         this.manifiesto.riskId = response[0].riskId;
         this.origenManifiestoId = this.manifiesto.originCityId;
         this.destinoManifiestoId = this.manifiesto.destinationCityId;
         this.obtenerRutas();
         this.manifiesto.routeId = response[0].routeId;
         this.cargarInfoVehiculo(this.manifiesto.vehicleId);
         var d=response[0].date;
         var today = new Date();
         var date=new Date(d);
         var mD=d.split('-');
         this.manifiestoExp.date = {year: parseInt(mD[0]), month: parseInt(mD[1]), day: parseInt(mD[2])};
      }
    });
  }
  crearActualizarManifiesto(){
    var fecha=this.parserFormatter.format(this.manifiestoExp.date);
    this.manifiesto.date = fecha;
    if(this.manifiesto.vehicleTypeId!=this.vehicleTypeID){
      swal({
        title: "El vehículo seleccionado no corresponde al tipo de vehículo solicitado.",
        text: '',
        type: 'warning'
       }).catch(swal.noop);
    }
    if(this.manifiestoId>-1){
      this.manifiestoService.crearActualizarManifiesto(this.manifiesto)
        .then(response =>{
          if (response) {
            console.log('response : ', response)
            if (response.estado == 'EXITO') {
              this.manifiestoService.borrarRequerimientosManifiesto(this.manifiestoId).then(resp => {
                  if (resp){
                    for(var i=0;i<this.selectedItems.length;i++){
                      var requerimentId=this.selectedItems[i].id;
                      this.manifiestoService.crearRequerimientoManifiesto(this.manifiestoId,requerimentId)
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
               this.router.navigate(['/home/rtn/manifiestos']);
            } else {
              this.alertService.error(response.mensaje);
            }
          }
        });
    }else if(this.manifiestoId==-1){
      this.manifiestoService.crearActualizarManifiesto(this.manifiesto)
        .then(response =>{
          if (response) {
            var manifestId = response.manifestId;
            this.router.navigate(['/home/rtn/manifiestos']);
            if (response.estado == 'EXITO') {
                this.manifiestoService.borrarRequerimientosManifiesto(manifestId).then(resp => {
                    if (resp){
                      for(var i=0;i<this.selectedItems.length;i++){
                        var requerimentId = this.selectedItems[i].id;
                        this.manifiestoService.crearRequerimientoManifiesto(manifestId,requerimentId)
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
            } else {
              this.alertService.error(response.mensaje);
            }
          }
        });
    }
  }
  obtenerConductorPropietario(e){

  }
  obtenerDireccionesPropietario(thirdId){
    if(thirdId!=null){
      this.surcursalesPropietario = [];
      this.terceroService.obtenerSurcursalesTercero(thirdId)
         .then(response =>{
           if (response) {
             this.surcursalesPropietario = response;
           }
      });
    }
  }
  nuevaRemesa(){
    this.hideAddEditCosignment = false;
    this.hideConsignmentList = true;
    this.remesa.manifestId=this.manifiestoId;
  }
  editarRemesa(index){
    var id = this.remesas[index].id;
    this.remesaId = id;
    this.hideAddEditCosignment = false;
    this.hideAddEditLoadUnload = false;
    this.hideConsignmentList = true;
    this.manifiestoService.obtenerRemesa(id).then(response => {
       if(response){
          this.remesa = {};
          this.remesaAux = {};
          this.remesa.id = response[0].id;
          this.remesa.manifestId = this.manifiestoId;
          this.remesa.clientOrderNumber = response[0].clientOrderNumber;
          this.remesa.cosignmentOriginCityId = response[0].cosignmentOriginCityId;
          this.remesa.cosignmentDestinationCityId = response[0].cosignmentDestinationCityId;
          this.remesa.senderId = response[0].senderId;
          this.obtenerDireccionesRemitente(this.remesa.senderId);
          this.remesa.senderBranchId = response[0].senderBranchId;
          this.obtenerInfoDirRemitente(this.remesa.senderBranchId);
          this.remesa.receiverId = response[0].receiverId;
          this.obtenerDireccionesDestinatario(this.remesa.receiverId);
          this.remesa.receiverBranchId = response[0].receiverBranchId;
          this.obtenerInfoDirDestinatario(this.remesa.receiverBranchId);
          this.remesa.productId = response[0].productId;
          this.remesa.packageTypeId = response[0].packageTypeId;
          this.remesa.quantity = response[0].quantity;
          this.remesa.volume = response[0].volume;
          this.remesa.weight = response[0].weight;
          this.remesa.policyNumber = response[0].policyNumber;
          //this.remesa.insuranceValue = response[0].insuranceValue;
          var insuranceVal=String(response[0].insuranceValue);
          insuranceVal = insuranceVal.substring(0, insuranceVal.length - 3);
          this.remesaAux.insuranceValue  = insuranceVal;
          this.formatInsuranceValue();
          //this.remesa.freightValue = response[0].freightValue;
          var freightVal=String(response[0].freightValue);
          freightVal = freightVal.substring(0, freightVal.length - 3);
          this.remesaAux.freightValue  = freightVal;
          this.formatInsuranceValue();
          this.formatFreightValue();
          this.obtenerCargues();
          this.obtenerDescargues();
       }
    });
  }
  atras(nForm: NgForm){
    this.hideAddEditLoadUnload = true;
    this.hideAddEditCosignment = true;
    this.hideConsignmentList = false;
    this.remesa= {};
    this.remesaAux= {};
    nForm.form.reset()
    nForm.form.markAsPristine();
    nForm.form.markAsUntouched();
    nForm.form.updateValueAndValidity();
  }
  obtenerCiudadOrigenManifiesto(originId){
   this.origenManifiestoId = originId;
   if(this.origenManifiestoId!=-1&&this.destinoManifiestoId!=-1){
     this.obtenerRutas();
   }
  }
  obtenerCiudadDestinoManifiesto(destinationId){
   this.destinoManifiestoId = destinationId;
   if(this.origenManifiestoId!=-1&&this.destinoManifiestoId!=-1){
     this.obtenerRutas();
   }
  }
  obtenerRutas(){
    this.rutas=[];
    this.manifiesto.routeId = null;
    this.rutaService.obtenerRutasOrigenDestino(this.origenManifiestoId,this.destinoManifiestoId)
      .then(response =>{
        if (response) {
            console.log(response);
            this.rutas = response;
        }
    });
  }
  obtenerDireccionesRemitente(thirdId){
    if(thirdId!=null){
      this.surcursalesRemitente = [];
      this.remesa.senderPhone = "";
      this.remesa.senderCity = "";
      this.terceroService.obtenerSurcursalesTercero(thirdId)
         .then(response =>{
           if (response) {
             this.surcursalesRemitente = response;
           }
      });
    }
  }
  obtenerInfoDirRemitente(branchId){
   if(branchId!=null){
      this.terceroService.obtenerSurcursal(branchId).then(response => {
        if (response) {
            this.remesa.senderPhone = response[0].phone;
            this.remesa.senderCity = response[0].city+" - "+response[0].department;
        }
      });
   }
  }
  obtenerDireccionesDestinatario(thirdId){
    if(thirdId!=null){
      this.surcursalesDestinatario = [];
      this.remesa.receiverPhone = "";
      this.remesa.receiverCity = "";
      this.terceroService.obtenerSurcursalesTercero(thirdId)
         .then(response =>{
           if (response) {
             this.surcursalesDestinatario = response;
           }
      });
    }
  }
  obtenerInfoDirDestinatario(branchId){
  if(branchId!=null){
      this.terceroService.obtenerSurcursal(branchId).then(response => {
        if (response) {
            this.remesa.receiverPhone = response[0].phone;
            this.remesa.receiverCity = response[0].city+" - "+response[0].department;
        }
      });
   }
  }
  obtenerRiesgos(): void{
    this.manifiestoService.obtenerRiesgos().then(response => {
      this.riesgos = response;
    });
  }
  obtenerTipoServicios(): void{
    this.manifiestoService.obtenerTipoServicios().then(response => {
      this.tiposServicio = response;
    });
  }
  obtenerCiudades(): void {
    this.empresaService.obtenerCiudades().then(response => {
      this.origenManifiesto = response;
      this.origenRemesa = response;
      this.destinoManifiesto = response;
      this.destinoRemesa =response;
    });
  }
  obtenerTipoVehiculos(): void{
    this.vehiculoService.obtenerTiposCarroceria().then(response => {
      this.tiposVehiculo = response;
    });
  }
  obtenerVehiculos(): void {
		this.vehiculoService.obtenerVehiculos().then(response => {
			this.vehiculos = response;
		});
	}
  cargarInfoVehiculo(idVehiculo):void{
    this.manifiesto.driver = "";
    this.manifiesto.owner = "";
    //this.manifiesto.vehicleType = "";
    this.vehiculoService.obtenerInfoVehiculoPorPlaca(idVehiculo).then(response =>{
      if (response) {
         this.manifiesto.driver = response[0].driver;
         this.manifiesto.owner = response[0].owner;
         this.vehicleTypeID = response[0].vehicleTypeId;
         //this.manifiesto.vehicleType = response[0].vehicleType;
      }
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
  /*openModalRemesa(content,i) {
    if(i>-1){


    }else{
      this.remesa= {};
      this.remesa.manifestId=this.manifiestoId;
    }
     const modalRef = this.modalService.open(content, {backdrop: 'static', size: 'lg'});

     modalRef.result.then(value => {
       console.log('component.abrirDialogoCrearCuenta.modalRef.result.then', value);

     }).catch(reason => {
         console.log('component.abrirDialogoCrearCuenta.modalRef.result.catch', reason);
     });
  }*/
  openModalCargue(content,i) {
    if(i>-1){
      var id=this.cargues[i].id;
      this.manifiestoService.obtenerCargue(id).then(response => {
      if(response){
        this.cargue= {};
        this.cargueExp ={};
        console.log(response[0]);
        this.cargue.cosignmentId=this.remesaId;
        this.cargue.id=response[0].id;
        var s =response[0].loadFullDate.split(/-|:|T/g).slice(0,5);
        //var c =parseInt(s[3]) > 12 ? parseInt(s[3])-12 : s[3];
        //var f =parseInt(s[3]) > 12 ? 'PM' : 'AM';
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
      }

      });
    }else{
      this.cargue = {};
      this.cargueExp ={};
      this.cargue.cosignmentId=this.remesaId;
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
          this.descargue.cosignmentId=this.remesaId;
          this.descargue.id=response[0].id;

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
        }
      });
    }else{
      this.descargue = {};
      this.descargueExp= {};
      this.descargue.cosignmentId=this.remesaId;
    }
     const modalRef = this.modalService.open(content, {backdrop: 'static', size: 'lg'});

     modalRef.result.then(value => {
       console.log('component.abrirDialogoCrearCuenta.modalRef.result.then', value);

     }).catch(reason => {
         console.log('component.abrirDialogoCrearCuenta.modalRef.result.catch', reason);
     });
  }
  openModalConexo(content,i) {
    if(i>-1){
      var id=this.conexos[i].id;
      this.manifiestoService.obtenerConexo(id).then(response => {
        this.conexo= {};
        this.conexoAux= {};
        this.conexo.manifestId=this.manifiestoId;
        this.conexo.id=response[0].id;
        this.conexo.service=response[0].service;
        //this.conexo.saleValue=response[0].saleValue;
        //this.conexo.contractValue=response[0].contractValue;
        var saleVal=String(response[0].saleValue);
        saleVal = saleVal.substring(0, saleVal.length - 3);
        this.conexoAux.saleValue = saleVal;
        this.formatSaleValue();
        var contractValue=String(response[0].contractValue);
        contractValue = contractValue.substring(0, contractValue.length - 3);
        this.conexoAux.contractValue = contractValue;
        this.formatContractValue();
      });
    }else{
      this.conexo= {};
      this.conexoAux= {};
      this.conexo.manifestId=this.manifiestoId;
    }
     const modalRef = this.modalService.open(content, {backdrop: 'static', size: 'lg'});

     modalRef.result.then(value => {
       console.log('component.abrirDialogoCrearCuenta.modalRef.result.then', value);

     }).catch(reason => {
         console.log('component.abrirDialogoCrearCuenta.modalRef.result.catch', reason);
     });
  }
  crearActualizarConexo(){
    if(this.manifiestoId!=-1){
     var saleValue = String(this.conexoAux.saleValue);
     saleValue = this.replaceAll(saleValue, ',', '');
     this.conexo.saleValue = parseFloat(saleValue);

     var contractValue = String(this.conexoAux.contractValue);
     contractValue = this.replaceAll(contractValue, ',', '');
     this.conexo.contractValue = parseFloat(contractValue);

     this.manifiestoService.crearActualizarConexo(this.conexo)
       .then(response =>{
         if (response) {
           console.log('response : ', response)
           if (response.estado == 'EXITO') {
             this.obtenerConexos(this.manifiestoId);
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
       this.alertService.error("No se ha creado aún un manifiesto para asociar el conexo.");
     }
  }
  escapeRegExp(string){
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

/* Define functin to find and replace specified term with replacement string */
  replaceAll(str, term, replacement) {
     return str.replace(new RegExp(this.escapeRegExp(term), 'g'), replacement);
  }
  obtenerRemitentesDestinatarios(){
    this.terceroService.obtenerTodosTerceros().then(response => {
      this.remitentes = response;
      this.destinatarios = response;
      this.propietarios = response;
    });
    /*this.terceroService.obtenerTercerosActivosPorTipo(3).then(response => {
      for(var i=0;i<response.length;i++){
        this.remitentes.push({id:response[i].id, identification:response[i].identification, name:response[i].name});
        this.destinatarios.push({id:response[i].id, identification:response[i].identification, name:response[i].name});
        this.propietarios.push({id:response[i].id, identification:response[i].identification, name:response[i].name});
      }
    });*/
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
    //this.cargues = [];
    this.manifiestoService.obtenerCargues(this.remesaId)
      .then(response =>{
        if (response) {
            this.cargues = response;
            /*for(var i=0;i<response.length;i++){
              console.log(response[i].loadFullDate);
              console.log(response[i].loadFullDepartureDate);
              var s =response[i].loadFullDate.split(/-|:|T/g).slice(0,5);
              var c =parseInt(s[3]) > 12 ? parseInt(s[3])-12 : s[3];
              var f =parseInt(s[3]) > 12 ? 'PM' : 'AM';


              var fechaCargue=s[0]+'-'+s[1]+'-'+s[2]+'  '+c+':'+s[4]+' '+f;
              s =response[i].loadFullDepartureDate.split(/-|:|T/g).slice(0,5);
              c =parseInt(s[3]) > 12 ? parseInt(s[3])-12 : s[3];
              f =parseInt(s[3]) > 12 ? 'PM' : 'AM';
              var fechaSalidaCargue=s[0]+'-'+s[1]+'-'+s[2]+'  '+c+':'+s[4]+' '+f;
              console.log(fechaCargue);
              console.log(fechaSalidaCargue);
              this.cargues.push({id:response[i].id,loadFullDate:fechaCargue,loadFullDepartureDate:fechaSalidaCargue});
            }*/
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
    //this.descargues = [];
    this.manifiestoService.obtenerDescargues(this.remesaId)
      .then(response =>{
        if (response) {
            this.descargues = response;
            /*for(var i=0;i<response.length;i++){
              var s =response[i].unloadFullDate.split(/-|:|T/g).slice(0,5);
              var c =parseInt(s[3]) > 12 ? parseInt(s[3])-12 : s[3];
              var f =parseInt(s[3]) > 12 ? 'PM' : 'AM';
              var fechaDescargue=s[0]+'-'+s[1]+'-'+s[2]+'  '+c+':'+s[4]+' '+f;

              s =response[i].unloadFullDepartureDate.split(/-|:|T/g).slice(0,5);
              c =parseInt(s[3]) > 12 ? parseInt(s[3])-12 : s[3];
              f =parseInt(s[3]) > 12 ? 'PM' : 'AM';
              var fechaSalidaDescargue=s[0]+'-'+s[1]+'-'+s[2]+'  '+c+':'+s[4]+' '+f;

              s =response[i].devolutionFullDate.split(/-|:|T/g).slice(0,5);
              c =parseInt(s[3]) > 12 ? parseInt(s[3])-12 : s[3];
              f =parseInt(s[3]) > 12 ? 'PM' : 'AM';
              var fechaDevolucion=s[0]+'-'+s[1]+'-'+s[2]+'  '+c+':'+s[4]+' '+f;
              this.descargues.push({id:response[i].id,containerNumber:response[i].containerNumber,type:response[i].containerType,address:response[i].address,ownerName:response[i].ownerName,unloadFullDate:fechaDescargue,unloadFullDepartureDate:fechaSalidaDescargue,devolutionFullDate:fechaDevolucion});
            }*/
        }
    });
  }
  crearActualizarRemesa(nForm: NgForm){
    var insuranceValue = String(this.remesaAux.insuranceValue);
    insuranceValue = this.replaceAll(insuranceValue, ',', '');
    this.remesa.insuranceValue = parseFloat(insuranceValue);

    var freightValue = String(this.remesaAux.freightValue);
    freightValue = this.replaceAll(freightValue, ',', '');
    this.remesa.freightValue = parseFloat(freightValue);

    this.manifiestoService.crearActualizarRemesa(this.remesa)
      .then(response =>{
        if (response) {
          console.log('response : ', response)
          if (response.estado == 'EXITO') {
            this.hideAddEditLoadUnload = true;
            this.hideAddEditCosignment = true;
            this.hideConsignmentList = false;
            this.remesa = {};
            this.remesaAux = {};
            nForm.form.reset()
            nForm.form.markAsPristine();
            nForm.form.markAsUntouched();
            nForm.form.updateValueAndValidity();
            this.obtenerRemesas(this.manifiestoId);
            swal({
              title: response.mensaje,
              text: '',
              type: 'success'
             }).catch(swal.noop);
          }
        }
      });
  }
  obtenerRemesas(manifestId){
    this.manifiestoService.obtenerRemesas(manifestId)
      .then(response =>{
        if (response) {
            this.remesas = response;
            console.log(response);
        }
    });
  }
}
