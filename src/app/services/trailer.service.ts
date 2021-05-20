import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import {CommonService} from './common.service';
import {AlertService} from './alert.service';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/observable/of';
var globalInfoTrailer = ''; 
@Injectable()
export class TrailerService {
  
  constructor(
    private http: HttpClient,
    private httpClient: HttpClient,
    private commonService: CommonService,
    private alertService: AlertService
  ) { }

  newOwner(trailer): Promise<any> {
    console.log('trailer en el servicio : ', trailer) 
    globalInfoTrailer = trailer
    return trailer
  }

  public globalInfoTrailerFun(): string {
    const globalInfo = globalInfoTrailer;
    return globalInfo;
  }

  

  obtenerTrailers(): Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'vehicle/VehicleTrailers/';
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log('trailer.service.obtenerTrailers:', response);
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
  crearActualizarTrailer(trailer: any): Promise<any>{
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'vehicle/VehicleTrailers/';
    return this.http.post(url, trailer)
    .toPromise()
    .then(response => {
      //console.log('usuario.service.crearActualizarVehiculo:', response);
      return response;
    })
    .catch((err) => this.commonService.handlePromiseError(err));
  }
  crearActualizarImagenTrailer(trailer: any): Promise<any>{
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'vehicle/ImagesbyVehicleTrailer/';
    return this.http.post(url, trailer)
    .toPromise()
    .then(response => {
      //console.log('usuario.service.crearActualizarVehiculo:', response);
      return response;
    })
    .catch((err) => this.commonService.handlePromiseError(err));
  }
  obtenerTrailer(id): Promise<any> {
    console.log('globalInfoTrailer : : : : : : : : : : ', globalInfoTrailer);
    if (id > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'vehicle/VehicleTrailers/?id=' + id;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          //console.log('vehiculo.service.obtenerVehiculo:', response);
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
  obtenerImagenesTrailer(trailerId): Promise<any> {
    if (trailerId > -1) {
      const url = this.commonService.obtenerPrefijoUrlServicio() + 'vehicle/ImagesbyVehicleTrailer/?idVehicleTrailer=' + trailerId;
      return this.http.get(url)
        .toPromise()
        .then(response => {
          //console.log('vehiculo.service.obtenerVehiculo:', response);
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
  borrarImagenTrailer(id):Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'vehicle/ImagesbyVehicleTrailer/';
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

}
