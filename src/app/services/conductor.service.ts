import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import {CommonService} from './common.service';
import {AlertService} from './alert.service';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/observable/of';
Observable.of();

@Injectable()
export class ConductorService{

  constructor(
    private http: HttpClient,
    private httpClient: HttpClient,
    private commonService: CommonService,
    private alertService: AlertService
  ) {}

  obtenerEstadosCiviles(): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'drive/getMaritalStatus/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('conductor.service.obtenerEstadosCiviles:', response);
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
  obtenerTiposCuentas(): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'drive/getTypeAccount/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('conductor.service.obtenerTiposCuenta:', response);
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
  obtenerTiposReferencia(): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'drive/getTypeReference/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('conductor.service.obtenerTiposCuenta:', response);
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
  obtenerConductores(): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'drive/driversByCompany/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('conductor.service.obtenerConductores:', response);
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
  obtenerConductor(id): Promise<any> {
    if (id > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'drive/driversByCompany/?id=' + id;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          console.log('usuario.service.obtenerConductor:', response);
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
  }
  obtenerReferenciasConductor(idConductor): Promise<any> {
    if (idConductor > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'drive/referencesByDriver/?driverid=' + idConductor;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          console.log('usuario.service.obtenerReferenciasConductor:', response);
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
  }
  obtenerReferencia(id): Promise<any> {
    if (id > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'drive/referencesByDriver/?id=' + id;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          console.log('usuario.service.obtenerReferencia:', response);
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
  }

  //////////////////////////////////////////////////postFile(fileToUpload: File): Observable<boolean> {
    //////////////////////////////////////////////////console.log("ingresando  a postfile", fileToUpload.name)
    //////////////////////////////////////////////////const endpoint = 'assets/images';
    //////////////////////////////////////////////////const formData: FormData = new FormData();
    //////////////////////////////////////////////////console.log('cargando 1: : : : : : : :')
    //////////////////////////////////////////////////formData.append('fileKey', fileToUpload, fileToUpload.name);

    //////////////////////////////////////////////////console.log("form data : ", formData)
    //////////////////////////////////////////////////return this.httpClient
      //////////////////////////////////////////////////.post(endpoint, formData, { headers: yourHeadersConfig })
      //////////////////////////////////////////////////.map(() => { return true; })
      //////////////////////////////////////////////////.catch((e) => this.handleError(e));
  //////////////////////////////////////////////////}

  crearActualizarConductor(conductor: any): Promise<any>{
    //////////////////////////////////////////////////this.postFile(conductor.img);
    //console.log("imag tg tg  : : : : : : :  : : : :  : : : . : ", conductor.img.name);   
    console.log('conductor.service.crearActualizarConductor.conductor:', conductor);
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'drive/driversByCompany/';
    return this.http.post(url, conductor)
      .toPromise()
      .then(response => {
        console.log('usuario.service.crearActualizarConductor:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }


  crearActualizarReferencia(referencia: any): Promise<any>{
    console.log('conductor.service.crearActualizarReferencia.conductor:', referencia);
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'drive/referencesByDriver/';
    return this.http.post(url, referencia)
      .toPromise()
      .then(response => {
        console.log('conductor.service.crearActualizarReferencia:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  borrarReferenciaConductor(id):Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'drive/referencesByDriver/';
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
}
