import { NgModule } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgxDatatableModule} from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { NgbTabsetConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { VehiculoService } from '../../../services/vehiculo.service';
import {Observable} from 'rxjs/Rx';
import swal from 'sweetalert2';

@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.component.html',
  styleUrls: ['./vehiculo.component.css'],
  providers: [NgbTabsetConfig] ,

  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({opacity: 0}),
        animate('400ms ease-in-out', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translate(0)'}),
        animate('400ms ease-in-out', style({opacity: 0}))
      ])
    ])
  ]

})
export class VehiculoComponent implements OnInit {
	vehiculo: any= {};
	propietario: any= {};
	marcas: any = [];
  cedulas1: any = [];
  cedulas2: any = [];
	tiposCombustible: any = [];
	clasesVehiculo: any = [];
	coloresVehiculo: any = [];
	tiposCarroceria: any = [];
	lineasVehiculo: any = [];
  idPropietario: number = -1;
  idPoseedor: number = -1;
  vehicleId: number = -1;
	constructor(
		public parserFormatter: NgbDateParserFormatter,
	    private route: ActivatedRoute,
	    private router: Router,
	    private vehiculoService: VehiculoService,
	    private alertService: AlertService,
	    private modalService: NgbModal
	) { }

  	ngOnInit() {
      this.vehicleId=this.route.snapshot.params.idVehiculo;
      //alert(this.vehicleId);
		this.obtenerVehiculo();
  		this.obtenerMarcasVehiculo();
  		this.obtenerTiposCombustible();
  		this.obtenerClasesVehiculo();
  		this.obtenerColoresVehiculo();
  		this.obtenerTiposCarroceria();

  		this.obtenerPropietario();
      //this.obtenerIdsTerceros();
      this.vehiculo.repowering= false;
      this.vehiculo.ownFleet = false;
      this.vehiculo.observations = "";
      this.vehiculo.mileage="5000";
      this.vehiculo.driverId= 1;
      this.vehiculo.vehicleOwnerId=1;
      this.vehiculo.vehicleTrailerId=1;
      if(this.vehicleId>-1){
         this.obtenerIdsTerceros();
      }
  		// this.obtenerLineasVehiculo()
  	}
  	obtenerLineasVehiculo(idMarca): void {
  		console.log("the fuckin id : ", idMarca);
      this.vehiculoService.obtenerLineasVehiculo(idMarca)
        .then(response =>{
          if (response) {
             this.lineasVehiculo=response;
          }
        });
  	/*this.route.paramMap
  		.switchMap((params: ParamMap) => this.vehiculoService.obtenerLineasVehiculo	(params.get(idMarca)))
  		.subscribe(response => {
  			if(response){
  				console.log(response);
  				this.lineasVehiculo=response;
			}
		});*/
	}

  	//handleChange(q) {
  		//console.log("handleChange : 7", q)
	    // this.estados = pais.estados;
	//}

