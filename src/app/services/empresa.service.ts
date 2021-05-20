import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import {CommonService} from './common.service';
import {AlertService} from './alert.service';

@Injectable()
export class EmpresaService {

  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private alertService: AlertService
  ) { }

  obtenerEmpresas(): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'adminUser/companies/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('empresa.service.obtenerEmpresas:', response);
        if( response && response['estado'] && response['estado'] == 'EXITO' ) {
          return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerPagos(companyId): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'adminUser/payments/?companyId='+companyId;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('empresa.service.obtenerPagos:', response);
        if( response && response['estado'] && response['estado'] == 'EXITO' ) {
          return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  borrarPago(id):Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'adminUser/payments/';
    var param = {
              "id" : id,
              "del" : "1",
    };
    return this.http.post(url, JSON.stringify(param))
      .toPromise()
      .then(response => {
        console.log('conductor.service.borrarReferencia:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerNumeroTrans(id): Promise<any> {
		const url = this.commonService.obtenerPrefijoUrlServicio() + 'adminUser/planTransationNumber/?id=' + id;
		return this.http.get(url)
			.toPromise()
			.then(response => {
				console.log('vehiculo.service.obtenerNumeroTrans:', response);
				if (response && response['estado'] && response['estado'] == 'EXITO') {
					// return response['registros'][0];
					return response['transacciones_permitidas'];
				} else {
					if (response && response['estado'] == 'ERROR') {
						this.alertService.error(response['mensaje']);
					}
				}
			})
			.catch((err) => this.commonService.handlePromiseError(err));
	}
  crearActualizarPago(pago: any): Promise<any>{
    console.log('empresa.service.crearActualizarPago.Pago:', pago);
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'adminUser/payments/';
    return this.http.post(url, pago)
      .toPromise()
      .then(response => {
        console.log('empresa.service.crearActualizarEmpresa:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerEmpresa(id): Promise<any> {
    if (id > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'adminUser/companies/?id=' + id;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          console.log('empresa.service.obtenerEmpresa:', response);
          if (response && response['estado'] && response['estado'] == 'EXITO') {
            return response['registros'][0];
          } else {
            if (response && response['estado'] == 'ERROR') {
              this.alertService.error(response['mensaje']);
            }
          }
        })
        .catch((err) => this.commonService.handlePromiseError(err));
    }
  }

  obtenerPlanes(): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'adminUser/plans/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('empresa.service.obtenerPlanes:', response);
        if( response && response['estado'] && response['estado'] == 'EXITO' ) {
          return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }

  crearActualizarEmpresa(empresa: any): Promise<any>{
    console.log('empresa.service.crearActualizarEmpresa.empresa:', empresa);
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'adminUser/companies/';
    return this.http.post(url, empresa)
      .toPromise()
      .then(response => {
        console.log('empresa.service.crearActualizarEmpresa:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }

  obtenerAlertas(): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'adminUser/alerts/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('empresa.service.obtenerAlertas:', response);
        if( response && response['estado'] && response['estado'] == 'EXITO' ) {
          // return response['registros'];
          return response;
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }

  guardarAlertas(alertas: any, company: any): Promise<any>{
    const newObject = {};
    newObject['company'] = company;
    newObject['registros'] = alertas;
    console.log('empresa.service.guardarAlertas.newObject:', newObject);
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'adminUser/alerts/';
    return this.http.post(url, newObject)
      .toPromise()
      .then(response => {
        console.log('empresa.service.guardarAlertas:', response);
        return response;
        //this.alertService.success(response.mensaje);
      })
      .catch((err) => this.commonService.handlePromiseError(err));
      // this.alertService.error(response.mensaje);
  }

  obtenerNotificacionesJerarquia(): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'adminUser/hierarchy/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('empresa.service.obtenerNotificacionesJerarquia:', response);
        if( response && response['estado'] && response['estado'] == 'EXITO' ) {
          return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }

}
