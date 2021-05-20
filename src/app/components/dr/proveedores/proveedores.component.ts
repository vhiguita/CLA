import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TerceroService} from '../../../services/tercero.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  proveedores: any []=[];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private terceroService: TerceroService
  ) { }

  ngOnInit() {
    this.obtenerProveedores();
  }
  obtenerProveedores(): void {
    this.terceroService.obtenerTercerosPorTipo(2).then(response => {
      this.proveedores=response;
    });
  }
  edit(index){
     var id=this.proveedores[index].id;
     this.router.navigate(['/home/dr/proveedor',id]);
  }

}
