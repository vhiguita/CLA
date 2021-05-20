import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, Directive, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgxDatatableModule} from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { NgbTabsetConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import {EmpresaService} from '../../../services/empresa.service';
import {TerceroService} from '../../../services/tercero.service';
import {ConductorService} from '../../../services/conductor.service';
import {TrailerService} from '../../../services/trailer.service';
import {UsuarioService} from '../../../services/usuario.service';
import { VehiculoService } from '../../../services/vehiculo.service';
import {CommonService} from '../../../services/common.service';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { DualListComponent } from 'angular-dual-listbox';
import {Observable} from 'rxjs/Rx';
import swal from 'sweetalert2';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import * as $ from 'jquery';

declare const google: any;
var marker: any;
var map: any;
var isLocCreated: boolean = false;
var lat:number;
var lng:number;

@Component({
  selector: 'app-tercero',
  templateUrl: './tercero.component.html',
  styleUrls: ['./tercero.component.css'],
  providers: [NgbTabsetConfig] ,

  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({opacity: 0}),
        animate('400ms ease-in-out', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translate(0)'}),
        animate('400ms ease-in-out', style({opacity: 0}))
      ])
    ])
  ]
})
@Directive({ selector: '[scrollToFirstInvalid]' }) 
export class TerceroComponent implements OnInit {

  FOLDER = 'drivers/';
  accessKey ='AKIAJBSEKUWJ6JUFUTIA';
  secretKey ='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';
  bucketName = 'upload';
  imgName = '';
  format :any;
  validatemail: any = 0;
  tercero: any= {};
  terceroExp: any= {};
  terceroAccount: any= {};
  bufferSize = 50;
  ciudades: any = [];
  ciudadesBuffer =[];
  loading1 = false;
  lugarDocumento: any = [];
  lugarDocumentoBuffer =[];
  loading2 = false;
  ciudadesSurcursal: any = [];
  ciudadesSurcursalBuffer =[];
  loading3 = false;
  barrios: any = [];
  tiposCuenta: any = [];
  tipos: any = [];
  licenses: any = [];
  regimenes: any = [];
  terceroId: number = -1;
  surcursalTercero: any = {};
  surcursalesTercero: any []=[];
  contactoTercero: any ={};
  contactosTercero: any []=[];
  estadosCivil: any = [];
  isValidDiscount = false;
  isDriver: boolean = false;
  hideAddEditBranch: boolean = true;
  hideBranchesList: boolean = false;
  hideThirdAccountContent: boolean = true;
  hideThirdContactContent: boolean = true;
  hideThirdBranchContent: boolean = true;
  hideContentPicture: boolean = true;//To show if the third is type driver
  hideRegimenCtrl: boolean = true;
  hideCtrlDriver: boolean = true;
  hideCtrlProvider: boolean = true;
  hideCtrlClient: boolean = true;
  hideCtrlThird: boolean = true;
  hideCtrlForm: boolean = true;
  cuentaTercero: any ={};
  cuentasTercero: any []=[];
  terceroImg: any = null;
  fileToUpload: File = null;
  tiposRH: any = [{id:1,description:"O+"},{id:2,description:"O-"},{id:3,description:"B+"},{id:4,description:"B-"},{id:5,description:"A+"},{id:6,description:"A-"},{id:7,description:"AB+"},{id:8,description:"AB-"}];
  servicios: any = [];
  serviciosProveedor: any = [];
  itemList = [];
  items1 = [];
  items2 = [];
  selectedItems = [];
  selectedItemList = [];
  settings = {};
  source:Array<any>;
  nSeletedItems: number = 0;
  auxPhone = '';
  auxIdentification = '';
  btnIsVisible: boolean = false;
  jsonTrailer: any = [];
  jsonVehiculo: any = [];
  licenseId: any;
  license: any = {};
  licencia: any = {};
  categoria: any = {};
  modalLicense: any;
  licenseIdSave: any;
  typeService: any;
  descriptionCat: any;
  codeCat: any;
  categoriasLicencia: any = [];
  agenciasTransito: any = [];

  @ViewChild("terceroForm") form: NgForm; 
  @ViewChild('modalUpdateLicense') modalUpdateLicense: HTMLElement;
  constructor(
    public parserFormatter: NgbDateParserFormatter,
    private route: ActivatedRoute,
    private router: Router,
    private completerService: CompleterService,
    private empresaService: EmpresaService,
    private conductorService: ConductorService,
    private terceroService: TerceroService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private usuarioService: UsuarioService,
    private commonService: CommonService,
    private trailerService: TrailerService,
    private vehiculoService: VehiculoService,
    private el: ElementRef
  ) { }
  @HostListener('submit', ['$event'])
  onSubmit(event) { //Función de validación que lo lleva al comienzo del formulario si hay un campo que no haya sido completado
    if(!this.form.valid) {
      //let invalidFields = [].slice.call(document.getElementsByClassName('ng-invalid'));
      //invalidFields[1].focus();
      let target;

      target = this.el.nativeElement.querySelector('.ng-invalid')

      if (target) {
          console.log('target', target);
          $('html,body').animate({ scrollTop: $(target).offset().top }, 3000);
          target.focus();
      }
    }
  }
  ngOnInit() {
    this.moduloEsLecturaEscritura(7);
    this.terceroId=this.route.snapshot.params.idTercero;
    this.reset();

    this.jsonTrailer = this.trailerService.globalInfoTrailerFun()
    this.jsonVehiculo = this.vehiculoService.globalInfoVehicleFun()
    // console.log('datyos del trailer : : : : ', this.trailerService.getTrailer())


    if(this.terceroId==-1){
       this.terceroImg = "assets/images/social/profile.jpg";
       this.tercero.urlImage="assets/images/social/profile.jpg";
    }
    this.format = { add: 'Adicionar', remove: 'Borrar', all: 'Todos', none: 'Ninguno', direction: 'left-to-right', draggable: true, locale: undefined };
    /*this.items = [
    { _id: 1, _name: 'Antonito'},
		{ _id: 2, _name: 'Big Horn'}
    ];*/


    this.obtenerServicios();
    this.obtenerAgenciasTransito();
    this.settings = {

            text: "Seleccionar",
            classes: "multiselect-style",
            enableCheckAll: false,
            maxHeight: '150'
    };
    //this.tercero.thirdTypeId=3;
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

    this.obtenerEstadosCiviles();
    this.obtenerCiudades();
    this.obtenerCategoriasLicencia();
    this.obtenerTiposCuentas();
    this.obtenerTiposReferencia();
    this.obtenerRegimenes();
    this.obtenerTiposDeTercero();
    if(this.terceroId>-1){
       this.obtenerTercero();
       this.obtenerSurcursalesTercero();
       this.obtenerContactosTercero();
       this.obtenerCuentasTercero(this.terceroId);
       this.hideThirdContactContent = false;
       this.hideThirdBranchContent = false;
       this.hideThirdAccountContent = false;
    }else if(this.terceroId==-1){
      this.tercero.status = true;
    }
  }
  moduloEsLecturaEscritura(moduleId){
    var rolId = this.commonService.obtenerIdCodigoPerfilUsuario();
    this.usuarioService.moduloEsLecturaEscritura(rolId,moduleId).then(response => this.btnIsVisible = response);
  }
  obtenerCodigoPerfilUsuario(): string {
    return this.commonService.obtenerCodigoPerfilUsuario();
  }
  obtenerTiposDeTercero(){
    this.terceroService.obtenerTiposTercero().then(response => {
      if(response){
        for(var i=0;i<response.length;i++){
          this.items1.push({_id:response[i].id,_name:response[i].description});
        }
        this.source= JSON.parse(JSON.stringify(this.items1));
      }
    });
  }

