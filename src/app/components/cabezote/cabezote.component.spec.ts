import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabezoteComponent } from './cabezote.component';

describe('CabezoteComponent', () => {
  let component: CabezoteComponent;
  let fixture: ComponentFixture<CabezoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabezoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabezoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
