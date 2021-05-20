import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleeventsComponent } from './vehicleevents.component';

describe('VehicleeventsComponent', () => {
  let component: VehicleeventsComponent;
  let fixture: ComponentFixture<VehicleeventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleeventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleeventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
