import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TerceroService} from '../../../services/tercero.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: any []=[];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private terceroService: TerceroService
  ) { }

  ngOnInit() {
    this.obtenerClientes();
    //this.terceroService.listarReportes();
  }
  obtenerClientes(): void {
    this.terceroService.obtenerTercerosPorTipo(1).then(response => {
      this.clientes=response;
      //console.log(response);
    });
  }
  edit(index){
     var id=this.clientes[index].id;
     this.router.navigate(['/home/dr/cliente',id]);
  }

}
