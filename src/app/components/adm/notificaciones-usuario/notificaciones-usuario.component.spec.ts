import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionesUsuarioComponent } from './notificaciones-usuario.component';

describe('NotificacionesUsuarioComponent', () => {
  let component: NotificacionesUsuarioComponent;
  let fixture: ComponentFixture<NotificacionesUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificacionesUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacionesUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
