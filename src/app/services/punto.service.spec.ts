import { TestBed, inject } from '@angular/core/testing';

import { PuntoService } from './punto.service';

describe('PuntoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PuntoService]
    });
  });

  it('should be created', inject([PuntoService], (service: PuntoService) => {
    expect(service).toBeTruthy();
  }));
});
