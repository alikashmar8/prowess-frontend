import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateItemInvoiceModalComponent } from './create-item-invoice-modal.component';

describe('CreateItemInvoiceModalComponent', () => {
  let component: CreateItemInvoiceModalComponent;
  let fixture: ComponentFixture<CreateItemInvoiceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateItemInvoiceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateItemInvoiceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
