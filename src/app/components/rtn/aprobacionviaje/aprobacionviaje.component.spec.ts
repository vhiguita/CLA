import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobacionviajeComponent } from './aprobacionviaje.component';

describe('AprobacionviajeComponent', () => {
  let component: AprobacionviajeComponent;
  let fixture: ComponentFixture<AprobacionviajeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AprobacionviajeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobacionviajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
