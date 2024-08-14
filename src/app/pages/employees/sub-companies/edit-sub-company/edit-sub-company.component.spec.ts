import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditCompanyComponent } from './edit-company.component';

describe('EditCompanyComponent', () => {
  let component: AdminEditCompanyComponent;
  let fixture: ComponentFixture<AdminEditCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminEditCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEditCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
