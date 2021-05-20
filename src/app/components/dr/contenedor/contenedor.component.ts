import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import {animate, style, transition, trigger} from '@angular/animations';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbTabsetConfig, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {AlertService} from '../../../services/alert.service';
import {ConductorService} from '../../../services/conductor.service';
import {TerceroService} from '../../../services/tercero.service';
import {TrailerService} from '../../../services/trailer.service';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

@Component({
  selector: 'app-contenedor',
  templateUrl: './contenedor.component.html',
  styleUrls: ['./contenedor.component.css']
})
export class ContenedorComponent implements OnInit {
  contenedor: any= {};
  contenedorExp: any={};
  clientes: any []=[];
  conductores: any []=[];
  dataConductores: any =[];
  propietarios: any = [];
  poseedores: any = [];
  trailers: any []=[];
  containerId: number = -1;
  searchDriver: string;
  dataService: CompleterData;
  constructor(
    public parserFormatter: NgbDateParserFormatter,
    private route: ActivatedRoute,
    private router: Router,
    private terceroService: TerceroService,
    private conductorService: ConductorService,
    private trailerService: TrailerService,
    private completerService: CompleterService,
    private alertService: AlertService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.obtenerClientes();
    this.obtenerConductores();
    this.obtenerTerceros();
    this.obtenerTrailers();
  }
  obtenerClientes(): void {
    this.terceroService.obtenerTercerosPorTipo(3).then(response => {
      this.clientes=response;
      console.log(this.clientes);
    });
  }
  obtenerConductores(): void {
    this.conductorService.obtenerConductoresActivos().then(response => {
      this.conductores =response;
      for(var i=0;i<this.conductores.length;i++){
        this.dataConductores.push({id:this.conductores[i].id,identification:this.conductores[i].identification+" - "+this.conductores[i].name+" "+this.conductores[i].firstLastName+" "+this.conductores[i].secondLastName});

      }
      this.dataService = this.completerService.local(this.dataConductores, 'identification', 'identification');
    });
  }
  obtenerTerceros(): void{
    this.terceroService.obtenerTodosTerceros().then(response => {
      this.propietarios = response;
      this.poseedores = response;
    });
  }
  obtenerTrailers(): void {
    this.trailerService.obtenerTrailers().then(response => {
      this.trailers=response;
    });
  }
  isValidDate(dateString) {
    if(dateString=="" || dateString==null){
        return true;
    }else{
      var regEx = /^\d{4}-\d{2}-\d{2}$/;
  		if(!dateString.match(regEx)) return false;  // Invalid format
  		var d = new Date(dateString);
  		if(!d.getTime() && d.getTime() !== 0) return false; // Invalid date
  		return d.toISOString().slice(0,10) === dateString;
    }
	}
  crearActualizarContenedor():void{
    var fechaMatricula = this.parserFormatter.format(this.contenedorExp.date);
  }
}
