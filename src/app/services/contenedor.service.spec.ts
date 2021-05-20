import { TestBed, inject } from '@angular/core/testing';

import { ContenedorService } from './contenedor.service';

describe('ContenedorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContenedorService]
    });
  });

  it('should be created', inject([ContenedorService], (service: ContenedorService) => {
    expect(service).toBeTruthy();
  }));
});
