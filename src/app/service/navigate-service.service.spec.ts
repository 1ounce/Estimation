import { TestBed } from '@angular/core/testing';

import { NavigateServiceService } from './navigate-service.service';

describe('NavigateServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavigateServiceService = TestBed.get(NavigateServiceService);
    expect(service).toBeTruthy();
  });
});
