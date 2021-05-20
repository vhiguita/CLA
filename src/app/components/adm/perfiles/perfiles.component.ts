import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UsuarioService} from '../../../services/usuario.service';
import {AlertService} from '../../../services/alert.service';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.css']
})
export class PerfilesComponent implements OnInit {

  roles: any = [];
  idPerfil: any;
  modulos: any;
  isSubmitted: any = false;

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    private router: Router,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    this.obtenerPerfiles();
  }

  obtenerPerfiles(): void {
    this.usuarioService.obtenerRoles().then(response => this.roles = response);
  }

  obtenerModulos() {
    this.usuarioService.obtenerModulos(this.idPerfil).then(response => this.modulos = response);
  }

  guardarModulos() {
    this.usuarioService.guardarModulos(this.modulos, this.idPerfil).then(response => {
      console.log('perfiles.component.guardarModulos.response: ', response);
      if (response) {
        // this.empresa = response;
        // this.router.navigate(['/home/adm/alertas']);
        // this.alertService.success('Empresa creada / actualizada exitosamente');
        if (response.estado == 'EXITO') {
          this.alertService.success(response.mensaje);
        } else {
          this.alertService.error(response.mensaje);
        }
      }
    });
  }

}
