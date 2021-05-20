import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConductorService} from '../../../services/conductor.service';


@Component({
  selector: 'app-conductores',
  templateUrl: './conductores.component.html',
  styleUrls: ['./conductores.component.css']
})
export class ConductoresComponent implements OnInit {
  conductores: any []=[];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private conductorService: ConductorService
  ) { }

  ngOnInit() {
    this.obtenerConductores();
  }
  obtenerConductores(): void {
    this.conductorService.obtenerConductores().then(response => {
      this.conductores =response;
      //console.log(response);
    });
  }
  edit(index){
     var id=this.conductores[index].id;
     this.router.navigate(['/home/dr/conductor',id]);
  }

}
