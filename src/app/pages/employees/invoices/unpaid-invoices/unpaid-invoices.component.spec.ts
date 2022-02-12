import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpaidInvoicesComponent } from './unpaid-invoices.component';

describe('UnpaidInvoicesComponent', () => {
  let component: UnpaidInvoicesComponent;
  let fixture: ComponentFixture<UnpaidInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnpaidInvoicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnpaidInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
