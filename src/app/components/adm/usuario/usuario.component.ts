import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {UsuarioService} from '../../../services/usuario.service';
import {AlertService} from '../../../services/alert.service';
import {EmpresaService} from '../../../services/empresa.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  usuario: any = {rol: {id: ''} };
  roles: any = [];
  isSubmitted: any = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
/*
    if (!this.usuario.rol) {
      this.usuario.rol = {};
    }
*/
    this.obtenerRoles();
    this.obtenerUsuario();
  }

  crearActualizarUsuario(): void {
    this.usuarioService.crearActualizarUsuario(this.usuario)
      .then(response =>{
        console.log('usuario.component.crearActualizarUsuario.response: ', response);
        if (response) {
          console.log('response : ', response)
          //this.usuario = response;
          this.router.navigate(['/home/adm/usuarios']);
          if (response.estado == 'EXITO') {
            this.alertService.success(response.mensaje);
          } else {
            this.alertService.error(response.mensaje);
          }

        }
      });
  }

  obtenerUsuario(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.usuarioService.obtenerUsuario(params.get('idUsuario')))
      .subscribe(response => {
        if (response) {
          console.log(response);
          this.usuario = response;
        }
      });
  }

  obtenerRoles(): void {
    this.usuarioService.obtenerRoles().then(response => {
      // console.log('usuario.component.obtenerRoles.response: ', response);
      this.roles = response;
    });
  }

}
