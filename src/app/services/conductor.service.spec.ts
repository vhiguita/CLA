import { TestBed, inject } from '@angular/core/testing';

import { ConductorService } from './conductor.service';

describe('ConductorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConductorService]
    });
  });

  it('should be created', inject([ConductorService], (service: ConductorService) => {
    expect(service).toBeTruthy();
  }));
});
