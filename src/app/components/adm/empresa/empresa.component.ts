import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {EmpresaService} from '../../../services/empresa.service';
import {AlertService} from '../../../services/alert.service';
import {CommonService} from '../../../services/common.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbTabsetConfig, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit {

  empresa: any = {};
  empresaAux: any = {};
  exp: any = {};
  pagos: any = {};
  planes: any = [];
  planesPago: any = [];
  pago: any = {};
  empresaId: number = -1;
  isSubmitted: any = false;
  toShow: any = 1;
  unamePattern = "^(0|[1-9][0-9]*)$";
  emailPattern = "^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$";
//  message: any;

  constructor(
    public parserFormatter: NgbDateParserFormatter,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private empresaService: EmpresaService,
    private alertService: AlertService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.empresaId=this.route.snapshot.params.idEmpresa;
    if(this.empresaId>-1){
      this.toShow = 0;
    }else{
      this.toShow = 1;
    }
    if (!this.empresa.plan) {
      this.empresa.plan = {};
    }
    this.obtenerPlanes();
    this.obtenerEmpresa();
    if(this.empresaId>-1){
       this.obtenerPagos(this.empresaId);
    }
  }

  crearActualizarEmpresa(): void {
    var fecha=this.parserFormatter.format(this.exp.insuranceExpirationDate);
    this.empresa.InsuranceExpirationDate = fecha;
    var insuranceValue=String(this.empresaAux.InsuranceValue);
    console.log(insuranceValue);
    insuranceValue=this.replaceAll(insuranceValue, '.', ''); //insuranceValue.replace(/./g,'');
    console.log(insuranceValue);
    this.empresa.InsuranceValue= parseFloat(insuranceValue);
    console.log(this.empresa.InsuranceValue);
    console.log(this.empresa);
    this.empresaService.crearActualizarEmpresa(this.empresa)
      .then(response =>{
        console.log('empresa.component.crearActualizarEmpresa.response: ', response);
        if (response) {
          // this.empresa = response;
          if ( this.obtenerCodigoPerfilUsuario() == 'SUPERADMIN' ) {
            this.router.navigate(['/home/adm/empresas']);
          }

          if(response.estado == 'EXITO') {
            this.alertService.success(response.mensaje);
          } else {
            this.alertService.error(response.mensaje);
          }
        }

      });
  }
  escapeRegExp(string){
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

/* Define functin to find and replace specified term with replacement string */
  replaceAll(str, term, replacement) {
     return str.replace(new RegExp(this.escapeRegExp(term), 'g'), replacement);
  }

  obtenerEmpresa(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.empresaService.obtenerEmpresa(params.get('idEmpresa')))
      .subscribe(response => {
        if (response) {
          //console.log(response);
          var insExpDate= response.InsuranceExpirationDate;
          this.empresa = response;
          var iED=insExpDate.split('-');
          this.exp.insuranceExpirationDate = {year: parseInt(iED[0]), month: parseInt(iED[1]), day: parseInt(iED[2])};
          var insuranceVal=String(response.InsuranceValue);
          insuranceVal = insuranceVal.substring(0, insuranceVal.length - 3);
          this.empresaAux.InsuranceValue=insuranceVal;
          this.format();
        }
      });
  }
  onKey(){
    console.log(this.empresa.expirationDate);
  }
  borrarPago(index){
    var id=this.pagos[index].id;
    let that = this;
    swal({
      title: '¿Esta seguro de borrar el pago seleccionado?',
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
            that.empresaService.borrarPago(id).then(response => {
                if (response){
                  if (response.estado == 'EXITO') {
                    that.pagos.splice(index, 1);
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
  openModal(content,i) {
   console.log(i);

   this.pago= {};
   this.pago.status=0;
   this.exp.paymentDate="";
   //this.referencia.idDriver=this.driverId;

   const modalRef = this.modalService.open(content, {backdrop: 'static', size: 'lg'});

   //this.referencia = Object.assign({}, referencia);

   modalRef.result.then(value => {
     console.log('referencia.component.abrirDialogoCrearPago.modalRef.result.then', value);

   }).catch(reason => {
       console.log('referencia.component.abrirDialogoCrearPago.modalRef.result.catch', reason);
   })
 }
 onChangeObj(nObj) {
    var idPlan=nObj;
    this.empresaService.obtenerNumeroTrans(idPlan)
      .then(response =>{
        if (response) {
           this.pago.transactionNumber=response.toLocaleString();
        }
      });
  }
  format(){
    var num = this.empresaAux.InsuranceValue.replace(/\./g,'');
    if(!isNaN(num)){
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
        num = num.split('').reverse().join('').replace(/^[\.]/,'');
        this.empresaAux.InsuranceValue = num;
    }else{
        //this.empresa.InsuranceValue = this.empresa.InsuranceValue.replace(/[^\d\.]*/g,'');
    }
  }
  crearPago(): void{
    if(this.empresaId>-1){
      var fecha=this.parserFormatter.format(this.exp.paymentDate);
      this.pago.paymentDate = fecha;
      this.pago.companyId=this.empresaId;
      console.log(this.pago);
      this.empresaService.  crearActualizarPago(this.pago)
        .then(response =>{
          console.log('conductor.component.crearActualizarPago.response: ', response);
          if (response) {
            if (response.estado == 'EXITO') {
              this.obtenerPagos(this.empresaId);
              this.alertService.success(response.mensaje);
            } else {
              this.alertService.error(response.mensaje);
            }
          }
        });
    }
  }
  obtenerPlanes(): void {
    this.empresaService.obtenerPlanes().then(response => this.planes = response);
    this.empresaService.obtenerPlanes().then(response => this.planesPago = response);
  }
  obtenerPagos(companyId): void {
    this.empresaService.obtenerPagos(companyId).then(response => this.pagos = response);
  }
  obtenerCodigoPerfilUsuario(): string {
    return this.commonService.obtenerCodigoPerfilUsuario();
  }

}
