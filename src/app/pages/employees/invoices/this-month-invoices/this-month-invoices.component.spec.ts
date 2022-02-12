import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThisMonthInvoicesComponent } from './this-month-invoices.component';

describe('ThisMonthInvoicesComponent', () => {
  let component: ThisMonthInvoicesComponent;
  let fixture: ComponentFixture<ThisMonthInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThisMonthInvoicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThisMonthInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
