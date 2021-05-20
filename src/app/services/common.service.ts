import { Injectable } from '@angular/core';
import {AlertService} from './alert.service';

@Injectable()
export class CommonService {

  developmentPort = '4200';
  servicesPort = '8080';
  developmentProtocol = 'http';
  contextName = 'cela/';

  constructor(
    private alertService: AlertService
  ) { }

  handlePromiseError(error: any): void {
    console.error('An error occurred', error);
    if (error.error && error.error.message){
      this.alertService.error(error.error.message);
    } else if ( error.responseJSON && error.responseJSON.message ){
      this.alertService.error(error.responseJSON.message);
    } else {
      this.alertService.error(error.message);
    }
  }
  public obtenerPrefijoUrlServicio(): string {

    /*
    let protocol = '';
    if (location.protocol != this.developmentProtocol){
      protocol = location.protocol;
    } else {
      protocol = this.developmentProtocol;
    }

    let port = '';
    if (location.port == this.developmentPort){
      port = this.servicesPort;
    } else {
      port = location.port;
    }

    let prefijo = protocol + '//' + location.hostname + ':' + port + '/' + this.contextName + 'rest/';
    */

    const prefijo = 'http://claservices.optimus3d.com/';
    //const prefijo = 'http://localhost:8000/';


    return prefijo;

  }

  private obtenerUsuarioActual(): any {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser;
  }

  public getToken(): string {
    const currentUser = this.obtenerUsuarioActual();
    if (currentUser){
      return currentUser.token;
    } else {
      return '';
    }
  }

  obtenerCodigoPerfilUsuario(): string {
    return this.obtenerUsuarioActual().rol;
  }

  obtenerNombreUsuario(): string {
    return this.obtenerUsuarioActual().usuario;
  }

  obtenerIdEmpresaLogueada(): number {
    return this.obtenerUsuarioActual().companyId;
  }

}
