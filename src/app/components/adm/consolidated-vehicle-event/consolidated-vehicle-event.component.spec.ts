import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidatedVehicleEventComponent } from './consolidated-vehicle-event.component';

describe('ConsolidatedVehicleEventComponent', () => {
  let component: ConsolidatedVehicleEventComponent;
  let fixture: ComponentFixture<ConsolidatedVehicleEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsolidatedVehicleEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidatedVehicleEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
