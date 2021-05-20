import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import {CommonService} from './common.service';
import {AlertService} from './alert.service';

@Injectable()
export class PuntoService {

  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private alertService: AlertService
  ) { }
  obtenerPuntos(): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'drive/pointsByCompany/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('conductor.service.obtenerPuntos:', response);
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
  obtenerPunto(id): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'drive/pointsByCompany/?id=' + id;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('usuario.service.obtenerPunto:', response);
        if (response && response['estado'] && response['estado'] == 'EXITO') {
          // return response['registros'][0];
          return response['registros'];
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  borrarPunto(id):Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'drive/pointsByCompany/';
    var param = {
              "id" : id,
              "del" : "1",
    };
    return this.http.post(url, JSON.stringify(param))
      .toPromise()
      .then(response => {
        console.log('conductor.service.borrarPunto:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  crearActualizarPunto(punto: any): Promise<any>{
    console.log('conductor.service.crearActualizarPunto.conductor:', punto);
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'drive/pointsByCompany/';
    return this.http.post(url, punto)
      .toPromise()
      .then(response => {
        console.log('conductor.service.crearActualizarPunto:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerTiposPunto(): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'drive/interestPoints/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('conductor.service.obtenerTiposPunto:', response);
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
