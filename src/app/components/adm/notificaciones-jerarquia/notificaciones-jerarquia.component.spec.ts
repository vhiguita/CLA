import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionesJerarquiaComponent } from './notificaciones-jerarquia.component';

describe('NotificacionesJerarquiaComponent', () => {
  let component: NotificacionesJerarquiaComponent;
  let fixture: ComponentFixture<NotificacionesJerarquiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificacionesJerarquiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacionesJerarquiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
