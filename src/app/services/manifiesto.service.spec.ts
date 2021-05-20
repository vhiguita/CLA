import { TestBed, inject } from '@angular/core/testing';

import { ManifiestoService } from './manifiesto.service';

describe('ManifiestoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManifiestoService]
    });
  });

  it('should be created', inject([ManifiestoService], (service: ManifiestoService) => {
    expect(service).toBeTruthy();
  }));
});
