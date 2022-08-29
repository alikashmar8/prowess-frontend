import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateCustomerModalComponent } from './activate-customer-modal.component';

describe('ActivateCustomerModalComponent', () => {
  let component: ActivateCustomerModalComponent;
  let fixture: ComponentFixture<ActivateCustomerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivateCustomerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateCustomerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
