import { TestBed } from '@angular/core/testing';

import { EmployeeTaskReasonsService } from './employee-task-reasons.service';

describe('EmployeeTaskReasonsService', () => {
  let service: EmployeeTaskReasonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeTaskReasonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
