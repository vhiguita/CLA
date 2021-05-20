import { NgModule } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { VehiculoService } from '../../../services/vehiculo.service';
import { ConductorService } from '../../../services/conductor.service';
import { TerceroService } from '../../../services/tercero.service';
import { TrailerService } from '../../../services/trailer.service';
import { UsuarioService } from '../../../services/usuario.service';
import { CommonService } from '../../../services/common.service';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { Observable } from 'rxjs/Rx';
import swal from 'sweetalert2';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';

@Component({
  selector: 'app-trailer',
  templateUrl: './trailer.component.html',
  styleUrls: ['./trailer.component.css']
})
export class TrailerComponent implements OnInit {
  // globalInfoTrailer : any;
  brands: any= {};
  FOLDER = 'trailers/';
  accessKey ='AKIAJBSEKUWJ6JUFUTIA';
  secretKey ='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';
  bucketName = 'upload';
  trailer: any= {};
  trailerExp: any={};
  objTrailerImg1: any={};
  objTrailerImg2: any={};
  objTrailerImg3: any={};
  objTrailerImg4: any={};
  objLicenseImg: any={};
  propietario: any= {};
  vehiculo: any={};
  marcas: any = [];
  propietarios: any = [];
  propietariosBuffer = [];
  bufferSize = 50;
  loading = false;
  vehiculos: any = [];
  globalInfoTrailer: any = [];

  valid = 0

  dataVehiculo: any =[];
  clasesVehiculo: any = [];
  coloresVehiculo: any = [];
  tiposCarroceria: any = [];
  clasesTrailer: any = [];
  agenciasTransito: any = [];
  lineasVehiculo: any = [];
  

