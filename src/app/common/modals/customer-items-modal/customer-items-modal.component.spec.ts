import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerItemsModal } from './customer-items-modal.component';

describe('CustomerItemsModal', () => {
  let component: CustomerItemsModal;
  let fixture: ComponentFixture<CustomerItemsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerItemsModal ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerItemsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
