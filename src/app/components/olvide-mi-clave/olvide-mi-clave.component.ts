import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UsuarioService} from '../../services/usuario.service';
import {Alert} from '../../classes/alert';
import {AlertType} from '../../enum/alert-type.enum';

@Component({
  selector: 'app-olvide-mi-clave',
  templateUrl: './olvide-mi-clave.component.html',
  styleUrls: ['./olvide-mi-clave.component.css']
})
export class OlvideMiClaveComponent implements OnInit {

  model: any = {};

  alert: Alert;
  isSubmitted: any = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
  }

  solicitarCambioClave(): void {
    this.usuarioService.solicitarCambioClave(this.model)
      .then(response =>{
        console.log('olvide-mi-clave.component.solicitarCambioClave.response: ', response);
        if (response) {
          // this.router.navigate(['/home/adm/empresas']);
          // this.alertService.success('Empresa creada / actualizada exitosamente');
          console.log('response : ', response)
          //this.usuario = response;
          // this.router.navigate(['/home/adm/usuarios']);
          this.alert = new Alert();
          this.alert.message = response.mensaje;
          if (response.estado == 'EXITO') {
            this.alert.type = AlertType.Success;
          } else {
            this.alert.type = AlertType.Error;
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