  trailerId: number = -1;
  searchVehicle: string;
  dataService: CompleterData;
  trailerImg1: any = null;
  trailerImg2: any = null;
  trailerImg3: any = null;
  trailerImg4: any = null;
  licenseImg: any = null;
  fileToUpload: File = null;
  imgName= '';
  visibleTrailerPhotoContent: boolean = false;
  btnIsVisible: boolean = false;
  infoTrailer : any;
  constructor(
    public parserFormatter: NgbDateParserFormatter,
    private route: ActivatedRoute,
    private router: Router,
    private completerService: CompleterService,
    private vehiculoService: VehiculoService,
    private conductorService: ConductorService,
    private terceroService: TerceroService,
    private trailerService: TrailerService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private usuarioService: UsuarioService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.moduloEsLecturaEscritura(9);
    this.trailerId = this.route.snapshot.params.idTrailer;
    this.trailerImg1 = "assets/images/social/default.jpg";
    this.trailerImg2 = "assets/images/social/default.jpg";
    this.trailerImg3 = "assets/images/social/default.jpg";
    this.trailerImg4 = "assets/images/social/default.jpg";
    this.licenseImg = "assets/images/social/default.jpg";
    this.objTrailerImg1.urlImage = "assets/images/social/default.jpg";
    this.objTrailerImg2.urlImage = "assets/images/social/default.jpg";
    this.objTrailerImg3.urlImage = "assets/images/social/default.jpg";
    this.objTrailerImg4.urlImage = "assets/images/social/default.jpg";
    this.objLicenseImg.urlImage = "assets/images/social/default.jpg";

    if(this.valid == 1){
      this.globalInfoTrailer = []
    }
    else {
      this.globalInfoTrailer = this.trailerService.globalInfoTrailerFun()
    }


    if(this.trailerId == -2){
      this.trailer.expeditionDate  = this.globalInfoTrailer.expeditionDate
      this.trailer.registrationDate  = this.globalInfoTrailer.registrationDate
      this.trailer.expirationDate = this.globalInfoTrailer.expirationDate
      this.trailer.releaseDate = this.globalInfoTrailer.releaseDate
      this.trailer.id = this.globalInfoTrailer.id
      this.trailer.plate = this.globalInfoTrailer.plate
      this.trailer.model = this.globalInfoTrailer.model
      this.trailer.propertyIdentification = this.globalInfoTrailer.propertyIdentification      
      this.trailer.brandId = this.globalInfoTrailer.brandId          
      this.trailer.vehicleId = this.globalInfoTrailer.vehicleId
      this.trailer.chassisNumber = this.globalInfoTrailer.chassisNumber
      this.trailer.axisNumber = this.globalInfoTrailer.axisNumber
      this.trailer.weight = this.globalInfoTrailer.weight
      this.trailer.capacity = this.globalInfoTrailer.capacity
      this.trailer.width = this.globalInfoTrailer.width
      this.trailer.height = this.globalInfoTrailer.height
      this.trailer.length = this.globalInfoTrailer.length
      this.trailer.bodyWorkType = this.globalInfoTrailer.bodyWorkType
      this.trailer.bodyWork_id = this.globalInfoTrailer.bodyWork_id
      this.trailer.brandName = this.globalInfoTrailer.brandName
      this.trailer.company_id = this.globalInfoTrailer.company_id 
      this.trailer.importDeclaration = this.globalInfoTrailer.importDeclaration
      this.trailer.propertyLimitations = this.globalInfoTrailer.propertyLimitations
      this.trailer.propertyName = this.globalInfoTrailer.propertyName
      this.trailer.tenantIdentification = this.globalInfoTrailer.tenantIdentification
      this.trailer.tireNumber = this.globalInfoTrailer.tireNumber
      this.trailer.trailerClass_id = this.globalInfoTrailer.trailerClass_id
      this.trailer.transitAgency = this.globalInfoTrailer.transitAgency
      this.trailer.trilerLine = this.globalInfoTrailer.trilerLine
      this.trailer.vehicleId = this.globalInfoTrailer.vehicleId
      this.trailer.vehiclePlate = this.globalInfoTrailer.vehiclePlate
      this.trailer.registerNumber = this.globalInfoTrailer.registerNumber
      this.trailer.origin = this.globalInfoTrailer.origin
    }





    //console.log('common common     : : : : : :', this.commonService.datosTrailer());
    //console.log('this.infoTrailer  : : : : : : : ', this.infoTrailer )




    this.obtenerMarcasVehiculo();
    this.obtenerClasesTrailer();
    //this.obtenerMarcasTrailer();
    this.obtenerColoresVehiculo();
    this.obtenerTiposCarroceria();
    this.obtenerAgenciasTransito();
    this.obtenerTerceros();
    this.obtenerVehiculos();
    if(this.trailerId > -1){
       this.objTrailerImg1.vehicleTrailerId=this.trailerId;
       this.objTrailerImg2.vehicleTrailerId=this.trailerId;
       this.objTrailerImg3.vehicleTrailerId=this.trailerId;
       this.objTrailerImg4.vehicleTrailerId=this.trailerId;
       this.objLicenseImg.vehicleTrailerId=this.trailerId;
       this.obtenerTrailer();
       this.obtenerImagenesTrailer();
       this.visibleTrailerPhotoContent = true;
    }else{
       this.visibleTrailerPhotoContent = false;
    }

  }

  public getTrailer(): string {
    var infoTrailer  = this.trailer
    this.globalInfoTrailer = this.trailer
    return infoTrailer
  }

  public newOwner(){
    this.infoTrailer = this.trailer
    // console.log('infoTrailer  : : : : ', this.infoTrailer)
    this.trailerService.newOwner(this.infoTrailer)
    this.router.navigate(['/home/dr/tercero/-2']);
    return this.infoTrailer
  }