	// obtenerLineasVehiculo(): void{
		// this.vehiculoService.obtenerTiposCarroceria().then(response => {
  			// console.log("clases vehiculo : ", response);
  			// this.lineasVehiculo= response;
  		// });
	// }
  onChangeCedula_1(nObj) {
     this.idPropietario=nObj;
     this.cargarPropietario(this.idPropietario);
   }
   onChangeCedula_2(nObj) {
      this.idPoseedor =nObj;
      this.cargarPoseedor(this.idPoseedor);
   }
   cargarPropietario(idPropietario):void{
      this.vehiculoService.obtenerTercero(idPropietario)
        .then(response =>{
          if (response) {
             console.log(response);
             this.propietario.titular=response[0].Name;
             this.propietario.lugCedula=response[0].IdentificationPlace;
             this.propietario.telefono=response[0].Phone1;
             this.propietario.celular=response[0].Phone2;
             this.propietario.direccion=response[0].Address;
             this.propietario.ciudad=response[0].City;
          }
        });
    }
    cargarPoseedor(idPoseedor):void{
      this.propietario.nombreCuenta="";
      this.propietario.numCuentaPos="";
      this.propietario.tipoCuentaPos="";
      this.propietario.entidadPos="";
      this.vehiculoService.obtenerTercero(idPoseedor)
        .then(response =>{
          if (response) {
             console.log(response);
             this.propietario.titularPos=response[0].Name;
             this.propietario.lugCedulaPos=response[0].IdentificationPlace;
             this.propietario.telefonoPos=response[0].Phone1;
             this.propietario.celularPos=response[0].Phone2;
             this.propietario.direccionPos=response[0].Address;
             this.propietario.ciudadPos=response[0].City;
             if(response[0].accountName !== undefined){
               this.propietario.nombreCuenta =response[0].accountName;
             }
             if(response[0].accountNumber !== undefined){
               this.propietario.numCuentaPos =response[0].accountNumber;
             }
             if(response[0].accountTypeName !== undefined){
               this.propietario.tipoCuentaPos=response[0].accountTypeName;
             }
             if(response[0].bank !== undefined){
               this.propietario.entidadPos=response[0].bank;
             }
          }
        });
    }
  	obtenerTiposCarroceria(): void{
  		this.vehiculoService.obtenerTiposCarroceria().then(response => {
  			// console.log("clases vehiculo : ", response);
  			this.tiposCarroceria = response;
  		});
  	}

  	obtenerColoresVehiculo(): void{
  		this.vehiculoService.obtenerColoresVehiculo().then(response => {
  			// console.log("clases vehiculo : ", response);
  			this.coloresVehiculo = response;
  		});
  	}

  	obtenerClasesVehiculo(): void{
  		this.vehiculoService.obtenerClasesVehiculo().then(response => {
  			// console.log("clases vehiculo : ", response);
  			this.clasesVehiculo = response;
  		});
  	}

  	obtenerTiposCombustible(): void{
  		this.vehiculoService.obtenerTiposCombustible().then(response => {
  			// console.log("tipos combustible : ", response);
  			this.tiposCombustible = response;
  		});
  	}
    obtenerIdsTerceros(): void{
      this.vehiculoService.obtenerIdsTerceros().then(response => {
        console.log("TERCEROS");
        console.log(response);
        this.cedulas1 = response;
        this.cedulas2 = response;
        console.log(this.cedulas1[0].identification);
      });
    }

  	obtenerMarcasVehiculo(): void {
  		this.vehiculoService.obtenerMarcasVehiculo().then(response => {
  			console.log("marcas : ", response);
  			this.marcas = response;
  		});
  	}

