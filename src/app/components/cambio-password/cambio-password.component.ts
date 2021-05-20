import { Component, OnInit } from '@angular/core';
import {UsuarioService} from '../../services/usuario.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Alert} from '../../classes/alert';
import {AlertType} from '../../enum/alert-type.enum';

@Component({
  selector: 'app-cambio-password',
  templateUrl: './cambio-password.component.html',
  styleUrls: ['./cambio-password.component.css']
})
export class CambioPasswordComponent implements OnInit {

  model: any = {};
//  message: any;
  alert: Alert;
  isSubmitted: any = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
  }

  cambiarPassword(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.usuarioService.cambiarPassword(params.get('token'), this.model.email, this.model.password))
      .subscribe(response => {
        if (response) {
          console.log('cambio-password.component.cambiarPassword.then: ', response);
          if (response) {
            // this.router.navigate(['/home/adm/empresas']);
            // this.alertService.success('Empresa creada / actualizada exitosamente');
            console.log('response : ', response)
            // this.usuario = response;
            // this.router.navigate(['/home/adm/usuarios']);
            this.alert = new Alert();
            this.alert.message = response.mensaje;
            if (response.estado == 'EXITO') {
              this.alert.type = AlertType.Success;
            } else {
              this.alert.type = AlertType.Error;
            }
          }
        }
      });
  }

  cssClass(alert: Alert) {
    if (!alert) {
      return;
    }

    // return css class based on alert type
    switch (alert.type) {
      case AlertType.Success:
        return 'alert background-success';
      case AlertType.Error:
        return 'alert background-danger';
      case AlertType.Info:
        return 'alert background-info';
      case AlertType.Warning:
        return 'alert background-warning';
    }
  }

}
