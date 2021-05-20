import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OcultarDirective } from './directives/ocultar.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [OcultarDirective]
})
export class SharedModule { }
