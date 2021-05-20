import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import {CommonService} from './common.service';
import {AlertService} from './alert.service';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class VehiculoService {
	constructor(
		private http: HttpClient,
    	private httpClient: HttpClient,
    	private commonService: CommonService,
    	private alertService: AlertService
	) { }


	obtenerVehiculos(): Promise<any> {
		const url = this.commonService.obtenerPrefijoUrlServicio() + 'vehicle/VehiclesByCompany/';
		return this.http.get(url)
		.toPromise()
		.then(response => {
			console.log('vehiculo.service.obtenerVehiculos:', response);
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

	crearActualizarVehiculo(vehiculo: any): Promise<any>{
		console.log('vehiculo.service.crearActualizarVehiculo.vehiculo:', vehiculo);
		const url = this.commonService.obtenerPrefijoUrlServicio() + 'vehicle/VehiclesByCompany/';
		return this.http.post(url, vehiculo)
		.toPromise()
		.then(response => {
			console.log('usuario.service.crearActualizarVehiculo:', response);
			return response;
		})
		.catch((err) => this.commonService.handlePromiseError(err));
	}


	obtenerLineasVehiculo(idMarca): Promise<any> {
		console.log("id marca : ", idMarca)
		if (idMarca > -1) {
			console.log('id marca 2: ', idMarca)
			const url = this.commonService.obtenerPrefijoUrlServicio() + 'vehicle/getLinesByBrand/?brandId=' + idMarca;
			return this.http.get(url)
			.toPromise()
			.then(response => {
				console.log('usuario.service.obtenerLineasVehiculo:', response);
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

	obtenerTiposCarroceria(): Promise<any> {
		console.log('obtener tipos de carroceria : : ')
		const url = this.commonService.obtenerPrefijoUrlServicio() + 'vehicle/getVehicleType/';
		return this.http.get(url)
		.toPromise()
		.then(response => {
			console.log('vehiculo.service.obtenerTiposcarroceria:', response);
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

	obtenerMarcasVehiculo(): Promise<any> {
		console.log('obtener marcas : : ')
		const url = this.commonService.obtenerPrefijoUrlServicio() + 'vehicle/getBrands/';
		return this.http.get(url)
		.toPromise()
		.then(response => {
			console.log('vehiculo.service.obtenerMarcas:', response);
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

	obtenerTiposCombustible(): Promise<any> {
		// console.log('obtener tipos de combustible : : ')
		const url = this.commonService.obtenerPrefijoUrlServicio() + 'vehicle/getFuelType/';
		return this.http.get(url)
		.toPromise()
		.then(response => {
			console.log('vehiculo.service.obtenerTiposCombustible:', response);
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

	// obtenerLineasVehiculo(): Promise<any> {}

	obtenerClasesVehiculo(): Promise<any> {
		// console.log('obtener tipos de combustible : : ')
		const url = this.commonService.obtenerPrefijoUrlServicio() + 'vehicle/getVehicleClass/';
		return this.http.get(url)
		.toPromise()
		.then(response => {
			console.log('vehiculo.service.obtenerClasesVehiculo:', response);
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

	// obtenerTipoCarroceria(): Promise<any> {}

	obtenerColoresVehiculo(): Promise<any> {
		// console.log('obtener colores : : ')
		const url = this.commonService.obtenerPrefijoUrlServicio() + 'vehicle/getColors/';
		return this.http.get(url)
		.toPromise()
		.then(response => {
			console.log('vehiculo.service.obtenerColores:', response);
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


	obtenerVehiculo(id): Promise<any> {
		//if (id > -1) {
			const url = this.commonService.obtenerPrefijoUrlServicio() + 'vehicle/VehiclesByCompany/?id=' + id;
			return this.http.get(url)
				.toPromise()
				.then(response => {
					console.log('vehiculo.service.obtenerVehiculo:', response);
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
		//}
	}

	obtenerPropietario(id): Promise<any> {
		console.log("id vehicle by property: ", id)
		const url = this.commonService.obtenerPrefijoUrlServicio() + 'vehicle/VehiclebyOwner/?id=' + id;
		console.log("url", url)
		return this.http.get(url)
		.toPromise()
		.then(response => {
			console.log('vehiculo.service.obtenerPropietario:', response);
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
	obtenerIdsTerceros(): Promise<any> {
		console.log('obtener marcas : : ')
		const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/getThirds/';
		return this.http.get(url)
		.toPromise()
		.then(response => {
			console.log('vehiculo.service.obtenerIdsTerceros:', response);
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
	obtenerTercero(id): Promise<any> {
		console.log('obtener marcas : : ')
		const url = this.commonService.obtenerPrefijoUrlServicio() + 'third/getThirdInfo/?id=' + id;
		return this.http.get(url)
		.toPromise()
		.then(response => {
			console.log('vehiculo.service.obtenerTercero:', response);
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
