import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import {CommonService} from './common.service';
import {AlertService} from './alert.service';

@Injectable()
export class UsuarioService {

  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private alertService: AlertService
  ) { }

  obtenerUsuarios(): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'adminUser/users/context/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('usuario.service.obtenerUsuarios:', response);
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

  obtenerUsuario(id): Promise<any> {
    if (id > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'adminUser/users/context/?id=' + id;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          console.log('usuario.service.obtenerUsuario:', response);
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

  obtenerRoles(): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'adminUser/roles/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('usuario.service.obtenerRoles:', response);
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

  crearActualizarUsuario(usuario: any): Promise<any>{
    console.log('usuario.service.crearActualizarUsuario.usuario:', usuario);
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'adminUser/users/context/';
    return this.http.post(url, usuario)
      .toPromise()
      .then(response => {
        console.log('usuario.service.crearActualizarUsuario:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }

  obtenerNotificaciones(idUsuario: any): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'adminUser/notifications/?idUser=' + idUsuario;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('usuario.service.obtenerNotificaciones:', response);
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

  guardarNotificaciones(notificaciones: any, idUsuario: any): Promise<any>{
    const newObject = {};
    newObject['idUser'] = idUsuario;
    newObject['registros'] = notificaciones;
    console.log('usuario.service.guardarNotificacioes.newObject:', newObject);
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'adminUser/notifications/';
    return this.http.post(url, newObject)
      .toPromise()
      .then(response => {
        console.log('usuario.service.guardarNotificacioes:', response);
        //this.alertService.success(response.mensaje); 
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }

  cambiarPassword(token: any, email: any, password: any): Promise<any>{
    const newObject = {};
    newObject['token'] = token;
    newObject['email'] = email;
    newObject['password'] = password;
    console.log('usuario.service.cambiarPassword.newObject:', newObject);
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'adminUser/recoveryPass/';
    return this.http.post(url, newObject)
      .toPromise()
      .then(response => {
        console.log('usuario.service.cambiarPassword:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }

  solicitarCambioClave(modelEmail: any): Promise<any>{
    console.log('usuario.service.solicitarCambioClave.modelEmail:', modelEmail);
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'adminUser/recoveryPass/';
    return this.http.post(url, modelEmail)
      .toPromise()
      .then(response => {
        console.log('usuario.service.solicitarCambioClave:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }

  obtenerModulos(idRole: any): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'adminUser/modules/?idRole=' + idRole;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('usuario.service.obtenerModulos:', response);
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

  guardarModulos(modulos: any, idRole: any): Promise<any>{
    const newObject = {};
    newObject['idRole'] = idRole;
    newObject['registros'] = modulos;
    console.log('usuario.service.guardarModulos.newObject:', newObject);
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'adminUser/modules/';
    return this.http.post(url, newObject)
      .toPromise()
      .then(response => {
        console.log('usuario.service.guardarModulos:', response);
        // this.alertService.success(response.mensaje);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
      // this.alertService.error(response.mensaje);
  }

}
