import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateCompanyComponent } from './create-company.component';

describe('CreateCompanyComponent', () => {
  let component: AdminCreateCompanyComponent;
  let fixture: ComponentFixture<AdminCreateCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCreateCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCreateCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
