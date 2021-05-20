import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {
  proveedor: any = {};
  cuentaProveedor: any ={};
  proveedorExp: any = {};
  cuentasProveedor: any = {};
  //proveedorAccount: any= {};
  ciudades: any = [];
  lugarDocumento: any = [];
  barrios: any = [];
  tiposCuenta: any = [];
  tipos: any = [];
  proveedorId: number = -1;
  contactoProveedor: any ={};
  contactosProveedor: any ={};
  servicios: any = [];
  serviciosProveedor: any = [];
  itemList = [];
  selectedItems = [];
  settings = {};
  regimenes: any = [];
  visibleProviderBankContent: boolean = false;
  visibleProviderContactContent: boolean = false;
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
    this.proveedorId=this.route.snapshot.params.idProveedor;
    this.proveedor.thirdTypeId=2;
    this.obtenerCiudades();
    this.obtenerTiposCuentas();
    this.obtenerServicios();
    this.obtenerRegimenes();
    this.settings = {

            text: "Seleccionar",
            classes: "multiselect-style",
            enableCheckAll: false,
            maxHeight: '150'
    };
    if(this.proveedorId>-1){
       this.obtenerProveedor();
       this.obtenerCuentasProveedor(this.proveedorId);
       this.obtenerContactosProveedor();
       this.obtenerTiposReferencia();
       this.obtenerServiciosProveedor(this.proveedorId);
       this.visibleProviderBankContent = true;
       this.visibleProviderContactContent = true;
    }else if(this.proveedorId==-1){
      this.proveedor.status = true;
      this.visibleProviderBankContent = false;
      this.visibleProviderContactContent = false;
    }
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
  obtenerProveedor():void{
    this.terceroService.obtenerTercero(this.proveedorId)
      .then(response =>{
        if (response) {
          this.proveedor.id = response[0].id;
          this.proveedor.identification = response[0].identification;
          this.proveedor.regimeId = response[0].regimeId;
          this.proveedor.name = response[0].name;
          this.proveedor.contact = response[0].contact;
          this.proveedor.identificationPlaceId = response[0].identificationPlaceId;
          this.obtenerDepartamento(this.proveedor.identificationPlaceId);
          this.proveedor.cityId = response[0].cityId;
          this.proveedor.address = response[0].address;
          this.proveedor.email = response[0].email;
          this.proveedor.website = response[0].website;
          this.proveedor.phone1 = response[0].phone1;
          this.proveedor.phone2 = response[0].phone2;
          this.proveedor.phone3 = response[0].phone3;
          this.proveedor.quota = response[0].quota;
          this.proveedor.deadLine = response[0].deadLine;
          this.proveedor.userPUC = response[0].userPUC;
          this.proveedor.billHasIVA = response[0].billHasIVA;
          this.proveedor.applyRetention = response[0].applyRetention;
          this.obtenerBarrio(this.proveedor.cityId);
          this.proveedor.districtId = response[0].districtId;
          this.proveedor.status = response[0].status;
        }
    });
  }
  obtenerServicios(): void{
    this.terceroService.obtenerListaServicios().then(response => {
      this.servicios = response;
      for(var i=0;i<this.servicios.length;i++){
        this.itemList.push({id:this.servicios[i].id,itemName:this.servicios[i].description});
      }
    });
  }
  obtenerCuentasProveedor(thirdId): void{
    this.terceroService.obtenerCuentaBancaria(thirdId)
      .then(response =>{
        if (response) {
           this.cuentasProveedor=response;
        }
    });
  }
  obtenerServiciosProveedor(thirdId): void{
    this.terceroService.obtenerServiciosTercero(thirdId)
      .then(response =>{
        if (response) {
            this.serviciosProveedor=response;
            for(var i=0;i<this.serviciosProveedor.length;i++){
              this.selectedItems.push({id:this.serviciosProveedor[i].serviceId,itemName:this.serviciosProveedor[i].serviceName});
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
  obtenerTiposCuentas(): void {
    this.conductorService.obtenerTiposCuentas().then(response => {
      //console.log(response);
      this.tiposCuenta = response;
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
           this.proveedorExp.deparment2=response[0].departmentName;
        }
    });
  }
  obtenerDepartamento(idCiudad): void {
    this.empresaService.obtenerDepatamentoPorCiudad(idCiudad)
      .then(response =>{
        if (response) {
           this.proveedorExp.deparment1=response[0].departmentName;
        }
    });
  }
  obtenerBarriosCiudad(idCiudad): void {
    this.empresaService.obtenerBarriosPorCiudad(idCiudad)
      .then(response =>{
        if (response) {
           this.barrios=response;
           this.proveedor.districtId = response[0].id;
        }
    });
    this.empresaService.obtenerDepatamentoPorCiudad(idCiudad)
      .then(response =>{
        if (response) {
           this.proveedorExp.deparment2=response[0].departmentName;
        }
    });
  }
  obtenerCiudades(): void {
    this.empresaService.obtenerCiudades().then(response => {
      this.ciudades = response;
      this.lugarDocumento = response;
    });
  }
  openModal(content,i) {
   if(i>-1){
     var id=this.cuentasProveedor[i].id;
     this.terceroService.obtenerCuentaBancariaPorID(id).then(response => {
       this.cuentaProveedor = {};
       this.cuentaProveedor.thirdId = this.proveedorId;
       this.cuentaProveedor.id=response[0].id;
       this.cuentaProveedor.bank=response[0].bank;
       this.cuentaProveedor.accountNumber=response[0].accountNumber;
       this.cuentaProveedor.accountName=response[0].accountName;
       this.cuentaProveedor.accountTypeId=response[0].accountTypeId;
     });
   }else{
     this.cuentaProveedor = {};
     this.cuentaProveedor.thirdId = this.proveedorId;
   }
   const modalRef = this.modalService.open(content, {backdrop: 'static', size: 'lg'});

   modalRef.result.then(value => {
     console.log('component.abrirDialogoCrearCuenta.modalRef.result.then', value);

   }).catch(reason => {
       console.log('component.abrirDialogoCrearCuenta.modalRef.result.catch', reason);
   })
 }
 openModal_(content,i) {
   if(i>-1){
     var id=this.contactosProveedor[i].id;
     this.terceroService.obtenerContacto(id).then(response => {
       this.contactoProveedor= {};
       this.contactoProveedor.thirdId=this.proveedorId;
       this.contactoProveedor.id=response[0].id;
       this.contactoProveedor.occupation=response[0].occupation;
       this.contactoProveedor.workplace=response[0].workplace;
       this.contactoProveedor.workphone=response[0].workphone;
       this.contactoProveedor.name=response[0].name;
       this.contactoProveedor.phone=response[0].phone;
       this.contactoProveedor.cellphone=response[0].cellphone;
       this.contactoProveedor.optionalphone=response[0].optionalphone;
       this.contactoProveedor.email=response[0].email;
       this.contactoProveedor.address=response[0].address;
       this.contactoProveedor.relationship=response[0].relationship;
       this.contactoProveedor.idTypeReference=response[0].idTypeReference;
     });
   }else{
     this.contactoProveedor= {};
     this.contactoProveedor.thirdId=this.proveedorId;
   }
    const modalRef = this.modalService.open(content, {backdrop: 'static', size: 'lg'});

    modalRef.result.then(value => {
      console.log('component.abrirDialogoCrearCuenta.modalRef.result.then', value);

    }).catch(reason => {
        console.log('component.abrirDialogoCrearCuenta.modalRef.result.catch', reason);
    });
 }
 crearActualizarContacto(): void{
   if(this.proveedorId!=-1){
    this.terceroService.crearActualizarContacto(this.contactoProveedor)
      .then(response =>{
        if (response) {
          console.log('response : ', response)
          if (response.estado == 'EXITO') {
            this.obtenerContactosProveedor();
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
 obtenerContactosProveedor(): void{
   this.route.paramMap
     .switchMap((params: ParamMap) => this.terceroService.obtenerContactosTercero(params.get('idProveedor')))
     .subscribe(response => {
       if(response){
         //console.log(response);
         this.contactosProveedor=response;
       }
     });
 }
 borrarContacto(index){
   var id=this.contactosProveedor[index].id;
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
                   that.contactosProveedor.splice(index, 1);
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
 crearActualizarProveedor(): void {
   if(this.proveedorId>-1){
     this.terceroService.crearActualizarTercero(this.proveedor)
       .then(response =>{
         console.log('proveedor.component.crearActualizarProveedor.response: ', response);
         if (response) {
           this.router.navigate(['/home/dr/proveedores']);
           if (response.estado == 'EXITO') {
               this.terceroService.borrarServiciosTercero(this.proveedorId).then(resp => {
                  console.log(resp);
                   if (resp){
                     //if(resp.estado == 'EXITO'){
                       for(var i=0;i<this.selectedItems.length;i++){
                         var serviceId=this.selectedItems[i].id;
                         this.terceroService.crearServicioTercero(this.proveedorId,serviceId)
                           .then(s =>{
                           });
                       }
                     //}
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

   }else if(this.proveedorId==-1){
     this.terceroService.crearActualizarTercero(this.proveedor)
       .then(response =>{
         console.log('proveedor.component.crearActualizarProveedor.response: ', response);
         if (response) {
           var thirdId = response.thirdId;
           console.log(thirdId);
           this.router.navigate(['/home/dr/proveedores']);
           if (response.estado == 'EXITO') {
               this.terceroService.borrarServiciosTercero(thirdId).then(resp => {
                  console.log(resp);
                   if (resp){
                     for(var i=0;i<this.selectedItems.length;i++){
                       var serviceId=this.selectedItems[i].id;
                       this.terceroService.crearServicioTercero(thirdId,serviceId)
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
  crearActualizarCuenta(): void {
    this.terceroService.crearActualizarCuenta(this.cuentaProveedor)
    .then(response =>{
      if (response) {
        console.log('response : ', response);
        if (response.estado == 'EXITO') {
          this.obtenerCuentasProveedor(this.proveedorId);
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
  borrar(index){
    var id=this.cuentasProveedor[index].id;
    let that = this;
    swal({
      title: '¿Esta seguro de borrar la cuenta seleccionada?',
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
            that.terceroService.borrarCuenta(id).then(response => {
                if (response){
                  if (response.estado == 'EXITO') {
                    that.cuentasProveedor.splice(index, 1);
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
