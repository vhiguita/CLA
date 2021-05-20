import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EmpresaService} from '../../../services/empresa.service';
import {AlertService} from '../../../services/alert.service';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.css']
})
export class AlertasComponent implements OnInit {

  alertas: any;
  company: any;
  isSubmitted: any = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private empresaService: EmpresaService,
  ) { }

  ngOnInit() {
    this.obtenerAlertas();
  }

  obtenerAlertas(): void {
    this.empresaService.obtenerAlertas().then(response => {
      this.alertas = response.registros;
      this.company = response.company;
    } );
  }

  guardarAlertas(): void {
    this.empresaService.guardarAlertas(this.alertas, this.company)
      .then(response =>{
        console.log('empresa.component.guardarAlertas.response: ', response);
        if (response) {
          // this.empresa = response;
          this.router.navigate(['/home/adm/alertas']);
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
