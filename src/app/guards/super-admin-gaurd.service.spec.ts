import { TestBed } from '@angular/core/testing';

import { SuperAdminGuard } from './super-admin-guard.service';

describe('SuperUserGuardService', () => {
  let service: SuperAdminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuperAdminGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