	obtenerVehiculo(): void {
	  	this.route.paramMap
			.switchMap((params: ParamMap) => this.vehiculoService.obtenerVehiculo(params.get('idVehiculo')))
			.subscribe(response => {
			if (response) {
				this.vehiculo.id=response[0].id;
        console.log(response);
				// console.log("id : ", this.vehiculo.id)
				this.vehiculo.brandId = response[0].brandId;
				this.vehiculo.brandName = response[0].brandName;
				this.vehiculo.capacity = response[0].capacity;
				this.vehiculo.chassisNumber = response[0].chassisNumber;
				this.vehiculo.colorId = response[0].colorId;
				this.vehiculo.colorName = response[0].colorName;
				this.vehiculo.displacement = response[0].displacement;
				this.vehiculo.driverId = response[0].driverId;
				this.vehiculo.expeditionDate = response[0].expeditionDate;
				this.vehiculo.fuelType = response[0].fuelType;
				this.vehiculo.fuelTypeId = response[0].fuelTypeId;
				this.vehiculo.fullName = response[0].fullName;
				this.vehiculo.line = response[0].line;
				this.vehiculo.lineId = response[0].lineId;
				this.vehiculo.mileage = response[0].mileage;
				this.vehiculo.model = response[0].model;
				this.vehiculo.motorNumber = response[0].motorNumber;
				this.vehiculo.observations = response[0].observations;
				this.vehiculo.ownFleet = response[0].ownFleet;
				this.vehiculo.plate = response[0].plate;
				this.vehiculo.pledgee = response[0].pledgee;
				this.vehiculo.pwd = response[0].pwd;
				this.vehiculo.registrationDate = response[0].registrationDate;
				this.vehiculo.repowering = response[0].repowering;
				this.vehiculo.satellitalWebAddress = response[0].satellitalWebAddress;
				this.vehiculo.serialNumber = response[0].serialNumber;
				this.vehiculo.status = response[0].status;
				this.vehiculo.user = response[0].user;
				this.vehiculo.vehicleClass = response[0].vehicleClass;
				this.vehiculo.vehicleClassId = response[0].vehicleClassId;
				this.vehiculo.vehicleOwner = response[0].vehicleOwner;
				this.vehiculo.vehicleOwnerId = response[0].vehicleOwnerId;
				this.vehiculo.vehicleTrailer = response[0].vehicleTrailer;
				this.vehiculo.vehicleTrailerId = response[0].vehicleTrailerId;
				this.vehiculo.vehicleType = response[0].vehicleType;
				this.vehiculo.vehicleTypeId = response[0].vehicleTypeId;
				this.vehiculo.weight = response[0].weight;
        this.obtenerLineasVehiculo(this.vehiculo.brandId);
        /*this.vehiculo.thirdId1=response[0].thirdId1
        this.idPropietario=this.vehiculo.thirdId1
        this.vehiculo.thirdId2=response[0].thirdId2
        this.idPoseedor=this.vehiculo.thirdId2
        this.cargarPropietario(this.idPropietario)
        this.cargarPoseedor(this.idPoseedor)*/
				console.log("this vehiculo : ", this.vehiculo);
	     }
	 	});
	}

	obtenerPropietario():void{
		this.route.paramMap
		.switchMap((params: ParamMap) => this.vehiculoService.obtenerPropietario(params.get('idVehiculo')))
		.subscribe(response => {
			if (response) {
				console.log("propietario : ", response)
				console.log("id : ", this.propietario.id)
			}
		});
	}
	isValidDate(dateString) {
		var regEx = /^\d{4}-\d{2}-\d{2}$/;
		if(!dateString.match(regEx)) return false;  // Invalid format
		var d = new Date(dateString);
		if(!d.getTime() && d.getTime() !== 0) return false; // Invalid date
		return d.toISOString().slice(0,10) === dateString;
	}

	crearActualizarVehiculo(): void {
   		console.log("this.vehiculo tg: ", this.vehiculo)
	    this.vehiculoService.crearActualizarVehiculo(this.vehiculo)
	      .then(response =>{
	        console.log('vehiculo.component.crearActualizarVehiculo.response: ', response);
	        if (response) {
	          console.log('response : ', response)
	          //this.usuario = response;
	          this.router.navigate(['/home/dr/vehiculos']);
	          if (response.estado == 'EXITO') {
	            this.alertService.success(response.mensaje);
	          } else {
	            this.alertService.error(response.mensaje);
	          }
	        }
	      });
	}
  crearActualizarPropietario(): void{
    //alert(this.idPoseedor+" "+this.idPropietario);
    this.vehiculo.thirdId1 = this.idPropietario;
    this.vehiculo.thirdId2 = this.idPoseedor;
    this.vehiculoService.crearActualizarVehiculo(this.vehiculo)
      .then(response =>{
        console.log('vehiculo.component.crearActualizarVehiculo.response: ', response);
        if (response) {
          console.log('response : ', response)
          //this.usuario = response;
          this.router.navigate(['/home/dr/vehiculos']);
          if (response.estado == 'EXITO') {
            this.alertService.success(response.mensaje);
          } else {
            this.alertService.error(response.mensaje);
          }
        }
      });
  }
}
