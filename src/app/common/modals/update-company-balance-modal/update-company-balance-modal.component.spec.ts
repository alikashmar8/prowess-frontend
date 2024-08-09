import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCompanyBalanceModalComponent } from './update-company-balance-modal.component';

describe('UpdateCompanyBalanceModalComponent', () => {
  let component: UpdateCompanyBalanceModalComponent;
  let fixture: ComponentFixture<UpdateCompanyBalanceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCompanyBalanceModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCompanyBalanceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
