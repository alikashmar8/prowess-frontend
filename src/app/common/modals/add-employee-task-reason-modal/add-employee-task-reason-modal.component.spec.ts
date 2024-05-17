import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeTaskReasonModalComponent } from './add-employee-task-reason-modal.component';

describe('AddEmployeeTaskReasonModalComponent', () => {
  let component: AddEmployeeTaskReasonModalComponent;
  let fixture: ComponentFixture<AddEmployeeTaskReasonModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmployeeTaskReasonModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEmployeeTaskReasonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
