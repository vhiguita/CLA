import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionsolicitudComponent } from './asignacionsolicitud.component';

describe('AsignacionsolicitudComponent', () => {
  let component: AsignacionsolicitudComponent;
  let fixture: ComponentFixture<AsignacionsolicitudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignacionsolicitudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionsolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
