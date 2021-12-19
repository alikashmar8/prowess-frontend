import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCompaniesComponent } from './companies.component';

describe('CompaniesComponent', () => {
  let component: AdminCompaniesComponent;
  let fixture: ComponentFixture<AdminCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCompaniesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
