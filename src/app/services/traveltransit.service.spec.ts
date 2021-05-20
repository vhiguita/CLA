import { TestBed, inject } from '@angular/core/testing';

import { TraveltransitService } from './traveltransit.service';

describe('TraveltransitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TraveltransitService]
    });
  });

  it('should be created', inject([TraveltransitService], (service: TraveltransitService) => {
    expect(service).toBeTruthy();
  }));
});