  removeCat(id){
     // var id=this.points[index].id;
     console.log(id);
     let that = this;
    swal({
      title: '¿Esta seguro de borrar el punto de chequeo seleccionado?',
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
            that.terceroService.eliminarCategoriaLicencia(id).then(response => {
                if (response){
                  if (response.estado == 'EXITO') {
                    //that.points.splice(index, 1);
                    /*for (var i = 0; i < that.circles.length; i++) {
                         if(id==that.circles[i].id){
                            that.circles[i].circle.setMap(null);
                            that.circles.splice(i, 1);
                         }
                    }*/
                    swal({
                      title: response.mensaje,
                      text: '',
                      type: 'success'
                     }).catch(swal.noop);
                  } 
                  console.log('recargando lista')
                  that.obtenerTercero();
                }
            });
          }
       }
     }
   }).catch(swal.noop);
  }

  saveUpdateCat(): void {
    let that = this;
    this.categoria.thirdId = this.terceroId
    console.log('esta categoria : ', this.categoria);
    console.log('esta terceroId : ', this.terceroId);

    /*
      var expirDate = response[0].expirationDate
      var expiD=expirDate.split('-');
      this.vehiculoExp.expirationDate = {year: parseInt(expiD[0]), month: parseInt(expiD[1]), day: parseInt(expiD[2])};
    */
  
    var expirationDate = this.parserFormatter.format(this.categoria.expirationDate);
    this.categoria.expirationDate = expirationDate;
    this.terceroService.guardarActualizarLicencia(this.categoria)
      .then(response => {
        if (response.validate != '0'){
          if (response.estado == 'EXITO') {
            if(this.categoria.Id!=null){
              swal({
                title: 'Categoria actualizada exitosamente.',
                text: '',
                type: 'success'
              }).catch(swal.noop);
            }else{
              swal({
                title: response.mensaje,
                text: '',
                type: 'success'
              }).catch(swal.noop);
            }
            this.modalLicense.close();
            this.obtenerTercero();
          }
        }
        else{
          swal({
            title: response.mensaje,
            text: '',
            type: 'success'
          }).catch(swal.noop);
        }
      });
  }

  openModalLicense(licenseId: any): void {
    console.log('licensec : : : : ', this.license)
    console.log('licenseId licenseId licenseId licenseId licenseId licenseId licenseId licenseId : ', licenseId)
    //this.getTypePoints();
    let that = this;
    if(licenseId > -1){
      this.licenseIdSave = licenseId;
      this.licenseId = Object.assign({}, licenseId);
      // this.getrfids();
      this.terceroService.obtenerLicenciaConductor(licenseId).then(response => {
        if (response) {
          this.obtenerCategoriasLicencia();
          console.log('categoriasLicencia : ', this.categoriasLicencia)
          var expirDate = response.registros[0].expirationDate
          var expiD=expirDate.split('-');
          this.categoria.expirationDate = {year: parseInt(expiD[0]), month: parseInt(expiD[1]), day: parseInt(expiD[2])};
          this.categoriasLicencia.id = response.registros[0].idCategory
          this.categoria.id = response.registros[0].idCategory
          this.categoria.typeService = response.registros[0].typeService;
          this.categoria.description = response.registros[0].vehicleClass;
          this.categoria.idLicThird = licenseId
        }
      });
    }else{
      this.license = {};
      //this.license.IdRoute =this.routeId;
    }

    this.modalLicense = this.modalService.open(this.modalUpdateLicense, {size: 'lg'});
    this.modalLicense.result.then(value => {
      console.log('component.abrirDialogoCrearCuenta.modalRef.result.then', value);

    }).catch(reason => {
        console.log('component.abrirDialogoCrearCuenta.modalRef.result.catch', reason);
    });
  }

  obtenerCategoriaId(idCategory): void{
    console.log('id category id category id category id category id category id category : ', idCategory)
    this.terceroService.obtenerCategoriaId(idCategory).then(response => {
      var idLicThird = this.categoria.idLicThird
      var expirationDate = this.categoria.expirationDate
      this.categoria = response;
      // this.licencia.description = ''
      // this.licencia.typeService = '' 
      this.typeService = this.categoria.registros[0].typeService
      this.descriptionCat = this.categoria.registros[0].description
      this.codeCat = this.categoria.registros[0].code

      this.categoria.expirationDate = expirationDate
      this.categoria.idLicThird = idLicThird
      this.categoria.id = this.categoria.registros[0].id
      this.categoria.typeService = this.categoria.registros[0].typeService
      this.categoria.description = this.categoria.registros[0].description
      this.categoria.code = this.categoria.registros[0].code

    });
  }


  cargarTiposTercero(a:any){
    this.hideCtrlForm = false;
    for(var i=0;i<a.length;i++){
      this.items2.push({_id:a[i].ThirdType_id,_name:a[i].type});
      // tipo conductor
      if(a[i].ThirdType_id==1){
        this.hideContentPicture = false;
        this.hideCtrlDriver = false;
        this.isDriver = true;
        this.hideThirdBranchContent = true;
      }
      //tipo cliente
      if(a[i].ThirdType_id==2){
          this.hideRegimenCtrl = false;
          this.hideCtrlThird = false;
          this.hideCtrlClient = false;
          this.hideThirdBranchContent = false;
      }
      //tipo proveedor
      if(a[i].ThirdType_id==3){
          this.hideRegimenCtrl = false;
          this.hideCtrlThird = false;
          this.hideCtrlProvider = false;
          this.obtenerServiciosTercero(this.terceroId);
          this.hideThirdBranchContent = false;
      }
      // tipo tercero
      if(a[i].ThirdType_id==4){
          this.hideRegimenCtrl = false;
          this.hideCtrlThird = false;
          this.hideCtrlClient = false;
          this.hideThirdBranchContent = false;
      }
    }
    this.selectedItemList = JSON.parse(JSON.stringify(this.items2));
    this.nSeletedItems = this.selectedItemList.length;
  }
  reset(){
    this.tercero.regimeId = 2;
    this.tercero.rh = 'NA';
    this.tercero.roleId = 10;
    this.tercero.birthPlace = 'NA';
    this.terceroExp.birthDate = {year: 1900, month: 7, day: 10};
    this.terceroExp.expeditionDate = {year: 1900, month: 7, day: 10};//inia en la variable auxiliar terceroExp la fecha expedición expeditionDate con un valor por defecto
    this.tercero.userPUC = 'NA';
    this.tercero.advisor = 'NA';
    this.tercero.quota = 0; //inicia como 0 el valor por defecto
    this.terceroExp.quota = '0';//inicia como '0' el valor por defecto
    this.tercero.deadLine = 0;
    this.tercero.discount = 0;//inicia como 0 el valor por defecto
    this.tercero.maritalStatusId = 4;
    this.terceroExp.rhType=this.tiposRH[0]['id'];
    // cuando vaya a hacer seguimiento los valores de las variables "hide" las pongo en false
    this.hideContentPicture = true;
    this.hideRegimenCtrl = true;
    this.hideCtrlDriver = true;
    this.hideCtrlProvider = true;
    this.hideCtrlClient = true;
    this.hideCtrlThird = true;
    this.hideCtrlForm = true;
    
    this.isDriver= false;

    this.tercero.expeditionDate = null;
    this.tercero.transitAgency = 1;
  }
  getSeletedItems(){
    console.log('this.nSeletedItems : ', this.selectedItemList)
    if(this.nSeletedItems!=this.selectedItemList.length){
       this.nSeletedItems = this.selectedItemList.length;
          this.reset();
       if(this.nSeletedItems!=0){
          this.hideCtrlForm = false;
          var countValidate = 0
          for(var i=0;i<this.nSeletedItems;i++){
            //tipo conductor, seleccionado de la lista de tipo de tercero
            if(this.selectedItemList[i]._id==1){
              this.tercero.rh = '';
              this.tercero.roleId = 7;
              this.tercero.birthPlace = '';
              this.terceroExp.birthDate ='';
              this.terceroExp.expeditionDate ='';
              this.tercero.maritalStatusId = '';
              this.terceroExp.rhType=null;
              this.hideContentPicture = false;
              this.hideCtrlDriver = false;
              this.isDriver= true;
              this.validatemail = 1;
              this.tercero.transitAgency = null;
            }
              //tipo cliente, seleccionado de la lista de tipo de tercero
            if(this.selectedItemList[i]._id==2){
                this.tercero.advisor = '';
                //this.tercero.quota = '';
                this.terceroExp.quota = '0';//tipo couta de la variable auxiliar terceroExp inicializada como '0'
                this.tercero.deadLine = '';
                this.tercero.discount = '';
                this.tercero.userPUC = '';
                this.tercero.regimeId = '';
                this.hideRegimenCtrl = false;
                this.hideCtrlThird = false;
                this.hideCtrlClient = false;
                countValidate = countValidate + 1
            }
            //tipo proveedor, seleccionado de la lista de tipo de tercero
            if(this.selectedItemList[i]._id==3){
                //this.tercero.quota = '';
                this.terceroExp.quota = '0';//tipo couta de la variable auxiliar terceroExp inicializada como '0'
                this.tercero.deadLine = '';
                this.tercero.userPUC = '';
                this.tercero.regimeId = '';
                this.hideRegimenCtrl = false;
                this.hideCtrlThird = false;
                this.hideCtrlProvider = false;
                countValidate = countValidate +1
            }
            //tipo tercero, seleccionado de la lista de tipo de tercero
            if(this.selectedItemList[i]._id==4){
                this.tercero.advisor = '';
                //this.tercero.quota = '';
                this.terceroExp.quota = '0';//tipo couta de la variable auxiliar terceroExp inicializada como '0'
                this.tercero.deadLine = '';
                this.tercero.discount = '';
                this.tercero.userPUC = '';
                this.tercero.regimeId = '';
                this.hideRegimenCtrl = false;
                this.hideCtrlThird = false;
                this.hideCtrlClient = false;
                countValidate = countValidate +1
            }
            if(countValidate >= 1){this.validatemail = 0}else{this.validatemail = 1}
          }
       }
    }
  }
  obtenerServicios(): void{
    this.terceroService.obtenerListaServicios().then(response => {
      this.servicios = response;
      for(var i=0;i<this.servicios.length;i++){
        this.itemList.push({id:this.servicios[i].id,itemName:this.servicios[i].description});
      }
    });
  }
  obtenerEstadosCiviles(): void {
    this.conductorService.obtenerEstadosCiviles().then(response => {
      //console.log(response);
      this.estadosCivil = response;
    });
  }
  obtenerRegimenes():void{
    this.terceroService.obtenerRegimenes().then(response => {
       this.regimenes =response;
    });
  }
  obtenerTiposReferencia(): void {
    this.conductorService.obtenerTiposReferencia().then(response => {
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
    this.surcursalTercero = {};
    this.surcursalTercero.thirdId = this.terceroId;
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
       if(s.dismiss !== undefined){
         if (s.dismiss.toString() === 'cancel') {
         }
       }else{
         if(s.value!== undefined){
            if(s.value){
              marker.setMap(null);
              marker=null;
              isLocCreated=false;
              that.surcursalTercero.location="";
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
    this.surcursalTercero.latitude = String(lat);
    this.surcursalTercero.longitude = String(lng);
    this.terceroService.crearActualizarSurcursal(this.surcursalTercero)
      .then(response =>{
        if (response) {
          if (response.estado == 'EXITO') {
            this.hideAddEditBranch=true;
            this.hideBranchesList=false;
            marker.setMap(null);
            marker=null;
            isLocCreated=false;
            lat=null;
            lng=null;
            this.obtenerSurcursalesTercero();
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
    var id=this.surcursalesTercero[i].id;
    this.terceroService.obtenerSurcursal(id).then(response => {
      this.surcursalTercero = {};
      this.surcursalTercero.thirdId = this.terceroId;
      this.surcursalTercero.id=response[0].id;
      this.surcursalTercero.name=response[0].name;
      this.surcursalTercero.phone=response[0].phone;
      this.surcursalTercero.address=response[0].address;
      this.surcursalTercero.cityId=response[0].cityId;
      this.surcursalTercero.latitude=response[0].latitude;
      this.surcursalTercero.longitude=response[0].longitude;
      this.obtenerDep(this.surcursalTercero.cityId);
      lat=parseFloat(this.surcursalTercero.latitude);
      lng=parseFloat(this.surcursalTercero.longitude);
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
  obtenerTercero(): void {
    this.terceroService.obtenerTercero(this.terceroId)
      .then(response =>{
        if (response) {
          this.tercero.id = response[0].id;
          this.terceroAccount.thirdId = response[0].id;
          var a= response[0].tipos;
          this.licenses = response[0].license
          this.cargarTiposTercero(a);
          this.obtenerCuentaBancaria(this.terceroAccount.thirdId);
          this.tercero.identification = response[0].identification;
          this.auxIdentification = this.tercero.identification;
          this.tercero.regimeId = response[0].regimeId;
          this.tercero.name = response[0].name;
          this.tercero.contact = response[0].contact;
          this.tercero.identificationPlaceId = response[0].identificationPlaceId;
          this.obtenerDepartamento(this.tercero.identificationPlaceId);
          this.tercero.cityId = response[0].cityId;
          this.tercero.address = response[0].address;
          this.tercero.email = response[0].email;
          this.tercero.website = response[0].website;
          this.tercero.phone1 = response[0].phone1;
          this.auxPhone = this.tercero.phone1;
          this.tercero.phone2 = response[0].phone2;
          this.tercero.phone3 = response[0].phone3;
          this.tercero.quota = response[0].quota;
          var quota= String(response[0].quota);//convierte la variable quota de la base de datos a string
          //quota = quota.substring(0, quota.length - 3);
          this.terceroExp.quota=quota;//asigna el valor de quota a la variable auxiliar terceroExp.quota
          this.format_();//invoca la función para formatear el valor de la quota
          this.tercero.deadLine = response[0].deadLine;
          var discount = response[0].discount;
          this.tercero.discount = response[0].discount;

          this.tercero.discount = discount.substring(0, discount.length - 3);//convierte 20.00 que de la base de datos 20
          this.tercero.userPUC = response[0].userPUC;
          this.tercero.advisor = response[0].advisor;
          this.tercero.applyRetention = response[0].applyRetention;
          this.tercero.retentionCREE = response[0].retentionCREE;
          this.obtenerBarrio(this.tercero.cityId);
          this.tercero.districtId = response[0].districtId;
          this.tercero.status = response[0].status;
          this.tercero.bascCertificate = response[0].bascCertificate;
          this.tercero.billHasIVA = response[0].billHasIVA;
          this.tercero.birthPlace = response[0].birthPlace;
          this.tercero.maritalStatusId = response[0].maritalStatusId;
          // this.tercero.expeditionDate = response[0].expeditionDate;
          this.tercero.mobilityRestriction = response[0].mobilityRestriction;
          //valida que un tercero sea de tipo conductor con estado civil que no sea NA
          if(this.tercero.maritalStatusId!=4){
            this.tercero.transitAgency = response[0].transitAgency;
            //console.log(this.tercero.maritalStatusId);
            this.tercero.urlImage = response[0].urlImage;
            this.terceroImg = this.tercero.urlImage;
            var bd=response[0].birthDate;
            var today = new Date();
            var birthDate=new Date(bd);
            var bD=bd.split('-');
            this.terceroExp.birthDate = {year: parseInt(bD[0]), month: parseInt(bD[1]), day: parseInt(bD[2])};
            var expDate = response[0].expeditionDate
            var expD=expDate.split('-');
            this.terceroExp.expeditionDate = {year: parseInt(expD[0]), month: parseInt(expD[1]), day: parseInt(expD[2])};
            var years=this.diff_years(today, birthDate);
            (<HTMLInputElement>document.getElementById('inputyears')).value=years+ " años";
            for(var i=0;i<this.tiposRH.length;i++){
               if(this.tiposRH[i]['description']==this.tercero.rh){
                  this.terceroExp.rhType=this.tiposRH[i]['id'];
               }
            }
          }else{
                this.tercero.expeditionDate = null;
                this.tercero.birthDate = null;
                this.tercero.transitAgency = 1;
          }
          console.log('TERCERO', this.tercero);
        }
    });
  }

  obtenerAgenciasTransito(): void{
      this.vehiculoService.obtenerAgenciasTransito().then(response => {
        
        console.log("agencias de transito : ", response);
        response.map((i) => { 
          i.description = i.fields.Description;
          return i; 
        });  
        this.agenciasTransito = response;
        });
  }  

  obtenerServiciosTercero(thirdId): void{
    this.terceroService.obtenerServiciosTercero(thirdId)
      .then(response =>{
        if (response) {
            for(var i=0;i<response.length;i++){
              this.selectedItems.push({id:response[i].serviceId,itemName:response[i].serviceName});
            }
        }
    });
  }
  obtenerSurcursalesTercero(): void {
    this.terceroService.obtenerSurcursalesTercero(this.terceroId)
      .then(response =>{
        if (response) {
          this.surcursalesTercero=response;
        }
    });
  }
  obtenerDepartamento(idCiudad): void {
   this.terceroExp.deparment1 ="";
   if(idCiudad!=null){
      this.empresaService.obtenerDepatamentoPorCiudad(idCiudad)
        .then(response =>{
          if (response) {
             this.terceroExp.deparment1=response[0].departmentName;
          }
      });
   }
  }
  obtenerDep(idCiudad): void{
    this.surcursalTercero.deparment ="";
    if(idCiudad!=null){
      this.empresaService.obtenerDepatamentoPorCiudad(idCiudad)
        .then(response =>{
          if (response) {
             this.surcursalTercero.deparment=response[0].departmentName;
             this.surcursalTercero.departmentId=response[0].departmentId;
          }
      });
    }
  }
  obtenerCuentaBancaria(thirdId): void {
    this.terceroService.obtenerCuentaBancaria(thirdId)
      .then(response =>{
        if (response) {
          console.log('cuenta bancaria:', response);
          if(response.length==1){
           this.terceroAccount.id=response[0].id;
           this.terceroAccount.bank=response[0].bank;
           this.terceroAccount.accountNumber=response[0].accountNumber;
           this.terceroAccount.accountName=response[0].accountName;
           this.terceroAccount.accountTypeId=response[0].accountTypeId;
         }
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
      response.map((i) => { i.cityName = i.fields.Description; return i; });
      this.ciudades = response;
      this.ciudadesBuffer = this.ciudades.slice(0, this.bufferSize);
      this.lugarDocumento = response;
      this.lugarDocumentoBuffer = this.lugarDocumento.slice(0, this.bufferSize);
      this.ciudadesSurcursal = response;
      this.ciudadesSurcursalBuffer = this.ciudadesSurcursal.slice(0, this.bufferSize);
    });
  }

  obtenerCategoriasLicencia(): void{
      this.terceroService.obtenerCategoriasLicencia().then(response => {
        response.map((i) => { 
          i.description = i.code;
          return i; 
        });  
        this.categoriasLicencia = response;
      });
  }  

  obtenerLicenciaId(idLicense): void{
    console.log('idLicense idLicense idLicense idLicense idLicense idLicense : ', idLicense)
    this.terceroService.obtenerLicenciaId(idLicense).then(response => {
      this.licencia = response;
      
    });
  }

  

  fetchMoreCiudad() {
        const len = this.ciudadesBuffer.length;
        const more = this.ciudades.slice(len, this.bufferSize + len);
        this.loading1 = true;
        // using timeout here to simulate backend API delay
        setTimeout(() => {
            this.loading1 = false;
            this.ciudadesBuffer = this.ciudadesBuffer.concat(more);
        }, 200)
  }
  fetchMoreLugarDocumento() {
        const len = this.lugarDocumentoBuffer.length;
        const more = this.lugarDocumento.slice(len, this.bufferSize + len);
        this.loading2 = true;
        // using timeout here to simulate backend API delay
        setTimeout(() => {
            this.loading2 = false;
            this.lugarDocumentoBuffer = this.lugarDocumentoBuffer.concat(more);
        }, 200)
  }
  fetchMoreCiudadSurcursal() {
        const len = this.ciudadesSurcursalBuffer.length;
        const more = this.ciudadesSurcursal.slice(len, this.bufferSize + len);
        this.loading3 = true;
        // using timeout here to simulate backend API delay
        setTimeout(() => {
            this.loading3 = false;
            this.ciudadesSurcursalBuffer = this.ciudadesSurcursalBuffer.concat(more);
        }, 200)
  }
  obtenerBarriosCiudad(idCiudad): void {
    this.barrios =[];
    this.tercero.districtId = null;
    this.terceroExp.deparment2 ="";
    if(idCiudad!=null){
      this.empresaService.obtenerBarriosPorCiudad(idCiudad)
        .then(response =>{
          if (response) {
             this.barrios=response;
             //this.tercero.districtId = response[0].id;
          }
      });
      this.empresaService.obtenerDepatamentoPorCiudad(idCiudad)
        .then(response =>{
          if (response) {
             this.terceroExp.deparment2=response[0].departmentName;
          }
      });
    }
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
           this.terceroExp.deparment2=response[0].departmentName;
        }
    });
  }
  openModal(content,i) {
    // licenses
   if(i>-1){      
     var id=this.cuentasTercero[i].id;
     this.terceroService.obtenerCuentaBancariaPorID(id).then(response => {
       this.cuentaTercero = {};
       this.cuentaTercero.thirdId = this.terceroId;
       this.cuentaTercero.id=response[0].id;
       this.cuentaTercero.bank=response[0].bank;
       this.cuentaTercero.accountNumber=response[0].accountNumber;
       this.cuentaTercero.accountName=response[0].accountName;
       this.cuentaTercero.accountTypeId=response[0].accountTypeId;
     });
   }else{
     this.cuentaTercero = {};
     this.cuentaTercero.thirdId = this.terceroId;
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
      var id=this.contactosTercero[i].id;
      this.terceroService.obtenerContacto(id).then(response => {
        this.contactoTercero= {};
        this.contactoTercero.thirdId=this.terceroId;
        this.contactoTercero.id=response[0].id;
        this.contactoTercero.occupation=response[0].occupation;
        this.contactoTercero.workplace=response[0].workplace;
        this.contactoTercero.workphone=response[0].workphone;
        this.contactoTercero.name=response[0].name;
        this.contactoTercero.phone=response[0].phone;
        this.contactoTercero.cellphone=response[0].cellphone;
        this.contactoTercero.optionalphone=response[0].optionalphone;
        this.contactoTercero.email=response[0].email;
        this.contactoTercero.address=response[0].address;
        this.contactoTercero.relationship=response[0].relationship;
        this.contactoTercero.idTypeReference=response[0].idTypeReference;
      });
    }else{
      this.contactoTercero= {};
      this.contactoTercero.thirdId=this.terceroId;
    }
     const modalRef = this.modalService.open(content, {backdrop: 'static', size: 'lg'});

     modalRef.result.then(value => {
       console.log('component.abrirDialogoCrearCuenta.modalRef.result.then', value);

     }).catch(reason => {
         console.log('component.abrirDialogoCrearCuenta.modalRef.result.catch', reason);
     });
  }
  crearActualizarContacto(): void{
    if(this.terceroId!=-1){
     this.terceroService.crearActualizarContacto(this.contactoTercero)
       .then(response =>{
         if (response) {
           if (response.estado == 'EXITO') {
             this.obtenerContactosTercero();
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
  obtenerContactosTercero(): void{
    /*this.route.paramMap
      .switchMap((params: ParamMap) => this.terceroService.obtenerContactosTercero(params.get('idTercero')))
      .subscribe(response => {
        if(response){
          this.contactosTercero=response;
        }
      });*/
      this.terceroService.obtenerContactosTercero(this.terceroId)
        .then(response =>{
          if (response) {
             this.contactosTercero=response;
          }
      });
  }
  borrarContacto(index){
    var id=this.contactosTercero[index].id;
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
                    that.contactosTercero.splice(index, 1);
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
    var id=this.surcursalesTercero[index].id;
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
                    that.surcursalesTercero.splice(index, 1);
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
  back(){
    //Valida que por lo menos haya una surcursal guardada para un tercero que no sea exclusivamente de tipo conductor al darle atras
    if(this.surcursalesTercero.length==0&&this.hideThirdBranchContent==false){
      swal({
        title: 'Debe por lo menos agregar una surcursal.',
        text: '',
        type: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#ff5370',
        confirmButtonText: 'Ok',
      }).then(function (s) {

      });
    }else{
      this.router.navigate(['/home/dr/terceros']);
    }
  }
  diff_years(datenew, dateold) {
    var ynew = datenew.getFullYear();
    var mnew = datenew.getMonth();
    var dnew = datenew.getDate();
    var yold = dateold.getFullYear();
    var mold = dateold.getMonth();
    var dold = dateold.getDate();
    var diff = ynew - yold;
    if (mold > mnew) diff--;
    else {
        if (mold == mnew) {
            if (dold > dnew) diff--;
        }
    }
    return diff;
  }
  onKey(){
    console.log("this.conductor.birthDate : on key ", this.tercero.birthDate);
    this.calculateYears(this.terceroExp.birthDate);
  }
  onChange(dt:any){
    //console.log("this.conductor.birthDate : onChange ", this.conductor.birthDate);
    this.calculateYears(this.terceroExp.birthDate);
  }
  /*onChangeDiscount(d){
   this.tercero.discount = d;
   if(this.tercero.discount>=0&&this.tercero.discount<=100){
      this.isValidDiscount = true;
   }else{
     this.isValidDiscount = false;
   }
 }*/
  calculateYears(birthDate){
    if(birthDate.year!==undefined&&birthDate.month!==undefined&&birthDate.day!==undefined){
      var yyyy=birthDate.year;
      var mm=birthDate.month;
      var dd=birthDate.day;
      if(mm<10){
        mm="0"+mm;
      }
      if(dd<10){
        dd="0"+dd;
      }
      var bd=yyyy+"-"+mm+"-"+dd;
      var b=this.isValidDate(bd);
      //console.log(b);
      if(b){
        var today = new Date();
        var birthdate=new Date(bd);
        var years=this.diff_years(today, birthdate);
        console.log(years);
        (<HTMLInputElement>document.getElementById('inputyears')).value = years+ " años";
      }
    }
  }
  isValidDate(dateString) {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if(!dateString.match(regEx)) return false;  // Invalid format
    var d = new Date(dateString);
    if(!d.getTime() && d.getTime() !== 0) return false; // Invalid date
    return d.toISOString().slice(0,10) === dateString;
  }
  isValidDate_1(dateString) {
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
  handleFileInput(files:FileList){
    console.log(this.tercero.urlImage);
    if(this.tercero.urlImage=="assets/images/social/profile.jpg"){
       this.fileToUpload = files.item(0);
       this.imgName=this.fileToUpload.name;
       let that = this;
        const bucket = new S3(
        {
          accessKeyId: this.accessKey,
          secretAccessKey: this.secretKey,
          region: 'us-west-2'
        }
      );
      const params = {
        Bucket: this.bucketName,
        Key: this.FOLDER+this.fileToUpload.name,
        Body: this.fileToUpload
      };

      bucket.upload(params, function (err, data) {
        if (err) {
          console.log('There was an error uploading your file: ', err);
          return false;
        }
        console.log('Successfully uploaded file.', data);
        that.tercero.urlImage="https://upload.s3-us-west-2.amazonaws.com/drivers/"+that.imgName;
        that.terceroImg = "https://upload.s3-us-west-2.amazonaws.com/drivers/"+that.imgName;
        //console.log("imagen conductor:"+that.conductorImg);
        return true;
      });
    }else{
      var url =this.tercero.urlImage;
      var fileName= url.replace(/^.*[\\\/]/, '');
      this.fileToUpload = files.item(0);
      this.imgName=this.fileToUpload.name;
      let that = this;
      const params = {
       Bucket: this.bucketName,
       Key: this.FOLDER+fileName
     };
     const bucket = new S3(
       {
         accessKeyId: this.accessKey,
         secretAccessKey: this.secretKey,
         region: 'us-west-2'
       }
     );
     const params1 = {
       Bucket: this.bucketName,
       Key: this.FOLDER+this.fileToUpload.name,
       Body: this.fileToUpload
     };

     bucket.deleteObject(params, function (err, data) {
         if (err) {
           console.log('There was an error deleting your file: ', err.message);
           return false;
         }

         console.log('Successfully deleted file.');
         return true;

     });
     bucket.upload(params1, function (err, data) {
       if (err) {
         console.log('There was an error uploading your file: ', err);
         return false;
       }
       console.log('Successfully uploaded file.', data);
       that.tercero.urlImage="https://upload.s3-us-west-2.amazonaws.com/drivers/"+that.imgName;
       that.terceroImg = "https://upload.s3-us-west-2.amazonaws.com/drivers/"+that.imgName;
       return true;
     });
    }
  }
  removeImage(){
   let that = this;
   if(this.tercero.urlImage!="assets/images/social/profile.jpg"){
      var url =this.tercero.urlImage;
      var fileName= url.replace(/^.*[\\\/]/, '');
      //alert(fileName);
      const params = {
       Bucket: this.bucketName,
       Key: this.FOLDER+fileName
     };
     const bucket = new S3(
       {
         accessKeyId: this.accessKey,
         secretAccessKey: this.secretKey,
         region: 'us-west-2'
       }
     );

     bucket.deleteObject(params, function (err, data) {
         if (err) {
           console.log('There was an error deleting your file: ', err.message);
           return;
         }
         console.log('Successfully deleted file.');
         if(that.tercero.urlImage!="assets/images/social/profile.jpg"){
            that.tercero.urlImage = "assets/images/social/profile.jpg";
            that.terceroImg = "assets/images/social/profile.jpg";
         }
     });
   }
  }
  crearActualizarCuenta(): void {
    this.terceroService.crearActualizarCuenta(this.cuentaTercero)
    .then(response =>{
      if (response) {
        console.log('response : ', response);
        if (response.estado == 'EXITO') {
          this.obtenerCuentasTercero(this.terceroId);
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
  obtenerCuentasTercero(thirdId): void{
    this.terceroService.obtenerCuentaBancaria(thirdId)
      .then(response =>{
        if (response) {
           this.cuentasTercero=response;
        }
    });
  }
  borrarCuenta(index){
    var id=this.cuentasTercero[index].id;
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
                    that.cuentasTercero.splice(index, 1);
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
  onItemSelect(item:any){
    //console.log(item.id);
    if(item.id==2){
       this.tercero.roleId = 8;
    }
    if(item.id==4){
       this.tercero.roleId = 5;
    }
  }
  onItemDeSelect(item:any){
   //console.log(item.id);
   if(item.id==2){
      if(this.isDriver){
        this.tercero.roleId = 7;
      }else{
        this.tercero.roleId = 10;
      }
   }
   if(item.id==4){
      if(this.isDriver){
        this.tercero.roleId = 7;
      }else{
        this.tercero.roleId = 10;
      }
   }
  }
  //función para formatear el valor de la quota a valor dinero
  format_(){
    var num = this.terceroExp.quota.replace(/\,/g,'');
    if(!isNaN(num)){
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\,?)(\d{3})/g,'$1,');
        num = num.split('').reverse().join('').replace(/^[\,]/,'');
        this.terceroExp.quota = num;
    }else{
        //this.empresa.InsuranceValue = this.empresa.InsuranceValue.replace(/[^\d\.]*/g,'');
    }
  }
  replaceAll(str, term, replacement) {
     return str.replace(new RegExp(this.escapeRegExp(term), 'g'), replacement);
  }
  escapeRegExp(string){
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  crearActualizarTercero(): void {
    //realiza la conversión de la variable auxiliar terceroExp el valor de la couta y se asigna a tercero.quota
    var quota = String(this.terceroExp.quota);
    quota = this.replaceAll(quota, ',', '');
    this.tercero.quota = quota;
    if(this.nSeletedItems!=0){
        if(this.terceroId>-1){
          if(this.tercero.phone1!=this.auxPhone){
            this.terceroService.existeCelular(this.tercero.phone1)
              .then(response =>{
                if (response) {
                  if (response.estado == 'EXITO') {
                   if(response.b==1){
                     swal({
                       title: response.mensaje,
                       text: '',
                       type: 'warning'
                      }).catch(swal.noop);
                   }else if(response.b==0){
                      if(this.tercero.identification!=this.auxIdentification){
                         this.terceroService.existeIdentificacion(this.tercero.identification)
                           .then(response =>{
                             if (response) {
                               if (response.estado == 'EXITO') {
                                if(response.b==1){
                                  swal({
                                    title: response.mensaje,
                                    text: '',
                                    type: 'warning'
                                   }).catch(swal.noop);
                                }else if(response.b==0){
                                  //valida que un tercero sea de tipo conductor con estado civil que no sea NA
                                  if(this.tercero.maritalStatusId!=4){
                                    var fecha=this.parserFormatter.format(this.terceroExp.birthDate);
                                    this.tercero.birthDate = fecha;
                                    console.log("Fecha 2:" +fecha);
                                      //realiza la conversión de la variable auxiliar terceroExp el valor de la fecha y se asigna a tercero.expeditionDate
                                    var fecha2=this.parserFormatter.format(this.terceroExp.expeditionDate);
                                    this.tercero.expeditionDate = fecha2;

                                    for(var i=0;i<this.tiposRH.length;i++){
                                       //console.log(this.terceroExp.rhType);
                                       //console.log(this.tiposRH[i]['id']);
                                       if(this.terceroExp.rhType==this.tiposRH[i]['id']){
                                          this.tercero.rh=this.tiposRH[i]['description'];
                                       }
                                    }
                                  }else{
                                    //Asigna por defecto un valor a estas variables cuando el tercero es distinto a un conductor
                                    this.tercero.birthDate = null;
                                    this.tercero.expeditionDate = null;
                                    this.tercero.transitAgency = 1;
                                  }
                                  console.log(this.tercero);
                                  this.terceroService.crearActualizarTercero(this.tercero)
                                    .then(response =>{
                                      if (response) {
                                        if (response.estado == 'EXITO') {
                                          this.auxPhone = this.tercero.phone1;
                                          this.auxIdentification = this.tercero.identification;
                                          this.terceroService.borrarServiciosTercero(this.terceroId).then(resp => {
                                              if (resp){
                                                //if(resp.estado == 'EXITO'){
                                                  for(var i=0;i<this.selectedItems.length;i++){
                                                    var serviceId=this.selectedItems[i].id;
                                                    this.terceroService.crearServicioTercero(this.terceroId,serviceId)
                                                      .then(s =>{
                                                      });
                                                  }
                                                //}
                                              }
                                          });
                                          this.terceroService.borrarTiposTercero(this.terceroId).then(resp => {
                                             console.log(resp);
                                              if (resp){
                                                //if(resp.estado == 'EXITO'){
                                                  for(var i=0;i<this.selectedItemList.length;i++){
                                                    var thirdTypeId=this.selectedItemList[i]._id;
                                                    this.terceroService.crearTiposTercero(this.terceroId,thirdTypeId)
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
                                }
                              }
                            }
                           });
                        }else{
                          //valida que un tercero sea de tipo conductor con estado civil que no sea NA
                          if(this.tercero.maritalStatusId!=4){
                            var fecha=this.parserFormatter.format(this.terceroExp.birthDate);
                            this.tercero.birthDate = fecha;
                            var fecha2=this.parserFormatter.format(this.terceroExp.expeditionDate);
                            this.tercero.expeditionDate = fecha2;
                            for(var i=0;i<this.tiposRH.length;i++){
                               //console.log(this.terceroExp.rhType);
                               //console.log(this.tiposRH[i]['id']);
                               if(this.terceroExp.rhType==this.tiposRH[i]['id']){
                                  this.tercero.rh=this.tiposRH[i]['description'];
                               }
                            }
                          }else{
                            this.tercero.birthDate = null;
                            this.tercero.expeditionDate = null;
                            this.tercero.transitAgency = 1;
                          }
                          this.terceroService.crearActualizarTercero(this.tercero)
                            .then(response =>{
                              if (response) {
                                if (response.estado == 'EXITO') {
                                  this.auxPhone = this.tercero.phone1;
                                  this.auxIdentification = this.tercero.identification;
                                  this.terceroService.borrarServiciosTercero(this.terceroId).then(resp => {
                                     console.log(resp);
                                      if (resp){
                                        //if(resp.estado == 'EXITO'){
                                          for(var i=0;i<this.selectedItems.length;i++){
                                            var serviceId=this.selectedItems[i].id;
                                            this.terceroService.crearServicioTercero(this.terceroId,serviceId)
                                              .then(s =>{
                                              });
                                          }
                                        //}
                                      }
                                  });
                                  this.terceroService.borrarTiposTercero(this.terceroId).then(resp => {
                                     console.log(resp);
                                      if (resp){
                                        //if(resp.estado == 'EXITO'){
                                          for(var i=0;i<this.selectedItemList.length;i++){
                                            var thirdTypeId=this.selectedItemList[i]._id;
                                            this.terceroService.crearTiposTercero(this.terceroId,thirdTypeId)
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
                        }
                      }
                    }
                  }
              });
          }else{
            if(this.tercero.identification!=this.auxIdentification){
              this.terceroService.existeIdentificacion(this.tercero.identification)
                .then(response =>{
                  if (response) {
                    if (response.estado == 'EXITO') {
                     if(response.b==1){
                       swal({
                         title: response.mensaje,
                         text: '',
                         type: 'warning'
                        }).catch(swal.noop);
                     }else if(response.b==0){
                       //valida que un tercero sea de tipo conductor con estado civil que no sea NA
                       if(this.tercero.maritalStatusId!=4){
                         var fecha=this.parserFormatter.format(this.terceroExp.birthDate);
                         this.tercero.birthDate = fecha;
                         var fecha2=this.parserFormatter.format(this.terceroExp.expeditionDate);
                         this.tercero.expeditionDate = fecha2;
                         for(var i=0;i<this.tiposRH.length;i++){
                            //console.log(this.terceroExp.rhType);
                            //console.log(this.tiposRH[i]['id']);
                            if(this.terceroExp.rhType==this.tiposRH[i]['id']){
                               this.tercero.rh=this.tiposRH[i]['description'];
                            }
                         }
                       }else{
                         this.tercero.birthDate = null;
                         this.tercero.expeditionDate = null;
                         this.tercero.transitAgency = 1;
                       }
                       console.log(this.tercero);
                       this.terceroService.crearActualizarTercero(this.tercero)
                         .then(response =>{
                           console.log('tercero.component.crearActualizarTercero.response: ', response);
                           if (response) {
                             console.log('response : ', response)
                             if (response.estado == 'EXITO') {
                               this.auxPhone = this.tercero.phone1;
                               this.auxIdentification = this.tercero.identification;
                               this.terceroService.borrarServiciosTercero(this.terceroId).then(resp => {
                                  console.log(resp);
                                   if (resp){
                                     //if(resp.estado == 'EXITO'){
                                       for(var i=0;i<this.selectedItems.length;i++){
                                         var serviceId=this.selectedItems[i].id;
                                         this.terceroService.crearServicioTercero(this.terceroId,serviceId)
                                           .then(s =>{
                                           });
                                       }
                                     //}
                                   }
                               });
                               this.terceroService.borrarTiposTercero(this.terceroId).then(resp => {
                                  console.log(resp);
                                   if (resp){
                                     //if(resp.estado == 'EXITO'){
                                       for(var i=0;i<this.selectedItemList.length;i++){
                                         var thirdTypeId=this.selectedItemList[i]._id;
                                         this.terceroService.crearTiposTercero(this.terceroId,thirdTypeId)
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
                     }
                   }
                  }
                 });

            }else{
              //valida que un tercero sea de tipo conductor con estado civil que no sea NA
              if(this.tercero.maritalStatusId!=4){
                var fecha=this.parserFormatter.format(this.terceroExp.birthDate);
                this.tercero.birthDate = fecha;
                var fecha2=this.parserFormatter.format(this.terceroExp.expeditionDate);
                this.tercero.expeditionDate = fecha2;
                for(var i=0;i<this.tiposRH.length;i++){
                   //console.log(this.terceroExp.rhType);
                   //console.log(this.tiposRH[i]['id']);
                   if(this.terceroExp.rhType==this.tiposRH[i]['id']){
                      this.tercero.rh=this.tiposRH[i]['description'];
                   }
                }
              }else{
                this.tercero.birthDate = null;
                this.tercero.expeditionDate = null;
                this.tercero.transitAgency = 1;
              }

              console.log(this.tercero);
              this.terceroService.crearActualizarTercero(this.tercero)
                .then(response =>{
                  console.log('tercero.component.crearActualizarTercero.response: ', response);
                  if (response) {
                    console.log('response : ', response)
                    if (response.estado == 'EXITO') {
                      this.auxPhone = this.tercero.phone1;
                      this.auxIdentification = this.tercero.identification;
                      this.terceroService.borrarServiciosTercero(this.terceroId).then(resp => {
                         console.log(resp);
                          if (resp){
                            //if(resp.estado == 'EXITO'){
                              for(var i=0;i<this.selectedItems.length;i++){
                                var serviceId=this.selectedItems[i].id;
                                this.terceroService.crearServicioTercero(this.terceroId,serviceId)
                                  .then(s =>{
                                  });
                              }
                            //}
                          }
                      });
                      this.terceroService.borrarTiposTercero(this.terceroId).then(resp => {
                         console.log(resp);
                          if (resp){
                            //if(resp.estado == 'EXITO'){
                              for(var i=0;i<this.selectedItemList.length;i++){
                                var thirdTypeId=this.selectedItemList[i]._id;
                                this.terceroService.crearTiposTercero(this.terceroId,thirdTypeId)
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
              }
          }

        }else{
          this.terceroService.existeCelular(this.tercero.phone1)
            .then(response =>{
              if (response) {
                if (response.estado == 'EXITO') {
                 if(response.b==1){
                   swal({
                     title: response.mensaje,
                     text: '',
                     type: 'warning'
                    }).catch(swal.noop);
                 }else if(response.b==0){

                   this.terceroService.existeIdentificacion(this.tercero.identification)
                     .then(response =>{
                       if (response) {
                         if (response.estado == 'EXITO') {
                          if(response.b==1){
                            swal({
                              title: response.mensaje,
                              text: '',
                              type: 'warning'
                             }).catch(swal.noop);
                          }else if(response.b==0){

                            //valida que un tercero sea de tipo conductor con estado civil que no sea NA
                            if(this.tercero.maritalStatusId!=4){
                              var fecha=this.parserFormatter.format(this.terceroExp.birthDate);
                              this.tercero.birthDate = fecha;
                              var fecha2=this.parserFormatter.format(this.terceroExp.expeditionDate);
                              this.tercero.expeditionDate = fecha2;
                              for(var i=0;i<this.tiposRH.length;i++){
                                 //console.log(this.terceroExp.rhType);
                                 //console.log(this.tiposRH[i]['id']);
                                 if(this.terceroExp.rhType==this.tiposRH[i]['id']){
                                    this.tercero.rh=this.tiposRH[i]['description'];
                                 }
                              }
                            }else{
                              this.tercero.birthDate = null;
                              this.tercero.expeditionDate = null;
                              this.tercero.transitAgency = 1;
                            }
                            var validateId = 0
                            if (this.terceroId == -2){
                              validateId = 1
                            }
                            else if (this.terceroId == -3){
                              validateId = 2
                            }
                            this.terceroService.crearActualizarTercero(this.tercero)
                              .then(response =>{
                                //console.log('tercero.component.crearActualizarTercero.response: ', response);
                                if (response) {
                                  //console.log('response : ', response)
                                  if (response.estado == 'EXITO') {
                                    if (validateId == 1){
                                      this.jsonTrailer.axisNumber = this.jsonTrailer.axisNumber
                                      this.jsonTrailer.brandId = this.jsonTrailer.brandId
                                      this.jsonTrailer.brandName = this.jsonTrailer.brandName
                                      this.jsonTrailer.capacity = this.jsonTrailer.capacity
                                      this.jsonTrailer.chassisNumber = this.jsonTrailer.chassisNumber
                                      this.jsonTrailer.colorId = this.jsonTrailer.colorId
                                      this.jsonTrailer.colorName = this.jsonTrailer.colorName
                                      this.jsonTrailer.date = this.jsonTrailer.date
                                      this.jsonTrailer.height = this.jsonTrailer.height
                                      this.jsonTrailer.id = this.jsonTrailer.id
                                      this.jsonTrailer.length = this.jsonTrailer.length
                                      this.jsonTrailer.model = this.jsonTrailer.model
                                      this.jsonTrailer.plate = this.jsonTrailer.plate

                                      this.jsonTrailer.propertyName = this.jsonTrailer.propertyName
                                      this.jsonTrailer.vehicleId = this.jsonTrailer.vehicleId
                                      this.jsonTrailer.vehiclePlate = this.jsonTrailer.vehiclePlate
                                      this.jsonTrailer.vehicleType = this.jsonTrailer.vehicleType
                                      this.jsonTrailer.vehicleTypeId = this.jsonTrailer.vehicleTypeId
                                      this.jsonTrailer.volume = this.jsonTrailer.volume
                                      this.jsonTrailer.weight = this.jsonTrailer.weight
                                      this.jsonTrailer.width = this.jsonTrailer.width
                                      this.jsonTrailer.propertyIdentification = this.tercero.identification
                                      this.trailerService.newOwner(this.jsonTrailer)
                                    }
                                    else if(validateId == 2){
                                      this.jsonVehiculo.propertyIdentification = this.tercero.identification
                                      this.vehiculoService.newOwner(this.jsonVehiculo)
                                    }

                                    this.auxPhone = this.tercero.phone1;
                                    this.auxIdentification = this.tercero.identification;


                                      this.terceroId = response.thirdId;
                                      this.tercero.id = this.terceroId;

                                      this.terceroService.borrarServiciosTercero(this.terceroId).then(resp => {
                                         console.log(resp);
                                          if (resp){
                                            for(var i=0;i<this.selectedItems.length;i++){
                                              var serviceId=this.selectedItems[i].id;
                                              this.terceroService.crearServicioTercero(this.terceroId,serviceId)
                                                .then(s =>{
                                                });
                                            }
                                          }
                                      });
                                      this.terceroService.borrarTiposTercero(this.terceroId).then(resp => {
                                         console.log(resp);
                                          if (resp){
                                            //if(resp.estado == 'EXITO'){
                                              for(var i=0;i<this.selectedItemList.length;i++){
                                                var thirdTypeId=this.selectedItemList[i]._id;
                                                this.terceroService.crearTiposTercero(this.terceroId,thirdTypeId)
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

                                       this.hideThirdContactContent = false;
                                       // oculta /muestra la pestaña de surcursales si un tercero es exclusivamente de tipo conductor o no después de guardar por primera vez un tercero
                                       for(var i=0;i<this.selectedItemList.length;i++){
                                         if(this.selectedItemList[i]._id==1){
                                           this.hideThirdBranchContent = true;
                                         }else{
                                           this.hideThirdBranchContent = false;
                                         }
                                       }
                                       this.hideThirdAccountContent = false;



                                       if (validateId == 1){
                                        this.router.navigate(['/home/dr/trailer/-2']);
                                      }
                                      else if(validateId == 2){
                                        this.router.navigate(['/home/dr/vehiculo/-3']);
                                      }
                                  } else {
                                    this.alertService.error(response.mensaje);
                                  }
                                }
                              });
                          }
                        }
                      }
                     });
                    }
                  }
                }
            });
        }
      }else{
        swal({
          title: "Debe seleccionar por lo menos un tipo de tercero.",
          text: '',
          type: 'warning'
         }).catch(swal.noop);
      }
  }

}
export class NgbdTabsetOrientation {
  currentOrientation = 'horizontal';
}

export class NgbdTabsetConfig {
  constructor(config: NgbTabsetConfig) {
    // customize default values of tabsets used by this component tree
    config.justify = 'center';
    config.type = 'pills';
  }
}
