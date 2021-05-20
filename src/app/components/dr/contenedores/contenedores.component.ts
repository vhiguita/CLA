import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ContenedorService} from '../../../services/contenedor.service';
@Component({
  selector: 'app-contenedores',
  templateUrl: './contenedores.component.html',
  styleUrls: ['./contenedores.component.css']
})
export class ContenedoresComponent implements OnInit {

  contenedores: any []=[];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contenedorService: ContenedorService
  ) { }

  ngOnInit() {
      this.obtenerContenedores();
  }
  obtenerContenedores(): void {
    /*this.contenedorService.obtenerContenedores().then(response => {
      this.conductores =response;
    });*/
  }
  edit(index){
     var id=this.contenedores[index].id;
     this.router.navigate(['/home/dr/contenedor',id]);
  }
}
