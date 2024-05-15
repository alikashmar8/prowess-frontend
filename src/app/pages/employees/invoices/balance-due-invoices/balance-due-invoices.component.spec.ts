import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldUnpaidInvoicesComponent } from './balance-due-invoices.component';

describe('OldUnpaidInvoicesComponent', () => {
  let component: OldUnpaidInvoicesComponent;
  let fixture: ComponentFixture<OldUnpaidInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldUnpaidInvoicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OldUnpaidInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
