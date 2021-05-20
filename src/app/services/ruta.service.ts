import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import {CommonService} from './common.service';
import {AlertService} from './alert.service';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/observable/of';


@Injectable()
export class RutaService {

  constructor(
    private http: HttpClient,
    private httpClient: HttpClient,
    private commonService: CommonService,
    private alertService: AlertService
  ) { }
  obtenerRutas(){
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/Routes/';
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
  obtenerRuta(id){
   if(id>-1){
     const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/Routes/?id='+id;
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
  obtenerRutasOrigenDestino(origenId, destinationId){
   const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/getRoutes/?originManifestId='+origenId+'&&destinationManifestId='+destinationId;
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
  crearActualizarRuta(ruta: any): Promise<any>{
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/Routes/';
    return this.http.post(url, ruta)
      .toPromise()
      .then(response => {
        //console.log('conductor.service.crearActualizarReferencia:', response);
        return response;
      })
      .catch((err) => this.commonService.handlePromiseError(err));
  }
  borrarRuta(id):Promise<any> {
    const url = this.commonService.obtenerPrefijoUrlServicio() + 'travel/Routes/';
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
