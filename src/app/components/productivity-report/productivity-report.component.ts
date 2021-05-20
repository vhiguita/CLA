import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { ReportsServiceService } from '../../services/reports-service.service';
import { CommonService } from '../../services/common.service';
import { Globals } from '../../globals';
import { TerceroService } from '../../services/tercero.service';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, filter, map} from 'rxjs/operators';

@Component({
  selector: 'app-productivity-report',
  templateUrl: './productivity-report.component.html',
  styleUrls: ['./productivity-report.component.css']
})
export class ProductivityReportComponent implements OnInit {
	report: any= {};
	plates: any;
	reports: any;
	ownfleet: any;
	driverId: any;
	plateId: any;
	drivers: any = [];
	driversBuffer = [];
	platesBuffer = [];
	dataDrivers: any =[];
	bufferSize = 50;
	loading1 = false;
	constructor(
		private route: ActivatedRoute,
	    private router: Router,
	    private reportsService: ReportsServiceService,
	    private alertService: AlertService,
	    private globals: Globals,
	    private terceroService: TerceroService,
	    private commonService: CommonService) { }
	ngOnInit() {
		this.ownfleet = '-1';
		this.driverId = '-1';
		this.plateId = '-1'
		this.getReports(this.ownfleet , this.driverId, this.plateId )
		this.getActiveDrivers();
		this.getPlates();
	}
	getReports(ownfleet, driverId, plateId): void {
		console.log('componente reportes')
		this.reportsService.getReports(ownfleet, driverId, plateId).then(response => {
			this.reports = response;
			console.log('this.reports : ', this.reports)  
			console.log('response : ', response)  
		});  
	}

	filterReport():void {
		var ownfleet = $('#ownfleet').val()
		this.reportsService.getReports(ownfleet, this.report.thirdId, this.report.plateId).then(response => this.reports = response);
	}

	getPlates(): void {
		console.log('componente placas ')
		this.reportsService.getPlates().then(response => {
			this.plates = response
			console.log('this plates : ', this.plates)
			this.platesBuffer = this.plates.slice(0, this.bufferSize);
		});    
	}

	getActiveDrivers(): void {
		this.terceroService.obtenerTerceroPorTipo(1).then(response => {
			this.drivers = response;
			console.log('this drivers : ', this.drivers)
			this.driversBuffer = this.drivers.slice(0, this.bufferSize);
		});
	}

}
