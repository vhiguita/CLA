import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import {CommonService} from './common.service';
import {AlertService} from './alert.service';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/observable/of';

@Injectable()
export class TerceroService {
  constructor(
    private http: HttpClient,
    private httpClient: HttpClient,
    private commonService: CommonService,
    private alertService: AlertService
  ) { }

  obtenerCategoriasLicencia(): Promise<any> {
    //console.log('obtener tipos de carroceria : : ')
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/getCategoriesLicense/';    
    return this.http.get(url)
    .toPromise()
    .then(response => {
      console.log('tercero.service.getCategoriesLicense:', response);
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

  eliminarCategoriaLicencia(idLicense: any): Promise<any>{
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/delLicenseThird/'
    var param = { "idLicense" : idLicense };
    return this.http.post(url, JSON.stringify(param))
      .toPromise()
      .then(response => {
        console.log('empresa.service.eliminar Categoria:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }


  guardarActualizarLicencia(categoria: any): Promise<any>{
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/saveLicenseThird/';
    return this.http.post(url, categoria)
      .toPromise()
      .then(response => {
        console.log('empresa.service.crearActualizarCategoria:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }

  obtenerLicenciaConductor(idLicense): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/getLicenseThird/?idLicense=' + idLicense;
    return this.http.get(url, {headers: {'Accept': 'application/json', 'Content-Type': 'application/json; ; charset=UTF-8'}})
      .toPromise()
      .then(response => {
        // const response = JSON.parse(obj.toString());
        return response;
      });
  }

  obtenerLicenciaId(idLicense): Promise<any> {    
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/getLicenseId/?idLicense=' + idLicense;
    return this.http.get(url, {headers: {'Accept': 'application/json', 'Content-Type': 'application/json; ; charset=UTF-8'}})
      .toPromise()
      .then(obj => {
        const response = JSON.parse(obj.toString());
        return response;
      });
  }

  obtenerCategoriaId(idCategory): Promise<any> {    
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/getCategoryId/?idCategory=' + idCategory;
    return this.http.get(url, {headers: {'Accept': 'application/json', 'Content-Type': 'application/json; ; charset=UTF-8'}})
      .toPromise()
      .then(response => {
        // const response = JSON.parse(obj.toString());
        return response;
      });
  }

  crearActualizarTercero(tercero: any): Promise<any>{
    console.log('empresa.service.crearActualizarTercero:', tercero);
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/Thirds/';
    return this.http.post(url, tercero)
      .toPromise()
      .then(response => {
        console.log('empresa.service.crearActualizarTercero:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  crearActualizarCuenta(cuenta: any): Promise<any>{
    console.log('empresa.service.crearActualizarCuenta:', cuenta);
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/ThirdBankAccounts/';
    return this.http.post(url, cuenta)
      .toPromise()
      .then(response => {
        console.log('empresa.service.crearActualizarCuenta:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerTercerosPorTipo(idTercero){
    if (idTercero > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/ThirdByType/?thirdTypeId=' + idTercero;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          console.log('usuario.service.obtenerTercerosPorTipo:', response);
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
  obtenerTercerosActivosPorTipo(idTercero){
    if (idTercero > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/ActivateThirdByType/?thirdTypeId=' + idTercero;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          console.log('usuario.service.obtenerTercerosPorTipo:', response);
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
  obtenerTerceroPorTipo(idTercero){
    if (idTercero > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/getThirdByType/?thirdTypeId=' + idTercero;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          console.log('usuario.service.obtenerTercerosPorTipo:', response);
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
  obtenerRegimenes(){
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/getRegimes/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('usuario.service.obtenerRegimenesPorTipo:', response);
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
  obtenerTerceros(): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/Thirds/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        //console.log('conductor.service.obtenerConductores:', response);
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
  obtenerTodosTerceros(){
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/getAllThirds/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        // console.log('usuario.service.obtenerTercerosPorTipo:', response);
        if (response && response['estado'] && response['estado'] == 'EXITO') {
          //return response['registros'];
          return JSON.parse(response['registros']);
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerTiposTercero(){
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/getThirdTypes/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('usuario.service.obtenerTercerosPorTipo:', response);
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
  obtenerTercero(id){
    if (id > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/Thirds/?id=' + id;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          console.log('usuario.service.obtenerTercero:', response);
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
  obtenerCuentaBancaria(thirdId){
    if (thirdId > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/ThirdBankAccounts/?thirdId=' + thirdId;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          console.log('usuario.service.obtenerCuentaBancaria:', response);
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
  obtenerCuentaBancariaPorID(id){
    if (id > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/ThirdBankAccounts/?id=' + id;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          console.log('usuario.service.obtenerCuentaBancaria:', response);
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
  borrarCuenta(id):Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/ThirdBankAccounts/';
    var param = {
              "id" : id,
              "del" : "1",
    };
    return this.http.post(url, JSON.stringify(param))
      .toPromise()
      .then(response => {
        console.log('cuenta.service.borrarCuenta:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerSurcursalesTercero(thirdId){
    if (thirdId > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/ThirdBranches/?thirdId=' + thirdId;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          console.log('usuario.service.obtenerCuentaBancaria:', response);
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
  borrarSurcursal(id):Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/ThirdBranches/';
    var param = {
              "id" : id,
              "del" : "1",
    };
    return this.http.post(url, JSON.stringify(param))
      .toPromise()
      .then(response => {
        console.log('tercero.service.borrarSurcursal:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerContactosTercero(idTercero): Promise<any> {
    if (idTercero > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/ThirdReference/?thirdId=' + idTercero;
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
  obtenerContacto(id): Promise<any> {
    if (id > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/ThirdReference/?id=' + id;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          console.log('tercero.service.obtenerContacto:', response);
          if (response && response['estado'] && response['estado'] == 'EXITO') {
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
  borrarContactoTercero(id):Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/ThirdReference/';
    var param = {
              "id" : id,
              "del" : "1",
    };
    return this.http.post(url, JSON.stringify(param))
      .toPromise()
      .then(response => {
        console.log('tercero.service.borrarContacto:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  crearActualizarSurcursal(surcursal: any): Promise<any>{
    console.log('tercero.service.crearActualizarSurcursal:', surcursal);
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/ThirdBranches/';
    return this.http.post(url, surcursal)
      .toPromise()
      .then(response => {
        console.log('conductor.service.crearActualizarReferencia:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  crearActualizarContacto(contacto: any): Promise<any>{
    console.log('tercero.service.crearActualizarContacto:', contacto);
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/ThirdReference/';
    return this.http.post(url, contacto)
      .toPromise()
      .then(response => {
        console.log('conductor.service.crearActualizarReferencia:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerSurcursal(id){
    if (id > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/ThirdBranches/?id=' + id;
      return this.http.get(url)
        .toPromise()
        .then(response => {
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
  obtenerListaServicios(): Promise<any> {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/getServices/';
      return this.http.get(url)
        .toPromise()
        .then(response => {
          if (response && response['estado'] && response['estado'] == 'EXITO') {
            return response['registros'];
          } else {
            if (response && response['estado'] == 'ERROR') {
              this.alertService.error(response['mensaje']);
            }
          }
        })
        .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerServiciosTercero(idTercero): Promise<any> {
    if (idTercero > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/getServicesByThird/?thirdId=' + idTercero;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          if (response && response['estado'] && response['estado'] == 'EXITO') {
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
  borrarServiciosTercero(idTercero){
    if (idTercero > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/DeleteServicesByThird/';
      var param = {
                "thirdId" : idTercero,
                "del" : "1"
      };
      return this.http.post(url, JSON.stringify(param))
        .toPromise()
        .then(response => {
          console.log('tercero.service.borrarContacto:', response);
          return response;
        })
        .catch((err) => this.commonService.handlePromiseError(err));
    }
  }
  crearServicioTercero(idTercero,idServicio): Promise<any>{
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/SaveServicesByThird/';
    var param = {
              "thirdId" : idTercero,
              "serviceId" : idServicio
    };
    console.log(param);
    return this.http.post(url, JSON.stringify(param))
      .toPromise()
      .then(response => {
        console.log('tercero.service.crearServicioTercero:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  borrarTiposTercero(idTercero){
    if (idTercero > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/DeleteTypesByThird/';
      var param = {
                "thirdId" : idTercero,
                "del" : "1"
      };
      return this.http.post(url, JSON.stringify(param))
        .toPromise()
        .then(response => {
          console.log('tercero.service.borrarContacto:', response);
          return response;
        })
        .catch((err) => this.commonService.handlePromiseError(err));
    }
  }
  crearTiposTercero(idTercero,idTipoTercero): Promise<any>{
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/SaveTypesByThird/';
    var param = {
              "thirdId" : idTercero,
              "typeId" : idTipoTercero
    };
    console.log(param);
    return this.http.post(url, JSON.stringify(param))
      .toPromise()
      .then(response => {
        console.log('tercero.service.crearServicioTercero:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  existeCelular(cellPhone): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/existThirdCellPhone/?cellPhone=' + cellPhone;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('empresa.service.existeCelular:', response);
        if (response && response['estado'] && response['estado'] == 'EXITO') {
          return response;
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  existeIdentificacion(identification): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/existThirdIdentification/?identification=' + identification;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('empresa.service.existeCelular:', response);
        if (response && response['estado'] && response['estado'] == 'EXITO') {
          return response;
        } else {
          if (response && response['estado'] == 'ERROR') {
            this.alertService.error(response['mensaje']);
          }
        }
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }

}
