import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminShowCompanyComponent } from './show-sub-company.component';

describe('ShowCompanyComponent', () => {
  let component: AdminShowCompanyComponent;
  let fixture: ComponentFixture<AdminShowCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminShowCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminShowCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
