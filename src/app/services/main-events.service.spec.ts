import { TestBed, inject } from '@angular/core/testing';

import { MainEventsService } from './main-events.service';

describe('MainEventsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MainEventsService]
    });
  });

  it('should be created', inject([MainEventsService], (service: MainEventsService) => {
    expect(service).toBeTruthy();
  }));
});