  moduloEsLecturaEscritura(moduleId){
    var rolId = this.commonService.obtenerIdCodigoPerfilUsuario();
    this.usuarioService.moduloEsLecturaEscritura(rolId,moduleId).then(response => this.btnIsVisible = response);
  }
  obtenerCodigoPerfilUsuario(): string {
    return this.commonService.obtenerCodigoPerfilUsuario();
  }
  obtenerImagenesTrailer():void{
    this.trailerService.obtenerImagenesTrailer(this.trailerId)
      .then(response =>{
        if(response){
          ///console.log(response);
          for(var i=0;i<response.length;i++){
            if(response[i].imageNumber==1){
              this.objTrailerImg1.id=response[i].id;
              this.objTrailerImg1.urlImage =response[i].urlImage;
              this.objTrailerImg1.imageNumber =response[i].imageNumber;
              this.trailerImg1 = response[i].urlImage;
            }
            if(response[i].imageNumber==2){
              this.objTrailerImg2.id=response[i].id;
              this.objTrailerImg2.urlImage =response[i].urlImage;
              this.objTrailerImg2.imageNumber =response[i].imageNumber;
              this.trailerImg2 = response[i].urlImage;
            }
            if(response[i].imageNumber==3){
              this.objTrailerImg3.id=response[i].id;
              this.objTrailerImg3.urlImage =response[i].urlImage;
              this.objTrailerImg3.imageNumber =response[i].imageNumber;
              this.trailerImg3 = response[i].urlImage;
            }
            if(response[i].imageNumber==4){
              this.objTrailerImg4.id=response[i].id;
              this.objTrailerImg4.urlImage =response[i].urlImage;
              this.objTrailerImg4.imageNumber =response[i].imageNumber;
              this.trailerImg4 = response[i].urlImage;
            }
            if(response[i].imageNumber==5){
              this.objLicenseImg.id=response[i].id;
              this.objLicenseImg.urlImage =response[i].urlImage;
              this.objLicenseImg.imageNumber =response[i].imageNumber;
              this.licenseImg = response[i].urlImage;
            }
          }
        }
      });
  }
  obtenerTrailer(): void{
    this.trailerService.obtenerTrailer(this.trailerId)
      .then(response =>{
        if(response){

          var expDate = response[0].expeditionDate;
          var regDate = response[0].registrationDate;
          var expirDate = response[0].expirationDate;
          var relDate = response[0].releaseDate;
          var expD
          var regD
          var expirD
          var relD
          if (expDate){expD = expDate.split('-');}else{expD = ''}
          if (regDate){regD = regDate.split('-');}else{regD = ''}
          if (expirDate){expirD = expirDate.split('-');}else{expirD = ''}
          if (relDate){relD = relDate.split('-');}else{relD = ''}            


          this.trailer.expeditionDate = {year: parseInt(expD[0]), month: parseInt(expD[1]), day: parseInt(expD[2])};
          this.trailer.registrationDate = {year: parseInt(regD[0]), month: parseInt(regD[1]), day: parseInt(regD[2])};
          this.trailer.expirationDate = {year: parseInt(expirD[0]), month: parseInt(expirD[1]), day: parseInt(expirD[2])};
          this.trailer.releaseDate = {year: parseInt(relD[0]), month: parseInt(relD[1]), day: parseInt(relD[2])};

          this.trailer.id = response[0].id;
          this.trailer.plate = response[0].plate;
          this.trailer.model = response[0].model;
          this.trailer.propertyIdentification = response[0].propertyIdentification;      
          this.trailer.brandId = response[0].trailerBrand_id;          
          this.trailer.vehicleId = response[0].vehicleId;
          this.trailer.chassisNumber = response[0].chassisNumber;
          this.trailer.axisNumber = response[0].axisNumber;
          this.trailer.weight = response[0].weight;
          this.trailer.capacity = response[0].capacity;
          this.trailer.width = response[0].width;
          this.trailer.height = response[0].height;
          this.trailer.length = response[0].length;
          this.trailer.bodyWorkType = response[0].bodyWorkType;
          this.trailer.bodyWork_id = response[0].bodyWork_id;
          this.trailer.brandName = response[0].brandName;
          this.trailer.company_id = response[0].company_id; 
          this.trailer.importDeclaration = response[0].importDeclaration;
          this.trailer.propertyLimitations = response[0].propertyLimitations;
          this.trailer.propertyName = response[0].propertyName;
          this.trailer.tenantIdentification = response[0].tenantIdentification;
          this.trailer.tireNumber = response[0].tireNumber;
          this.trailer.trailerClass_id = response[0].trailerClass_id;
          this.trailer.transitAgency = response[0].transitAgency;
          this.trailer.trilerLine = response[0].trilerLine;
          this.trailer.vehicleId = response[0].vehicleId;
          this.trailer.vehiclePlate = response[0].vehiclePlate;
          this.trailer.registerNumber = response[0].registerNumber;
          this.trailer.origin = response[0].origin;
        }
      });
    }
 

