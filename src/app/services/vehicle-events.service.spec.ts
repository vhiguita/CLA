import { TestBed, inject } from '@angular/core/testing';

import { VehicleEventsService } from './vehicle-events.service';

describe('VehicleEventsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VehicleEventsService]
    });
  });

  it('should be created', inject([VehicleEventsService], (service: VehicleEventsService) => {
    expect(service).toBeTruthy();
  }));
});
