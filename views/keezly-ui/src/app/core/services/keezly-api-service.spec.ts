import { TestBed } from '@angular/core/testing';

import { KeezlyApiService } from './keezly-api.service';

describe('KeezlyApiService', () => {
  let service: KeezlyApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeezlyApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
