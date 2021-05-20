import { TestBed, inject } from '@angular/core/testing';

import { TerceroService } from './tercero.service';

describe('TerceroService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TerceroService]
    });
  });

  it('should be created', inject([TerceroService], (service: TerceroService) => {
    expect(service).toBeTruthy();
  }));
});
