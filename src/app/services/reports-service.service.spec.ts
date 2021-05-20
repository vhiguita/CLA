import { TestBed, inject } from '@angular/core/testing';

import { ReportsServiceService } from './reports-service.service';

describe('ReportsServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportsServiceService]
    });
  });

  it('should be created', inject([ReportsServiceService], (service: ReportsServiceService) => {
    expect(service).toBeTruthy();
  }));
});
