import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelTransitComponent } from './travel-transit.component';

describe('TravelTransitComponent', () => {
  let component: TravelTransitComponent;
  let fixture: ComponentFixture<TravelTransitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelTransitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelTransitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
