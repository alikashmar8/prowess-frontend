import { TestBed } from '@angular/core/testing';

import { EmployeeTaskTypesService } from './employee-task-types.service';

describe('EmployeeTaskTypesService', () => {
  let service: EmployeeTaskTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeTaskTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
