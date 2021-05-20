import { NgModule } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {animate, style, transition, trigger} from '@angular/animations';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbTabsetConfig, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {AlertService} from '../../../services/alert.service';
import {ConductorService} from '../../../services/conductor.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.component.html',
  styleUrls: ['./conductor.component.css'],
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
export class ConductorComponent implements OnInit {
  //conductor: any = {accounttype: {id: ''}, maritalstatus: {id: ''}};
  conductor: any= {};
  //referencia: any = {tipo: {id: ''} };
  conductorExp: any = {};
  referencia: any = {};
  referencias: any []=[];
  tiposCuenta: any = [];
  estadosCivil: any = [];
  tipos: any = [];
  idReferencia: number = -1;
  driverId: number = -1;
  isSubmitted_1: any = false;
  isSubmitted_2: any = false;
  @ViewChild('contentDialogoCrearModificarReferencia') dialogoCrearModificarReferencia: HTMLElement;
  constructor(
    public parserFormatter: NgbDateParserFormatter,
    private route: ActivatedRoute,
    private router: Router,
    private conductorService: ConductorService,
    private alertService: AlertService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.driverId=this.route.snapshot.params.idConductor;
    this.obtenerEstadosCiviles();
    this.obtenerTiposCuentas();
    this.obtenerTiposReferencia();
    this.obtenerConductor();
    this.obtenerReferenciasConductor();
    this.conductor.phone3=" ";
  }
  obtenerEstadosCiviles(): void {
    this.conductorService.obtenerEstadosCiviles().then(response => {
      //console.log(response);
      this.estadosCivil = response;
    });
  }
  obtenerTiposCuentas(): void {
    this.conductorService.obtenerTiposCuentas().then(response => {
      //console.log(response);
      this.tiposCuenta = response;
    });
  }
  obtenerTiposReferencia(): void {
    this.conductorService.obtenerTiposReferencia().then(response => {
      //console.log(response);
      this.tipos = response;
    });
  }
  obtenerReferenciasConductor(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.conductorService.obtenerReferenciasConductor(params.get('idConductor')))
      .subscribe(response => {
        if(response){
          //console.log(response);
          this.referencias=response;
        }
      });
  }
  obtenerConductor(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.conductorService.obtenerConductor(params.get('idConductor')))
      .subscribe(response => {
        if (response) {
          this.conductor.id=response[0].id;
          this.conductor.identification=response[0].identification;
          this.conductor.identificationPlace=response[0].identificationPlace;
          this.conductor.name=response[0].name;
          this.conductor.firstLastName=response[0].firstLastName;
          this.conductor.secondLastName=response[0].secondLastName;
          //this.conductor.birthDate=response[0].birthDate;
          this.conductor.birthPlace=response[0].birthPlace;
          this.conductor.homeAddress=response[0].homeAddress;
          this.conductor.city=response[0].city;
          this.conductor.district=response[0].district;
          this.conductor.rh=response[0].rh;
          this.conductor.email=response[0].email;
          this.conductor.phone1=response[0].phone1;
          this.conductor.phone2=response[0].phone2;
          this.conductor.phone3=response[0].phone3;
          this.conductor.bank=response[0].bank;
          this.conductor.accountName=response[0].accountName;
          this.conductor.accountNumber=response[0].accountNumber;
          this.conductor.maritalStatusId=response[0].maritalStatusId;
          this.conductor.accountTypeId=response[0].accountTypeId;
          this.conductor.status=response[0].status;
          this.conductor.roleId=response[0].roleId;
          this.conductor.img=response[0].img
          var bd=response[0].birthDate;
          var today = new Date();
          var birthDate=new Date(bd);
          var bD=bd.split('-');
          this.conductorExp.birthDate = {year: parseInt(bD[0]), month: parseInt(bD[1]), day: parseInt(bD[2])};

          var years=this.diff_years(today, birthDate);
          (<HTMLInputElement>document.getElementById('inputyears')).value=years+ " años";
        }
      });
  }
  borrar(index){
    var id=this.referencias[index].id;
    let that = this;
    swal({
      title: '¿Esta seguro de borrar la referencia seleccionada?',
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
            that.conductorService.borrarReferenciaConductor(id).then(response => {
                if (response){
                  if (response.estado == 'EXITO') {
                    that.referencias.splice(index, 1);
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
  }
  borrarReferencia(id){

  }
  openModal(content,i) {
   console.log(i);
   if(i>-1){
     var id=this.referencias[i].id;
     this.conductorService.obtenerReferencia(id).then(response => {
       //this.referencia= {tipo: {id: ''} };
       this.referencia= {};
       //console.log(response);
       this.referencia.idDriver=this.driverId;
       this.referencia.id=response[0].id;
       this.referencia.name=response[0].name;
       this.referencia.phone=response[0].phone;
       this.referencia.email=response[0].email;
       this.referencia.address=response[0].address;
       //this.referencia.tipo.id=response[0].idTypeReference;
       this.referencia.idTypeReference=response[0].idTypeReference;
     });
   }else{
     this.referencia= {};
     this.referencia.idDriver=this.driverId;
   }

   const modalRef = this.modalService.open(content, {backdrop: 'static', size: 'lg'});

   //this.referencia = Object.assign({}, referencia);

   modalRef.result.then(value => {
     console.log('referencia.component.abrirDialogoCrearEditarReferencia.modalRef.result.then', value);

   }).catch(reason => {
       console.log('referencia.component.abrirDialogoCrearEditarReferencia.modalRef.result.catch', reason);
   })
 }

 crearActualizarConductor(): void {
    if(this.conductor.phone3 === undefined){
      //console.log('La variable de telefono alternativo no esta definida');
      this.conductor.phone3="";
    }

    //this.conductor.img = this.fileToUpload;
    //console.log("this.conductor tg: ", this.conductor)
    //console.log("this.fileToUpload save : ", this.fileToUpload)
    this.conductor.urlImageDriver="assets/images/social/profile.jpg";
    var fecha=this.parserFormatter.format(this.conductorExp.birthDate);
    this.conductor.birthDate = fecha;
    this.conductor.roleId=7;
    this.conductorService.crearActualizarConductor(this.conductor)
      .then(response =>{
        console.log('conductor.component.crearActualizarConductor.response: ', response);
        if (response) {
          console.log('response : ', response)
          //this.usuario = response;
          this.router.navigate(['/home/dr/conductores']);
          if (response.estado == 'EXITO') {
            this.alertService.success(response.mensaje);
          } else {
            var f=fecha.split('-');
            this.conductor.birthDate = {year: parseInt(f[0]), month: parseInt(f[1]), day: parseInt(f[2])};
            this.alertService.error(response.mensaje);
          }
        }
      });
  }




  /*diff_years(dt2, dt1){

   var diff =(dt2.getTime() - dt1.getTime()) / 1000;
   diff /= (60 * 60 * 24);
   return Math.abs(Math.round(diff/365.25));

 }*/
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
    console.log(this.conductor.birthDate);
    this.calculateYears(this.conductorExp.birthDate);
  }
  onChange(dt:any){
    console.log(this.conductor.birthDate);
    this.calculateYears(this.conductorExp.birthDate);
  }
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
        (<HTMLInputElement>document.getElementById('inputyears')).value=years+ " años";
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
  crearActualizarReferencia(): void {
   if(this.driverId!=-1){
    //console.log(this.referencia);
    if(this.referencia.email === undefined){
      this.referencia.email="";
    }
    this.conductorService.crearActualizarReferencia(this.referencia)
      .then(response =>{
        console.log('conductor.component.crearActualizarReferencia.response: ', response);
        if (response) {
          console.log('response : ', response)
          //this.usuario = response;
          //this.router.navigate(['/home/dr/conductores']);
          if (response.estado == 'EXITO') {
            this.obtenerReferenciasConductor();
            this.alertService.success(response.mensaje);
          } else {
            this.alertService.error(response.mensaje);
          }

        }
      });
    }else{
      this.alertService.error("No se ha creado aún un conductor para asociar la referencia.");
    }
  }
  openConfirmsSwal() {

   swal({
     title: 'Are you sure?',
     text: 'You wont be able to revert',
     type: 'warning',
     showCancelButton: true,
     confirmButtonColor: '#3085d6',
     cancelButtonColor: '#ff5370',
     confirmButtonText: 'Yes',
     cancelButtonText: 'No'
   }).then(function (s) {
     console.log(s);
    if(s.dismiss !== undefined){
      if (s.dismiss.toString() === 'cancel') {
          swal("Cancelled", "Your imaginary file is safe :)", "error");
      }
    }else{
      if(s.value!== undefined){
         if(s.value){
            swal("Deleted!", "Your imaginary file has been deleted.", "success");
         }
      }
    }
  }).catch(swal.noop);

 }

 fileToUpload: File = null;

  handleFileInput(files:FileList){
      this.fileToUpload = files.item(0);
      console.log("this.fileToUpload : ", this.fileToUpload)
  }

  ////////////////////////////////////////////uploadFileToActivity() {
    ////////////////////////////////////////////console.log('ingresando al upload')
    ////////////////////////////////////////////console.log("this.conductorService upload: ", this.fileToUpload)
    ////////////////////////////////////////////this.conductorService.postFile(this.fileToUpload).subscribe(data => {
      ////////////////////////////////////////////console.log('do something, if upload success')
      ////////////////////////////////////////////}, error => {
        ////////////////////////////////////////////console.log(error);
      ////////////////////////////////////////////});
  ////////////////////////////////////////////}

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
