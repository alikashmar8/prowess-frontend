import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCustomerPlansModalComponent } from './update-customer-plans-modal.component';

describe('UpdateCustomerPlansModalComponent', () => {
  let component: UpdateCustomerPlansModalComponent;
  let fixture: ComponentFixture<UpdateCustomerPlansModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCustomerPlansModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCustomerPlansModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
