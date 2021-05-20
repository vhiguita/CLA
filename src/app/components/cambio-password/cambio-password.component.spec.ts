import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioPasswordComponent } from './cambio-password.component';

describe('CambioPasswordComponent', () => {
  let component: CambioPasswordComponent;
  let fixture: ComponentFixture<CambioPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