  obtenerVehiculos(): void{
      this.vehiculoService.obtenerVehiculosTrailer().then(response => {
        
        // console.log("clases vehiculo : ", response);
        response.map((i) => { 
          i.description = i.fields.Plate;
          return i; 
        });  
        this.vehiculos = response;
        });
  }


  obtenerTerceros(): void{
    this.terceroService.obtenerTodosTerceros().then(response => {
      response.map((i) => { i.description = i.fields.Identification+" - "+i.fields.Name; return i; });
      this.propietarios = response;
      this.propietariosBuffer = this.propietarios.slice(0, this.bufferSize);
    });
  }
  fetchMore() {
        const len = this.propietariosBuffer.length;
        const more = this.propietarios.slice(len, this.bufferSize + len);
        this.loading = true;
        // using timeout here to simulate backend API delay
        setTimeout(() => {
            this.loading = false;
            this.propietariosBuffer = this.propietariosBuffer.concat(more);
        }, 200)
  }
  obtenerTiposCarroceria(): void{
      this.vehiculoService.obtenerTiposCarroceria().then(response => {
        // console.log('response carroceria : ', response)
        // console.log("clases vehiculo : ", response);
        response.map((i) => { 
          i.description = i.fields.Description;
          return i; 
        });  
        this.tiposCarroceria = response;
        console.log('this.tiposCarroceria : ', this.tiposCarroceria)
      });
  }

