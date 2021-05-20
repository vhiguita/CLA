import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { EventsService } from '../../../services/events.service';
import { CommonService } from '../../../services/common.service';
import { Globals } from '../../../globals';
import { ReportsServiceService } from '../../../services/reports-service.service';
import { TerceroService } from '../../../services/tercero.service';
import swal from 'sweetalert2';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-main-events',
  templateUrl: './main-events.component.html',
  styleUrls: ['./main-events.component.css']
})
export class MainEventsComponent implements OnInit {
	vehiclesEvents: any;
  	constructor(
  		private route: ActivatedRoute,
	    private router: Router,
      	private reportsService: ReportsServiceService,
	    private eventsService: EventsService,
	    private alertService: AlertService,
	    private globals: Globals,
	    private commonService: CommonService,
      	private terceroService: TerceroService,
      	private modalService: NgbModal,
    ) { }

  ngOnInit() {
  	this.getListVehiclesEvents()
  }


  getListVehiclesEvents(): void {
  	this.eventsService.getListVehiclesEvents().then(response => {
      this.vehiclesEvents = response;
      console.log('this.vehiclesEvents : ', this.vehiclesEvents)
    });
  }

}
