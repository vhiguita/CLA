import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { VehiculoService } from '../../../services/vehiculo.service';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent implements OnInit {
	vehiculos: any []=[];
	constructor(
	private route: ActivatedRoute,
    private router: Router,
    private vehiculoService:VehiculoService
    ) { }
	ngOnInit() {
		this.obtenerVehiculos();
	}

	obtenerVehiculos(): void {
		this.vehiculoService.obtenerVehiculos().then(response => {
			this.vehiculos = response;
			//console.log(response);
		});
	}

	edit(index){
		var id=this.vehiculos[index].id;
		console.log('id : ', id)
		this.router.navigate(['/home/dr/vehiculo',id]);
	}
}
