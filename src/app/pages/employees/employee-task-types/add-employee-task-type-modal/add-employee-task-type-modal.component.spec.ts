import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeTaskTypeModalComponent } from './add-employee-task-type-modal.component';

describe('AddEmployeeTaskTypeModalComponent', () => {
  let component: AddEmployeeTaskTypeModalComponent;
  let fixture: ComponentFixture<AddEmployeeTaskTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmployeeTaskTypeModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEmployeeTaskTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
