import { TestBed } from '@angular/core/testing';

import { ReceivedAmountsService } from './received-amounts.service';

describe('ReceivedAmountsService', () => {
  let service: ReceivedAmountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceivedAmountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
