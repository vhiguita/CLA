import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AlertService} from '../../../services/alert.service';
import {PuntoService} from '../../../services/punto.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-puntos',
  templateUrl: './puntos.component.html',
  styleUrls: ['./puntos.component.css']
})
export class PuntosComponent implements OnInit {
  puntos: any []=[];
  constructor(
    private route: ActivatedRoute,
    private _router:Router,
    private puntoService: PuntoService,
    private alertService: AlertService,
    private modalService: NgbModal
  ) { }
  ngOnInit() {
    this.obtenerPuntos();
  }
  obtenerPuntos(){
    this.puntoService.obtenerPuntos().then(response => {
      this.puntos =response;
    });
  }
  edit(index){
     var id=this.puntos[index].id;
     this._router.navigate(['/home/rtn/punto',id]);
  }
  delete(index) {
    var id=this.puntos[index].id;
    let that = this;
    swal({
      title: '¿Esta seguro de borrar el punto seleccionado?',
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
            that.puntoService.borrarPunto(id).then(response => {
                if (response){
                  if (response.estado == 'EXITO') {
                    that.puntos.splice(index, 1);
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
}
