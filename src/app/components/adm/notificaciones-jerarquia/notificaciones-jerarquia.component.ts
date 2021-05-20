import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../../../services/alert.service';
import {EmpresaService} from '../../../services/empresa.service';
import {UsuarioService} from '../../../services/usuario.service';

@Component({
  selector: 'app-notificaciones-jerarquia',
  templateUrl: './notificaciones-jerarquia.component.html',
  styleUrls: ['./notificaciones-jerarquia.component.css']
})
export class NotificacionesJerarquiaComponent implements OnInit {

  notificaciones: any;
  roles: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private empresaService: EmpresaService,
    private usuarioService: UsuarioService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.obtenerNotificacionesJerarquia();
    this.obtenerRoles();
  }

  obtenerNotificacionesJerarquia(): void {
    this.empresaService.obtenerNotificacionesJerarquia().then(response => this.notificaciones = response);
  }

  obtenerRoles(): void {
    this.usuarioService.obtenerRoles().then(response => this.roles = response);
  }

}
