import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeTaskModalComponent } from './add-employee-task-modal.component';

describe('AddEmployeeTaskModalComponent', () => {
  let component: AddEmployeeTaskModalComponent;
  let fixture: ComponentFixture<AddEmployeeTaskModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmployeeTaskModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEmployeeTaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
