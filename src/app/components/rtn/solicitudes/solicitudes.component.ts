import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AlertService} from '../../../services/alert.service';
import {ManifiestoService} from '../../../services/manifiesto.service';
import {CommonService} from '../../../services/common.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {
  messages_1 = {
    'emptyMessage': '',
    'totalMessage': 'total',
    'selectedMessage': 'seleccionado'
  };
  solicitudes: any []=[];
  historialSolicitudes: any []=[];
  tiposRechazo: any [] = [];
  userId: number;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commonService:CommonService,
    private manifiestoService: ManifiestoService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.obtenerSolicitudes();
    this.obtenerTiposRechazo();
    this.obtenerHistorialSolicitudes();
    this.userId = this.commonService.obtenerUsuarioId();
  }
  obtenerTiposRechazo(): void{
    this.manifiestoService.obtenerTiposRechazo().then(response => {
      this.tiposRechazo = response;
    });
  }
  obtenerSolicitudes(): void{
    this.manifiestoService.obtenerSolicitudes().then(response => {
      this.solicitudes = response;
    });
  }
  obtenerHistorialSolicitudes():void{
    this.manifiestoService.obtenerHistorialSolicitudes().then(response => {
      this.historialSolicitudes = response;
    });
  }
  /*edit(index){

     var id=this.solicitudes[index].id;
     this.router.navigate(['/home/rtn/solicitud',id]);
  }*/
  edit(id){
    this.router.navigate(['/home/rtn/solicitud',id]);
  }
  getTravelRequestStatus(id){
    status="";
    for(var i=0;i<this.solicitudes.length;i++){
         if(this.solicitudes[i].id==id){
           status=this.solicitudes[i].travelStatus;
         }
    }
    return status;
  }
  cancelarSolicitud(id):void{
    var options = {};
    $.map(this.tiposRechazo,
       function(o) {
           options[o.id] = o.Description;
    });
    let that = this;
    swal({
     title: '¿Esta seguro de anular la solicitud seleccionada?',
     type: 'warning',
     input: 'select',
     inputOptions: options,
     inputPlaceholder: 'Seleccione el tipo de rechazo',
     html: 'Razón: <textarea id="swal-input1" rows="3" cols="50"></textarea>',
     showCancelButton: true,
     confirmButtonColor: '#3085d6',
     cancelButtonColor: '#d33',
     confirmButtonText: 'Sí',
     cancelButtonText: 'No',
     preConfirm: function (selectedOption) {
       return new Promise(function (resolve , reject) {
         if(selectedOption!=""){
           console.log(selectedOption);
           resolve([
              $('#swal-input1').val(),
              selectedOption,
           ])
         }else{
           //reject('Debe seleccionar el tipo de rechazo.')
           //swal('Debe seleccionar el tipo.', '', 'error');
            swal.showValidationError('Debe seleccionar el tipo de rechazo.');
            swal.enableButtons();
            return false;
         }
       });
     },
     onOpen: function () {
       $('#swal-input1').focus();
     }
   }).then(function (result) {
     //console.log(result);
     if(result.dismiss !== undefined){
       if (result.dismiss.toString() === 'cancel') {
       }
     }else{
       if(result.value!== undefined){
          if(result.value){
            //console.log(result.value);
            //swal(JSON.stringify(result))
            var comment=result.value[0];
            var typeRejectId=parseInt(result.value[1]);
            var idSolicitud=id;
            console.log(comment+" "+typeRejectId+" "+id);
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
            var currentDate = dateTime.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' +seconds;
            var param_1 = {
                "travelRequestId": idSolicitud,
                "requestStatus" : "C"
            };
            var param_2 = {
                "date" : currentDate,
                "comment" : comment,
                "rejectionTypeId" : typeRejectId,
                "travelRequestId": idSolicitud,
                "userId": that.userId
            };
            that.manifiestoService.actualizarEstadoSolicitud(JSON.stringify(param_1))
              .then(response =>{
               if (response.estado == 'EXITO') {
                   var j =that.solicitudes.length-1;
                   while(j>=0){
                     if(idSolicitud == that.solicitudes[j].id){
                       that.solicitudes.splice(j,1);
                       break;
                     }
                     j--;
                 }
                 that.solicitudes = [...that.solicitudes];
                 that.manifiestoService.crearHistorialSolicitud(JSON.stringify(param_2))
                   .then(s =>{
                     swal({
                       title: 'Solicitud anulada exitosamente',
                       text: '',
                       type: 'success'
                      }).catch(swal.noop);
                  });
               }
             });
          }
       }
     }
   });
  }

}
