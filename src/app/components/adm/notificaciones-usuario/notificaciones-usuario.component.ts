import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {EmpresaService} from '../../../services/empresa.service';
import {UsuarioService} from '../../../services/usuario.service';
import {AlertService} from '../../../services/alert.service';

@Component({
  selector: 'app-notificaciones-usuario',
  templateUrl: './notificaciones-usuario.component.html',
  styleUrls: ['./notificaciones-usuario.component.css']
})
export class NotificacionesUsuarioComponent implements OnInit {

  notificaciones: any;

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    private router: Router,
    private usuarioService: UsuarioService
  ) {
  }

  ngOnInit() {
    this.obtenerNotificaciones();
  }

  obtenerNotificaciones(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.usuarioService.obtenerNotificaciones(params.get('idUsuario')))
      .subscribe(response => {
        if (response) {
          this.notificaciones = response;
        }
      });
  }

  guardarNotificaciones(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.usuarioService.guardarNotificaciones(this.notificaciones, params.get('idUsuario')))
      .subscribe(response => {
        if (response) {
          if (response.estado == 'EXITO') {
            this.alertService.success(response.mensaje);
          } else {
            this.alertService.error(response.mensaje);
          }
        }
      });
  }

}