  obtenerClasesTrailer(): void{
      this.vehiculoService.obtenerClasesTrailer().then(response => {
        // console.log("clases vehiculo : ", response);
        response.map((i) => { 
          i.description = i.fields.Description;
          return i; 
        });  
        this.clasesTrailer = response;
        // console.log('this.tiposCarroceria : ', this.tiposCarroceria)
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
  obtenerColoresVehiculo(): void{
      this.vehiculoService.obtenerColoresVehiculo().then(response => {

        // console.log("clases vehiculo : ", response);
        response.map((i) => { 
        i.description = i.fields.Description;
        return i; 
      });
        this.coloresVehiculo = response;
      });
  }
  obtenerMarcasVehiculo(): void {
    this.vehiculoService.obtenerMarcasTrailer().then(response => {
      // console.log('response marcas : ', response)
      response.map((i) => { 
        i.description = i.fields.Description;
        i.code = i.fields.Code
        return i; 
      });      
      this.brands = response;
      // console.log("brands : ", this.brands)
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
  crearActualizarTrailer(): void {
    console.log('this.trailer : ', this.trailer)


    var expeditionDateF = this.parserFormatter.format(this.trailer.expeditionDate);
    var registrationDateF = this.parserFormatter.format(this.trailer.registrationDate);
    var expirationDateF = this.parserFormatter.format(this.trailer.expirationDate);
    var releaseDateF = this.parserFormatter.format(this.trailer.releaseDate);
    this.trailer.expeditionDate = expeditionDateF
    this.trailer.registrationDate = registrationDateF
    this.trailer.expirationDate = expirationDateF
    this.trailer.releaseDate = releaseDateF
    // console.log('this.trailer : ', this.trailer)
	  this.trailerService.crearActualizarTrailer(this.trailer)
      .then(response =>{
        if (response) {
          this.router.navigate(['/home/dr/trailers']);
          if (response.estado == 'EXITO') {
            this.trailerService.newOwner(this.infoTrailer)


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
  cargarImagen(files:FileList, i){
     if(i==1){
       if(this.objTrailerImg1.urlImage=="assets/images/social/default.jpg"){
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
             that.objTrailerImg1.urlImage="https://upload.s3-us-west-2.amazonaws.com/"+that.FOLDER+that.imgName;
             that.trailerImg1 = "https://upload.s3-us-west-2.amazonaws.com/"+that.FOLDER+that.imgName;
             that.objTrailerImg1.imageNumber=1;
             that.trailerService.crearActualizarImagenTrailer(that.objTrailerImg1).then(response =>{
               if (response) {
                 if (response.estado == 'EXITO') {
                   that.objTrailerImg1.id=response.id;
                   /*swal({
                     title: response.mensaje,
                     text: '',
                     type: 'success'
                   }).catch(swal.noop);*/
                 } else {
                   that.alertService.error(response.mensaje);
                 }
               }
             });
             return true;
           });
         }else{
           var url =this.objTrailerImg1.urlImage;
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

            that.objTrailerImg1.urlImage="https://upload.s3-us-west-2.amazonaws.com/"+that.FOLDER+that.imgName;
            that.trailerImg1 = "https://upload.s3-us-west-2.amazonaws.com/"+that.FOLDER+that.imgName;
            that.objTrailerImg1.imageNumber=1;
            that.trailerService.crearActualizarImagenTrailer(that.objTrailerImg1).then(response =>{
              if (response) {
                if (response.estado == 'EXITO') {
                  /*swal({
                    title: response.mensaje,
                    text: '',
                    type: 'success'
                  }).catch(swal.noop);*/
                } else {
                  that.alertService.error(response.mensaje);
                }
              }
            });
            return true;
          });
        }

     }else if(i==2){
       if(this.objTrailerImg2.urlImage=="assets/images/social/default.jpg"){
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
             that.objTrailerImg2.urlImage="https://upload.s3-us-west-2.amazonaws.com/"+that.FOLDER+that.imgName;
             that.trailerImg2 = "https://upload.s3-us-west-2.amazonaws.com/"+that.FOLDER+that.imgName;
             that.objTrailerImg2.imageNumber=2;
             that.trailerService.crearActualizarImagenTrailer(that.objTrailerImg2).then(response =>{
               if (response) {
                 if (response.estado == 'EXITO') {
                   that.objTrailerImg2.id=response.id;
                   /*swal({
                     title: response.mensaje,
                     text: '',
                     type: 'success'
                   }).catch(swal.noop);*/
                 } else {
                   that.alertService.error(response.mensaje);
                 }
               }
             });
             return true;
           });
         }else{
           var url =this.objTrailerImg2.urlImage;
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

            that.objTrailerImg2.urlImage="https://upload.s3-us-west-2.amazonaws.com/"+that.FOLDER+that.imgName;
            that.trailerImg2 = "https://upload.s3-us-west-2.amazonaws.com/"+that.FOLDER+that.imgName;
            that.objTrailerImg2.imageNumber=2;
            that.trailerService.crearActualizarImagenTrailer(that.objTrailerImg2).then(response =>{
              if (response) {
                if (response.estado == 'EXITO') {
                  /*swal({
                    title: response.mensaje,
                    text: '',
                    type: 'success'
                  }).catch(swal.noop);*/
                } else {
                  that.alertService.error(response.mensaje);
                }
              }
            });
            return true;
          });
        }
     }else if(i==3){
       if(this.objTrailerImg3.urlImage=="assets/images/social/default.jpg"){
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
             that.objTrailerImg3.urlImage="https://upload.s3-us-west-2.amazonaws.com/"+that.FOLDER+that.imgName;
             that.trailerImg3 = "https://upload.s3-us-west-2.amazonaws.com/"+that.FOLDER+that.imgName;
             that.objTrailerImg3.imageNumber=3;
             that.trailerService.crearActualizarImagenTrailer(that.objTrailerImg3).then(response =>{
               if (response) {
                 if (response.estado == 'EXITO') {
                   that.objTrailerImg3.id=response.id;
                   /*swal({
                     title: response.mensaje,
                     text: '',
                     type: 'success'
                   }).catch(swal.noop);*/
                 } else {
                   that.alertService.error(response.mensaje);
                 }
               }
             });
             return true;
           });
         }else{
           var url =this.objTrailerImg3.urlImage;
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

            that.objTrailerImg3.urlImage="https://upload.s3-us-west-2.amazonaws.com/"+that.FOLDER+that.imgName;
            that.trailerImg3 = "https://upload.s3-us-west-2.amazonaws.com/"+that.FOLDER+that.imgName;
            that.objTrailerImg3.imageNumber=3;
            that.trailerService.crearActualizarImagenTrailer(that.objTrailerImg3).then(response =>{
              if (response) {
                if (response.estado == 'EXITO') {
                  /*swal({
                    title: response.mensaje,
                    text: '',
                    type: 'success'
                  }).catch(swal.noop);*/
                } else {
                  that.alertService.error(response.mensaje);
                }
              }
            });
            return true;
          });
        }
     }else if(i==4){
       if(this.objTrailerImg4.urlImage=="assets/images/social/default.jpg"){
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
             that.objTrailerImg4.urlImage="https://upload.s3-us-west-2.amazonaws.com/"+that.FOLDER+that.imgName;
             that.trailerImg4 = "https://upload.s3-us-west-2.amazonaws.com/"+that.FOLDER+that.imgName;
             that.objTrailerImg4.imageNumber=4;
             that.trailerService.crearActualizarImagenTrailer(that.objTrailerImg4).then(response =>{
               if (response) {
                 if (response.estado == 'EXITO') {
                   that.objTrailerImg4.id=response.id;
                   /*swal({
                     title: response.mensaje,
                     text: '',
                     type: 'success'
                   }).catch(swal.noop);*/
                 } else {
                   that.alertService.error(response.mensaje);
                 }
               }
             });
             return true;
           });
         }else{
           var url =this.objTrailerImg4.urlImage;
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

            that.objTrailerImg4.urlImage="https://upload.s3-us-west-2.amazonaws.com/"+that.FOLDER+that.imgName;
            that.trailerImg4 = "https://upload.s3-us-west-2.amazonaws.com/"+that.FOLDER+that.imgName;
            that.objTrailerImg4.imageNumber=4;
            that.trailerService.crearActualizarImagenTrailer(that.objTrailerImg4).then(response =>{
              if (response) {
                if (response.estado == 'EXITO') {
                  /*swal({
                    title: response.mensaje,
                    text: '',
                    type: 'success'
                  }).catch(swal.noop);*/
                } else {
                  that.alertService.error(response.mensaje);
                }
              }
            });
            return true;
          });
        }
     }else if(i==5){
       if(this.objLicenseImg.urlImage=="assets/images/social/default.jpg"){
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
             that.objLicenseImg.urlImage="https://upload.s3-us-west-2.amazonaws.com/"+that.FOLDER+that.imgName;
             that.licenseImg = "https://upload.s3-us-west-2.amazonaws.com/"+that.FOLDER+that.imgName;
             that.objLicenseImg.imageNumber=5;
             that.trailerService.crearActualizarImagenTrailer(that.objLicenseImg).then(response =>{
               if (response) {
                 if (response.estado == 'EXITO') {
                   that.objLicenseImg.id=response.id;
                   /*swal({
                     title: response.mensaje,
                     text: '',
                     type: 'success'
                   }).catch(swal.noop);*/
                 } else {
                   that.alertService.error(response.mensaje);
                 }
               }
             });
             return true;
           });
         }else{
           var url =this.objLicenseImg.urlImage;
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

            that.objLicenseImg.urlImage="https://upload.s3-us-west-2.amazonaws.com/"+that.FOLDER+that.imgName;
            that.licenseImg = "https://upload.s3-us-west-2.amazonaws.com/"+that.FOLDER+that.imgName;
            that.objLicenseImg.imageNumber=5;
            that.trailerService.crearActualizarImagenTrailer(that.objLicenseImg).then(response =>{
              if (response) {
                if (response.estado == 'EXITO') {
                  /*swal({
                    title: response.mensaje,
                    text: '',
                    type: 'success'
                  }).catch(swal.noop);*/
                } else {
                  that.alertService.error(response.mensaje);
                }
              }
            });
            return true;
          });
        }
     }
  }
  eliminarImagenTrailerFrontal():void{
    let that = this;
      if(this.objTrailerImg1.urlImage!="assets/images/social/default.jpg"){
         var url =this.objTrailerImg1.urlImage;
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
            that.trailerService.borrarImagenTrailer(that.objTrailerImg1.id).then(response =>{
              if (response) {
                if (response.estado == 'EXITO') {
                  if(that.objTrailerImg1.urlImage!="assets/images/social/default.jpg"){
                     that.objTrailerImg1={};
                     that.objTrailerImg1.urlImage = "assets/images/social/default.jpg";
                     that.trailerImg1 = "assets/images/social/default.jpg";
                     that.objTrailerImg1.vehicleTrailerId=that.trailerId;
                  }
                  /*swal({
                    title: response.mensaje,
                    text: '',
                    type: 'success'
                  }).catch(swal.noop);*/
                } else {
                  that.alertService.error(response.mensaje);
                }
              }
            });

        });
      }
  }
  eliminarImagenTrailerLateralDerecho():void{
    let that = this;
      if(this.objTrailerImg2.urlImage!="assets/images/social/default.jpg"){
         var url =this.objTrailerImg2.urlImage;
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
            that.trailerService.borrarImagenTrailer(that.objTrailerImg2.id).then(response =>{
              if (response) {
                if (response.estado == 'EXITO') {
                  if(that.objTrailerImg2.urlImage!="assets/images/social/default.jpg"){
                     that.objTrailerImg2={};
                     that.objTrailerImg2.urlImage = "assets/images/social/default.jpg";
                     that.trailerImg2 = "assets/images/social/default.jpg";
                     that.objTrailerImg2.vehicleTrailerId=that.trailerId;
                  }
                  /*swal({
                    title: response.mensaje,
                    text: '',
                    type: 'success'
                  }).catch(swal.noop);*/
                } else {
                  that.alertService.error(response.mensaje);
                }
              }
            });

        });
      }
  }
  eliminarImagenTrailerLateralIzquierdo():void{
    let that = this;
      if(this.objTrailerImg3.urlImage!="assets/images/social/default.jpg"){
         var url =this.objTrailerImg3.urlImage;
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
            that.trailerService.borrarImagenTrailer(that.objTrailerImg3.id).then(response =>{
              if (response) {
                if (response.estado == 'EXITO') {
                  if(that.objTrailerImg3.urlImage!="assets/images/social/default.jpg"){
                     that.objTrailerImg3={};
                     that.objTrailerImg3.urlImage = "assets/images/social/default.jpg";
                     that.trailerImg3 = "assets/images/social/default.jpg";
                     that.objTrailerImg3.vehicleTrailerId=that.trailerId;
                  }
                  /*swal({
                    title: response.mensaje,
                    text: '',
                    type: 'success'
                  }).catch(swal.noop);*/
                } else {
                  that.alertService.error(response.mensaje);
                }
              }
            });

        });
      }
  }
  eliminarImagenTrailerTrasero():void{
    let that = this;
      if(this.objTrailerImg4.urlImage!="assets/images/social/default.jpg"){
         var url =this.objTrailerImg4.urlImage;
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
            that.trailerService.borrarImagenTrailer(that.objTrailerImg4.id).then(response =>{
              if (response) {
                if (response.estado == 'EXITO') {
                  if(that.objTrailerImg4.urlImage!="assets/images/social/default.jpg"){
                     that.objTrailerImg4 = {};
                     that.objTrailerImg4.urlImage = "assets/images/social/default.jpg";
                     that.trailerImg4 = "assets/images/social/default.jpg";
                     that.objTrailerImg4.vehicleTrailerId=that.trailerId;
                  }
                  /*swal({
                    title: response.mensaje,
                    text: '',
                    type: 'success'
                  }).catch(swal.noop);*/
                } else {
                  that.alertService.error(response.mensaje);
                }
              }
            });

        });
      }
  }
  eliminarImagenMatricula():void{
    let that = this;
      if(this.objLicenseImg.urlImage!="assets/images/social/default.jpg"){
         var url =this.objLicenseImg.urlImage;
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
            that.trailerService.borrarImagenTrailer(that.objLicenseImg.id).then(response =>{
              if (response) {
                if (response.estado == 'EXITO') {
                  if(that.objLicenseImg.urlImage!="assets/images/social/default.jpg"){
                     that.objLicenseImg={};
                     that.objLicenseImg.urlImage = "assets/images/social/default.jpg";
                     that.licenseImg = "assets/images/social/default.jpg";
                     that.objLicenseImg.vehicleTrailerId=that.trailerId;
                  }
                  /*swal({
                    title: response.mensaje,
                    text: '',
                    type: 'success'
                  }).catch(swal.noop);*/
                } else {
                  that.alertService.error(response.mensaje);
                }
              }
            });
        });
      }
  }

}
